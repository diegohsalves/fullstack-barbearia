import { createContext, ReactNode, useState } from 'react';

import { api } from '../services/apiClient';

import {destroyCookie, setCookie} from 'nookies';
import Router from 'next/router';

import { toast } from 'react-toastify'

type AuthContextData = {
    user?: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {
    username: string;
}

type SignInProps = {
    username: string;
    password: string;
}

type SignUpProps = {
    username: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut(){
    try{
        destroyCookie(undefined, '@auth.token')
        Router.push('/')
    }catch{
        console.log('erro ao deslogar')
    }
}

export function AuthProvider({children}: AuthProviderProps){

    const [user, setUser] = useState<UserProps>()
    const isAuthenticated = !!user;

   async function signIn({username, password}: SignInProps) {
    try{
        const response = await api.post('/login', {
           username,
           password 
        })

        const {token} = response.data

        setCookie(undefined, '@auth.token', token, {
            maxAge: 60 * 60 * 2.5,
            path: "/"
        })

       setUser({
        username
       })

       api.defaults.headers.common['Authorization'] = `Bearer ${token}`

       toast.success("Logado com sucesso!")
       Router.push('/dashboard')

    }catch(err){
        toast.error("Erro ao acessar!")
        console.log("Error ao acessar", err)
    }
    }

    async function signUp({username, password}:SignUpProps){
      
        try{

            const response = await api.post('/usuarios', {
                username,
                password
            })

            toast.success("Conta criada com sucesso!")

            Router.push('/')
        }catch(err){
            toast.error("Erro ao cadastrar!")
        }
    }

    return(
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp}}>
            {children}
        </AuthContext.Provider>
    )
}