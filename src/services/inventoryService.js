import { db } from './firebase'
import { collection, addDoc, doc, setDoc, deleteDoc, getDocs, query, orderBy } from 'firebase/firestore'

const inventoryCollection = () => collection(db, 'inventory')

export async function addInventory(item) {
  const payload = { ...item, createdAt: new Date() }
  return await addDoc(inventoryCollection(), payload)
}

export async function updateInventory(id, data) {
  const ref = doc(db, 'inventory', id)
  return await setDoc(ref, { ...data, updatedAt: new Date() }, { merge: true })
}

export async function deleteInventory(id) {
  const ref = doc(db, 'inventory', id)
  return await deleteDoc(ref)
}

export async function getInventory() {
  const q = query(inventoryCollection(), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export default {
  addInventory,
  updateInventory,
  deleteInventory,
  getInventory,
}
