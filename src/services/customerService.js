import { db } from './firebase'
import { collection, addDoc, doc, setDoc, deleteDoc, getDocs, getDoc, query, orderBy } from 'firebase/firestore'
import { auth } from './firebase'

const customersCollection = () => collection(db, 'customers')

export async function addCustomer(customer) {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to add customers')
  }
  const payload = { ...customer, createdAt: new Date(), owner: auth.currentUser.uid }
  return await addDoc(customersCollection(), payload)
}

export async function updateCustomer(id, data) {
  const ref = doc(db, 'customers', id)
  return await setDoc(ref, { ...data, updatedAt: new Date() }, { merge: true })
}

export async function deleteCustomer(id) {
  const ref = doc(db, 'customers', id)
  return await deleteDoc(ref)
}

export async function getCustomers() {
  const q = query(customersCollection(), orderBy('name', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getCustomer(id) {
  const ref = doc(db, 'customers', id)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export default {
  addCustomer,
  updateCustomer,
  deleteCustomer,
  getCustomers,
  getCustomer,
}
