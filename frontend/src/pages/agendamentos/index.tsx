/* eslint-disable react-hooks/exhaustive-deps */
import { canSSRAuth } from "../../utils/canSSRAuth"
import Head from 'next/head'
import Link from 'next/link'
import styles from './styles.module.scss'
import {useState, useEffect} from 'react'
import {setupAPIClient} from '../../services/api'
import {Table, Modal} from 'antd'
import {EditOutlined, DeleteOutlined} from '@ant-design/icons'
import { toast } from 'react-toastify'
import Select from 'react-select'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

import { Header } from '../../components/HeaderSecundario'
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

type StatusMap = {
    label: string;
    value: string;
}

export default function Agendamentos(){

    const [isEditando, setIsEditando] = useState(false);
    const [editandoAgendamento, setEditandoAgendamento] = useState<Agendamento>(null)
    const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
    const [query, setQuery] = useState("");
    const [editandoCliente, setEditandoCliente] = useState<ClienteMap>(null)
    const [clientesDisponiveis, setClientesDisponiveis] = useState<ClienteMap[]>([]);
    const [editandoBarbeiro, setEditandoBarbeiro] = useState<BarbeiroMap>(null)
    const [barbeirosDisponiveis, setBarbeirosDisponiveis] = useState<BarbeiroMap[]>([]);
    const [editandoServicos, setEditandoServicos] = useState<ServicoMap[]>([])
    const [servicosDisponiveis, setServicosDisponiveis] = useState<ServicoMap[]>([]);
    const [date, setDate] = useState(new Date());
    const [editandoHorario, setEditandoHorario] = useState<HorarioMap>(null);
    const [horarios, setHorarios] = useState<HorarioMap[]>([]);
    const [status, setStatus] = useState<StatusMap>(null);
    const [texto, setTexto] = useState("");
    
    const opcoesStatus = [
        {value: "CONFIRMADO", label: "CONFIRMADO"},
        {value: "CONCLUIDO", label: "CONCLUÍDO"},
        {value: "CANCELADO", label: "CANCELADO"},
        {value: "REMARCADO", label: "REMARCADO"},
        {value: "AUSENTE", label: "AUSENTE"},
    ]

    const apiClient = setupAPIClient();

    const fetchAgendamentos = async() => {
        const response = await apiClient.get('/agendamentos').catch(err=> console.log(err));

        if(response){
            const agendamentos: Agendamento[] = response.data;
            setAgendamentos(agendamentos);
        }
    };

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

        fetchAgendamentos();
        fetchCliente();
        fetchBarbeiro();
        fetchServico();

    }, []);


    const keys = ["id", "data", "horario", "status", "cliente", "barbeiro", "total", "observacao"];

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
            title:'Id',
            dataIndex:'id'
        },
        {
            key:'2',
            title:'Cliente',
            dataIndex: ['cliente', 'nome']
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
            title:'Data',
            dataIndex:'data',
            render: (text) => String(text)
        },
        {
            key:'6',
            title:'Horário',
            dataIndex:'horario'
        },
        {
            key:'7',
            title:'Total',
            dataIndex:'total',
            render: (total) => String("R$ ").concat(total)
        },
        {
            key:'8',
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
            key:'9',
            title:'Observação',
            dataIndex:'observacao'
        },
        {
            key:'10',
            title:'Alterações',
            render:(record) => {
                return (
                <>
                <EditOutlined onClick={() =>{onHandleEdit(record)}}/>
                <DeleteOutlined onClick={() =>{onHandleDelete(record)}} style={{color: "#cc331f", marginLeft: 12}}/>
                </>
                );
            }
        },
    ];

    async function BuscarHorarios(barbeiro: Barbeiro, e: Date): Promise<void> {

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

    const handleServicos = (selectedOption: ServicoMap[]) => {

        const servicosEscolhidos: ServicoMap[] = [];

        let result = selectedOption;
                result.some((servico) => {
                    servicosEscolhidos.push(servico);
                })

                setEditandoServicos(servicosEscolhidos);
    }

    const onHandleDelete = async(record: Agendamento) => {
        Modal.confirm({
            title: "Tem certeza que deseja deletar esse agendamento?",
            okText: "Sim",
            okType: "danger",
            cancelText:"Cancelar",
            onOk:() =>{
                apiClient.delete(`/agendamentos/${record.id}`).catch(err=> console.log(err)).then(fetchAgendamentos)
            }

        })
    };

    const onHandleEdit = async(record: Agendamento) => {
        setIsEditando(true);

        const clienteMap: ClienteMap = {value: record.cliente, label: record.cliente.nome};
        setEditandoCliente(clienteMap);

        const barbeiroMap: BarbeiroMap = {value: record.barbeiro, label: record.barbeiro.nome};
        setEditandoBarbeiro(barbeiroMap);

        const servicoMap: ServicoMap[] = [];

        record.servicos.map((servico) => {
            servicoMap.push({value: servico, label: servico.nome});
        })

        setEditandoServicos(servicoMap);

        const [dia, mes, ano] = record.data.split("/");
        const dataAgendada = new LocalDate();
        
        dataAgendada.setFullYear(+ano);
        dataAgendada.setMonth(+mes -1);
        dataAgendada.setDate(+dia);

        setDate(dataAgendada);

        await BuscarHorarios(record.barbeiro, dataAgendada);

        const horarioAgendado: HorarioMap = {value: record.horario, label: record.horario.toString()};

        setEditandoHorario(horarioAgendado);

        const statusMap: StatusMap = {value: record.status, label: record.status};
        setStatus(statusMap)
        
        if(record.observacao != null){
            setTexto(record.observacao);
        } else {
            setTexto("");
        }
        
        setEditandoAgendamento({...record})
    }

    const resetarEdicao = () => {
        setIsEditando(false);
        setEditandoAgendamento(null);
        setTexto("")
    }

    async function handleBarbeiro(selectedOption: BarbeiroMap) {
        if(selectedOption != null){
        setEditandoBarbeiro(selectedOption);
        setDate(null);
        }
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
            <title>Área de Agendamento - Zuko Barbearia</title>
        </Head>
        <div>
            <Header/>

            <main className={styles.container}>
                <h1>AGENDAMENTOS                
                    
                    <div>
                        <Link href="agendamentos/cadastrar" passHref>
                         <button className={styles.cadastrarbutton}>{"CADASTRAR"}</button>
                        </Link>
                    </div>
                </h1>
                <form>
                    <input 
                    type="text"
                    placeholder="Buscar..."
                    className={styles.filter}
                    onChange={(e) => setQuery(e.target.value)}
                    />

                    <Table columns={columns} dataSource={search(agendamentos)} rowKey='id'/>

                    <Modal
                        title="Editar Agendamento"
                        open={isEditando}
                        okText="Salvar"
                        cancelText="Cancelar"
                        onCancel={() => {
                            resetarEdicao()
                        }}
                        onOk={async() => { 
                            
                            try{

                                if(editandoCliente === null || editandoBarbeiro === null || date === null || editandoServicos === null || editandoHorario === null){
                                    toast.error("Preencha todos os campos!")
                                    return;
                                  }

                                  const servicosAgendados: Servico[] = [];

                                  editandoServicos.forEach((servico) => {
                                    servicosAgendados.push(servico.value);
                                  })

                                  const dataAtual = new Date();
                                  const horarioAtual = dataAtual.toLocaleTimeString();
                    
                                  const [horaAtual, minutoAtual, segundoAtual] = horarioAtual.split(':');
                                  const [horaMarcada, minutoMarcado, segundoMarcado] = editandoHorario.value.toString().split(':');
                    
                                  const comparaHoraAtual = new Date(2023, 1, 8, +horaAtual, +minutoAtual, +segundoAtual);
                                  const comparaHoraMarcada = new Date(2023, 1, 8, +horaMarcada, +minutoMarcado, +segundoMarcado);
                    
                                if((dataAtual.toLocaleDateString() === date.toLocaleDateString()) && comparaHoraMarcada.getTime() < comparaHoraAtual.getTime()){
                                    toast.error("Horário escolhido já passou!");
                                    return;
                                }

                                  const permissao = await BuscarEncaixe(servicosAgendados, editandoHorario.value, horarios);
                    
                                  if(!permissao && editandoAgendamento.horario != editandoHorario.value && editandoAgendamento.cliente != editandoCliente.value) {
                                        toast.error("Tempo necessário incompatível com horários disponíveis")
                                        return;
                                    }

                                  const novoAgendamento: Agendamento = {
                                    id: editandoAgendamento.id,
                                    cliente: editandoCliente.value,
                                    barbeiro: editandoBarbeiro.value,
                                    servicos: servicosAgendados,
                                    data: date.toLocaleDateString(),
                                    horario: editandoHorario.value,
                                    status: status.value,
                                    observacao: texto
                                  }

                              await apiClient.put(`/agendamentos/${editandoAgendamento.id}`, novoAgendamento).then(fetchAgendamentos).then(resetarEdicao)
                
                              toast.success('Agendamento editado com sucesso!');
                
                        }catch(err){
                            console.log(err);
                            toast.error("Erro ao editar!")
                            resetarEdicao();
                        }
                           
                        }}
                    >

                    <Select
                    value={editandoCliente}
                    className={styles.input}
                    options={clientesDisponiveis}
                    onChange={(e) => {setEditandoCliente(e)}}
                    />
                    
                    <Select
                    value={editandoBarbeiro}
                    className={styles.input}
                    options={barbeirosDisponiveis}
                    onChange={handleBarbeiro}
                    />

                    <Select
                    isMulti
                    className={styles.input}
                    value={editandoServicos}
                    options={servicosDisponiveis}
                    onChange={handleServicos}
                    />

                    <DatePicker
                    selected={date}
                    onChange={(e: Date) => {setDate(e), BuscarHorarios(editandoBarbeiro.value, e), setStatus(opcoesStatus.at(3))}}
                    dateFormat="dd/MM/yyyy"
                    minDate={new Date()}
                    placeholderText="Selecione a data"
                    className={styles.datePicker}
                    />

                    <Select
                    value={editandoHorario}
                    className={styles.input}
                    options={horarios}
                    onChange={(e) => {setEditandoHorario(e), setStatus(opcoesStatus.at(3))}}
                    />

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