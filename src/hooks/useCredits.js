import { useState, useEffect } from 'react'
import { db } from '../services/firebase'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import * as service from '../services/creditsService'
import { useAuth } from './useAuth'

export default function useCredits() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    const q = query(collection(db, 'credits'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        console.error('credits onSnapshot error', err)
        setLoading(false)
      },
    )

    return () => unsub()
  }, [user])

  const add = async (item) => await service.addCredit(item)
  const update = async (id, data) => await service.updateCredit(id, data)
  const remove = async (id) => await service.deleteCredit(id)

  return { items, loading, add, update, remove }
}
