import type { NextApiRequest, NextApiResponse } from 'next'
import { db, seedDatabase } from '../../database'
import { Product } from '../../models'

type Data = {
    message: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    if( process.env.NODE_ENV === 'production') {
        return res.status(401).json({message: 'No tiene acceso a éste API'})
    }

    await db.connect();
    await Product.deleteMany(); // borra lo que hay en la base de datos
    await Product.insertMany(seedDatabase.initialData.products) // Inserta los datos
    await db.disconnect();

    res.status(200).json({ message: 'Conexión Realizada Correctamente, todos los datos fueron añadidos' })
}