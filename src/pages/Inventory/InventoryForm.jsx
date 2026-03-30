import { useState, useEffect } from 'react'
import useInventory from '../../hooks/useInventory'
import useCategories from '../../hooks/useCategories'
import { processImageForFirebase, formatFileSize } from '../../utils/imageUtils'

export default function InventoryForm({ initial = {}, onSave, onCancel }) {
  const { items: categories } = useCategories()
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [qty, setQty] = useState(0)
  const [unitPrice, setUnitPrice] = useState('')
  const [costPrice, setCostPrice] = useState('')
  const [minSellingPrice, setMinSellingPrice] = useState('')
  const [maxSellingPrice, setMaxSellingPrice] = useState('')
  const [image, setImage] = useState('')
  const [imagePreview, setImagePreview] = useState('')
  const [note, setNote] = useState('')

  useEffect(() => {
    if (initial) {
      setName(initial.name || '')
      setCategory(initial.category || '')
      setQty(initial.qty ?? 0)
      setUnitPrice(initial.unitPrice ?? '')
      setCostPrice(initial.costPrice ?? '')
      setMinSellingPrice(initial.minSellingPrice ?? '')
      setMaxSellingPrice(initial.maxSellingPrice ?? '')
      setImage(initial.image || '')
      setImagePreview(initial.image || '')
      setNote(initial.note || '')
    }
  }, [initial])

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        console.log('Processing image:', file.name, formatFileSize(file.size))
        
        // Process image with compression and validation
        const imageData = await processImageForFirebase(file)
        
        setImagePreview(imageData.base64)
        setImage(imageData.base64)
        
        console.log('Image processed successfully:', {
          originalSize: formatFileSize(imageData.originalSize),
          compressedSize: formatFileSize(imageData.size),
          dimensions: imageData.dimensions,
          compressed: imageData.compressed
        })
        
      } catch (error) {
        console.error('Image processing error:', error)
        alert(`Image processing failed: ${error.message}`)
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { 
      name, 
      category,
      qty: Number(qty), 
      unitPrice: Number(unitPrice),
      costPrice: Number(costPrice),
      minSellingPrice: Number(minSellingPrice),
      maxSellingPrice: Number(maxSellingPrice),
      image,
      note 
    }
    onSave && onSave(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm text-gray-700">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full border px-3 py-2 rounded" required />
      </div>

      <div>
        <label className="block text-sm text-gray-700">Category</label>
        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select category...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm text-gray-700">Product Image</label>
        <div className="mt-2">
          {imagePreview ? (
            <div className="space-y-2">
              <div className="relative">
                <img 
                  src={imagePreview} 
                  alt="Product preview" 
                  className="h-32 w-32 object-cover rounded-lg border shadow-md"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  ✓
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview('')
                    setImage('')
                  }}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Remove image
                </button>
                <span className="text-xs text-gray-500 self-center">
                  Image size: {imagePreview ? formatFileSize(imagePreview.length) : ''}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 w-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
              <div className="text-center">
                <div className="text-gray-400 text-2xl mb-2">📷</div>
                <label htmlFor="image-upload" className="cursor-pointer">
                  <span className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">Choose Image</span>
                  <div className="text-xs text-gray-500 mt-1">
                    JPG, PNG, GIF (Max 5MB)
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm text-gray-700">Quantity</label>
          <input value={qty} onChange={(e) => setQty(e.target.value)} type="number" className="w-full border px-3 py-2 rounded" required />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Unit Price (₦)</label>
          <input value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} type="number" step="0.01" className="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm text-gray-700">Cost Price (₦)</label>
          <input value={costPrice} onChange={(e) => setCostPrice(e.target.value)} type="number" step="0.01" className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Min Selling Price (₦)</label>
          <input value={minSellingPrice} onChange={(e) => setMinSellingPrice(e.target.value)} type="number" step="0.01" className="w-full border px-3 py-2 rounded" />
        </div>
        <div>
          <label className="block text-sm text-gray-700">Max Selling Price (₦)</label>
          <input value={maxSellingPrice} onChange={(e) => setMaxSellingPrice(e.target.value)} type="number" step="0.01" className="w-full border px-3 py-2 rounded" />
        </div>
      </div>

      <div>
        <label className="block text-sm text-gray-700">Note</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} className="w-full border px-3 py-2 rounded" rows={3} />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded">Save</button>
        <button type="button" onClick={onCancel} className="bg-white border px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  )
}
