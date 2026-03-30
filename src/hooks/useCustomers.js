import { useState, useEffect } from 'react'
import { 
  getCustomers, 
  addCustomer, 
  updateCustomer, 
  deleteCustomer 
} from '../services/customerService'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'

export default function useCustomers() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe
    
    const setupListener = async (user) => {
      if (user) {
        setLoading(true)
        try {
          const customers = await getCustomers()
          setItems(customers)
        } catch (error) {
          console.error('Error fetching customers:', error)
        } finally {
          setLoading(false)
        }
      } else {
        setItems([])
        setLoading(false)
      }
    }

    unsubscribe = onAuthStateChanged(auth, setupListener)
    
    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [])

  const add = async (customer) => {
    try {
      await addCustomer(customer)
      // Refresh list
      const customers = await getCustomers()
      setItems(customers)
    } catch (error) {
      console.error('Error adding customer:', error)
      throw error
    }
  }

  const update = async (id, data) => {
    try {
      await updateCustomer(id, data)
      // Refresh list
      const customers = await getCustomers()
      setItems(customers)
    } catch (error) {
      console.error('Error updating customer:', error)
      throw error
    }
  }

  const remove = async (id) => {
    try {
      await deleteCustomer(id)
      // Refresh list
      const customers = await getCustomers()
      setItems(customers)
    } catch (error) {
      console.error('Error deleting customer:', error)
      throw error
    }
  }

  return {
    items,
    loading,
    add,
    update,
    remove,
  }
}
