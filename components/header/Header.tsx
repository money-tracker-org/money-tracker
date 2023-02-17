
import Link from 'next/link'
import { LoginControlCard } from '../login/LoginControlCard'

export const Header = () => {
    return (
        <header>
            <nav className="container-fluid">
                <ul>
                    <li>
                        <strong>money-tracker</strong>
                    </li>
                </ul>
                <ul>
                    <li>
                        <Link href="/user">Users</Link>
                    </li>
                    <li>
                        <Link href="/transaction">Transaction</Link>
                    </li>
                    <li>
                        <LoginControlCard />
                    </li>
                </ul>
            </nav>
        </header>
    )
}