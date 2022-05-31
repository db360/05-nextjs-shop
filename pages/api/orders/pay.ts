import axios, { AxiosError } from 'axios';
import { error } from 'console';
import type { NextApiRequest, NextApiResponse } from 'next'

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

    console.log(base64Token);

    try {
        const { data } = await axios.post(process.env.PAYPAL_OAUTH_URL || '', body, {
             headers: {
                 'Authorization': `Basic ${base64Token}` ,
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        return data.access_token;

    } catch (err) {
        if( axios.isAxiosError(err)) {
             const error = err as AxiosError
             console.log(error.response?.data);
        } else {
            console.log(error);
        }
        return null
    }
}


const  payOrder = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const paypalBearerToken = await getPaypalBearerToken();

    if(!paypalBearerToken) {
        res.status(400).json({ message: 'No se pudo confirmar el token de PayPal' })
    }

    res.status(200).json({ message: `${paypalBearerToken}`  })
}
