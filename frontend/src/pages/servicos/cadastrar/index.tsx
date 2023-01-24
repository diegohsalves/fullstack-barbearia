/* eslint-disable react-hooks/rules-of-hooks */

import { canSSRAuth } from "../../../utils/canSSRAuth"
import Head from 'next/head'
import styles from './styles.module.scss'
import InputMask from 'react-input-mask'
import { Button } from '../../../components/ui/Button'
import { InputNumber } from "antd"
import { MaskedInput } from "antd-mask-input"

import { Header } from '../../../components/HeaderSecundario'
import { FormEvent, useState} from "react"

import { toast } from 'react-toastify'
import Router from 'next/router';

import { setupAPIClient } from '../../../services/api'
import React from "react"

type Servico = {
    nome: string;
    preco: number;
    tempoDuracao: string;
}

export default function CadastrarServico(){

    const [nome, setNome] = useState(''); 
    const [preco, setPreco] = useState(null); 
    const [tempoDuracao, setTempoDuracao] = useState('');

    const nodeRef = React.useRef(null);

    async function handleRegister(event: FormEvent){
        event.preventDefault();

        try{

            if(nome === '' || preco === null || tempoDuracao === ''){
                toast.error("Preencha todos os campos!")
                return;
              }

              const nomeInicialMaiuscula = nome.charAt(0).toUpperCase() + nome.slice(1);

              const novoServico: Servico = {
                nome: nomeInicialMaiuscula,
                preco: preco,
                tempoDuracao: tempoDuracao
              }
          
              const apiClient = setupAPIClient();
              await apiClient.post('/servicos', novoServico)

              toast.success('Serviço cadastrado com sucesso!');
              Router.push('/servicos')

        }catch(err){
            console.log(err);
            toast.error("Erro ao cadastrar!")
            setNome('');
            setPreco(0);
            setTempoDuracao('');
        }
  }

    return(
        <>
        <Head>
            <title>Cadastrar Serviço</title>
        </Head>
        <div>
            <Header/>

            <main className={styles.container}>
                <h1>SERVIÇO</h1>

                <form className={styles.form} onSubmit={handleRegister}>
                    <input
                    type="text"
                    placeholder="Nome do serviço"
                    value={nome}
                    onChange={ (event) => setNome(event.target.value)}
                    className={styles.input}
                    />

                    <InputNumber
                    type="number"
                    step="0.2"
                    placeholder="Preço"
                    value={preco}
                    onChange={ (event) => setPreco(event)}
                    className={styles.numeroInput}
                    />

                    <InputMask
                    mask="99:99"
                    timeout={1000}
                    noderef={nodeRef}
                    placeholder='Tempo de duração'
                    className={styles.input}
                    value={tempoDuracao}
                    onChange={(event) => setTempoDuracao(event.target.value)}
                    />

                    <Button className={styles.buttonAdd}
                    type="submit"
                    loading={false}>
                    Cadastrar
                    </Button>

                </form>
            </main>
        </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async(context) => {

    return{
        props:{} 
    }
})