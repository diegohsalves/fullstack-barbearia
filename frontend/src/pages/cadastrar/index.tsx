/* eslint-disable react-hooks/rules-of-hooks */

import { canSSRGuest } from "../../utils/canSSRGuest"
import Head from 'next/head'
import styles from './styles.module.scss'

import { Input } from '../../components/ui/Input'
import { Button } from '../../components/ui/Button'
import { FormEvent, useState, useContext } from "react"

import { AuthContext } from '../../contexts/AuthContext'
import { toast } from 'react-toastify'
import Link from 'next/link'

import { setupAPIClient } from '../../services/api'

export default function CadastrarUsuario(){

    const {signUp} = useContext(AuthContext);
 
    const [username, setUsername] = useState(''); 
    const [password, setPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const apiClient = setupAPIClient();

    async function handleRegister(event: FormEvent){
        event.preventDefault();

            if(username === '' || password === ''){
                toast.error("Preencha todos os campos!")
                return;
              }

              const usernameDisponivel = await apiClient.post(`/usuarios/usernameDisponivel?username=${username}`);

              if(!usernameDisponivel.data){
                  toast.error("Username já existente!")
                  return;
              
                } else{

                setLoading(true);

                let data = {
                    username: username,
                    password: password
                }
        
                await signUp(data);
        
                setLoading(false);
              }

  }

    return(
        <>
        <Head>
            <title>Cadastrar Usuário</title>
        </Head>
        <div>

            <main className={styles.container}>
                <h1>USUÁRIO</h1>

                <form className={styles.form} onSubmit={handleRegister}>
                    <Input
                    type="text"
                    placeholder="Escolha o username"
                    value={username}
                    onChange={ (event) => setUsername(event.target.value)}
                    className={styles.input}
                    />

                    <Input
                    type="password"
                    placeholder="Escolha a senha"
                    value={password}
                    onChange={ (event) => setPassword(event.target.value)}
                    className={styles.input}
                    />

                    <Button className={styles.buttonAdd}
                    type="submit"
                    loading={loading}>
                    Cadastrar
                    </Button>

                    <Link href="/" legacyBehavior>
                    <a className={styles.text}>Já possui uma conta? Faça o login!</a>
                    </Link>

                </form>
            </main>
        </div>
        </>
    )
}

export const getServerSideProps = canSSRGuest(async(context) => {

    return{
        props:{} 
    }
})