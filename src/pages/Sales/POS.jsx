import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useInventory from '../../hooks/useInventory'
import useSales from '../../hooks/useSales'
import useCategories from '../../hooks/useCategories'
import CustomerSelector from '../../components/CustomerSelector'
import { POSSkeleton, FormSkeleton } from '../../components/SkeletonLoader'
import { formatCurrency } from '../../utils/currency'

export default function POS() {
  const { items: inventory, loading } = useInventory()
  const { add } = useSales()
  const { items: categories } = useCategories()
  const [cart, setCart] = useState([])
  const [customer, setCustomer] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [discount, setDiscount] = useState(0)
  const [deposit, setDeposit] = useState(0)
  const [isCredit, setIsCredit] = useState(false)
  const [error, setError] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [showAllProducts, setShowAllProducts] = useState(false)

  const categoriesList = categories.map(cat => cat.name)

  const filteredProducts = inventory.filter(item => 
    item.qty > 0 &&
    (!selectedCategory || item.category === selectedCategory) &&
    (
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.note && item.note.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  )

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    
    if (existingItem) {
      if (existingItem.quantity < product.qty) {
        setCart(cart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ))
      } else {
        setError(`Only ${product.qty} items available in stock`)
        setTimeout(() => setError(''), 3000)
      }
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        unitPrice: product.unitPrice,
        quantity: 1,
        maxStock: product.qty,
        image: product.image || null,
        category: product.category || 'Uncategorized'
      }])
    }
  }

  const updateQuantity = (productId, newQuantity) => {
    const product = inventory.find(item => item.id === productId)
    const maxStock = product?.qty || 0
    
    if (newQuantity <= 0) {
      setCart(cart.filter(item => item.id !== productId))
    } else if (newQuantity <= maxStock) {
      setCart(cart.map(item => 
        item.id === productId 
          ? { ...item, quantity: newQuantity }
          : item
      ))
    } else {
      setError(`Only ${maxStock} items available in stock`)
      setTimeout(() => setError(''), 3000)
    }
  }

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId))
  }

  const getTotal = () => {
    const subtotal = cart.reduce((total, item) => total + (item.unitPrice * item.quantity), 0)
    return Math.max(0, subtotal - discount)
  }

  const getSubtotal = () => {
    return cart.reduce((total, item) => total + (item.unitPrice * item.quantity), 0)
  }

  const getBalance = () => {
    const total = getTotal()
    return Math.max(0, total - deposit)
  }

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer)
  }

  const handleDebugTest = async () => {
    try {
      console.log('Creating debug test sale...')
      await createTestSale()
      alert('Debug test sale created successfully! Check the Sales page.')
    } catch (error) {
      console.error('Debug test failed:', error)
      alert('Debug test failed: ' + error.message)
    }
  }

  const handleCheckout = async () => {
    if (cart.length === 0) {
      setError('Cart is empty')
      setTimeout(() => setError(''), 3000)
      return
    }

    // Customer is required for credit sales
    if (isCredit && !customer.trim()) {
      setError('Customer is required for credit sales')
      setTimeout(() => setError(''), 3000)
      return
    }

    // Validate deposit for credit sales
    if (isCredit && deposit > getTotal()) {
      setError('Deposit cannot exceed total amount')
      setTimeout(() => setError(''), 3000)
      return
    }

    // Validate phone number for credit sales
    if (isCredit && (!selectedCustomer || !selectedCustomer.phone)) {
      setError('Customer phone number is required for credit sales')
      setTimeout(() => setError(''), 3000)
      return
    }

    setIsProcessing(true)
    setError('')

    try {
      console.log('Starting checkout process...')
      console.log('Cart items:', cart)
      console.log('Customer:', customer)
      console.log('Is Credit:', isCredit)
      console.log('Deposit:', deposit)
      
      // Create sales records for each cart item
      const salesPromises = cart.map(async (item, index) => {
        try {
          console.log(`Processing item ${index + 1}:`, item)
          const saleData = {
            customer: customer || 'Walk-in Customer',
            customerInfo: selectedCustomer,
            productId: item.id,
            productName: item.name,
            quantity: item.quantity,
            amount: item.unitPrice * item.quantity,
            unitPrice: item.unitPrice,
            discount: discount / cart.length, // Distribute discount evenly
            deposit: isCredit ? deposit / cart.length : 0, // Distribute deposit evenly
            isCredit,
            paymentMethod: isCredit ? 'Credit' : 'Cash',
            balance: isCredit ? getBalance() : 0,
            saleDate: new Date().toISOString(), // Store as ISO string
            saleTime: new Date().toLocaleTimeString(), // Keep as string
            dueDate: isCredit ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null // Store as ISO string
          }
          
          const result = await add(saleData)
          console.log(`Sale ${index + 1} created successfully:`, result)
          return result
        } catch (error) {
          console.error(`Error creating sale for item ${index + 1}:`, error)
          throw error
        }
      })

      await Promise.all(salesPromises)
      
      console.log('All sales created successfully!')
      
      // Reset cart and form
      setCart([])
      setCustomer('')
      setSelectedCustomer(null)
      setDiscount(0)
      setDeposit(0)
      setIsCredit(false)
      
      alert('Sale completed successfully!')
      
    } catch (error) {
      console.error('Checkout error:', error)
      let errorMessage = 'Failed to complete sale'
      
      if (error.code === 'permission-denied') {
        errorMessage = 'You do not have permission to create sales'
      } else if (error.code === 'unavailable') {
        errorMessage = 'Service temporarily unavailable. Please try again.'
      } else if (error.code === 'deadline-exceeded') {
        errorMessage = 'Request timed out. Please try again.'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
      setTimeout(() => setError(''), 5000)
    } finally {
      setIsProcessing(false)
    }
  }

  if (loading) {
    return <POSSkeleton />
  }

  if (error) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#dc2626', marginBottom: '1rem' }}>Error Loading POS</h2>
          <p style={{ color: '#666' }}>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gray-100">
      {/* MAIN: Products Section */}
      <div className="flex-1 p-2 lg:p-4 overflow-y-auto">
        <div className="mb-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 space-y-2 sm:space-y-0">
            <h1 className="text-xl lg:text-2xl font-bold">Point of Sale</h1>
            <button
              onClick={handleDebugTest}
              className="bg-red-500 text-white px-2 py-1 rounded text-xs lg:text-sm hover:bg-red-600"
            >
              Debug Test
            </button>
          </div>
          <div className="flex flex-col sm:flex-row items-center space-x-0 sm:space-x-4 mb-4 space-y-2 sm:space-y-0">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full sm:flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
            />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-auto border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* MOBILE: 3x3 Product Grid */}
        <div className="lg:hidden">
          <div className="grid grid-cols-3 gap-2 mb-4">
            {filteredProducts.slice(0, 9).map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-indigo-500"
              >
                <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center p-2">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="text-gray-400 text-2xl">📦</div>
                  )}
                </div>
                <div className="p-2">
                  <h3 className="font-semibold text-xs truncate leading-tight">{product.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{product.category || 'Uncategorized'}</p>
                  <p className="text-sm font-bold text-indigo-600">{formatCurrency(product.unitPrice)}</p>
                  <p className="text-xs text-gray-500">Stock: {product.qty}</p>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProducts.length > 9 && (
            <button
              onClick={() => setShowAllProducts(!showAllProducts)}
              className="w-full bg-indigo-600 text-white py-2 rounded-lg text-sm"
            >
              {showAllProducts ? 'Show Less' : `Show All (${filteredProducts.length} products)`}
            </button>
          )}
          {showAllProducts && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
              {filteredProducts.slice(9).map((product) => (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border-2 border-transparent hover:border-indigo-500"
                >
                  <div className="aspect-square bg-gray-200 rounded-t-lg flex items-center justify-center p-2">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    ) : (
                      <div className="text-gray-400 text-2xl">📦</div>
                    )}
                  </div>
                  <div className="p-2">
                    <h3 className="font-semibold text-xs truncate leading-tight">{product.name}</h3>
                    <p className="text-xs text-gray-500 truncate">{product.category || 'Uncategorized'}</p>
                    <p className="text-sm font-bold text-indigo-600">{formatCurrency(product.unitPrice)}</p>
                    <p className="text-xs text-gray-500">Stock: {product.qty}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* DESKTOP: Optimized Product Grid */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 2xl:grid-cols-10 gap-2">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="bg-white rounded shadow hover:shadow-lg transition-shadow cursor-pointer border border-transparent hover:border-indigo-500 group"
              >
                <div className="aspect-square bg-gray-100 rounded-t flex items-center justify-center p-1">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover rounded-t"
                    />
                  ) : (
                    <div className="text-gray-300 text-2xl">📦</div>
                  )}
                </div>
                <div className="p-2">
                  <h3 className="font-semibold text-xs truncate leading-tight group-hover:text-indigo-600 transition-colors">{product.name}</h3>
                  <p className="text-xs text-gray-500 truncate">{product.category || 'Uncategorized'}</p>
                  <p className="text-sm font-bold text-indigo-600">{formatCurrency(product.unitPrice)}</p>
                  <p className="text-xs text-gray-500">Stock: {product.qty}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 'No products found matching your search' : 'No products available'}
          </div>
        )}
      </div>

      {/* DESKTOP: Cart Sidebar */}
      <div className="hidden lg:block w-96 bg-white shadow-lg border-l border-gray-200">
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold">Cart</h2>
          <div className="mb-4">
            <CustomerSelector
              value={customer}
              onChange={setCustomer}
              onCustomerSelect={handleCustomerSelect}
              required={isCredit}
            />
          </div>
          {isCredit && (
            <div className="mb-4">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <span className="text-orange-600">⚠️</span>
                  <div className="text-sm">
                    <p className="font-medium text-orange-800">Phone number required for credit sales</p>
                    <p className="text-orange-600">
                      {selectedCustomer?.phone 
                        ? `Customer phone: ${selectedCustomer.phone}` 
                        : 'Please select a customer with phone number'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-3 space-y-3">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="credit-sale"
                checked={isCredit}
                onChange={(e) => setIsCredit(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="credit-sale" className="text-sm">Credit Sale</label>
            </div>
            {isCredit && (
              <div>
                <label className="block text-sm text-gray-700 mb-1">Deposit Amount</label>
                <input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Enter deposit amount"
                />
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-700 mb-1">Discount</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter discount amount"
              />
            </div>
          </div>
        </div>
        
        <div className="border-t p-4">
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({getTotalItems()} items):</span>
              <span>{formatCurrency(getSubtotal())}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount:</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            {isCredit && deposit > 0 && (
              <div className="flex justify-between text-sm text-blue-600">
                <span>Deposit:</span>
                <span>-{formatCurrency(deposit)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>{isCredit ? 'Balance Due:' : 'Total:'}</span>
              <span>{formatCurrency(getBalance())}</span>
            </div>
            <div className="text-xs text-gray-500">
              Payment: {isCredit ? 'Credit' : 'Cash'}
              {isCredit && deposit > 0 && ` • Deposit: ${formatCurrency(deposit)}`}
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <span>Processing Sale...</span>
            ) : (
              <span>{isCredit ? `Complete Credit Sale${deposit > 0 ? ` (${formatCurrency(deposit)} paid)` : ''}` : 'Complete Sale'}</span>
            )}
          </button>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto">
          <h3 className="font-semibold mb-2">Cart Items ({cart.length})</h3>
          {cart.length === 0 ? (
            <p className="text-sm text-gray-500">Cart is empty</p>
          ) : (
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{item.name}</h4>
                      <p className="text-xs text-gray-500">{formatCurrency(item.unitPrice)} each</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(index)}
                      className="w-6 h-6 rounded bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 text-xs"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Quantity:</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="w-8 h-8 rounded bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-medium active:scale-95 transition-transform"
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="w-8 h-8 rounded bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center font-medium active:scale-95 transition-transform"
                        disabled={item.quantity >= item.maxStock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE: Cart Card at Bottom */}
      <div className="lg:hidden w-full bg-white shadow-lg border-t border-gray-200">
        <div className="p-3">
          <h2 className="text-lg font-bold mb-3">Cart</h2>
          <div className="mb-3">
            <CustomerSelector
              value={customer}
              onChange={setCustomer}
              onCustomerSelect={handleCustomerSelect}
              required={isCredit}
            />
          </div>
          {isCredit && (
            <div className="mb-3">
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-2">
                <div className="flex items-center space-x-2">
                  <span className="text-orange-600">⚠️</span>
                  <div className="text-sm">
                    <p className="font-medium text-orange-800">Phone number required for credit sales</p>
                    <p className="text-orange-600">
                      {selectedCustomer?.phone 
                        ? `Customer phone: ${selectedCustomer.phone}` 
                        : 'Please select a customer with phone number'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="credit-sale"
                checked={isCredit}
                onChange={(e) => setIsCredit(e.target.checked)}
                className="rounded"
              />
              <label htmlFor="credit-sale" className="text-sm">Credit Sale</label>
            </div>
            {isCredit && (
              <div>
                <label className="block text-sm text-gray-700">Deposit Amount</label>
                <input
                  type="number"
                  value={deposit}
                  onChange={(e) => setDeposit(Number(e.target.value))}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Enter deposit amount"
                />
              </div>
            )}
            <div>
              <label className="block text-sm text-gray-700">Discount</label>
              <input
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                className="w-full border px-3 py-2 rounded"
                placeholder="Enter discount amount"
              />
            </div>
          </div>
        </div>
        <div className="border-t p-4">
          <div className="mb-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal ({getTotalItems()} items):</span>
              <span>{formatCurrency(getSubtotal())}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Discount:</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            {isCredit && deposit > 0 && (
              <div className="flex justify-between text-sm text-blue-600">
                <span>Deposit:</span>
                <span>-{formatCurrency(deposit)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg border-t pt-2">
              <span>{isCredit ? 'Balance Due:' : 'Total:'}</span>
              <span>{formatCurrency(getBalance())}</span>
            </div>
            <div className="text-xs text-gray-500">
              Payment: {isCredit ? 'Credit' : 'Cash'}
              {isCredit && deposit > 0 && ` • Deposit: ${formatCurrency(deposit)}`}
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <span>Processing Sale...</span>
            ) : (
              <span>{isCredit ? `Complete Credit Sale${deposit > 0 ? ` (${formatCurrency(deposit)} paid)` : ''}` : 'Complete Sale'}</span>
            )}
          </button>
        </div>
        
        {/* Cart Items */}
        <div className="p-3 border-t max-h-48 overflow-y-auto">
          <h3 className="font-semibold mb-2">Cart Items ({cart.length})</h3>
          {cart.length === 0 ? (
            <p className="text-sm text-gray-500">Cart is empty</p>
          ) : (
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div key={index} className="flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-gray-500 text-xs">{formatCurrency(item.unitPrice)} x {item.quantity}</div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(index)}
                      className="w-8 h-8 rounded bg-red-100 hover:bg-red-200 flex items-center justify-center text-red-600 text-sm"
                    >
                      ×
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">Quantity:</span>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => updateQuantity(index, item.quantity - 1)}
                        className="w-10 h-10 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-lg font-medium active:scale-95 transition-transform"
                        disabled={item.quantity <= 1}
                      >
                        −
                      </button>
                      <span className="w-12 text-center font-bold text-lg">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(index, item.quantity + 1)}
                        className="w-10 h-10 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center text-lg font-medium active:scale-95 transition-transform"
                        disabled={item.quantity >= item.maxStock}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
