import { useState, useEffect } from 'react'
import { 
  getCategories, 
  addCategory, 
  updateCategory, 
  deleteCategory 
} from '../services/categoryService'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'

export default function useCategories() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let unsubscribe
    
    const setupListener = async (user) => {
      if (user) {
        setLoading(true)
        try {
          const categories = await getCategories()
          setItems(categories)
        } catch (error) {
          console.error('Error fetching categories:', error)
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

  const add = async (category) => {
    try {
      await addCategory(category)
      // Refresh the list
      const categories = await getCategories()
      setItems(categories)
    } catch (error) {
      console.error('Error adding category:', error)
      throw error
    }
  }

  const update = async (id, data) => {
    try {
      await updateCategory(id, data)
      // Refresh the list
      const categories = await getCategories()
      setItems(categories)
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  }

  const remove = async (id) => {
    try {
      await deleteCategory(id)
      // Refresh the list
      const categories = await getCategories()
      setItems(categories)
    } catch (error) {
      console.error('Error deleting category:', error)
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
