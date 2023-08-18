import styles from './sign.module.css'
import { signInWithGoogle, signOut } from '../firebase/firebase'
import { User } from 'firebase/auth'
import { Fragment } from 'react'

interface UserProps {
  user: User | null
}

export default function SignIn({ user }: UserProps) {
  return (
    <Fragment>
      {user ? 
        (<button className={styles.signButton} onClick={signOut}>Sign Out</button>) 
        : 
        (<button className={styles.signButton} onClick={signInWithGoogle}>Sign In</button>)
      }
    </Fragment>
  )
}