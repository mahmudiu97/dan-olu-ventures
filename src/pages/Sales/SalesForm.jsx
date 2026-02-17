import { useState, useEffect } from 'react'

export default function SalesForm({ initial = {}, onSave, onCancel }) {
  const [customer, setCustomer] = useState('')
  const [product, setProduct] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (initial) {
      setCustomer(initial.customer || '')
      setProduct(initial.product || '')
      setQuantity(initial.quantity ?? 1)
      setAmount(initial.amount ?? '')
    }
  }, [initial])

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave && onSave({ customer, product, quantity: Number(quantity), amount: Number(amount) })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-700">Customer</label>
        <input value={customer} onChange={(e) => setCustomer(e.target.value)} className="w-full border px-3 py-2 rounded" required />
      </div>

      <div>
        <label className="block text-sm text-gray-700">Product</label>
        <input value={product} onChange={(e) => setProduct(e.target.value)} className="w-full border px-3 py-2 rounded" required />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-700">Quantity</label>
          <input value={quantity} onChange={(e) => setQuantity(e.target.value)} type="number" className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Amount</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.01" className="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
        <button type="button" onClick={onCancel} className="bg-white border px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  )
}
