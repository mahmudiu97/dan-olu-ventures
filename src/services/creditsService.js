import { db } from './firebase'
import { collection, addDoc, doc, setDoc, deleteDoc, getDocs, getDoc, query, orderBy } from 'firebase/firestore'
import { auth } from './firebase'

const creditsCollection = () => collection(db, 'credits')

export async function addCredit(credit) {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to add credits')
  }
  const payload = { ...credit, createdAt: new Date(), owner: auth.currentUser.uid }
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

export async function getCredit(id) {
  const ref = doc(db, 'credits', id)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export default {
  addCredit,
  updateCredit,
  deleteCredit,
  getCredits,
  getCredit,
}
