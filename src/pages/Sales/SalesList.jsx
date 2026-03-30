import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useSales from '../../hooks/useSales'
import SalesForm from './SalesForm'
import { exportToCsv } from '../../utils/exportCsv'
import { formatCurrency } from '../../utils/currency'
import { PageSkeleton, FormSkeleton } from '../../components/SkeletonLoader'

export default function SalesList() {
  const { items, loading, add, update, remove } = useSales()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState('')

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [debouncedQuery, setDebouncedQuery] = useState(query)
  const [sortKey, setSortKey] = useState(searchParams.get('sortKey') ?? 'customer')
  const [sortDirection, setSortDirection] = useState(searchParams.get('sortDirection') ?? 'asc')
  const [page, setPage] = useState(Number(searchParams.get('page') ?? 1))

  const pageSize = 10

  // Debounce
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(t)
  }, [query])

  // Filter + Sort
  const sortedItems = useMemo(() => {
    const filtered = items.filter((it) => {
      if (!debouncedQuery) return true
      const q = debouncedQuery.toLowerCase()
      return (
        (it.customerInfo?.name || it.customer || '').toLowerCase().includes(q) ||
        (it.productName || it.product || '').toLowerCase().includes(q)
      )
    })

    return [...filtered].sort((a, b) => {
      let aVal = a[sortKey]
      let bVal = b[sortKey]

      if (sortKey === 'customer') {
        aVal = a.customerInfo?.name || a.customer || ''
        bVal = b.customerInfo?.name || b.customer || ''
      }

      if (sortKey === 'product') {
        aVal = a.productName || a.product || ''
        bVal = b.productName || b.product || ''
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
      }

      const cmp = (aVal || '').toString().localeCompare((bVal || '').toString())
      return sortDirection === 'asc' ? cmp : -cmp
    })
  }, [items, debouncedQuery, sortKey, sortDirection])

  useEffect(() => setPage(1), [debouncedQuery, sortKey, sortDirection])

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize))

  const currentPageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedItems.slice(start, start + pageSize)
  }, [page, sortedItems])

  const handlePageChange = (newPage) => {
    setPage(Math.min(Math.max(1, newPage), totalPages))
  }

  const handleAdd = async (payload) => {
    try {
      setError('')
      await add(payload)
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpdate = async (payload) => {
    if (!editing) return
    try {
      setError('')
      await update(editing.id, payload)
      setEditing(null)
      setShowForm(false)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Sales</h1>
          <p className="text-sm text-gray-600">Manage your sales</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="w-full border rounded px-3 py-2 text-sm"
          />

          <button
            onClick={() => {
              setEditing(null)
              setShowForm(true)
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
          >
            Add
          </button>

          <button
            onClick={() =>
              exportToCsv(
                'sales.csv',
                ['customer', 'productName', 'quantity', 'amount'],
                sortedItems
              )
            }
            className="border px-4 py-2 rounded text-sm w-full sm:w-auto"
          >
            Export
          </button>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <SalesForm
            initial={editing || {}}
            onSave={editing ? handleUpdate : handleAdd}
            onCancel={() => {
              setShowForm(false)
              setEditing(null)
            }}
          />
        </div>
      )}

      {/* Show loading skeleton only when loading */}
      {loading ? (
        <PageSkeleton />
      ) : (
        <>
          {/* MOBILE VIEW (scrollable table) */}
          <div className="lg:hidden">
            <div className="bg-white rounded shadow overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-xs font-medium">Customer</th>
                    <th className="p-3 text-xs font-medium">Product</th>
                    <th className="p-3 text-xs font-medium">Qty</th>
                    <th className="p-3 text-xs font-medium">Amount</th>
                    <th className="p-3 text-xs font-medium">Date</th>
                    <th className="p-3 text-xs font-medium">Time</th>
                    <th className="p-3 text-xs font-medium">Due Date</th>
                    <th className="p-3 text-xs font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageItems.map((it) => (
                    <tr key={it.id} className="border-t">
                      <td className="p-3">
                        <div>
                          <div className="font-medium text-sm">
                            {it.customerInfo?.name || it.customer || 'Walk-in Customer'}
                          </div>
                          {it.customerInfo?.phone && (
                            <div className="text-xs text-gray-500">{it.customerInfo.phone}</div>
                          )}
                          {it.isCredit && (
                            <div className="text-xs text-orange-600 font-medium">Credit Sale</div>
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-sm">{it.productName || it.product}</td>
                      <td className="p-3 text-sm">{it.quantity}</td>
                      <td className="p-3 text-sm">{formatCurrency(it.amount)}</td>
                      <td className="p-3 text-sm">
                        {it.saleDate ? new Date(it.saleDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="p-3 text-sm">
                        {it.saleTime || '-'}
                      </td>
                      <td className="p-3 text-sm">
                        {it.dueDate ? new Date(it.dueDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col gap-1">
                          <button 
                            onClick={() => navigate(`/sales/${it.id}`)} 
                            className="text-xs text-indigo-600 hover:text-indigo-800"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setEditing(it)
                              setShowForm(true)
                            }}
                            className="text-xs text-indigo-600 hover:text-indigo-800"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => remove(it.id)} 
                            className="text-xs text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden lg:block bg-white rounded shadow overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Product</th>
                  <th className="p-3">Qty</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>

              <tbody>
                {currentPageItems.map((it) => (
                  <tr key={it.id} className="border-t">
                    <td className="p-3">
                      {it.customerInfo?.name || it.customer || 'Walk-in Customer'}
                    </td>
                    <td className="p-3">{it.productName || it.product}</td>
                    <td className="p-3">{it.quantity}</td>
                    <td className="p-3">{formatCurrency(it.amount)}</td>
                    <td className="p-3 space-x-2">
                      <button onClick={() => navigate(`/sales/${it.id}`)}>View</button>
                      <button onClick={() => setEditing(it)}>Edit</button>
                      <button onClick={() => remove(it.id)} className="text-red-600">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-4">
            <div className="flex gap-2">
              <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1}>
                Prev
              </button>
              <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages}>
                Next
              </button>
            </div>

            <div className="text-sm text-gray-600 text-center">
              Page {page} of {totalPages}
            </div>
          </div>

          {/* No results message */}
          {currentPageItems.length === 0 && !loading && (
            <div className="text-center py-8 text-gray-500">
              {debouncedQuery ? 'No sales found matching your search' : 'No sales records found'}
            </div>
          )}
        </>
      )}
    </div>
  )
}