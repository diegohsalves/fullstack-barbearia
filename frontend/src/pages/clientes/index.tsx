import { canSSRAuth } from "../../utils/canSSRAuth"
import Head from 'next/head'
import Link from 'next/link'
import styles from './styles.module.scss'
import {useState, useEffect} from 'react'
import {setupAPIClient} from '../../services/api'
import {Table, Modal, Input} from 'antd'
import {EditOutlined, DeleteOutlined} from '@ant-design/icons'
import { toast } from 'react-toastify'

import { Header } from '../../components/HeaderSecundario'

type Cliente = {
    id: number;
    nome: string;
    email: string;
    cpf: string;
    telefone: string;
}

export default function Clientes(){

    const[isEditando, setIsEditando] = useState(false);
    const[nome, setNome] = useState('');
    const[email, setEmail] = useState('');
    const[cpf, setCpf] = useState('');
    const[telefone, setTelefone] = useState('');
    const[editandoCliente, setEditandoCliente] = useState<Cliente>(null);
    const[clientes, setClientes] = useState<Cliente[]>([]);
    const[query, setQuery] = useState("");

    const apiClient = setupAPIClient();

    const fetchClientes = async() => {
        const response = await apiClient.get('/clientes').catch(err=> console.log(err));

        if(response){
            const cliente: Cliente[] = response.data;
            setClientes(cliente);
        }
    };

    useEffect(() => {
        fetchClientes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const keys = ["nome", "cpf", "email", "telefone"];

    const search = (data: Cliente[]) => {
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
            title:'CPF',
            dataIndex:'cpf'
        },
        {
            key:'4',
            title:'Email',
            dataIndex:'email'
        },
        {
            key:'5',
            title:'Telefone',
            dataIndex:'telefone'
        },
        {
            key:'6',
            title:'Alterações',
            render:(record: Cliente) => {
                return (
                <>
                <EditOutlined onClick={() =>{onHandleEdit(record)}}/>
                <DeleteOutlined onClick={() =>{onHandleDelete(record)}} style={{color: "#cc331f", marginLeft: 12}}/>
                </>
                );
            }
        },
    ];

    const onHandleDelete = async(record: Cliente) => {
        Modal.confirm({
            title: "Tem certeza que deseja deletar esse cliente?",
            okText: "Sim",
            okType: "danger",
            cancelText:"Cancelar",
            onOk:() =>{
                apiClient.delete(`/clientes/${record.id}`).catch(err=> console.log(err)).then(fetchClientes)
            }

        })
    };

    const onHandleEdit = async(record: Cliente) => {
        setIsEditando(true);
        setEditandoCliente({...record});
        setNome(record.nome);
        setCpf(record.cpf);
        setEmail(record.email);
        setTelefone(record.telefone);
    }

    const resetarEdicao = () => {
        setIsEditando(false);
        setNome(editandoCliente.nome);
        setCpf(editandoCliente.cpf);
        setEmail(editandoCliente.email);
        setTelefone(editandoCliente.telefone);
    }

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
      }

    const handleCpf = (event) => {
        let input = event.target
        input.value = cpfMask(input.value)
    }

    const cpfMask = (value) => {
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

    return(
        <>
        <Head>
            <title>Área do Cliente - Zuko Barbearia</title>
        </Head>
        <div>
            <Header/>

            <main className={styles.container}>
                <h1>CLIENTES                
                    
                    <div>
                        <Link href="clientes/cadastrar" passHref>
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

                    <Table columns={columns} dataSource={search(clientes)} rowKey='id'/>
                    <Modal
                        title="Editar cliente"
                        open={isEditando}
                        okText="Salvar"
                        cancelText="Cancelar"
                        onCancel={() => {
                            resetarEdicao()
                        }}
                        onOk={async() => { 
                            
                            try{

                            if(nome === '' || email === '' || cpf === '' || telefone === ''){
                                toast.error("Preencha todos os campos!")
                                return;
                              }

                              const nomeInicialMaiuscula = nome.charAt(0).toUpperCase() + nome.slice(1);

                              const clienteEditado: Cliente = {
                                id: editandoCliente.id,
                                nome: nomeInicialMaiuscula,
                                email: email,
                                cpf: cpf,
                                telefone: telefone
                              }
                          
                              await apiClient.put(`/clientes/${editandoCliente.id}`, clienteEditado).then(fetchClientes).then(resetarEdicao)
                
                              toast.success('Cliente editado com sucesso!');
                
                        }catch(err){
                            console.log(err);
                            toast.error("Erro ao editar!")
                            resetarEdicao();
                        }
                           
                        }}
                    >
                        <Input type="text" value={nome} className={styles.input} onChange={(e) =>{setNome(e.target.value)}}/>

                        <Input
                        placeholder='CPF'
                        className={styles.input}
                        value={cpf}
                        onChange={(e) => handleCpf(e)}
                        />

                        <Input type="text" value={email} className={styles.input} onChange={(e) =>{setEmail(e.target.value)}}/>
                        
                        <Input
                        type="tel"
                        maxLength={15}
                        placeholder="Telefone"
                        className={styles.input}
                        value={telefone}
                        onChange={(e) => handleTelefone(e)}
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