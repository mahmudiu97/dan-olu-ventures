import { db } from './firebase'
import { collection, addDoc, doc, setDoc, deleteDoc, getDocs, getDoc, query, orderBy } from 'firebase/firestore'
import { auth } from './firebase'

const inventoryCollection = () => collection(db, 'inventory')

export async function addInventory(item) {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to add inventory')
  }
  const payload = { ...item, createdAt: new Date(), owner: auth.currentUser.uid }
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

export async function getInventoryItem(id) {
  const ref = doc(db, 'inventory', id)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export default {
  addInventory,
  updateInventory,
  deleteInventory,
  getInventory,
  getInventoryItem,
}
