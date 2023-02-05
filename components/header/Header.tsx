
import Link from 'next/link'

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
                </ul>
            </nav>
        </header>
    )
}