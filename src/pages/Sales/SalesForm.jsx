import { useState, useEffect } from 'react'
import useInventory from '../../hooks/useInventory'
import { formatCurrency } from '../../utils/currency'

export default function SalesForm({ initial = {}, onSave, onCancel }) {
  const { items: inventory } = useInventory()
  const [customer, setCustomer] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (initial) {
      setCustomer(initial.customerInfo?.name || initial.customer || '')
      setSelectedProduct(initial.productId || '')
      setQuantity(initial.quantity ?? 1)
      setAmount(initial.amount ?? '')
    }
  }, [initial])

  // Auto-calculate amount when product and quantity change
  useEffect(() => {
    if (selectedProduct && quantity) {
      const product = inventory.find(item => item.id === selectedProduct)
      if (product) {
        const calculatedAmount = Number(product.unitPrice || 0) * Number(quantity)
        setAmount(calculatedAmount.toString())
      }
    }
  }, [selectedProduct, quantity, inventory])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    
    try {
      const product = inventory.find(item => item.id === selectedProduct)
      await onSave({ 
        customer, 
        productId: selectedProduct,
        productName: product?.name || '',
        quantity: Number(quantity), 
        amount: Number(amount),
        unitPrice: product?.unitPrice || 0
      })
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label className="block text-sm text-gray-700">Customer</label>
        <input value={customer} onChange={(e) => setCustomer(e.target.value)} className="w-full border px-3 py-2 rounded" required />
      </div>

      <div>
        <label className="block text-sm text-gray-700">Product</label>
        <select 
          value={selectedProduct} 
          onChange={(e) => setSelectedProduct(e.target.value)} 
          className="w-full border px-3 py-2 rounded" 
          required
        >
          <option value="">Select a product...</option>
          {inventory.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} - {formatCurrency(item.unitPrice)} (Stock: {item.qty})
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-700">Quantity</label>
          <input value={quantity} onChange={(e) => setQuantity(e.target.value)} type="number" className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Amount (₦)</label>
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
