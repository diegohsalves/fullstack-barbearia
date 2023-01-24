import {useContext} from 'react'
import styles from './styles.module.scss'
import Link from 'next/link'
import Image from 'next/image'

import { FiLogOut, FiMenu } from 'react-icons/fi'

import { AuthContext } from '../../contexts/AuthContext'

export function Header(){

    const { signOut } = useContext(AuthContext)
    
    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <Link href="/dashboard" passHref>
                <Image src={"/barbearia.png"} alt="Logo Barbearia Zuko" width={180} height={108}/>
                </Link>

                <nav className={styles.menuNav}>
                    <Link href="/agendamentos/cadastrar" legacyBehavior>
                    <a>Novo Agendamento</a>
                    </Link>

                    <Link href="/clientes/cadastrar" legacyBehavior>
                    <a>Novo Cliente</a>
                    </Link>

                    <Link href="/configuracoes" passHref>
                    <button>
                        <FiMenu color="--black" size={24}/>
                    </button>
                    </Link>

                    <button onClick={signOut}>
                        <FiLogOut color="--black" size={24}/>
                    </button>
                </nav>
                
            </div>
        </header>
    )
}