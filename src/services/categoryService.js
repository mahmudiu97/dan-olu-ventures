import { db } from './firebase'
import { collection, addDoc, doc, setDoc, deleteDoc, getDocs, getDoc, query, orderBy } from 'firebase/firestore'
import { auth } from './firebase'

const categoriesCollection = () => collection(db, 'categories')

export async function addCategory(category) {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to add categories')
  }
  const payload = { ...category, createdAt: new Date(), owner: auth.currentUser.uid }
  return await addDoc(categoriesCollection(), payload)
}

export async function updateCategory(id, data) {
  const ref = doc(db, 'categories', id)
  return await setDoc(ref, { ...data, updatedAt: new Date() }, { merge: true })
}

export async function deleteCategory(id) {
  const ref = doc(db, 'categories', id)
  return await deleteDoc(ref)
}

export async function getCategories() {
  const q = query(categoriesCollection(), orderBy('name', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getCategory(id) {
  const ref = doc(db, 'categories', id)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export default {
  addCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getCategory,
}
