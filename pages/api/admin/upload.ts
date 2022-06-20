import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';

import {v2 as cloudinary} from 'cloudinary';

cloudinary.config( process.env.CLOUDINARY_URL || ''); // config cloudinary

type Data = {
    message: string
}

export const config = { //config para que next no serialize las imagenes
    api: {
        bodyParser: false,
    }
}


export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':

            return uploadFile(req, res);

        default:
            res.status(400).json({ message: 'El Endpoint no existe'})
    }
}

const saveFile = async( file: formidable.File ): Promise<string> => {

    // // Grabar en el fs
    // const data = fs.readFileSync(file.filepath); // carpeta temporal en filesystem
    // fs.writeFileSync(`./public/${file.originalFilename}`, data);
    // fs.unlinkSync( file.filepath); // eliminar de la carpeta temporal del fs
    // return;

    const { secure_url } = await cloudinary.uploader.upload( file.filepath) // subir el contenido del filepath
    return secure_url;

}

const parseFiles = async(req: NextApiRequest):Promise<string> => {

    return new Promise( (resolve, reject) => {

        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {

            // console.log({err, fields, files});

            if(err) {
                return reject(err);
            }

            const filePath = await saveFile( files.file as formidable.File)
            resolve(filePath);
        })

    })

}

const uploadFile = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const imgUrl = await parseFiles(req);

    return res.status(200).json({ message: imgUrl})

}

