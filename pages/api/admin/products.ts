import type { NextApiRequest, NextApiResponse } from 'next';
import { isValidObjectId } from 'mongoose';

import {v2 as cloudinary} from 'cloudinary';

import { db } from '../../../database';
import { IProduct } from '../../../interfaces';
import { Product } from '../../../models';

cloudinary.config( process.env.CLOUDINARY_URL || '');


type Data =
|   {message: string;}
|   IProduct[]
|   IProduct

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'GET':
            return getProducts(req, res);

        case 'PUT':
            return updateProduct(req, res);

        case 'POST':
            return createProduct(req, res);

        default:
            return res.status(400).json({message: 'Bad Request'});
    }
};

const  getProducts = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    await db.connect();

    const products = await Product.find() // Obtener todos los productos
        .sort({title: 'asc'})             // Ordenar ascendente
        .lean();

    await db.disconnect();

    //Actualizar imagenes
    const updatedProducts = products.map( product => {

        product.images = product.images.map( image => {
        return image.includes('http') ? image : `${ process.env.HOST_NAME }products/${ image }`
      });

      return product;
      })

    res.status(200).json(updatedProducts);
}
const  updateProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { _id = '', images = [] } = req.body as IProduct;
    if( !isValidObjectId( _id ) ) {
        return res.status(400).json({ message: 'El Id del producto no es válido' });
    }

    if( images.length < 2 ) {
        return res.status(400).json({ message: 'Se Necesitan al menos dos imágenes' });
    }

    // todo: Posiblenente tendremos un localhost:3000/products/xxxxx.jpg

    try {
        await db.connect();
        const product = await Product.findById(_id);
        if(!product) {
            await db.disconnect();
            return res.status(400).json({ message: 'No existe ningun producto con ese ID' + _id})
        }

        // https://res.cloudinary.com/da-b-martinez/image/upload/v1655741683/x5vyojaxkqhdarvhcerc.png

        product.images.forEach(async(image) => {
            if( !images.includes(image)) {
                //Borrar de cloudinary
                const [fileId, extension] = image.substring( image.lastIndexOf('/') + 1).split('.') //buscar el indice del ultimo /
                console.log({image, fileId, extension});
                await cloudinary.uploader.destroy(fileId) //eliminar de cloudinary

            }
        })

        await product.update( req.body );
        await db.disconnect();

        return res.status(200).json( product )

    } catch (error) {

        console.log(error);
        await db.disconnect();
        return res.status(400).json({ message: 'ERROR: Revisar la consola del servidor'})
    }
}


const createProduct = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { images = [] } = req.body as IProduct;

    if( images.length < 2 ) {
        return res.status(400).json({ message: 'El producto necesita al menos 2 imágenes.'})
    }

    // todo: Posiblenente tendremos un localhost:3000/products/xxxxx.jpg

    try {
        await db.connect();
        const productInDB = await Product.findOne({ slug: req.body.slug}); //buscar por slu
        if(productInDB){
            await db.disconnect();
            return res.status(400).json({message: 'Ya existe un producto con el mismo slug'});
        }

        const product = new Product( req.body );
        await product.save();
        await db.disconnect();

        return res.status(201).json( product );

    } catch (error) {

        await db.disconnect();
        return res.status(400).json({ message: 'Revisar logs del servidor.'})
    }


}

