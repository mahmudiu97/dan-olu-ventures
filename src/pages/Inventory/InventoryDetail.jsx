import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import InventoryForm from './InventoryForm'
import { getInventoryItem, deleteInventory, updateInventory } from '../../services/inventoryService'

export default function InventoryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getInventoryItem(id)
      .then((data) => {
        if (!data) throw new Error('Item not found')
        setItem(data)
      })
      .catch((err) => setError(err.message || 'Failed to load item'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async (payload) => {
    if (!item) return
    await updateInventory(item.id, payload)
    navigate('/inventory')
  }

  const handleDelete = async () => {
    if (!item) return
    await deleteInventory(item.id)
    navigate('/inventory')
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Inventory item</h1>
          <p className="text-sm text-gray-600">Edit the item or delete it.</p>
        </div>
        <button onClick={() => navigate('/inventory')} className="text-sm text-indigo-600 hover:underline">
          Back to list
        </button>
      </div>
      <div className="bg-white rounded shadow p-6">
        <InventoryForm initial={item} onSave={handleSave} onCancel={() => navigate('/inventory')} />
        <div className="mt-4">
          <button onClick={handleDelete} className="text-sm text-red-600">
            Delete item
          </button>
        </div>
      </div>
    </div>
  )
}
