import { useState, useContext, FormEvent } from 'react'

import Head from 'next/head'
import Image from 'next/image'
import styles from '../../styles/home.module.scss'

import logoImg from '../../public/barbearia.png'

import {Input} from '../components/ui/Input'
import { Button } from '../components/ui/Button'

import { AuthContext } from '../contexts/AuthContext'

import Link from 'next/link'
import { toast } from 'react-toastify'

import { canSSRGuest } from '../utils/canSSRGuest'

export default function Home() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  const { signIn } = useContext(AuthContext)

  async function handleLogin(event: FormEvent){
    event.preventDefault();

    if(username === '' || password === ''){
      toast.error("Preencha todos os campos!")
      return;
    }

    setLoading(true);

    let data = {
      username,
      password
    }

    await signIn(data)

    setLoading(false);
  }

  return (
    <>
     <Head>
      <title>Zuko Barbearia - Faça seu login</title>
     </Head>
     <div className={styles.containerCenter}>
      <Image src={logoImg} alt="Logo Barbearia Zuko" />
      <div className={styles.login}>
        <form onSubmit={handleLogin}>

          <Input 
          placeholder='Digite seu username'
          type="text"
          value={username}
          onChange={ (log) => setUsername(log.target.value)}
          />

          <Input 
          placeholder='Digite seu password'
          type="password"
          value={password}
          onChange={ (pass) => setPassword(pass.target.value)}
          />

          <Button
          type="submit"
          loading={loading}
          >
            Acessar
            </Button>

        </form>
        
        <Link href="/cadastrar" legacyBehavior>
        <a className={styles.text}>Não possui uma conta? Cadastre-se</a>
        </Link>

      </div>
     </div>

    </>
  )
}

export const getServerSideProps = canSSRGuest(async(context) => {

  return{
    props: {}
  }
})