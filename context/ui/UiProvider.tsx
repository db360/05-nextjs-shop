import { FC, useReducer } from 'react';

import {UiContext, uiReducer} from './'

type Props = { children?: React.ReactNode };

export interface UiState {
     isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UiState = {
     isMenuOpen: false
}

export const UiProvider:FC<Props> = ({ children }) => {

     const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE)

     const toggleSideMenu = () => {
          dispatch({type: '[UI] - Toggle Menu'});
     }

     return (
          <UiContext.Provider value={{
               ...state,
               //Method
               toggleSideMenu,
          }}>
               {children}
          </UiContext.Provider>
     )
}

export default UiProvider