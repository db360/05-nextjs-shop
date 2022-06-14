import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Order, Product, User } from '../../../models';

type Data = {
    numberOfOrders: number;
    paidOrders: number; // isPaid = true
    notPaidOrders: number;
    numberOfClients: number; // role: client
    numberOfProducts: number;
    productsWithNoInventory: number; // 0
    lowInventory: number; // productos < 10 inStock
}
export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    await db.connect();
    // const numberOfOrders = await Order.count(); // Sacar el numero de ordenes de la base de datos
    // const paidOrders = await Order.find({isPaid: true}).count(); // Buscamos las ordenes pagadasa isPaid: true
    // const numberOfClients = await User.find({ role: 'client' }).count(); // contamos los clientes con role: 'client'
    // const numberOfProducts = await Product.count(); // contamos los productos
    // const productsWithNoInventory = await Product.find({ inStock: 0 }).count(); // contamos los productos con 0 inStock
    // const lowInventory = await Product.find({ inStock: {$lte: 10}}).count(); // contamos los productos con inStock < 10
    const [
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
    ] = await Promise.all([ //Lo metemos todo en la promise para que se hagan paralelamente
            Order.count(), // Sacar el numero de ordenes de la base de datos
            Order.find({isPaid: true}).count(), // Buscamos las
            User.find({ role: 'client' }).count(), // contamos
            Product.count(),// contamos los productos
            Product.find({ inStock: 0 }).count(), // contamos los productos con
            Product.find({ inStock: {$lte: 10}}).count(),
    ])

    await db.disconnect();

    res.status(200).json({
        numberOfOrders,
        paidOrders,
        numberOfClients,
        numberOfProducts,
        productsWithNoInventory,
        lowInventory,
        notPaidOrders: numberOfOrders - paidOrders
    })

}