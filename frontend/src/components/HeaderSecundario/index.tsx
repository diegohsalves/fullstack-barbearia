import {useContext} from 'react'
import styles from './styles.module.scss'
import Link from 'next/link'
import Image from 'next/image'

import { FiLogOut, FiMenu } from 'react-icons/fi'

import { AuthContext } from '../../contexts/AuthContext'

export function Header(){

    return(
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                
                <Link href="/dashboard" passHref>
                <Image src={"/barbearia.png"} alt="Logo Barbearia Zuko" width={180} height={108}/>
                </Link>

                <nav className={styles.menuNav}>
                    <Link href="/clientes" legacyBehavior>
                    <a>Clientes</a>
                    </Link>

                    <Link href="/servicos" legacyBehavior>
                    <a>Serviços</a>
                    </Link>

                    <Link href="/barbeiros" legacyBehavior>
                    <a>Barbeiros</a>
                    </Link>

                    <Link href="/agendamentos" legacyBehavior>
                    <a>Agendamentos</a>
                    </Link>

                    <Link href="/dashboard" passHref>
                    <button>
                        <FiMenu color="--black" size={24}/>
                    </button>
                    </Link>
                </nav>
                
            </div>
        </header>
    )
}