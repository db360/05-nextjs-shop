import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { IOrder } from '../../../interfaces';
import { Product } from '../../../models';

type Data = {
    message: string
}

export default function handleOrder(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch(req.method) {
        case 'POST':
            return createOrder(req, res);

        default:
        res.status(400).json({ message: 'Bad Request' })
    }

}

const createOrder= async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const {orderItems, total} = req.body as IOrder;

    //Verificar session de user
    const session:any = await getSession({ req });

    if(!session) {
        return res.status(401).json({message: 'Debe de iniciar sesión para realizar ésta accion'})
    }

    //Crear un array con los productos de la order

    const productsIds = orderItems.map(product => product._id);
    await db.connect();

    const dbProducts = await Product.find({_id: {$in: productsIds} });
    

    await db.disconnect();




    return res.status(201).json( req.body );
}
