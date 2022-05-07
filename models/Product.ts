import mongoose, {Schema, model, Model} from "mongoose";
import { IProduct } from "../interfaces";

const productSchema = new Schema({
    description: { type: String, required: true },
    images: [{ type: String }],
    inStock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    sizes: [{
        type: String,
        enum: {
            values: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            message: '{VALUE} no es un tamaño válido'
        }
    }],
    slug: { type: String, required: true, unique: true },
    tags: [{ type: String }],
    title: {type: String, required: true},
    type: [{
        type: String,
        enum: {
            values: ['shirts', 'pants', 'hoodies', 'hats'],
            message: '{VALUE} no es un tipo de prenda válida' //message para cuando no existe el enum
        }
    }],
    gender: [{
        type: String,
        enum: {
            values: ['men', 'women', 'kid', 'unisex'],
            message: '{VALUE} no es un modelo válido'
        }
    }]
},{
    timestamps: true // Crea timestamps al añadir y editar
});

//Crear un indice para el search
productSchema.index({title: 'text', tags: 'text'});

const Product: Model<IProduct> = mongoose.models.Product || model('Product', productSchema);
//CREA EL MODELO, BUSCA EL MODELO QUE QUIERO CREAR, SI YA EXISTE USA ESE, SI NO SE CREA

export default Product;
