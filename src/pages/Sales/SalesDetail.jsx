import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import SalesForm from './SalesForm'
import { getSale, deleteSale, updateSale } from '../../services/salesService'
import { formatCurrency } from '../../utils/currency'

export default function SalesDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    getSale(id)
      .then((data) => {
        if (!data) throw new Error('Sale not found')
        setItem(data)
      })
      .catch((err) => setError(err.message || 'Failed to load sale'))
      .finally(() => setLoading(false))
  }, [id])

  const handleSave = async (payload) => {
    if (!item) return
    await updateSale(item.id, payload)
    navigate('/sales')
  }

  const handleDelete = async () => {
    if (!item) return
    await deleteSale(item.id)
    navigate('/sales')
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (error) return <div className="p-8 text-red-600">{error}</div>

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Sale Details</h1>
          <p className="text-sm text-gray-600">View sale information and manage.</p>
        </div>
        <button onClick={() => navigate('/sales')} className="text-sm text-indigo-600 hover:underline">
          Back to list
        </button>
      </div>

      {loading && <div className="p-8">Loading...</div>}
      {error && <div className="p-8 text-red-600">{error}</div>}
      
      {item && (
        <div className="bg-white rounded shadow p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Customer Information</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-600">Name:</span>
                    <div className="font-medium">{item.customerInfo?.name || item.customer || 'Walk-in Customer'}</div>
                  </div>
                  {item.customerInfo?.phone && (
                    <div>
                      <span className="text-sm text-gray-600">Phone:</span>
                      <div className="font-medium">{item.customerInfo.phone}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Sale Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Product:</span>
                      <div className="font-medium">{item.productName || item.product}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Quantity:</span>
                      <div className="font-medium">{item.quantity}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Unit Price:</span>
                      <div className="font-medium">{formatCurrency(item.unitPrice)}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Total Amount:</span>
                      <div className="font-medium">{formatCurrency(item.amount)}</div>
                    </div>
                    {item.discount && (
                      <div>
                        <span className="text-sm text-gray-600">Discount:</span>
                        <div className="font-medium">{formatCurrency(item.discount)}</div>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-600">Payment Method:</span>
                      <div className="font-medium">{item.paymentMethod}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Date & Time</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Sale Date:</span>
                      <div className="font-medium">
                        {item.saleDate ? new Date(item.saleDate).toLocaleDateString() : '-'}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Sale Time:</span>
                      <div className="font-medium">{item.saleTime || '-'}</div>
                    </div>
                  </div>
                </div>

                {item.isCredit && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold mb-2">Credit Information</h3>
                    <div className="space-y-2">
                      {item.deposit && (
                        <div>
                          <span className="text-sm text-gray-600">Deposit Paid:</span>
                          <div className="font-medium">{formatCurrency(item.deposit)}</div>
                        </div>
                      )}
                      <div>
                        <span className="text-sm text-gray-600">Balance Due:</span>
                        <div className="font-medium text-red-600">{formatCurrency(item.balance)}</div>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Due Date:</span>
                        <div className="font-medium text-orange-600">
                          {item.dueDate ? new Date(item.dueDate).toLocaleDateString() : '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Delete Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
