import type { NextApiRequest, NextApiResponse } from 'next';
import axios, { AxiosError } from 'axios';
import { db } from '../../../database';
import { IPaypal } from '../../../interfaces';
import { Order } from '../../../models';

type Data = {
    message: string
}

export default function payhandler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch(req.method) {
        case 'POST':
            return payOrder(req, res);
        default:
            return res.status(400).json({message: 'Bad Request'})
    }

}

const getPaypalBearerToken = async():Promise<string|null>=> {
    const PAYPAL_CLIENT = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
    const PAYPAL_SECRET = process.env.PAYPAL_SECRET;

    const base64Token = Buffer.from(`${ PAYPAL_CLIENT }:${ PAYPAL_SECRET }`, 'utf-8').toString('base64');  // el token como viene
    const body = new URLSearchParams('grant_type=client_credentials'); // Crear el body de la data

    // console.log(base64Token);

    try {
        const { data } = await axios.post( process.env.PAYPAL_OAUTH_URL || '', body, {
             headers: {
                'Authorization': `Basic ${ base64Token }` ,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        return data.access_token;

    } catch (error) {
        if ( axios.isAxiosError(error) ) {
            console.log(error.response?.data);
        } else {
            console.log(error);
        }

        return null;
    }
}


const  payOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    // Todo: Validar sesion de usuario

    // Todo: Validar MongoId
    console.log(req.body);

    const paypalBearerToken = await getPaypalBearerToken();


    if(!paypalBearerToken) {
        res.status(400).json({ message: 'No se pudo confirmar el token de PayPal' })
    }

    const { transactionId = '', orderId = ''} = req.body;

    // console.log(paypalBearerToken);



    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(`${ process.env.PAYPAL_ORDERS_URL }/${transactionId}`, {
        headers: {
            'Authorization': `Bearer ${paypalBearerToken}`
        }
    });

    console.log({data});

    console.log({transactionId, orderId});

    if(data.status !== 'COMPLETED') {
        return res.status(401).json({message: 'Orden no reconocida'})
    }

    await db.connect();
    const dbOrder = await Order.findById(orderId);

    if(!dbOrder) {
        await db.disconnect();
        return res.status(400).json({message: 'La orden no existe en nuestra base de datos'})
    }

    if(dbOrder.total !== Number(data.purchase_units[0].amount.value)) {
        await db.disconnect();
        return res.status(400).json({message: 'Los importes de paypal no coinciden con la base de datos'})
    }

    dbOrder.transactionId = transactionId;
    dbOrder.isPaid = true;
    await dbOrder.save();
    await db.disconnect();

    res.status(200).json({ message: 'Orden Pagada'  })
}
