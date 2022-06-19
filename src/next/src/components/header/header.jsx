import Image from 'next/image'
import Link from "next/link.js";
import styles from './header.module.css'

/**
 * @return JSX.Element
 * */
export default function Header(_props) {
    return (
        <header>
            <ul className={styles['header-list']}>
                <li className={'logo-wrapper'}>
                    <Link href="/" as="/">
                        <a style={{width: '100px', height: 'auto'}}>
                            <Image layout="intrinsic" width={80} height={60} className={'logo-img'} src={'/test.png'}/>
                        </a>
                    </Link>

                </li>
                <li>
                    <Link href="/login" as="/login">
                        <a>
                            <p>Login</p>
                        </a>
                    </Link>
                </li>
            </ul>
        </header>
    )
}
