import { ICartProduct } from '../../interfaces';
import { CartState } from './';


type CartActionType =
   |{ type: '[Cart] - Load Cart From Cookies | Storage', payload: ICartProduct[]}
   |{ type: '[Cart] - Update Products in Cart', payload: ICartProduct[]}


export const cartReducer = ( state: CartState, action: CartActionType ): CartState => {
   switch (action.type) {
     case '[Cart] - Load Cart From Cookies | Storage':
          return {
               ...state,
     }
     case '[Cart] - Update Products in Cart':
          return {
               ...state,
               cart: [...action.payload]
     }

      default:
          return state;
      }
}