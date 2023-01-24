import { canSSRAuth } from "../../utils/canSSRAuth"
import Head from 'next/head'

import { Header } from '../../components/HeaderSecundario'

export default function Configuracoes(){
    return(
        <>
        <Head>
            <title>Configurações - Zuko Barbearia</title>
        </Head>
        <div>
            <Header/>
        </div>
        </>
    )
}

export const getServerSideProps =canSSRAuth(async(context) => {

    return{
        props:{} 
    }
})