import { useState } from 'react'
import useCredits from '../../hooks/useCredits'
import CreditsForm from './CreditsForm'

export default function CreditsList() {
  const { items, loading, add, update, remove } = useCredits()
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const handleAdd = async (payload) => {
    await add(payload)
    setShowForm(false)
  }

  const handleUpdate = async (payload) => {
    if (!editing) return
    await update(editing.id, payload)
    setEditing(null)
    setShowForm(false)
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Credits</h1>
        <div>
          <button onClick={() => { setEditing(null); setShowForm(true) }} className="bg-indigo-600 text-white px-4 py-2 rounded">Add Credit</button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <CreditsForm
            initial={editing || {}}
            onSave={editing ? handleUpdate : handleAdd}
            onCancel={() => { setShowForm(false); setEditing(null) }}
          />
        </div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Customer</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Due Date</th>
                <th className="p-3">Note</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id} className="border-t">
                  <td className="p-3">{it.customer}</td>
                  <td className="p-3">{it.amount}</td>
                  <td className="p-3">{it.dueDate}</td>
                  <td className="p-3">{it.note}</td>
                  <td className="p-3">
                    <button onClick={() => { setEditing(it); setShowForm(true) }} className="mr-2 text-sm text-indigo-600">Edit</button>
                    <button onClick={() => remove(it.id)} className="text-sm text-red-600">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
