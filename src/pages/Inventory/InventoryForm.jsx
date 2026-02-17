import { useState, useEffect } from 'react'

export default function InventoryForm({ initial = {}, onSave, onCancel }) {
  const [name, setName] = useState('')
  const [qty, setQty] = useState(0)
  const [price, setPrice] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    if (initial) {
      setName(initial.name || '')
      setQty(initial.qty ?? 0)
      setPrice(initial.price ?? '')
      setNote(initial.note || '')
    }
  }, [initial])

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { name, qty: Number(qty), price: Number(price), note }
    onSave && onSave(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-700">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-3 py-2 rounded" required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-700">Quantity</label>
          <input value={qty} onChange={(e) => setQty(e.target.value)} type="number" className="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Price</label>
          <input value={price} onChange={(e) => setPrice(e.target.value)} type="number" step="0.01" className="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700">Note</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full border px-3 py-2 rounded" rows={3} />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
        <button type="button" onClick={onCancel} className="bg-white border px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  )
}
