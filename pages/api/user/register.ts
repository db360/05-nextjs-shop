import type { NextApiRequest, NextApiResponse } from 'next'
import bcrypt from 'bcryptjs'

import { db } from '../../../database';
import { User } from '../../../models';
import { jwt, validations } from '../../../utils';

type Data =
| {message: string}
| {
    token: string;
    user: {
        email: string;
        name: string;
        role: string;
    }
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {

    switch (req.method) {
        case 'POST':
            return registerUser(req, res)

        default:
            res.status(400).json({ message:'Bad Request'});
    }

}

const registerUser = async(req: NextApiRequest, res: NextApiResponse<Data>) => {

    const { email= '', password= '', name= ''} = req.body as { email: string, password: string, name: string };

    if( password.length < 6 ) {
        return res.status(400).json({
            message: 'La Contraseña debe de tener al menos 6 carácteres'
        })
    }
    if( name.length < 3 ) {
        return res.status(400).json({
            message: 'El Nombre debe de tener al menos 4 carácteres'
        })
    }

    if( !validations.isValidEmail(email)) {
        return res.status(400).json({
            message: 'El Correo no parece ser válido'
        })
    }

    await db.connect();
    const user = await User.findOne({ email });

    if ( user ) {
        return res.status(400).json({
            message:'Correo ya registrado'
        })
    }

    const newUser = new User({
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password),
        role: 'client',
        name,
    });

    try {
        await newUser.save({validateBeforeSave: true})

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Revisar logs del servidor'
        })
    }

    const {_id, role} = newUser;

    const token = jwt.signToken(_id, email);

    return res.status(200).json({
        token, // JWT
        user: {
            email,
            role,
            name,
        }
    })

}
