import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CreditsForm from './CreditsForm'
import { getCredit, deleteCredit, updateCredit } from '../../services/creditsService'

export default function CreditsDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getCredit(id)
      .then((data) => {
        if (!data) throw new Error('Credit not found')
        setItem(data)
      })
      .catch((err) => setError(err.message || 'Failed to load credit'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async (payload) => {
    if (!item) return
    await updateCredit(item.id, payload)
    navigate('/credits')
  }

  const handleDelete = async () => {
    if (!item) return
    await deleteCredit(item.id)
    navigate('/credits')
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Credit</h1>
          <p className="text-sm text-gray-600">Edit or delete this credit record.</p>
        </div>
        <button onClick={() => navigate('/credits')} className="text-sm text-indigo-600 hover:underline">
          Back to list
        </button>
      </div>
      <div className="bg-white rounded shadow p-6">
        <CreditsForm initial={item} onSave={handleSave} onCancel={() => navigate('/credits')} />
        <div className="mt-4">
          <button onClick={handleDelete} className="text-sm text-red-600">
            Delete credit
          </button>
        </div>
      </div>
    </div>
  )
}
