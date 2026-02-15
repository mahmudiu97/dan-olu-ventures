import { createContext, useState, useEffect } from 'react'
import { auth, db } from '../services/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser)
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid))
          setRole(userDoc.exists() ? userDoc.data()?.role : null)
        } catch (err) {
          setRole(null)
        }
      } else {
        setUser(null)
        setRole(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

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

  const logout = async () => {
    return await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, role, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
