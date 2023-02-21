import { LoginControlCard } from '../login/LoginControlCard';
import { SelectedGroupNav } from './SelectedGroupNav';

export const Header = () => {
    return (
        <header>
            <nav className="container-fluid">
                <ul>
                    <li>
                        <SelectedGroupNav />
                    </li>
                </ul>
                <ul>
                    <li>
                        <LoginControlCard />
                    </li>
                </ul>
            </nav>
        </header>
    )
}
