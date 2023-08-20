'use client';

import Image from 'next/image'
import Link from 'next/link'
import styles from './navbar.module.css'
import Sign from './sign'
import Upload from './upload';
import { onAuthStateChangedHelper } from '../firebase/firebase';
import { useState, useEffect } from 'react'
import { User } from 'firebase/auth';

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChangedHelper((user) => setUser(user));

    return () => {
      unsubscribe();
    }
  }, [])
  
  return (
    <div className={styles.nav}>
      <div className={styles.nav__left}>
        <p>Menu</p>
        <Link href="/">
          <Image src="/youtube-logo.svg" alt="youtube-logo" width={100} height={30} />
        </Link>        
      </div>
      <div className={styles.nav__right}>
        { user && <Upload />}
        <Sign user={user} />
      </div>
    </div>
  )
}