import { FC, PropsWithChildren, useReducer } from 'react';
import {AuthContext, authReducer} from './'
import axios, { AxiosError } from 'axios';

import { IUser } from '../../interfaces';
import { shopApi } from '../../api';
import Cookies from 'js-cookie';


export interface AuthState {
     isLoggedIn: boolean;
     user?: IUser
}

const AUTH_INITIAL_STATE: AuthState = {
     isLoggedIn:  false,
     user: undefined,
}

export const AuthProvider:FC<PropsWithChildren<AuthState>> = ({ children }) => {

     const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)

     const loginUser = async(email:string, password: string ):Promise<boolean> => {
          try {
               const { data } = await shopApi.post('/user/login', {email, password});
               const { token, user } = data;
               Cookies.set('token', token);
               dispatch({type: '[Auth] - LogIn', payload: user});
               return true;
          } catch (error) {
               return false;
          }
     }

     const registerUser = async(name: string, email: string, password: string): Promise<{hasError: boolean; message?: string}> => {
          try {
               const { data } = await shopApi.post('/user/register', {name, email, password});
               const { token, user } = data;
               Cookies.set('token', token);
               dispatch({type: '[Auth] - LogIn', payload: user});
               return {
                    hasError: false
               }
          } catch (err) {
               if( axios.isAxiosError(err)) {
                    const error = err as AxiosError
                    return{
                         hasError: true,
                         message: error.message

                    }
               }

               return {
                    hasError: true,
                    message: 'No se pude crear el usuario - Inténtelo de nuevo en unos minutos'
               }

          }
     }

     return (
          <AuthContext.Provider value={{
               ...state,

               //Methods
               loginUser,
               registerUser,

          }}>
               {children}
          </AuthContext.Provider>
     )
}
