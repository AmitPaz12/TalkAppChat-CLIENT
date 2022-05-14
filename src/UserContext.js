import {createContext, useContext} from 'react';

export const UserContext = createContext();
export const UseUserContext = () => useContext(UserContext);
