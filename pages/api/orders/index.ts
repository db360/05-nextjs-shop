import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react';
import { db } from '../../../database';
import { IOrder } from '../../../interfaces';
import { Product, Order } from '../../../models';

type Data =
| {message: string}
| IOrder

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

    //Crear un array con los productos de la order pidiendosela a la bd

    const productsIds = orderItems.map(product => product._id);
    await db.connect();

    const dbProducts = await Product.find({_id: {$in: productsIds} }); // todos los productos cuya id exista en productsIds

    // console.log(dbProducts)

    try {
        const subTotal = orderItems.reduce((prev, current) => {
            const currentPrice = dbProducts.find(prod => prod.id === current._id)?.price; // validar el precio producto con la bd
            if( !currentPrice ) {
                throw new Error('Verifique el carrito de nuevo, el producto no existe')
            }

            return (current.quantity * current.price) + prev
        }, 0);

        const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
        const backendTotal = subTotal * (taxRate + 1);

        if(total !== backendTotal) {
            throw new Error('El total de la order no concuerda con el total del backend')
        }


    // Todas las validaciones son correctas
    const userId = session.user._id;
    const newOrder = new Order({...req.body, isPaid: false, user: userId });

    // Guardar la orden en la bd
    await newOrder.save();
    await db.disconnect();

    return res.status(201).json(newOrder)

    } catch (error: any) {
        console.log(error);
        await db.disconnect();
        res.status(400).json({message: error.message || 'Revise Logs del Servidor' })
    }
}
