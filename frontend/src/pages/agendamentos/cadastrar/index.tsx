/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */

import { canSSRAuth } from "../../../utils/canSSRAuth"
import Head from 'next/head'
import styles from './styles.module.scss'
import { Button } from '../../../components/ui/Button'

import { Header } from '../../../components/HeaderPrimario'
import { FormEvent, useState, useEffect } from "react"

import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select'
import Router from 'next/router'

import { toast } from 'react-toastify'

import { setupAPIClient } from '../../../services/api'

type Agendamento = {
    cliente: Cliente;
    barbeiro: Barbeiro;
    servicos: Servico[];
    data: string;
    horario: string;
    observacao: string;
}

type Cliente = {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
}

type ClienteMap = {
    label: string;
    value: Cliente;
}

type Barbeiro = {
    id: number;
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

type BarbeiroMap = {
    label: string;
    value: Barbeiro;
}

type Servico = {
    id: number;
    nome: string;
    preco: number;
    tempoDuracao: Date;
}

type ServicoMap = {
    label: string;
    value: Servico;
}

type HorarioMap = {
    label: string;
    value: string;
}

export default function CadastrarAgendamento(){

    const [cliente, setCliente] = useState<Cliente>(null);
    const [clientesDisponiveis, setClientesDisponiveis] = useState<ClienteMap[]>([]);
    const [barbeiro, setBarbeiro] = useState<Barbeiro>(null);
    const [barbeirosDisponiveis, setBarbeirosDisponiveis] = useState<BarbeiroMap[]>([]);
    const [servicos, setServicos] = useState<Servico[]>([]);
    const [servicosDisponiveis, setServicosDisponiveis] = useState<ServicoMap[]>([]);
    const [date, setDate] = useState<Date>(new Date());
    const [horario, setHorario] = useState('');
    const [horarios, setHorarios] = useState<HorarioMap[]>([]);
    const[texto, setTexto] = useState("");

    const colorStyles = {
        option: (styles) => ({...styles, backgroundColor: "#FFF"}),
    }

    const apiClient = setupAPIClient();

    useEffect(() => {
        
        const fetchCliente = async() => {

            const listaClientes: ClienteMap[] = [];

            await apiClient.get('/clientes').then((res) => {
                let result = res.data;
                result.map((cliente: Cliente) => {
                    listaClientes.push({value: cliente, label: cliente.nome});
                })
                setClientesDisponiveis(listaClientes)
            });
        };

        const fetchBarbeiro = async() => {

            const listaBarbeiros: BarbeiroMap[] = [];

            await apiClient.get('/barbeiros').then((res) => {
                let result = res.data;
                result.map((barbeiro: Barbeiro) => {
                    listaBarbeiros.push({value: barbeiro, label: barbeiro.nome});
                })
                setBarbeirosDisponiveis(listaBarbeiros)
            });
        };

        const fetchServico = async() => {

            const listaServicos: ServicoMap[] = [];

            await apiClient.get('/servicos').then((res) => {
                let result = res.data;
                result.map((servico: Servico) => {
                    return listaServicos.push({value: servico, label: servico.nome});
                })
                setServicosDisponiveis(listaServicos)
            });
        };

        fetchCliente();
        fetchBarbeiro();
        fetchServico();

    }, []);

    async function BuscarHorarios(e: Date): Promise<void> {

        const horariosDisponiveis: HorarioMap[] = [];
        
        if(barbeiro != null && e != null){

            if(
            (e.getDay() == 0 && barbeiro.domingo == false) ||
            (e.getDay() == 1 && barbeiro.segunda == false) ||
            (e.getDay() == 2 && barbeiro.terca == false) ||
            (e.getDay() == 3 && barbeiro.quarta == false) ||
            (e.getDay() == 4 && barbeiro.quinta == false) ||
            (e.getDay() == 5 && barbeiro.sexta == false) ||
            (e.getDay() == 6 && barbeiro.sabado == false)) {
                
                setHorarios([]);
                toast.warn("Data indisponível para agendamento!")
                return;
            }

            const id = barbeiro.id;
            const dataFormatada = e.toLocaleDateString();

            await apiClient.post(`/agendamentos/horarios?id=${id}&data=${dataFormatada}`).then((res) => {
                let result = res.data;
                result.map((horario: string) => {
                    
                    const [hora, minutos] = horario.split(":");
                    const horaFormatada = hora + ":" + minutos;

                    horariosDisponiveis.push({value: horaFormatada, label: horaFormatada});
                })
            })
        
        }
        setHorarios(horariosDisponiveis)
    }

    async function BuscarEncaixe(listaServicos: Servico[], horarioEscolhido: string, listaHorarios: HorarioMap[]): Promise<boolean> {

        let encaixou: boolean;
        
        if(listaServicos != null && horarioEscolhido != null && listaHorarios != null){

            const horarios: string[] = [];
            const servicos: number[] = [];

            listaHorarios.map((horario) => {
                horarios.push(horario.value);
            })

            listaServicos.map((servico) => {
                servicos.push(servico.id);
            })

            await apiClient.post(`/agendamentos/encaixe?horarioEscolhidoInicio=${horarioEscolhido}&horariosDisponiveis=${horarios}&ids=${servicos}`).then((res) => {
                encaixou = res.data;
            });
        }

            return encaixou;
        }
        

    const handleCliente = (selectedOption: ClienteMap) => {
        if(selectedOption != null){
        setCliente(selectedOption.value);
        }
    }

    async function handleBarbeiro(selectedOption: BarbeiroMap) {
        if(selectedOption != null){
        setBarbeiro(selectedOption.value);
        setDate(null);
        }
    }

    const handleServico = (selectedOption: ServicoMap[]) => {

        const servicosEscolhidos: Servico[] = [];

        let result = selectedOption;
                result.some((servico) => {
                    servicosEscolhidos.push(servico.value);
                })

                setServicos(servicosEscolhidos);
    }

    const handleHorario = (selectedOption: HorarioMap) => {

        if(selectedOption != null){
        setHorario(selectedOption.value);
        }
    }

    const handleObservacao = (event) => {
        if(!event){
            setTexto("");
        } else {
            setTexto(event.target.value);
        }
    }
    
    async function handleRegister(event: FormEvent){
        event.preventDefault();

        try{

            if(cliente === null || barbeiro === null || date === null || servicos === null || horario === null){
                toast.error("Preencha todos os campos!")
                return;
              }

              const dataAtual = new Date();
              const horarioAtual = dataAtual.toLocaleTimeString();

              const [horaAtual, minutoAtual] = horarioAtual.split(':');
              const [horaMarcada, minutoMarcado] = horario.split(':');

              const comparaHoraAtual = new Date(2023, 1, 8, +horaAtual, +minutoAtual);
              const comparaHoraMarcada = new Date(2023, 1, 8, +horaMarcada, +minutoMarcado);

            if((dataAtual.toLocaleDateString() === date.toLocaleDateString()) && comparaHoraMarcada.getTime() < comparaHoraAtual.getTime()){
                toast.error("Horário escolhido já passou!");
                return;
            }

              const permissao = await BuscarEncaixe(servicos, horario, horarios);

              if(!permissao) {
                toast.error("Tempo necessário incompatível com horários disponíveis")
                return;
              }

              const agendamento: Agendamento = {
                cliente: cliente,
                barbeiro: barbeiro,
                servicos: servicos,
                data: date.toLocaleDateString(),
                horario: horario,
                observacao: texto
              }

              const apiClient = setupAPIClient();
              await apiClient.post('/agendamentos', agendamento)

              toast.success('Agendamento cadastrado com sucesso!');
              Router.push('/agendamentos');

        }catch(err){
            console.log(err);
            toast.error("Erro ao cadastrar!")
        }
  }

    return(
        <>
        <Head>
            <title>Novo Agendamento</title>
        </Head>
        <div>
            <Header/>

            <main className={styles.container}>
                <h1>AGENDAMENTO</h1>

                <form className={styles.form} onSubmit={handleRegister}>
                
                    <Select
                    options={clientesDisponiveis}
                    className={styles.input}
                    placeholder={"Selecione o cliente"}
                    isSearchable={true}
                    styles={colorStyles}
                    onChange={(handleCliente)}
                    />

                    <Select
                    options={barbeirosDisponiveis}
                    className={styles.input}
                    placeholder={"Selecione o barbeiro"}
                    isSearchable={true}
                    styles={colorStyles}
                    onChange={handleBarbeiro}
                    />
                    
                    <Select
                    isMulti
                    options={servicosDisponiveis}
                    className={styles.input}
                    placeholder={"Selecione os serviços"}
                    isSearchable={true}
                    styles={colorStyles}
                    onChange={handleServico}
                    />

                    <DatePicker
                    selected={date}
                    onChange={(e: Date) => {setDate(e), BuscarHorarios(e)}}
                    minDate={new Date()}
                    placeholderText="Selecione a data"
                    dateFormat="dd/MM/yyyy"
                    className={styles.datePicker}
                    />

                    <Select
                    options={horarios}
                    placeholder={"Selecione o horário"}
                    className={styles.input}
                    isSearchable={true}
                    styles={colorStyles}
                    onChange={handleHorario}
                    />

                    <textarea
                    placeholder="Observação"
                    className={styles.observacao}
                    value={texto}
                    onChange={handleObservacao}
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