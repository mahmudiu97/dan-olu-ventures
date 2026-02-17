import { db } from './firebase'
import { collection, addDoc, doc, setDoc, deleteDoc, getDocs, query, orderBy } from 'firebase/firestore'

const creditsCollection = () => collection(db, 'credits')

export async function addCredit(credit) {
  const payload = { ...credit, createdAt: new Date() }
  return await addDoc(creditsCollection(), payload)
}

export async function updateCredit(id, data) {
  const ref = doc(db, 'credits', id)
  return await setDoc(ref, { ...data, updatedAt: new Date() }, { merge: true })
}

export async function deleteCredit(id) {
  const ref = doc(db, 'credits', id)
  return await deleteDoc(ref)
}

export async function getCredits() {
  const q = query(creditsCollection(), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export default {
  addCredit,
  updateCredit,
  deleteCredit,
  getCredits,
}
