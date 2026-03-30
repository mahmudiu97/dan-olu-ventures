import { useState } from 'react'
import { seedData, sampleCategories, sampleProducts } from '../../utils/seedData'

export default function DataSeeder() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleSeedData = async () => {
    setLoading(true)
    setError('')
    setResult(null)

    try {
      const result = await seedData()
      setResult(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Data Seeder</h1>
        <p className="text-gray-600 mb-6">
          This tool will populate your database with sample data for shoes and phone accessories.
        </p>

        <div className="mb-6">
          <button
            onClick={handleSeedData}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Seeding Data...' : 'Seed Sample Data'}
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {result && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <strong>Success!</strong> Data has been seeded successfully.
            <ul className="mt-2 list-disc list-inside">
              <li>{result.categories} categories added</li>
              <li>{result.products} products added</li>
            </ul>
          </div>
        )}

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Sample Data Preview</h2>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">Categories ({sampleCategories.length})</h3>
            <div className="grid grid-cols-2 gap-2">
              {sampleCategories.map((cat, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: cat.color }}
                  />
                  <span>{cat.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Products ({sampleProducts.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {sampleProducts.map((product, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                  <div className="flex items-center gap-3">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-8 h-8 object-cover rounded"
                    />
                    <div>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-gray-500">{product.category} • Stock: {product.qty}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">₦{product.unitPrice.toLocaleString()}</div>
                    <div className="text-gray-500 text-xs">per unit</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">📋 What will be added:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• 2 categories: Footwear and Electronics</li>
            <li>• 6 shoe products from major brands (Nike, Adidas, Puma, etc.)</li>
            <li>• 8 phone accessories (chargers, cables, power banks, etc.)</li>
            <li>• All products include realistic Nigerian Naira pricing</li>
            <li>• Each product has cost price, selling prices, and stock quantities</li>
            <li>• Custom SVG images for visual representation</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
