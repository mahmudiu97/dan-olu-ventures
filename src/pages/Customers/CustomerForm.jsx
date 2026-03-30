import { useState, useEffect } from 'react'

export default function CustomerForm({ initial = {}, onSave, onCancel }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    if (initial) {
      setName(initial.name || '')
      setPhone(initial.phone || '')
      setEmail(initial.email || '')
      setAddress(initial.address || '')
    }
  }, [initial])

  const handleSubmit = (e) => {
    e.preventDefault()
    const payload = { 
      name, 
      phone,
      email,
      address
    }
    onSave && onSave(payload)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name *</label>
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input 
            type="tel"
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
            placeholder="08012345678"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input 
          type="email"
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          placeholder="customer@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Address</label>
        <textarea 
          value={address} 
          onChange={(e) => setAddress(e.target.value)} 
          className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" 
          rows={3}
          placeholder="123 Main Street, Lagos, Nigeria"
        />
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
