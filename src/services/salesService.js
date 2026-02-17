import { db } from './firebase'
import { collection, addDoc, doc, setDoc, deleteDoc, getDocs, query, orderBy } from 'firebase/firestore'

const salesCollection = () => collection(db, 'sales')

export async function addSale(sale) {
  const payload = { ...sale, createdAt: new Date() }
  return await addDoc(salesCollection(), payload)
}

export async function updateSale(id, data) {
  const ref = doc(db, 'sales', id)
  return await setDoc(ref, { ...data, updatedAt: new Date() }, { merge: true })
}

export async function deleteSale(id) {
  const ref = doc(db, 'sales', id)
  return await deleteDoc(ref)
}

export async function getSales() {
  const q = query(salesCollection(), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export default {
  addSale,
  updateSale,
  deleteSale,
  getSales,
}
