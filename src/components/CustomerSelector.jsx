import { useState } from 'react'
import useCustomers from '../hooks/useCustomers'

export default function CustomerSelector({ value, onChange, onCustomerSelect, required = false }) {
  const { items: customers } = useCustomers()
  const [showNewCustomerForm, setShowNewCustomerForm] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  })

  const handleCustomerChange = (customerId) => {
    if (customerId === 'new') {
      setShowNewCustomerForm(true)
      onChange('')
    } else {
      setShowNewCustomerForm(false)
      const customer = customers.find(c => c.id === customerId)
      onChange(customerId)
      onCustomerSelect && onCustomerSelect(customer)
    }
  }

  const handleAddCustomer = () => {
    if (newCustomer.name.trim()) {
      // Create a temporary customer object
      const tempCustomer = {
        ...newCustomer,
        id: 'temp-' + Date.now(),
        isNew: true
      }
      
      // Add to customers list and select it
      customers.push(tempCustomer)
      onChange(tempCustomer.id)
      onCustomerSelect && onCustomerSelect(tempCustomer)
      
      // Reset form
      setNewCustomer({ name: '', phone: '', email: '', address: '' })
      setShowNewCustomerForm(false)
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Customer {required && <span className="text-red-500">*</span>}
        </label>
        <select
          value={value || ''}
          onChange={(e) => handleCustomerChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required={required}
        >
          <option value="">
            {required ? 'Select customer...' : 'Walk-in Customer'}
          </option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name} {customer.phone && `(${customer.phone})`}
            </option>
          ))}
          <option value="new">+ Add New Customer</option>
        </select>
      </div>

      {showNewCustomerForm && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Add New Customer</h4>
          <div className="space-y-3">
            <div>
              <label className="block text-sm text-gray-700">Name *</label>
              <input
                type="text"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Customer name"
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Phone</label>
              <input
                type="tel"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Phone number"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Email</label>
              <input
                type="email"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Email address"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-700">Address</label>
              <textarea
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={2}
                placeholder="Address"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleAddCustomer}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
              >
                Add Customer
              </button>
              <button
                type="button"
                onClick={() => setShowNewCustomerForm(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
