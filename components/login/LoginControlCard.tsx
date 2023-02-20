import { signIn, signOut, useSession } from 'next-auth/react'
import { BoxArrowInLeft, BoxArrowRight } from 'react-bootstrap-icons'
import styles from './LoginControlCard.module.css'
export const LoginControlCard = () => {
    const { data: session } = useSession()
    if (!!session && !!session.user) {
        return (
            <>
                <button onClick={() => signOut()}>
                    <span>{session.user.name}</span>
                    <BoxArrowRight className={styles.loginIcon} />
                </button>
            </>
        )
    }
    return (
        <>
            <button onClick={() => signIn()}>
                <span>Sign in</span>
                <BoxArrowInLeft className={styles.loginIcon} />
            </button>
        </>
    )
}
