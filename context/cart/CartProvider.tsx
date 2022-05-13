import { FC, useEffect, useReducer } from 'react';
import Cookie from 'js-cookie';
import {CartContext, cartReducer} from './'
import { ICartProduct } from '../../interfaces';

type Props = { children?: React.ReactNode };


export interface CartState {
     cart: ICartProduct[];
     numberOfItems: number;
     subTotal: number;
     tax: number;
     total: number;
}

const CART_INITIAL_STATE: CartState = {
     cart: [],
     numberOfItems: 0,
     subTotal: 0,
     tax: 0,
     total: 0,
}

export const CartProvider:FC<Props> = ({ children }) => {

     const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

     //Leer la cookie y recargue el carrito

     useEffect(() => {
          try {
               const cookieProducts = Cookie.get('cart') ? JSON.parse( Cookie.get('cart')! ): []
               dispatch({type: '[Cart] - Load Cart From Cookies | Storage', payload: cookieProducts});
          } catch (error) {
               dispatch({type: '[Cart] - Load Cart From Cookies | Storage', payload: []});
          }
     }, []);

     //Set items to cookies
     useEffect(() => {
          Cookie.set('cart', JSON.stringify(state.cart), { expires: 1 });

     }, [state.cart]);

     useEffect(() => {


          const numberOfItems = state.cart.reduce(( prev, current ) => current.quantity + prev , 0);
          const subTotal = state.cart.reduce((prev, current) => current.quantity * current.price + prev, 0);
          const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

          const orderSummary = {
               numberOfItems,
               subTotal,
               tax: subTotal * taxRate,
               total: subTotal * (taxRate + 1)
          }

          dispatch({type: '[Cart] - Update Order Summary', payload: orderSummary});

     }, [state.cart])



     const addProductToCart = (product: ICartProduct) => {

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

     const updateCartQuantity = ( product: ICartProduct) => {
          dispatch({type: '[Cart] - Update Cart Quantity in Cart', payload: product })
     }
     const removeCartProduct = ( product: ICartProduct) => {
          dispatch({type: '[Cart] - Remove Product in Cart', payload: product })
     }

     return (
          <CartContext.Provider value={{
               ...state,

               //Methods
               addProductToCart,
               updateCartQuantity,
               removeCartProduct,

          }}>
               {children}
          </CartContext.Provider>
     )
}

export default CartProvider