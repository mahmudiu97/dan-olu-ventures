import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useCredits from '../../hooks/useCredits'
import CreditsForm from './CreditsForm'
import { exportToCsv } from '../../utils/exportCsv'
import { formatCurrency } from '../../utils/currency'
import { PageSkeleton } from '../../components/SkeletonLoader'

export default function CreditsList() {
  const { items, loading, add, update, remove } = useCredits()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [mode, setMode] = useState(searchParams.get('mode') ?? '')
  const [sortKey, setSortKey] = useState(searchParams.get('sortKey') ?? 'customer')
  const [sortDirection, setSortDirection] = useState(searchParams.get('sortDirection') ?? 'asc')
  const [page, setPage] = useState(Number(searchParams.get('page') ?? 1))
  const pageSize = 10

  const filteredItems = useMemo(() => {
    const lower = (query || '').toLowerCase().trim()

    let filtered = items
    if (mode === 'overdue') {
      const now = new Date()
      filtered = filtered.filter((c) => {
        const d = new Date(c.dueDate)
        return d instanceof Date && !Number.isNaN(d.valueOf()) && d < now
      })
    }

    if (!lower) return filtered

    return filtered.filter(
      (it) =>
        (it.customer || '').toLowerCase().includes(lower) ||
        String(it.amount).includes(lower) ||
        (it.note || '').toLowerCase().includes(lower) ||
        (it.dueDate || '').includes(lower),
    )
  }, [items, query, mode])

  useEffect(() => {
    setPage(1)
  }, [query, mode, sortKey, sortDirection, items.length])

  useEffect(() => {
    const params = {}
    if (query) params.q = query
    if (mode) params.mode = mode
    if (sortKey && sortKey !== 'customer') params.sortKey = sortKey
    if (sortDirection && sortDirection !== 'asc') params.sortDirection = sortDirection
    if (page && page !== 1) params.page = String(page)
    setSearchParams(params, { replace: true })
  }, [query, mode, sortKey, sortDirection, page, setSearchParams])

  useEffect(() => {
    const paramQuery = searchParams.get('q') ?? ''
    const paramMode = searchParams.get('mode') ?? ''
    const paramSortKey = searchParams.get('sortKey') ?? 'customer'
    const paramSortDirection = searchParams.get('sortDirection') ?? 'asc'
    const paramPage = Number(searchParams.get('page') ?? 1)

    if (paramQuery !== query) setQuery(paramQuery)
    if (paramMode !== mode) setMode(paramMode)
    if (paramSortKey !== sortKey) setSortKey(paramSortKey)
    if (paramSortDirection !== sortDirection) setSortDirection(paramSortDirection)
    if (paramPage !== page) setPage(paramPage)
  }, [searchParams])

  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems]
    sorted.sort((a, b) => {
      const aVal = a[sortKey] ?? ''
      const bVal = b[sortKey] ?? ''
      if (aVal === bVal) return 0
      const isNumeric = typeof aVal === 'number' && typeof bVal === 'number'
      if (isNumeric) {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal
      }
      const aStr = String(aVal).toLowerCase()
      const bStr = String(bVal).toLowerCase()
      return sortDirection === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr)
    })
    return sorted
  }, [filteredItems, sortKey, sortDirection])

  const totalPages = Math.max(1, Math.ceil(sortedItems.length / pageSize))
  const currentPageItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return sortedItems.slice(start, start + pageSize)
  }, [page, sortedItems])

  const handlePageChange = (newPage) => {
    setPage(Math.min(Math.max(1, newPage), totalPages))
  }

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
    <div className="p-4 lg:p-8">
      <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Credits</h1>
          <p className="text-sm text-gray-600">Search, add, and manage customer credits.</p>
          {mode === 'overdue' && (
            <div className="mt-2 text-sm text-yellow-700 bg-yellow-50 rounded px-3 py-2 inline-flex items-center gap-2">
              <span className="font-medium">Showing overdue credits</span>
              <button
                type="button"
                onClick={() => setMode('')}
                className="text-xs text-indigo-600 underline"
              >
                Clear
              </button>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search credits..."
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <button
            onClick={() => {
              setEditing(null)
              setShowForm(true)
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
          >
            Add Credit
          </button>
          <button
            onClick={() =>
              exportToCsv(
                'credits.csv',
                ['customer', 'amount', 'dueDate', 'note'],
                sortedItems.map((item) => ({
                  customer: item.customer,
                  amount: item.amount,
                  dueDate: item.dueDate,
                  note: item.note,
                })),
              )
            }
            className="border px-4 py-2 rounded text-sm w-full sm:w-auto"
          >
            Export
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-4 rounded shadow">
          <CreditsForm
            initial={editing || {}}
            onSave={editing ? handleUpdate : handleAdd}
            onCancel={() => {
              setShowForm(false)
              setEditing(null)
            }}
          />
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <h3 className="text-lg font-medium text-gray-600">Loading Credits...</h3>
          <p className="text-sm text-gray-500">Please wait while we fetch your data.</p>
        </div>
      ) : (
        <>
          <div className="bg-white rounded shadow overflow-x-auto">
            <div className="flex flex-wrap items-center justify-between gap-2 p-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select
                  value={sortKey}
                  onChange={(e) => setSortKey(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="customer">Customer</option>
                  <option value="amount">Amount</option>
                  <option value="dueDate">Due Date</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMode(mode === 'overdue' ? '' : 'overdue')}
                  className={`px-3 py-1 rounded text-sm border ${
                    mode === 'overdue' 
                      ? 'bg-yellow-100 border-yellow-300 text-yellow-800' 
                      : 'bg-white border-gray-300 text-gray-700'
                  }`}
                >
                  {mode === 'overdue' ? 'Show All' : 'Overdue'}
                </button>
              </div>
            </div>

            {/* MOBILE VIEW */}
            <div className="lg:hidden">
              <div className="min-w-[600px]">
                <table className="w-full text-left">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-xs font-medium">Customer</th>
                      <th className="p-3 text-xs font-medium">Amount</th>
                      <th className="p-3 text-xs font-medium">Due Date</th>
                      <th className="p-3 text-xs font-medium">Status</th>
                      <th className="p-3 text-xs font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPageItems.map((it) => (
                      <tr key={it.id} className="border-t">
                        <td className="p-3">
                          <div className="font-medium text-sm">{it.customer}</div>
                        </td>
                        <td className="p-3 text-sm">{formatCurrency(it.amount)}</td>
                        <td className="p-3 text-sm">
                          {it.dueDate ? new Date(it.dueDate).toLocaleDateString() : '-'}
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            it.status === 'paid' 
                              ? 'bg-green-100 text-green-800' 
                              : it.status === 'overdue'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {it.status || 'pending'}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-1">
                            <button
                              onClick={() => navigate(`/credits/${it.id}`)}
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

            {/* DESKTOP VIEW */}
            <div className="hidden lg:block">
              <table className="w-full text-left">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-3 text-xs font-medium">Customer</th>
                    <th className="p-3 text-xs font-medium">Amount</th>
                    <th className="p-3 text-xs font-medium">Due Date</th>
                    <th className="p-3 text-xs font-medium">Status</th>
                    <th className="p-3 text-xs font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentPageItems.map((it) => (
                    <tr key={it.id} className="border-t">
                      <td className="p-3">
                        <div className="font-medium">{it.customer}</div>
                      </td>
                      <td className="p-3">{formatCurrency(it.amount)}</td>
                      <td className="p-3">
                        {it.dueDate ? new Date(it.dueDate).toLocaleDateString() : '-'}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          it.status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : it.status === 'overdue'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {it.status || 'pending'}
                        </span>
                      </td>
                      <td className="p-3 space-x-2">
                        <button
                          onClick={() => navigate(`/credits/${it.id}`)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setEditing(it)
                            setShowForm(true)
                          }}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => remove(it.id)}
                          className="text-red-600 hover:text-red-800"
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
              {query ? 'No credits found matching your search' : 'No credit records found'}
            </div>
          )}
        </>
      )}
    </div>
  )
}
