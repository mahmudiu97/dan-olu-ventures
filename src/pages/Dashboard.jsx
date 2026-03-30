import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import useLocalStorage from '../hooks/useLocalStorage'
import useSales from '../hooks/useSales'
import useInventory from '../hooks/useInventory'
import useCredits from '../hooks/useCredits'
import { DashboardSkeleton } from '../components/SkeletonLoader'

function safeNumber(value) {
  const n = Number(value)
  return Number.isFinite(n) ? n : 0
}

function toDate(value) {
  if (!value) return null
  if (typeof value.toDate === 'function') return value.toDate()
  if (value instanceof Date) return value
  return new Date(value)
}

import { formatCurrency } from '../utils/currency'

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function SalesTrendChart({ data }) {
  // data: array of { label, value }
  const width = 320
  const height = 120
  const padding = 16
  const max = Math.max(...data.map((d) => d.value), 1)
  const points = data.map((d, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2)
    const y = height - padding - (d.value / max) * (height - padding * 2)
    return { x, y }
  })
  const path = points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ')

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
      <path d={path} fill="none" stroke="#4f46e5" strokeWidth={2} />
      {points.map((p, idx) => (
        <circle key={idx} cx={p.x} cy={p.y} r={3} fill="#4f46e5" />
      ))}
    </svg>
  )
}

export default function Dashboard() {
  const { items: sales, loading: salesLoading } = useSales()
  const { items: inventory, loading: inventoryLoading } = useInventory()
  const { items: credits, loading: creditsLoading } = useCredits()

  const [rangeDays, setRangeDays] = useLocalStorage('dashboardRangeDays', 7)
  const [lowStockThreshold, setLowStockThreshold] = useLocalStorage('lowStockThreshold', 5)

  const loading = salesLoading || inventoryLoading || creditsLoading

  // Show skeleton loader while loading
  if (loading) {
    return <DashboardSkeleton />
  }

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const rangeStart = useMemo(() => {
    const d = new Date(today)
    d.setDate(d.getDate() - (rangeDays - 1))
    return d
  }, [today, rangeDays])

  const totalSales = useMemo(
    () => sales.reduce((sum, item) => sum + safeNumber(item.amount), 0),
    [sales],
  )

  const totalInventoryValue = useMemo(
    () => inventory.reduce((sum, item) => sum + safeNumber(item.qty) * safeNumber(item.unitPrice), 0),
    [inventory],
  )

  const totalCredits = useMemo(
    () => credits.reduce((sum, item) => sum + safeNumber(item.amount), 0),
    [credits],
  )

  const currentMonth = today.getMonth()
  const currentYear = today.getFullYear()

  const monthlyRevenue = useMemo(() => {
    return sales
      .filter((s) => {
        const d = toDate(s.createdAt)
        return d && d.getFullYear() === currentYear && d.getMonth() === currentMonth
      })
      .reduce((sum, item) => sum + safeNumber(item.amount), 0)
  }, [sales, currentMonth, currentYear])

  const prevMonthRevenue = useMemo(() => {
    const prev = new Date(currentYear, currentMonth - 1, 1)
    return sales
      .filter((s) => {
        const d = toDate(s.createdAt)
        return d && d.getFullYear() === prev.getFullYear() && d.getMonth() === prev.getMonth()
      })
      .reduce((sum, item) => sum + safeNumber(item.amount), 0)
  }, [sales, currentMonth, currentYear])

  const monthOverMonth = useMemo(() => {
    if (prevMonthRevenue === 0) return null
    return ((monthlyRevenue - prevMonthRevenue) / Math.abs(prevMonthRevenue)) * 100
  }, [monthlyRevenue, prevMonthRevenue])

  const lowStockItems = useMemo(
    () => inventory.filter((item) => safeNumber(item.qty) < lowStockThreshold),
    [inventory, lowStockThreshold],
  )
  const lowStockCount = lowStockItems.length

  const overdueCreditsList = useMemo(() => {
    const now = new Date()
    return credits
      .filter((c) => {
        const d = new Date(c.dueDate)
        return d instanceof Date && !Number.isNaN(d.valueOf()) && d < now
      })
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
  }, [credits])

  const overdueCredits = useMemo(
    () => overdueCreditsList.reduce((sum, item) => sum + safeNumber(item.amount), 0),
    [overdueCreditsList],
  )

  const salesByRange = useMemo(() => {
    return sales.filter((s) => {
      const d = toDate(s.createdAt)
      return d && d >= rangeStart && d <= today
    })
  }, [sales, rangeStart, today])

  const salesByDay = useMemo(() => {
    const days = Array.from({ length: rangeDays }, (_, idx) => {
      const d = new Date(rangeStart)
      d.setDate(rangeStart.getDate() + idx)
      return d
    })

    const counts = days.map((day) => {
      const next = new Date(day)
      next.setDate(day.getDate() + 1)
      return salesByRange.filter((s) => {
        const date = toDate(s.createdAt)
        if (!date) return false
        return date >= day && date < next
      }).length
    })

    const maxCount = Math.max(...counts, 1)

    return days.map((day, idx) => ({
      label: day.toLocaleDateString(undefined, { weekday: 'short' }),
      count: counts[idx],
      widthPct: (counts[idx] / maxCount) * 100,
    }))
  }, [salesByRange, rangeDays, rangeStart])

  const weeklyRevenue = useMemo(() => {
    // last 4 weeks (Mon-Sun)
    const weeks = Array.from({ length: 4 }, (_, idx) => {
      const end = new Date(today)
      end.setDate(end.getDate() - end.getDay() + 6 - idx * 7) // end of week (Saturday)
      end.setHours(23, 59, 59, 999)
      const start = new Date(end)
      start.setDate(end.getDate() - 6)
      start.setHours(0, 0, 0, 0)
      const total = sales
        .filter((s) => {
          const d = toDate(s.createdAt)
          return d && d >= start && d <= end
        })
        .reduce((sum, item) => sum + safeNumber(item.amount), 0)
      return { label: `Wk ${idx + 1}`, value: total }
    })
    return weeks.reverse()
  }, [sales, today])

  const uniqueCustomers = useMemo(() => {
    const set = new Set(sales.map((s) => s.customer).filter(Boolean))
    return set.size
  }, [sales])

  const navigate = useNavigate()

  return (
    <div className="space-y-6 lg:space-y-8">
      <div className="flex flex-col gap-4">
        <div>
          <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Sales Overview</h1>
          <p className="text-sm text-gray-600">Quick stats and trends based on your sales, inventory and credits.</p>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Range</label>
            <select
              value={rangeDays}
              onChange={(e) => setRangeDays(Number(e.target.value))}
              className="border border-gray-300 rounded px-2 py-1 text-sm"
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-medium text-gray-600">Low stock</label>
            <input
              type="number"
              value={lowStockThreshold}
              onChange={(e) => setLowStockThreshold(clamp(Number(e.target.value), 1, 100))}
              className="w-16 border border-gray-300 rounded px-2 py-1 text-sm"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <button
          type="button"
          onClick={() => navigate('/sales')}
          className="text-left bg-indigo-900 shadow-lg rounded-lg p-4 lg:p-6 text-white relative overflow-hidden hover:bg-indigo-800"
        >
          <p className="text-xs lg:text-sm font-medium">Monthly Revenue</p>
          <p className="mt-1 lg:mt-2 text-2xl lg:text-3xl font-semibold">{formatCurrency(monthlyRevenue)}</p>
          <span className="text-xs bg-green-500 px-2 py-1 rounded-full absolute top-2 right-2">
            {loading ? '…' : monthOverMonth === null ? '—' : `${monthOverMonth >= 0 ? '+' : ''}${monthOverMonth.toFixed(1)}%`}
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/inventory?mode=lowStock')}
          className="text-left bg-white shadow rounded-lg p-4 lg:p-6 hover:bg-gray-50"
        >
          <p className="text-xs lg:text-sm font-medium text-gray-500">Inventory Value</p>
          <p className="mt-1 lg:mt-2 text-2xl lg:text-3xl font-semibold text-gray-900">{formatCurrency(totalInventoryValue)}</p>
          <span className="text-xs bg-red-200 text-red-600 px-2 py-1 rounded-full absolute top-2 right-2">
            {loading ? '…' : `${lowStockCount} low`}
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/credits?mode=overdue')}
          className="text-left bg-white shadow rounded-lg p-4 lg:p-6 hover:bg-gray-50"
        >
          <p className="text-xs lg:text-sm font-medium text-gray-500">Credits Outstanding</p>
          <p className="mt-1 lg:mt-2 text-2xl lg:text-3xl font-semibold text-gray-900">{formatCurrency(totalCredits)}</p>
          <span className="text-xs bg-red-200 text-red-600 px-2 py-1 rounded-full absolute top-2 right-2">
            {loading ? '…' : `${formatCurrency(overdueCredits)} overdue`}
          </span>
        </button>

        <button
          type="button"
          onClick={() => navigate('/sales')}
          className="text-left bg-white shadow rounded-lg p-4 lg:p-6 hover:bg-gray-50"
        >
          <p className="text-xs lg:text-sm font-medium text-gray-500">Sales in range</p>
          <p className="mt-1 lg:mt-2 text-2xl lg:text-3xl font-semibold text-gray-900">{salesByRange.length}</p>
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full absolute top-2 right-2">
            {loading ? '…' : `${uniqueCustomers} customers`}
          </span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <div className="bg-white shadow rounded-lg p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <p className="text-base lg:text-lg font-medium text-gray-700">Sales trend</p>
            <span className="text-xs text-gray-500">Last {rangeDays} days</span>
          </div>
          {loading ? (
            <p className="text-sm text-gray-500">Loading sales data…</p>
          ) : (
            <div>
              <SalesTrendChart data={salesByDay.map((d) => ({ label: d.label, value: d.count }))} />
              <div className="mt-2 flex justify-between text-xs text-gray-500">
                <span>{salesByDay[0]?.label}</span>
                <span>{salesByDay[salesByDay.length - 1]?.label}</span>
              </div>
            </div>
          )}
        </div>
        <div className="bg-white shadow rounded-lg p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
            <p className="text-base lg:text-lg font-medium text-gray-700">Low stock items</p>
            <span className="text-xs text-gray-500">Threshold: {lowStockThreshold}</span>
          </div>
          {lowStockCount === 0 ? (
            <p className="text-sm text-gray-500">No items with low stock.</p>
          ) : (
            <div className="space-y-2">
              {lowStockItems.slice(0, 6).map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <span className="text-sm font-medium truncate flex-1 mr-2">{item.name || 'Unnamed item'}</span>
                  <span className="text-xs text-red-600 whitespace-nowrap">{safeNumber(item.qty)} left</span>
                </div>
              ))}
              {lowStockCount > 6 && (
                <p className="text-xs text-gray-500">+{lowStockCount - 6} more low-stock items</p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-4 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
          <p className="text-base lg:text-lg font-medium text-gray-700">Overdue credits</p>
          <span className="text-xs text-gray-500">Total overdue: {formatCurrency(overdueCredits)}</span>
        </div>
        {overdueCredits === 0 ? (
          <p className="text-sm text-gray-500">No overdue credits. Great job!</p>
        ) : (
          <div className="space-y-2">
            {overdueCreditsList.slice(0, 5).map((credit) => (
              <div key={credit.id} className="flex items-center justify-between">
                <span className="text-sm font-medium truncate flex-1 mr-2">{credit.customer || 'Unnamed'}</span>
                <span className="text-xs text-red-600 whitespace-nowrap">{formatCurrency(safeNumber(credit.amount))}</span>
              </div>
            ))}
            {overdueCreditsList.length > 5 && (
              <p className="text-xs text-gray-500">+{overdueCreditsList.length - 5} more overdue credits</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
