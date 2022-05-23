import { FC, PropsWithChildren, useEffect, useReducer } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from 'next-auth/react'
import axios, { AxiosError } from 'axios';

import {AuthContext, authReducer} from './';

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

     const router = useRouter();
     const {data, status} = useSession();
     const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE)

     useEffect(() => {
          if(status === 'authenticated') {
               dispatch({type: '[Auth] - LogIn', payload: data?.user as IUser})
          }
     }, [status, data])


     // useEffect(() => {
     //      checkToken();
     // }, [])

     const checkToken = async () => {

          if( !Cookies.get('token')) {
               return;
          }

          try {
               //llamar al endpoint
               const { data } = await shopApi.get('/user/validate-token');
               const { token, user } = data;
               //revalidar token guardando el nuevo
               Cookies.set('token', token);
               //dispatch login
               dispatch({type: '[Auth] - LogIn', payload: user});
          } catch (error) {
               // borrar el token de las cookies si hay error
               Cookies.remove('token');
          }

     }

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

     const logOut = () => {
          Cookies.remove('cart');
          Cookies.remove('address');
          Cookies.remove('lastName');
          Cookies.remove('firstName');
          Cookies.remove('address2');
          Cookies.remove('zip')
          Cookies.remove('city');
          Cookies.remove('country');
          Cookies.remove('phone');

          signOut();

          // Cookies.remove('token');
          // router.reload();

     }

     return (
          <AuthContext.Provider value={{
               ...state,

               //Methods
               loginUser,
               registerUser,
               logOut,

          }}>
               {children}
          </AuthContext.Provider>
     )
}
