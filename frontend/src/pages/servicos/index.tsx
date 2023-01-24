import { canSSRAuth } from "../../utils/canSSRAuth"
import Head from 'next/head'
import styles from './styles.module.scss'
import {useState, useEffect} from 'react'
import {setupAPIClient} from '../../services/api'
import {Table, Modal, Input, InputNumber} from 'antd'
import {EditOutlined, DeleteOutlined} from '@ant-design/icons'
import { MaskedInput } from "antd-mask-input"
import { toast } from 'react-toastify'
import Link from 'next/link'

import { Header } from '../../components/HeaderSecundario'

type Servico = {
    id: number;
    nome: string;
    preco: number;
    tempoDuracao: string;
}

export default function Servicos(){

    const[isEditando, setIsEditando] = useState(false);
    const[editandoServico, setEditandoServico] = useState<Servico>(null);
    const[servico, setServico] = useState<Servico> (null);
    const[servicos, setServicos] = useState<Servico[]>([]);
    const[query, setQuery] = useState("");

    const apiClient = setupAPIClient();

    const fetchServicos = async() => {
        const response = await apiClient.get('/servicos').catch(err=> console.log(err));

        if(response){
            const servico: Servico[] = response.data;
            setServicos(servico);
        }
    };

    useEffect(() => {
        fetchServicos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const keys = ["nome", "preco", "tempoDuracao" ];

    const search = (data: Servico[]) => {
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
            title:'Preço',
            dataIndex:'preco',
            render: (total) => String("R$ ").concat(total)
        },
        {
            key:'4',
            title:'Duração',
            dataIndex:'tempoDuracao'
        },
        {
            key:'5',
            title:'Alterações',
            render:(record: Servico) => {
                return (
                <>
                <EditOutlined onClick={() =>{onHandleEdit(record)}}/>
                <DeleteOutlined onClick={() =>{onHandleDelete(record)}} style={{color: "#cc331f", marginLeft: 12}}/>
                </>
                );
            }
        },
    ];

    const onHandleDelete = async(record: Servico) => {
        Modal.confirm({
            title: "Tem certeza que deseja deletar esse serviço?",
            okText: "Sim",
            okType: "danger",
            cancelText:"Cancelar",
            onOk:() =>{
                apiClient.delete(`/servicos/${record.id}`).catch(err=> console.log(err)).then(fetchServicos)
            }

        })
    };

    const onHandleEdit = async(record: Servico) => {
        setIsEditando(true);
        setEditandoServico({...record})
        setServico({...record})
    }

    const resetarEdicao = () => {
        setIsEditando(false);
        setEditandoServico(servico);
        setServico(null);
    }

    return(
        <>
        <Head>
            <title>Área de Serviços - Zuko Barbearia</title>
        </Head>
        <div>
            <Header/>

            <main className={styles.container}>
                <h1>SERVIÇOS                 
                    
                    <div>
                        <Link href="servicos/cadastrar" passHref>
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

                    <Table columns={columns} dataSource={search(servicos)} rowKey='id'/>
                    
                    <Modal
                        title="Editar serviço"
                        open={isEditando}
                        okText="Salvar"
                        cancelText="Cancelar"
                        onCancel={() => {
                            resetarEdicao()
                        }}
                        onOk={async() => { 
                            
                            try{

                            if(editandoServico.nome === '' || editandoServico.preco === null || editandoServico.tempoDuracao === ''){
                                toast.error("Preencha todos os campos!")
                                return;
                              }

                              const nomeInicialMaiuscula = editandoServico.nome.charAt(0).toUpperCase() + editandoServico.nome.slice(1);

                              const servicoEditado: Servico = {
                                id: editandoServico.id,
                                nome: nomeInicialMaiuscula,
                                preco: editandoServico.preco,
                                tempoDuracao: editandoServico.tempoDuracao,
                              }
                          
                              await apiClient.put(`/servicos/${editandoServico.id}`, servicoEditado).then(fetchServicos).then(resetarEdicao)
                
                              toast.success('Serviço editado com sucesso!');
                
                        }catch(err){
                            console.log(err);
                            toast.error("Erro ao editar!")
                            resetarEdicao();
                        }
                           
                        }}
                    >
                        <Input type="text" className={styles.input} value={editandoServico?.nome} onChange={(e) =>{
                            setEditandoServico(pre=>{
                                return {...pre, nome: e.target.value}
                            })
                        }}/>
                        <InputNumber type="number" step={0.1} className={styles.numeroInput} value={editandoServico?.preco} onChange={(e) =>{
                            setEditandoServico(pre=>{
                                return {...pre, preco: e}
                            })
                        }}/>
                        <MaskedInput type="text" mask={"00:00"} className={styles.input} value={editandoServico?.tempoDuracao} onChange={(e) =>{
                            setEditandoServico(pre=>{
                                return {...pre, tempoDuracao: e.target.value}
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