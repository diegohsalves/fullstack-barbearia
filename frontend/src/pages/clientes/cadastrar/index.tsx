/* eslint-disable react-hooks/rules-of-hooks */

import { canSSRAuth } from "../../../utils/canSSRAuth"
import Head from 'next/head'
import styles from './styles.module.scss'
import { Button } from '../../../components/ui/Button'
import Router from 'next/router';
import validator from 'cpf-cnpj-validator';
import emailvalidator from 'validator'

import { Header } from '../../../components/HeaderPrimario'
import { FormEvent, useState } from "react"

import { toast } from 'react-toastify'

import { setupAPIClient } from '../../../services/api'
import { Input } from "../../../components/ui/Input"

type Cliente = {
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
}

export default function CadastrarCliente(){

    const [nome, setNome] = useState(''); 
    const [email, setEmail] = useState(''); 
    const [cpf, setCpf] = useState('');
    const [telefone, setTelefone] = useState('');

    const handleTelefone = (event) => {
        let input = event.target
        input.value = telefoneMascara(input.value)
    }

    const telefoneMascara = (value) => {
        if (!value) {
            setTelefone(value);
        }
        value = value.replace(/\D/g,'')
        value = value.replace(/(\d{2})(\d)/,"($1) $2")
        value = value.replace(/(\d)(\d{4})$/,"$1-$2")
        setTelefone(value);

        return value;
      }

    const handleCpf = (event) => {
        let input = event.target
        input.value = cpfMascara(input.value)
    }

    const cpfMascara = (value) => {
        if(!value){
            setCpf(value);
        }

    value = value.replace(/\D/g, '')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d)/, '$1.$2')
    value = value.replace(/(\d{3})(\d{1,2})/, '$1-$2')
    value = value.replace(/(-\d{2})\d+?$/, '$1')

    setCpf(value);
    }

    async function handleRegister(event: FormEvent){
        event.preventDefault();

        try{

            if(nome === '' || email === '' || cpf === '' || telefone === ''){
                toast.error("Preencha todos os campos!")
                return;
              }

              const nomeInicialMaiuscula = nome.charAt(0).toUpperCase() + nome.slice(1);

              const Joi = require('@hapi/joi').extend(validator)
              const cpfSchema = Joi.document().cpf();

              const cpfValidado = cpfSchema.validate(cpf);

              if(cpfValidado.error != null){
                toast.error("CPF inválido!");
                return;
              }

              if(!emailvalidator.isEmail(email)){
                toast.error("Email inválido!");
                return;
              }

              const novoCliente: Cliente = {
                nome: nomeInicialMaiuscula,
                email: email,
                cpf: cpf,
                telefone: telefone
              }
          
              const apiClient = setupAPIClient();
              const response = await apiClient.post('/clientes', novoCliente)

              toast.success('Cliente cadastrado com sucesso!');
              Router.push('/clientes')

        }catch(err){
            toast.error("CPF já cadastrado!")
            setCpf('');
        }
  }

    return(
        <>
        <Head>
            <title>Cadastrar Cliente</title>
        </Head>
        <div>
            <Header/>

            <main className={styles.container}>
                <h1>CLIENTE</h1>

                <form className={styles.form} onSubmit={handleRegister}>
                    <Input
                    type="text"
                    placeholder="Nome completo"
                    value={nome}
                    onChange={ (event) => setNome(event.target.value)}
                    className={styles.input}
                    />

                    <Input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={ (event) => setEmail(event.target.value)}
                    className={styles.input}
                    />

                    <Input
                    placeholder='CPF'
                    className={styles.input}
                    value={cpf}
                    onChange={(e) => handleCpf(e)}
                    />

                    <Input
                    type="tel"
                    maxLength={15}
                    placeholder="Telefone"
                    className={styles.input}
                    value={telefone}
                    onChange={(e) => handleTelefone(e)}
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