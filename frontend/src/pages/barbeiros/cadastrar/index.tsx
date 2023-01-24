/* eslint-disable react-hooks/rules-of-hooks */

import { canSSRAuth } from "../../../utils/canSSRAuth"
import Head from 'next/head'
import styles from './styles.module.scss'
import { Button } from '../../../components/ui/Button'
import { Header } from '../../../components/HeaderSecundario'
import { FormEvent, useState} from "react"
import { toast } from 'react-toastify'
import { Checkbox } from 'antd';
import InputMask from 'react-input-mask'
import Router from 'next/router';

import { setupAPIClient } from '../../../services/api'
import React from "react"

type Barbeiro = {
    nome: string;
    domingo: boolean;
    segunda: boolean;
    terca: boolean;
    quarta: boolean;
    quinta: boolean;
    sexta: boolean;
    sabado: boolean;
    entrada: string;
    saida: string;
    almoco: string;
    retorno: string;
}

export default function CadastrarBarbeiro(){

    const [nome, setNome] = useState('');
    const [domingo, setDomingo] = useState(false);
    const [segunda, setSegunda] = useState(false);
    const [terca, setTerca] = useState(false);
    const [quarta, setQuarta] = useState(false);
    const [quinta, setQuinta] = useState(false);
    const [sexta, setSexta] = useState(false);
    const [sabado, setSabado] = useState(false);
    const [entrada, setEntrada] = useState('');
    const [saida, setSaida] = useState('');
    const [almoco, setAlmoco] = useState('');
    const [retorno, setRetorno] = useState('');

    const nodeRef = React.useRef(null);

    async function handleRegister(event: FormEvent){
        event.preventDefault();

        try{

            if( nome === '' || entrada === '' || saida === '' || almoco === '' || retorno === ''){
                toast.error("Preencha todos os campos!")
                return;
              }

              const nomeInicialMaiuscula = nome.charAt(0).toUpperCase() + nome.slice(1);
          
              const apiClient = setupAPIClient();

              const barbeiro: Barbeiro = {
                nome: nomeInicialMaiuscula,
                domingo: domingo,
                segunda: segunda,
                terca: terca,
                quarta: quarta,
                quinta: quinta,
                sexta: sexta,
                sabado: sabado,
                entrada: entrada,
                saida: saida,
                almoco: almoco,
                retorno: retorno
              }

              await apiClient.post('/barbeiros', barbeiro)

              toast.success('Barbeiro cadastrado com sucesso!');
              Router.push('/barbeiros')

        }catch(err){
            console.log(err);
            toast.error("Erro ao cadastrar!")
            setNome('');
        }
  }

    return(
        <>
        <Head>
            <title>Cadastrar Barbeiro</title>
        </Head>
        <div>
            <Header/>

            <main className={styles.container}>
                <h1>BARBEIRO</h1>

                <form className={styles.form} onSubmit={handleRegister}>
                    <input
                    type="text"
                    placeholder="Nome completo"
                    value={nome}
                    onChange={ (event) => setNome(event.target.value)}
                    className={styles.input}
                    />

                    <div>

                    <h2>Horários de Trabalho</h2>

                    <div>
                    <Checkbox className={styles.checkbox} checked={domingo} onChange={(e) => setDomingo(!e.target.value)}>Domingo</Checkbox>
                    <Checkbox className={styles.checkbox} checked={segunda} onChange={(e) => setSegunda(!e.target.value)}>Segunda</Checkbox>
                    <Checkbox className={styles.checkbox} checked={terca} onChange={(e) => setTerca(!e.target.value)}>Terça</Checkbox>
                    <Checkbox className={styles.checkbox} checked={quarta} onChange={(e) => setQuarta(!e.target.value)}>Quarta</Checkbox>
                    <Checkbox className={styles.checkbox} checked={quinta} onChange={(e) => setQuinta(!e.target.value)}>Quinta</Checkbox>
                    <Checkbox className={styles.checkbox} checked={sexta} onChange={(e) => setSexta(!e.target.value)}>Sexta</Checkbox>
                    <Checkbox className={styles.checkbox} checked={sabado} onChange={(e) => setSabado(!e.target.value)}>Sábado</Checkbox>
                    </div>

                    <InputMask
                    timeout={1000}
                    noderef={nodeRef}
                    mask="99:99"
                    placeholder='Entrada'
                    className={styles.inputCurto}
                    value={entrada}
                    onChange={(e) => setEntrada(e.target.value)}
                    />

                    <InputMask
                    timeout={1000}
                    noderef={nodeRef}
                    mask="99:99"
                    placeholder='Saída'
                    className={styles.inputCurto}
                    value={saida}
                    onChange={(e) => setSaida(e.target.value)}
                    />

                    <InputMask
                    timeout={1000}
                    noderef={nodeRef}
                    mask="99:99"
                    placeholder='Almoço'
                    className={styles.inputCurto}
                    value={almoco}
                    onChange={(e) => setAlmoco(e.target.value)}
                    />

                    <InputMask
                    timeout={1000}
                    noderef={nodeRef}
                    mask="99:99"
                    placeholder='Retorno'
                    className={styles.inputCurto}
                    value={retorno}
                    onChange={(e) => setRetorno(e.target.value)}
                    />
                    </div>

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