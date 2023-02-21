import { GroupForm } from 'components/group/GroupForm';
import { GroupList } from 'components/group/GroupList';


export default function GroupsPage() {
    return (
        <div className="container">
            <h1>Groups</h1>
            <GroupForm />
            <GroupList />
        </div>
    )
}
