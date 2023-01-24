import { canSSRAuth } from "../../utils/canSSRAuth"
import Head from 'next/head'
import Link from 'next/link'
import styles from './styles.module.scss'
import {useState, useEffect} from 'react'
import {setupAPIClient} from '../../services/api'
import {Table, Modal, Input, Checkbox} from 'antd'
import {EditOutlined, DeleteOutlined, CheckOutlined} from '@ant-design/icons'
import { toast } from 'react-toastify'
import { MaskedInput } from "antd-mask-input"

import { Header } from '../../components/HeaderSecundario'

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

export default function Barbeiros(){

    const[isEditando, setIsEditando] = useState(false);
    const[editandoBarbeiro, setEditandoBarbeiro] = useState<Barbeiro>(null);
    const[barbeiro, setBarbeiro] = useState<Barbeiro>(null);
    const[barbeiros, setBarbeiros] = useState<Barbeiro[]>([]);
    const[query, setQuery] = useState("");

    const apiClient = setupAPIClient();

    const fetchBarbeiros = async() => {
        const response = await apiClient.get('/barbeiros').catch(err=> console.log(err));

        if(response){
            const barbeiro: Barbeiro[] = response.data;
            setBarbeiros(barbeiro);
         
        }
    };

    useEffect(() => {
        fetchBarbeiros();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const keys = ["nome"];

    const search = (data: Barbeiro[]) => {
        return data.filter((item) => 
        keys.some((key => String(item[key]).toLowerCase().includes(query)))
        );
    };

    const columns = [
        {
            key:'1',
            title:'Id',
            dataIndex:'id'
        },
        {
            key:'2',
            title:'Nome',
            dataIndex:'nome'
        },
        {
            key:'3',
            title:'Dom',
            dataIndex: 'domingo',
            render: (record: boolean) => {
                if(record){
                return (
                    <>
                        <CheckOutlined/>
                    </>
                )
                }
             }
        },
        {
            key:'4',
            title:'Seg',
            dataIndex: 'segunda',
            render: (record: boolean) => {
                if(record){
                return (
                    <>
                        <CheckOutlined/>
                    </>
                )
                }
             }
        },
        {
            key:'5',
            title:'Ter',
            dataIndex: 'terca',
            render: (record: boolean) => {
                if(record){
                return (
                    <>
                        <CheckOutlined/>
                    </>
                )
                }
             }
        },
        {
            key:'6',
            title:'Qua',
            dataIndex: 'quarta',
            render: (record: boolean) => {
                if(record){
                return (
                    <>
                        <CheckOutlined/>
                    </>
                )
                }
             }
        },
        {
            key:'7',
            title:'Qui',
            dataIndex: 'quinta',
            render: (record: boolean) => {
                if(record){
                return (
                    <>
                        <CheckOutlined/>
                    </>
                )
                }
             }
        },
        {
            key:'8',
            title:'Sex',
            dataIndex: 'sexta',
            render: (record: boolean) => {
                if(record){
                return (
                    <>
                        <CheckOutlined/>
                    </>
                )
                }
             }
        },
        {
            key:'9',
            title:'Sab',
            dataIndex: 'sabado',
            render: (record: boolean) => {
                if(record){
                return (
                    <>
                        <CheckOutlined/>
                    </>
                )
                }
             }
        },
        {
            key:'10',
            title:'Entrada',
            dataIndex: 'entrada',
            render: (text: Date) => String(text)
        },
        {
            key:'11',
            title:'Saída',
            dataIndex: 'saida',
            render: (text: Date) => String(text)
        },
        {
            key:'12',
            title:'Almoço',
            dataIndex: 'almoco',
            render: (text: Date) => String(text)
        },
        {
            key:'12',
            title:'Retorno',
            dataIndex: 'retorno',
            render: (text: Date) => String(text)
        },
        {
            key:'13',
            title:'Alterações',
            render:(record: Barbeiro) => {
                return (
                <>
                <EditOutlined onClick={() =>{onHandleEdit(record)}}/>
                <DeleteOutlined onClick={() =>{onHandleDelete(record)}} style={{color: "#cc331f", marginLeft: 12}}/>
                </>
                );
            }
        },
    ];

    const onHandleDelete = async(record: Barbeiro) => {
        Modal.confirm({
            title: "Tem certeza que deseja deletar esse barbeiro?",
            okText: "Sim",
            okType: "danger",
            cancelText:"Cancelar",
            onOk:() =>{
                apiClient.delete(`/barbeiros/${record.id}`).catch(err=> console.log(err)).then(fetchBarbeiros)
            }

        })
    };

    const onHandleEdit = async(record: Barbeiro) => {
        setIsEditando(true);
        setEditandoBarbeiro({...record});
        setBarbeiro({...record});
    }

    const resetarEdicao = () => {
        setIsEditando(false);
        setEditandoBarbeiro(barbeiro);
        setBarbeiro(null);

    }

    return(
        <>
        <Head>
            <title>Área do Barbeiro - Zuko Barbearia</title>
        </Head>
        <div>
            <Header/>

            <main className={styles.container}>
                <h1>BARBEIROS     

                    <div>
                    <Link href="barbeiros/cadastrar" passHref>
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

                    <Table columns={columns} dataSource={search(barbeiros)} rowKey='id'/>
                    <Modal
                        title="Editar Barbeiro"
                        open={isEditando}
                        okText="Salvar"
                        cancelText="Cancelar"
                        onCancel={() => {
                            resetarEdicao()
                        }}
                        onOk={async() => { 
                            
                            try{

                            if(editandoBarbeiro.nome === '' || editandoBarbeiro.entrada === null || editandoBarbeiro.saida === null || editandoBarbeiro.almoco === null || editandoBarbeiro.retorno === null){
                                toast.error("Preencha todos os campos!")
                                return;
                              }

                              const nomeInicialMaiuscula = editandoBarbeiro.nome.charAt(0).toUpperCase() + editandoBarbeiro.nome.slice(1);

                              const barbeiroEditado: Barbeiro = {
                                id: editandoBarbeiro.id,
                                nome: nomeInicialMaiuscula,
                                domingo: editandoBarbeiro.domingo,
                                segunda: editandoBarbeiro.segunda,
                                terca: editandoBarbeiro.terca,
                                quarta: editandoBarbeiro.quarta,
                                quinta: editandoBarbeiro.quinta,
                                sexta: editandoBarbeiro.sexta,
                                sabado: editandoBarbeiro.sabado,
                                entrada: editandoBarbeiro.entrada,
                                saida: editandoBarbeiro.saida,
                                almoco: editandoBarbeiro.almoco,
                                retorno: editandoBarbeiro.retorno
                              }
                          
                              await apiClient.put(`/barbeiros/${editandoBarbeiro.id}`, barbeiroEditado).then(fetchBarbeiros).then(resetarEdicao)
                
                              toast.success('Barbeiro editado com sucesso!');
                
                        }catch(err){
                            console.log(err);
                            toast.error("Erro ao editar!")
                            resetarEdicao();
                        }
                           
                        }}
                    >
                        <Input className={styles.input} value={editandoBarbeiro?.nome} onChange={(e) =>{
                            setEditandoBarbeiro(pre=>{
                                return {...pre, nome: e.target.value}
                            })
                        }}/>

                        <Checkbox className={styles.checkbox} checked={editandoBarbeiro?.domingo} onChange={(e) => {
                            setEditandoBarbeiro(pre=>{
                                return {...pre, domingo: e.target.checked ? true : false}
                            })
                        }}>Dom</Checkbox>

                        <Checkbox className={styles.checkbox} checked={editandoBarbeiro?.segunda} onChange={(e) => {
                            setEditandoBarbeiro(pre=>{
                                return {...pre, segunda: e.target.checked ? true : false} 
                            })
                        }}>Seg</Checkbox>

                        <Checkbox className={styles.checkbox} checked={editandoBarbeiro?.terca} onChange={(e) =>{
                            setEditandoBarbeiro(pre=>{
                                return {...pre, terca: e.target.checked ? true : false}
                            })
                        }}>Ter</Checkbox>

                        <Checkbox className={styles.checkbox} checked={editandoBarbeiro?.quarta} onChange={(e) =>{
                            setEditandoBarbeiro(pre=>{
                                return {...pre, quarta: e.target.checked ? true : false}
                            })
                        }}>Qua</Checkbox>

                        <Checkbox className={styles.checkbox} checked={editandoBarbeiro?.quinta} onChange={(e) =>{
                            setEditandoBarbeiro(pre=>{
                                return {...pre, quinta: e.target.checked ? true : false}
                            })
                        }}>Qui</Checkbox>

                        <Checkbox className={styles.checkbox} checked={editandoBarbeiro?.sexta} onChange={(e) =>{
                            setEditandoBarbeiro(pre=>{
                                return {...pre, sexta: e.target.checked ? true : false}
                            })
                        }}>Sex</Checkbox>

                        <Checkbox className={styles.checkbox} checked={editandoBarbeiro?.sabado} onChange={(e) =>{
                            setEditandoBarbeiro(pre=>{
                                return {...pre, sabado: e.target.checked ? true : false}
                            })
                        }}>Sab</Checkbox>

                        <MaskedInput className={styles.input} mask={"00:00"} value={editandoBarbeiro?.entrada} onChange={(e) =>{
                            setEditandoBarbeiro(pre=>{
                                return {...pre, entrada: e.target.value}
                            })
                        }}/>

                        <MaskedInput className={styles.input} mask={"00:00"} value={editandoBarbeiro?.saida} onChange={(e) =>{
                            setEditandoBarbeiro(pre=>{
                                return {...pre, saida: e.target.value}
                            })
                        }}/>

                        <MaskedInput className={styles.input} mask={"00:00"} value={editandoBarbeiro?.almoco} onChange={(e) =>{
                            setEditandoBarbeiro(pre=>{
                                return {...pre, almoco: e.target.value}
                            })
                        }}/>

                        <MaskedInput className={styles.input} mask={"00:00"} value={editandoBarbeiro?.retorno} onChange={(e) =>{
                            setEditandoBarbeiro(pre=>{
                                return {...pre, retorno: e.target.value}
                            })
                        }}/>

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