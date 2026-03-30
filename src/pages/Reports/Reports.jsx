import { useMemo } from 'react'
import useSales from '../../hooks/useSales'
import useInventory from '../../hooks/useInventory'
import useCredits from '../../hooks/useCredits'
import { exportToCsv } from '../../utils/exportCsv'

import { formatCurrency } from '../../utils/currency'

export default function Reports() {
  const { items: sales, loading: salesLoading } = useSales()
  const { items: inventory, loading: inventoryLoading } = useInventory()
  const { items: credits, loading: creditsLoading } = useCredits()

  const loading = salesLoading || inventoryLoading || creditsLoading

  const totalSalesValue = useMemo(
    () => sales.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [sales],
  )

  const totalSalesCount = sales.length
  const averageSale = totalSalesCount ? totalSalesValue / totalSalesCount : 0

  const totalInventoryValue = useMemo(
    () => inventory.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.unitPrice || 0), 0),
    [inventory],
  )

  const lowStockCount = useMemo(() => inventory.filter((item) => Number(item.qty) <= 5).length, [inventory])

  const overdueCredits = useMemo(() => {
    const now = new Date()
    return credits.filter((item) => {
      const d = new Date(item.dueDate)
      return d instanceof Date && !Number.isNaN(d.valueOf()) && d < now
    })
  }, [credits])

  const overdueCreditsValue = useMemo(
    () => overdueCredits.reduce((sum, item) => sum + Number(item.amount || 0), 0),
    [overdueCredits],
  )

  const summary = useMemo(
    () => [
      { label: 'Total sales', value: totalSalesCount },
      { label: 'Total revenue', value: formatCurrency(totalSalesValue) },
      { label: 'Average sale', value: formatCurrency(averageSale) },
      { label: 'Inventory items', value: inventory.length },
      { label: 'Inventory value', value: formatCurrency(totalInventoryValue) },
      { label: 'Low stock items (<=5)', value: lowStockCount },
      { label: 'Credits outstanding', value: credits.length },
      { label: 'Overdue credits', value: overdueCredits.length },
      { label: 'Overdue credit value', value: formatCurrency(overdueCreditsValue) },
    ],
    [
      totalSalesCount,
      totalSalesValue,
      averageSale,
      inventory.length,
      totalInventoryValue,
      lowStockCount,
      credits.length,
      overdueCredits.length,
      overdueCreditsValue,
    ],
  )

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-sm text-gray-600">
            Export summaries and raw data for reporting or bookkeeping.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() =>
              exportToCsv(
                'reports-summary.csv',
                ['metric', 'value'],
                summary.map((row) => ({ metric: row.label, value: row.value })),
              )
            }
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Export summary
          </button>
          <button
            onClick={() =>
              exportToCsv(
                'sales.csv',
                ['customer', 'productName', 'quantity', 'amount', 'unitPrice', 'createdAt'],
                sales.map((item) => ({
                  customer: item.customer,
                  productName: item.productName || item.product,
                  quantity: item.quantity,
                  amount: item.amount,
                  unitPrice: item.unitPrice,
                  createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : '',
                })),
              )
            }
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Export sales
          </button>
          <button
            onClick={() =>
              exportToCsv(
                'inventory.csv',
                ['name', 'category', 'qty', 'unitPrice', 'costPrice', 'minSellingPrice', 'maxSellingPrice', 'image', 'note'],
                inventory.map((item) => ({
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
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Export inventory
          </button>
          <button
            onClick={() =>
              exportToCsv(
                'credits.csv',
                ['customer', 'amount', 'dueDate', 'note'],
                credits.map((item) => ({
                  customer: item.customer,
                  amount: item.amount,
                  dueDate: item.dueDate,
                  note: item.note,
                })),
              )
            }
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded"
          >
            Export credits
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : (
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3">Metric</th>
                <th className="p-3">Value</th>
              </tr>
            </thead>
            <tbody>
              {summary.map((row) => (
                <tr key={row.label} className="border-t">
                  <td className="p-3 font-medium text-gray-700">{row.label}</td>
                  <td className="p-3 text-gray-900">{row.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
