import { createContext, useState, useEffect } from 'react'
import { auth, db } from '../services/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.debug('[Auth] AuthProvider mounted, subscribing to onAuthStateChanged')
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.debug('[Auth] onAuthStateChanged callback, currentUser=', currentUser)
      if (currentUser) {
        setUser(currentUser)
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
          console.debug('[Auth] loaded user doc:', userDoc.exists() ? userDoc.data() : null)
          setRole(userDoc.exists() ? userDoc.data()?.role : null)
        } catch (err) {
          console.error('[Auth] error reading user doc', err)
          setRole(null)
        }
      } else {
        console.debug('[Auth] no current user (signed out)')
        setUser(null)
        setRole(null)
      }
      setLoading(false)
      console.debug('[Auth] setLoading(false)')
    })

    return unsubscribe
  }, [])

  useEffect(() => {
    console.debug('[Auth] loading state changed =>', loading)
  }, [loading])

  const register = async (email, password, name, userRole = 'salesperson') => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password)
    await setDoc(doc(db, 'users', user.uid), {
      uid: user.uid,
      email,
      name,
      role: userRole,
      createdAt: new Date(),
    })
    return user
  }

  const login = async (email, password) => {
    return await signInWithEmailAndPassword(auth, email, password)
  }

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    // ensure user doc exists
    try {
      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || null,
          role: 'salesperson',
          createdAt: new Date(),
        })
      }
    } catch (e) {
      console.error('[Auth] error ensuring google user doc', e)
    }
    return user
  }

  const loginWithFacebook = async () => {
    const provider = new FacebookAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    try {
      const userRef = doc(db, 'users', user.uid)
      const userDoc = await getDoc(userRef)
      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          name: user.displayName || null,
          role: 'salesperson',
          createdAt: new Date(),
        })
      }
    } catch (e) {
      console.error('[Auth] error ensuring facebook user doc', e)
    }
    return user
  }

  const logout = async () => {
    return await signOut(auth)
  }

  const resetPassword = async (email) => {
    return await sendPasswordResetEmail(auth, email)
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, register, login, loginWithGoogle, loginWithFacebook, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
