import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';

import formidable from 'formidable';

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

const saveFile = async( file: formidable.File ) => { // Grabar en el fs

    const data = fs.readFileSync(file.filepath); // carpeta temporal en filesystem
    fs.writeFileSync(`./public/${file.originalFilename}`, data);
    fs.unlinkSync( file.filepath); // eliminar de la carpeta temporal del fs
    return;
}

const parseFiles = async(req: NextApiRequest) => {

    return new Promise( (resolve, reject) => {

        const form = new formidable.IncomingForm();
        form.parse(req, async(err, fields, files) => {
            console.log({err, fields, files});

            if(err) {
                return reject(err);
            }

            await saveFile( files.file as formidable.File)
            resolve(true);
        })

    })

}

const uploadFile = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    await parseFiles(req);

    return res.status(200).json({ message: 'Imagen Agregada con éxito'})

}
