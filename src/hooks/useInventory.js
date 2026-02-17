import { useState, useEffect } from 'react'
import { db } from '../services/firebase'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import * as service from '../services/inventoryService'

export default function useInventory() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'inventory'), orderBy('createdAt', 'desc'))
    const unsub = onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      (err) => {
        console.error('inventory onSnapshot error', err)
        setLoading(false)
      },
    )

    return () => unsub()
  }, [])

  const add = async (item) => await service.addInventory(item)
  const update = async (id, data) => await service.updateInventory(id, data)
  const remove = async (id) => await service.deleteInventory(id)

  return { items, loading, add, update, remove }
}
