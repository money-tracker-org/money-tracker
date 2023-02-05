import CreateNewUser from '../components/user/NewUserForm';
import { UserList } from '../components/user/UserList';

export default function UsersPage() {
    return (
        <div className="container">
            <CreateNewUser />
            <UserList />
        </div>
    )
}