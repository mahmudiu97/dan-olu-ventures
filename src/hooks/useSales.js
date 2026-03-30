import { useState, useEffect } from 'react'
import { db } from '../services/firebase'
import { collection, onSnapshot, query, orderBy, where } from 'firebase/firestore'
import * as service from '../services/salesService'
import { useAuth } from './useAuth'

export default function useSales() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      setItems([])
      setLoading(false)
      return
    }

    // Filter sales by current user's ID
    const q = query(
      collection(db, 'sales'), 
      where('owner', '==', user.uid),
      orderBy('createdAt', 'desc')
    )
    const unsub = onSnapshot(
      q,
      (snap) => {
        console.log('Sales snapshot received:', snap.docs.length, 'items')
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        console.error('sales onSnapshot error', err)
        setLoading(false)
      },
    )

    return () => unsub()
  }, [user])

  const add = async (item) => await service.addSale(item)
  const update = async (id, data) => await service.updateSale(id, data)
  const remove = async (id) => await service.deleteSale(id)

  return { items, loading, add, update, remove }
}
