import { useState } from 'react'
import useCustomers from '../../hooks/useCustomers'
import CustomerForm from './CustomerForm'

export default function CustomerList() {
  const { items: customers, loading, add, update, remove } = useCustomers()
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCustomers = customers.filter(
    (customer) =>
      (customer.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.phone || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAdd = async (payload) => {
    try {
      await add(payload)
      setShowForm(false)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleUpdate = async (payload) => {
    if (!editing) return
    try {
      await update(editing.id, payload)
      setEditing(null)
      setShowForm(false)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await remove(id)
      } catch (err) {
        alert(err.message)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading customers...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-gray-600">Manage customer information</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customers..."
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <button
            onClick={() => {
              setEditing(null)
              setShowForm(true)
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded font-medium"
          >
            Add Customer
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            {editing ? 'Edit Customer' : 'Add New Customer'}
          </h2>
          <CustomerForm
            initial={editing || {}}
            onSave={editing ? handleUpdate : handleAdd}
            onCancel={() => {
              setShowForm(false)
              setEditing(null)
            }}
          />
        </div>
      )}

      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-500">
            {searchQuery ? 'No customers found matching your search' : 'No customers found'}
          </div>
          {!searchQuery && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Add your first customer
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Address</th>
                  <th className="p-3 text-left">Since</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-t">
                    <td className="p-3 font-medium">{customer.name}</td>
                    <td className="p-3">{customer.phone || '-'}</td>
                    <td className="p-3">{customer.email || '-'}</td>
                    <td className="p-3 max-w-xs truncate">{customer.address || '-'}</td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => {
                          setEditing(customer)
                          setShowForm(true)
                        }}
                        className="mr-2 text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(customer.id)}
                        className="text-red-600 hover:text-red-800 font-medium text-sm"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
