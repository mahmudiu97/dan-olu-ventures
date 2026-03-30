import { useState, useMemo } from 'react'
import useCategories from '../../hooks/useCategories'
import CategoryForm from './CategoryForm'

export default function CategoryList() {
  const { items: categories, loading, add, update, remove } = useCategories()
  const [editing, setEditing] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const lower = searchQuery.toLowerCase()
    return categories.filter(
      (cat) =>
        (cat.name || '').toLowerCase().includes(lower) ||
        (cat.description || '').toLowerCase().includes(lower)
    )
  }, [categories, searchQuery])

  const handleAdd = async (payload) => {
    try {
      await add(payload)
      setShowForm(false)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleUpdate = async (payload) => {
    if (!editing) return
    try {
      await update(editing.id, payload)
      setEditing(null)
      setShowForm(false)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await remove(id)
      } catch (err) {
        alert(err.message)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading categories...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-sm text-gray-600">Manage product categories</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search categories..."
            className="border border-gray-300 rounded px-3 py-2 text-sm"
          />
          <button
            onClick={() => {
              setEditing(null)
              setShowForm(true)
            }}
            className="bg-indigo-600 text-white px-4 py-2 rounded font-medium"
          >
            Add Category
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mb-6 bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">
            {editing ? 'Edit Category' : 'Add New Category'}
          </h2>
          <CategoryForm
            initial={editing || {}}
            onSave={editing ? handleUpdate : handleAdd}
            onCancel={() => {
              setShowForm(false)
              setEditing(null)
            }}
          />
        </div>
      )}

      {filteredCategories.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="text-gray-500">
            {searchQuery ? 'No categories found matching your search' : 'No categories found'}
          </div>
          {!searchQuery && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Add your first category
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                      style={{ backgroundColor: category.color || '#6B7280' }}
                    >
                      {category.name?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <div>
                      <h3 className="font-semibold">{category.name}</h3>
                      {category.description && (
                        <p className="text-sm text-gray-600">{category.description}</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Created: {new Date(category.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  <button
                    onClick={() => {
                      setEditing(category)
                      setShowForm(true)
                    }}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-800 font-medium text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
