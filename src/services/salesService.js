import { db } from './firebase'
import { collection, addDoc, doc, setDoc, deleteDoc, getDocs, getDoc, query, orderBy, runTransaction } from 'firebase/firestore'
import { auth } from './firebase'

const salesCollection = () => collection(db, 'sales')

export async function addSale(sale) {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to add sales')
  }
  
  console.log('addSale called with:', sale)
  
  // Use transaction to ensure atomic operation
  return await runTransaction(db, async (transaction) => {
    // Get the inventory item
    const inventoryRef = doc(db, 'inventory', sale.productId)
    const inventorySnap = await getDoc(inventoryRef)
    
    if (!inventorySnap.exists()) {
      throw new Error('Product not found in inventory')
    }
    
    const inventoryData = inventorySnap.data()
    const currentStock = inventoryData.qty || 0
    const requestedQuantity = sale.quantity || 0
    
    console.log('Stock check - Current:', currentStock, 'Requested:', requestedQuantity)
    
    if (currentStock < requestedQuantity) {
      throw new Error(`Insufficient stock. Available: ${currentStock}, Requested: ${requestedQuantity}`)
    }
    
    // Update inventory quantity
    const newStock = currentStock - requestedQuantity
    transaction.update(inventoryRef, { 
      qty: newStock,
      updatedAt: new Date()
    })
    
    // Create the sale record
    const payload = { 
      ...sale, 
      createdAt: new Date().toISOString(), // Use ISO string
      owner: auth.currentUser.uid,
      previousStock: currentStock,
      newStock: newStock
    }
    
    console.log('Creating sale with payload:', payload)
    
    const salesRef = collection(db, 'sales')
    const saleDoc = await addDoc(salesRef, payload)
    
    console.log('Sale created successfully with ID:', saleDoc.id)
    
    return saleDoc
  })
}

export async function updateSale(id, data) {
  const ref = doc(db, 'sales', id)
  return await setDoc(ref, { ...data, updatedAt: new Date().toISOString() }, { merge: true })
}

export async function deleteSale(id) {
  return await runTransaction(db, async (transaction) => {
    // Get the sale record
    const saleRef = doc(db, 'sales', id)
    const saleSnap = await getDoc(saleRef)
    
    if (!saleSnap.exists()) {
      throw new Error('Sale not found')
    }
    
    const saleData = saleSnap.data()
    
    // Restore inventory quantity if productId exists
    if (saleData.productId) {
      const inventoryRef = doc(db, 'inventory', saleData.productId)
      const inventorySnap = await getDoc(inventoryRef)
      
      if (inventorySnap.exists()) {
        const inventoryData = inventorySnap.data()
        const currentStock = inventoryData.qty || 0
        const quantityToRestore = saleData.quantity || 0
        
        transaction.update(inventoryRef, {
          qty: currentStock + quantityToRestore,
          updatedAt: new Date()
        })
      }
    }
    
    // Delete the sale record
    transaction.delete(saleRef)
  })
}

export async function getSales() {
  const q = query(salesCollection(), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getSale(id) {
  const ref = doc(db, 'sales', id)
  const snap = await getDoc(ref)
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

export default {
  addSale,
  updateSale,
  deleteSale,
  getSales,
  getSale,
}
