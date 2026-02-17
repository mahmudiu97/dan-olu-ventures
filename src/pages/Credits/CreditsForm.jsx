import { useState, useEffect } from 'react'

export default function CreditsForm({ initial = {}, onSave, onCancel }) {
  const [customer, setCustomer] = useState('')
  const [amount, setAmount] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    if (initial) {
      setCustomer(initial.customer || '')
      setAmount(initial.amount ?? '')
      setDueDate(initial.dueDate || '')
      setNote(initial.note || '')
    }
  }, [initial])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave && onSave({ customer, amount: Number(amount), dueDate, note })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-700">Customer</label>
        <input value={customer} onChange={(e) => setCustomer(e.target.value)} className="w-full border px-3 py-2 rounded" required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-700">Amount</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.01" className="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Due Date</label>
          <input value={dueDate} onChange={(e) => setDueDate(e.target.value)} type="date" className="w-full border px-3 py-2 rounded" />
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
