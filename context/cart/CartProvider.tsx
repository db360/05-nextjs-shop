import { FC, useEffect, useReducer } from 'react';
import axios, {AxiosError} from 'axios';
import Cookies from 'js-cookie';

import {CartContext, cartReducer} from './'
import { ICartProduct, IOrder, ShippingAddress } from '../../interfaces';
import { shopApi } from '../../api';

type Props = { children?: React.ReactNode };


export interface CartState {
     isLoaded: boolean;
     cart: ICartProduct[];
     numberOfItems: number;
     subTotal: number;
     tax: number;
     total: number;

     shippingAddress?: ShippingAddress
}



const CART_INITIAL_STATE: CartState = {
     isLoaded: false,
     cart: [],
     numberOfItems: 0,
     subTotal: 0,
     tax: 0,
     total: 0,
     shippingAddress: undefined,
}

export const CartProvider:FC<Props> = ({ children }) => {

     const [state, dispatch] = useReducer(cartReducer, CART_INITIAL_STATE)

     //Leer la cookie y recargue el carrito

     useEffect(() => {
          try {
               const cookieProducts = Cookies.get('cart') ? JSON.parse( Cookies.get('cart')! ): []
               dispatch({type: '[Cart] - Load Cart From Cookies | Storage', payload: cookieProducts});
          } catch (error) {
               dispatch({type: '[Cart] - Load Cart From Cookies | Storage', payload: []});
          }
     }, []);

     useEffect(() => {

          if( Cookies.get('firstName')) {
               const shippingAddress = {
                    lastName: Cookies.get('lastName') || '',
                    address: Cookies.get('address') || '',
                    address2: Cookies.get('address2') || '',
                    zip: Cookies.get('zip') || '',
                    city: Cookies.get('city') || '',
                    country: Cookies.get('country') || '',
                    phone: Cookies.get('phone') || '',
                    firstName: Cookies.get('firstName') || '',
               }
               dispatch({type: '[Cart] - Load Address from Cookies', payload: shippingAddress})
          }



     }, [])

     //Set items to cookies
     useEffect(() => {
          Cookies.set('cart', JSON.stringify(state.cart));
     }, [state.cart]);

     useEffect(() => {


          const numberOfItems = state.cart.reduce(( prev, current ) => current.quantity + prev , 0);
          const subTotal = state.cart.reduce((prev, current) => (current.quantity * current.price) + prev, 0);
          const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);

          const orderSummary = {
               numberOfItems,
               subTotal,
               tax: subTotal * taxRate,
               total: subTotal * (taxRate + 1)
          }

          dispatch({type: '[Cart] - Update Order Summary', payload: orderSummary});

     }, [state.cart]);

     const createOrder = async():Promise<{hasError: boolean; message: string;}> => {

          if(!state.shippingAddress) {
               throw new Error('No hay dirección de entrega')
          }

          const body: IOrder = {
               orderItems: state.cart.map( p => ({
                    ...p,
                    size: p.size!
               })),
               shippingAddress: state.shippingAddress,
               numberOfItems: state.numberOfItems,
               subTotal: state.subTotal,
               tax: state.tax,
               total: state.total,
               isPaid: false
          }

          try {
               const {data} = await shopApi.post<IOrder>('/orders', body)
               // console.log(data);

               //Dispatch de la accion(vaciar el carrito, limpiar state)
               dispatch({type: '[Cart] - Order Completed'});

               return {
                    hasError: false,
                    message: data._id!
               }

          } catch (err) {
               if(axios.isAxiosError(err)) {
                    const error = err as AxiosError
                    return {
                         hasError: true,
                         message: error.message
                    }
               }
               return {
                    hasError: true,
                    message: 'Error Inesperado, por favor pongase en contacto con el administrador'
               }
          }

     }





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

     const updateAddress = (address: ShippingAddress) => {
          Cookies.set('lastName', address.lastName);
          Cookies.set('address', address.address);
          Cookies.set('firstName', address.firstName);
          Cookies.set('address2', address.address2 || '');
          Cookies.set('zip', address.zip);
          Cookies.set('city', address.city);
          Cookies.set('country', address.country);
          Cookies.set('phone', address.phone);
          dispatch({type: '[Cart] - Update Address', payload: address })
     }

     return (
          <CartContext.Provider value={{
               ...state,

               //Methods
               addProductToCart,
               updateCartQuantity,
               removeCartProduct,
               updateAddress,

               //orders
               createOrder,

          }}>
               {children}
          </CartContext.Provider>
     )
}

