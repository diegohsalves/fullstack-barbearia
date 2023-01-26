/* eslint-disable react-hooks/exhaustive-deps */
import { canSSRAuth } from "../../utils/canSSRAuth"
import Head from 'next/head'
import { Header } from '../../components/HeaderPrimario'
import styles from './styles.module.scss'
import { toast } from 'react-toastify'

import {useState, useEffect} from 'react'
import {setupAPIClient} from '../../services/api'

import {Table, Modal} from 'antd'
import {EditOutlined} from '@ant-design/icons'
import Select from 'react-select'
import { LocalDate } from "local-date"

type Agendamento = {
    id: number;
    cliente: Cliente;
    barbeiro: Barbeiro;
    servicos: Servico[];
    data: string;
    horario: string;
    status: string;
    observacao: string;
}

type Cliente = {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
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

type Servico = {
    id: number;
    nome: string;
    preco: number;
    tempoDuracao: Date;
}

type StatusMap = {
    label: string;
    value: string;
}

export default function Dashboard(){

    const[isEditando, setIsEditando] = useState(false);
    const[editandoAgendamento, setEditandoAgendamento] = useState<Agendamento>(null)
    const[agendamento, setAgendamento] = useState<Agendamento>(null)
    const[agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const[status, setStatus] = useState<StatusMap>(null);
    const[texto, setTexto] = useState("");
    const[query, setQuery] = useState("");

    const opcoesStatus = [
        {value: "CONFIRMADO", label: "CONFIRMADO"},
        {value: "CONCLUIDO", label: "CONCLUÍDO"},
        {value: "CANCELADO", label: "CANCELADO"},
        {value: "AUSENTE", label: "AUSENTE"},
    ]

    const apiClient = setupAPIClient();

    const fetchAgendamentos = async() => {
        const response = await apiClient.get('/agendamentos').catch(err=> console.log(err));

        if(response){
            const agendamentos: Agendamento[] = [];
            const data = new LocalDate().toLocaleDateString();

            response.data.forEach((agendamento: Agendamento) => {
                if(agendamento.data == data) {
                    agendamentos.push(agendamento);
                }
            })
            setAgendamentos(agendamentos);
        }
    };

    useEffect(() => {
        
        fetchAgendamentos();
    }, []);

    const keys = ["data", "horario", "status", "cliente", "barbeiro", "total", "observacao"];

    const search = (data: Agendamento[]) => {
    
        let lista: Agendamento[] = [];

        lista = data.filter((item) => {
            return item.servicos.some((servico) => servico.nome.toLowerCase().includes(query.toLowerCase()))
    })

        if(lista.length > 0) {
            return lista;    
        } 

            lista = data.filter((item) => {
                return keys.some((key => String(item[key].nome).toLowerCase().includes(query.toLowerCase())));
            })

        if(lista.length > 0) {
                return lista;    
        }

        lista = data.filter((item) => {
            return keys.some((key => String(item[key]).toLowerCase().includes(query.toLowerCase())));
        })

    if(lista.length > 0) {
            return lista;    
    }

    return lista;
    };

    const columns = [
        {
            key:'1',
            title:'Data',
            dataIndex:'data'
        },
        {
            key:'2',
            title:'Horário',
            dataIndex:'horario'
        },
        {
            key:'3',
            title:'Barbeiro',
            dataIndex: ['barbeiro', 'nome']
        },
        {
            key:'4',
            title:'Serviços',
            dataIndex: 'servicos',
            render: (servicos) => servicos.map(servico => servico.nome).join(", ")
        },
        {
            key:'5',
            title:'Cliente',
            dataIndex: ['cliente', 'nome']
        },
        {
            key:'6',
            title:'Status',
            dataIndex:'status',
            onCell: (record) => {

                if(record.status === "CONFIRMADO"){
                    return {
                        ['style']: {background: "#4663c9"}
                    }
                } if(record.status === "CANCELADO"){
                    return {
                        ['style']: {background: "#b3adad"}
                    }
                } if(record.status === "CONCLUIDO"){
                    return {
                        ['style']: {background: "#3d9960"}
                    }
                } if(record.status === "AUSENTE"){
                    return {
                        ['style']: {background: "#c5161f"}
                    }
                } if(record.status === "REMARCADO"){
                    return {
                        ['style']: {background: "#ccab33"}
                    }
                } 
            }
        },
        {
            key:'7',
            title:'Observação',
            dataIndex:'observacao'
        },
        {
            key:'8',
            title:'Total',
            dataIndex:'total',
            render: (total) => String("R$ ").concat(total)
        },
        {
            key:'9',
            title:'Alterações',
            render:(record) => {
                return (
                <>
                <EditOutlined onClick={() =>{onHandleEdit(record)}}/>
                </>
                );
            }
        },
    ];

    const onHandleEdit = async(record: Agendamento) => {

        setIsEditando(true);
        
        const statusMap: StatusMap = {value: record.status, label: record.status};
        setStatus(statusMap)
        
        if(record.observacao != null){
            setTexto(record.observacao);
        } else {
            setTexto("");
        }

        setEditandoAgendamento({...record});
        setAgendamento({...record});
    }

    const resetarEdicao = () => {
        setIsEditando(false);
        setEditandoAgendamento(agendamento);
        setAgendamento(null);
        setTexto("");
    }

    const handleObservacao = (event) => {
        if(!event){
            setTexto("");
        } else {
            setTexto(event.target.value);
        }
    }

    return(
        <>
        <Head>
            <title>Painel - Zuko Barbearia</title>
        </Head>
        <div>
            <Header/>
            <main className={styles.container}>
                <h1>AGENDA DO DIA</h1>
                <form>
                    <input 
                    type="text"
                    placeholder="Buscar..."
                    className={styles.filter}
                    onChange={(e) => setQuery(e.target.value)}
                    />

                    <Table columns={columns} dataSource={search(agendamentos)} rowKey='id'/>

                    <Modal
                        title="Alterar Status"
                        open={isEditando}
                        okText="Salvar"
                        cancelText="Cancelar"
                        onCancel={() => {
                            resetarEdicao()
                        }}
                        onOk={async() => { 
                            
                            try{
                                  const agendamentoEditado: Agendamento = {
                                    id: editandoAgendamento.id,
                                    cliente: editandoAgendamento.cliente,
                                    barbeiro: editandoAgendamento.barbeiro,
                                    servicos: editandoAgendamento.servicos,
                                    data: editandoAgendamento.data,
                                    horario: editandoAgendamento.horario,
                                    status: status.value,
                                    observacao: texto
                                  }

                              await apiClient.put(`/agendamentos/${editandoAgendamento.id}`, agendamentoEditado).then(fetchAgendamentos).then(resetarEdicao)
                
                              toast.success('Agendamento editado com sucesso!');
                
                        }catch(err){
                            console.log(err);
                            toast.error("Erro ao editar!");
                            resetarEdicao();
                        }
                           
                        }}
                    >

                    <Select
                    value={status}
                    className={styles.input}
                    options={opcoesStatus}
                    onChange={(e) => setStatus(e)}
                    />

                    <textarea
                    placeholder="Observação"
                    className={styles.observacao}
                    value={texto}
                    onChange={handleObservacao}
                    />

                    </Modal>
    
                </form>
            </main>
        </div>
        </>
    )
}

export const getServerSideProps =canSSRAuth(async(context) => {

    return{
        props:{} 
    }
})