import { FC, useReducer } from 'react';
import {CartContext, cartReducer} from './'
import { ICartProduct } from '../../interfaces';

type Props = { children?: React.ReactNode };


export interface CartState {
     cart: ICartProduct[];
}

const CART_INITIAL_STATE: CartState = {
    cart: [],
}

export const CartProvider:FC<Props> = ({ children }) => {

     const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

     const addProductToCart = (product: ICartProduct) => {
          // Primera solucion
          // dispatch({type: '[Cart] - Add Product', payload: product})
          //Segunda solucion
          // const productsInCart = state.cart.filter(p => p._id !== product._id && product.size !== product.size)
          // dispatch({type: '[Cart] - Add Product', payload: productsInCart, product})
          //FINAL-BUENA
          const productInCart = state.cart.some( p => p._id === product._id ); // si existe product in Cart es un true
          if(!productInCart) return dispatch({type: '[Cart] - Update Products in Cart', payload: [...state.cart, product]})

          const productInCartButDifferentSize = state.cart.some( p => p._id === product._id && p.size === product.size ); // si existe el producto y si existe con la misma talla
          if(!productInCartButDifferentSize) return dispatch({type:'[Cart] - Update Products in Cart', payload: [...state.cart, product]})

          // Acumular si es la misma talla
          const updatedProducts = state.cart.map( p => {
               if (p._id !== product._id ) return p;
               if (p.size !== product.size ) return p;

               // Actualizar cantidad
               p.quantity += product.quantity
               return p;
          });

          dispatch({type: '[Cart] - Update Products in Cart', payload: updatedProducts})
     }

     return (
          <CartContext.Provider value={{
               ...state,

               //Methods
               addProductToCart,
          }}>
               {children}
          </CartContext.Provider>
     )
}

export default CartProvider