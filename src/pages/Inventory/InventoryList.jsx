import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import useInventory from '../../hooks/useInventory'
import InventoryForm from './InventoryForm'
import { exportToCsv } from '../../utils/exportCsv'
import { formatCurrency } from '../../utils/currency'
import { PageSkeleton } from '../../components/SkeletonLoader'

export default function InventoryList() {
  const { items, loading, add, update, remove } = useInventory()
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const [mode, setMode] = useState(searchParams.get('mode') ?? '')
  const [sortKey, setSortKey] = useState(searchParams.get('sortKey') ?? 'name')
  const [sortDirection, setSortDirection] = useState(searchParams.get('sortDirection') ?? 'asc')
  const [page, setPage] = useState(Number(searchParams.get('page') ?? 1))
  const [lowStockThreshold, setLowStockThreshold] = useState(() => {
    const saved = localStorage.getItem('lowStockThreshold')
    return saved ? Number(saved) : 5
  })
  const pageSize = 10

  // Save low stock threshold to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('lowStockThreshold', lowStockThreshold.toString())
  }, [lowStockThreshold])

  const filteredItems = useMemo(() => {
    const lower = (query || '').toLowerCase().trim()
    let filtered = items

    if (mode === 'lowStock') {
      filtered = filtered.filter((it) => Number(it.qty) <= lowStockThreshold)
    }

    if (!lower) return filtered

    return filtered.filter(
      (it) =>
        (it.name || '').toLowerCase().includes(lower) ||
        (it.note || '').toLowerCase().includes(lower) ||
        String(it.qty).includes(lower) ||
        String(it.unitPrice).includes(lower) ||
        String(it.costPrice).includes(lower) ||
        String(it.minSellingPrice).includes(lower) ||
        String(it.maxSellingPrice).includes(lower),
    )
  }, [items, query, mode, lowStockThreshold])

  // Reset to first page when filters/sorting change
  useEffect(() => {
    setPage(1)
  }, [query, mode, sortKey, sortDirection, items.length])

  useEffect(() => {
    const params = {}
    if (query) params.q = query
    if (mode) params.mode = mode
    if (sortKey && sortKey !== 'name') params.sortKey = sortKey
    if (sortDirection && sortDirection !== 'asc') params.sortDirection = sortDirection
    if (page && page !== 1) params.page = String(page)
    setSearchParams(params, { replace: true })
  }, [query, mode, sortKey, sortDirection, page, setSearchParams])

  useEffect(() => {
    const paramQuery = searchParams.get('q') ?? ''
    const paramMode = searchParams.get('mode') ?? ''
    const paramSortKey = searchParams.get('sortKey') ?? 'name'
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

  const navigate = useNavigate()

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
      {loading && <PageSkeleton />}
      
      <div className="flex flex-col gap-3 lg:flex-row lg:justify-between lg:items-center mb-6">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold">Inventory</h1>
          <p className="text-sm text-gray-600">Search, add, edit, and manage inventory items.</p>
          {mode === 'lowStock' && (
            <div className="mt-2 text-sm text-yellow-700 bg-yellow-50 rounded px-3 py-2 inline-flex items-center gap-2">
              <span className="font-medium">Showing low stock items (≤ {lowStockThreshold})</span>
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
            placeholder="Search inventory..."
            className="w-full border rounded px-3 py-2 text-sm"
          />
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Low Stock Alert:</label>
            <input
              type="number"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(Math.max(0, Number(e.target.value)))}
              className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
              min="0"
              max="999"
            />
          </div>
          <button
            onClick={() => setMode(mode === 'lowStock' ? '' : 'lowStock')}
            className={`px-3 py-2 rounded text-sm border ${
              mode === 'lowStock' 
                ? 'bg-yellow-100 border-yellow-300 text-yellow-800' 
                : 'bg-white border-gray-300 text-gray-700'
            }`}
          >
            {mode === 'lowStock' ? 'Show All' : 'Low Stock'}
          </button>
          <button
            onClick={() => {
              setEditing(null)
              setShowForm(true)
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded text-sm w-full sm:w-auto"
          >
            Add Item
          </button>
          <button
            onClick={() =>
              exportToCsv(
                'inventory.csv',
                ['name', 'category', 'qty', 'unitPrice', 'costPrice', 'minSellingPrice', 'maxSellingPrice', 'image', 'note'],
                sortedItems.map((item) => ({
                  name: item.name,
                  category: item.category || '',
                  qty: item.qty,
                  unitPrice: item.unitPrice,
                  costPrice: item.costPrice,
                  minSellingPrice: item.minSellingPrice,
                  maxSellingPrice: item.maxSellingPrice,
                  image: item.image || '',
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
          <InventoryForm
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
          <h3 className="text-lg font-medium text-gray-600">Loading Inventory...</h3>
          <p className="text-sm text-gray-500">Please wait while we fetch your data.</p>
        </div>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <div className="flex flex-wrap items-center justify-between gap-2 p-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Sort by:</label>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 text-sm"
              >
                <option value="name">Name</option>
                <option value="qty">Qty</option>
                <option value="unitPrice">Unit Price</option>
                <option value="costPrice">Cost Price</option>
                <option value="minSellingPrice">Min Selling Price</option>
                <option value="maxSellingPrice">Max Selling Price</option>
              </select>
              <button
                onClick={() => setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'))}
                className="text-sm text-gray-600"
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-2 lg:p-3 text-xs lg:text-sm">Image</th>
                  <th className="p-2 lg:p-3 text-xs lg:text-sm">Name</th>
                  <th className="p-2 lg:p-3 text-xs lg:text-sm">Category</th>
                  <th className="p-2 lg:p-3 text-xs lg:text-sm">Qty</th>
                  <th className="p-2 lg:p-3 text-xs lg:text-sm">Unit Price</th>
                  <th className="p-2 lg:p-3 text-xs lg:text-sm">Cost Price</th>
                  <th className="p-2 lg:p-3 text-xs lg:text-sm">Min Price</th>
                  <th className="p-2 lg:p-3 text-xs lg:text-sm">Max Price</th>
                  <th className="p-2 lg:p-3 text-xs lg:text-sm">Note</th>
                  <th className="p-2 lg:p-3 text-xs lg:text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPageItems.map((it) => (
                  <tr key={it.id} className="border-t">
                    <td className="p-2 lg:p-3">
                      {it.image ? (
                        <img
                          src={it.image}
                          alt={it.name}
                          className="h-8 w-8 lg:h-12 lg:w-12 object-cover rounded"
                        />
                      ) : (
                        <div className="h-8 w-8 lg:h-12 lg:w-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-gray-400 text-sm lg:text-xl">📦</span>
                        </div>
                      )}
                    </td>
                    <td className="p-2 lg:p-3 text-xs lg:text-sm font-medium">{it.name}</td>
                    <td className="p-2 lg:p-3">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs lg:text-sm">
                        {it.category || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="p-2 lg:p-3 text-xs lg:text-sm">
                      <span className={`font-medium ${Number(it.qty) <= lowStockThreshold ? 'text-red-600' : 'text-gray-900'}`}>
                        {it.qty}
                      </span>
                    </td>
                    <td className="p-2 lg:p-3 text-xs lg:text-sm">{formatCurrency(it.unitPrice)}</td>
                    <td className="p-2 lg:p-3 text-xs lg:text-sm">{formatCurrency(it.costPrice)}</td>
                    <td className="p-2 lg:p-3 text-xs lg:text-sm">{formatCurrency(it.minSellingPrice)}</td>
                    <td className="p-2 lg:p-3 text-xs lg:text-sm">{formatCurrency(it.maxSellingPrice)}</td>
                    <td className="p-2 lg:p-3 text-xs lg:text-sm">
                      <div className="max-w-32 truncate" title={it.note}>
                        {it.note || '-'}
                      </div>
                    </td>
                    <td className="p-2 lg:p-3">
                      <div className="flex flex-col lg:flex-row gap-1">
                        <button
                          onClick={() => navigate(`/inventory/${it.id}`)}
                          className="text-xs lg:text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setEditing(it)
                            setShowForm(true)
                          }}
                          className="text-xs lg:text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => remove(it.id)}
                          className="text-xs lg:text-sm text-red-600 hover:text-red-800"
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

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t border-gray-100">
            <div className="flex gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page <= 1}
                className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page >= totalPages}
                className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="text-sm text-gray-600">
              Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, sortedItems.length)} of {sortedItems.length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
