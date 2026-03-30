import { useState, useEffect } from 'react'

export default function CategoryForm({ initial = {}, onSave, onCancel }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState('#6B7280')

  useEffect(() => {
    if (initial) {
      setName(initial.name || '')
      setDescription(initial.description || '')
      setColor(initial.color || '#6B7280')
    }
  }, [initial])

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { 
      name, 
      description,
      color
    }
    onSave && onSave(payload)
  }

  const predefinedColors = [
    '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16',
    '#22C55E', '#10B981', '#14B8A6', '#06B6D4', '#0EA5E9',
    '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7', '#D946EF',
    '#EC4899', '#F43F5E', '#6B7280'
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Category Name</label>
        <input 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          required 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          rows={3}
          placeholder="Optional description for this category"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
        <div className="flex items-center gap-2">
          <input 
            type="color" 
            value={color} 
            onChange={(e) => setColor(e.target.value)} 
            className="w-12 h-12 border rounded cursor-pointer"
          />
          <input 
            type="text" 
            value={color} 
            onChange={(e) => setColor(e.target.value)} 
            className="flex-1 border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="#6B7280"
          />
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {predefinedColors.map((presetColor) => (
            <button
              key={presetColor}
              type="button"
              onClick={() => setColor(presetColor)}
              className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400"
              style={{ backgroundColor: presetColor }}
              title={presetColor}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 pt-4">
        <button 
          type="submit" 
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 font-medium"
        >
          Save
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          className="bg-white border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 font-medium"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
