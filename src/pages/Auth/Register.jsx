import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState('salesperson')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(email, password, name, role)
      navigate('/')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 overflow-hidden relative">
      {/* Decorative circle - top left */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full -translate-x-20 -translate-y-20"></div>
      
      {/* Decorative circle - bottom right */}
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16 opacity-40"></div>

      <div className="flex w-full max-w-6xl mx-auto shadow-2xl rounded-3xl overflow-hidden">
        {/* Left side - Form */}
        <div className="w-1/2 bg-white flex flex-col justify-center px-16 py-12 relative z-10">
          <div className="mb-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">REGISTER</h1>
            <p className="text-gray-600 text-sm">Join Dan Olu Global Ventures team</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Input */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                  placeholder="Full Name"
                  required
                  className="w-full bg-gray-100 border-0 pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Email Input */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full bg-gray-100 border-0 pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Password"
                  required
                  className="w-full bg-gray-100 border-0 pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Role Select */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-gray-100 border-0 pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition appearance-none cursor-pointer"
                >
                  <option value="salesperson">Salesperson</option>
                  <option value="manager">Manager</option>
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Register Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Registering...' : 'Register Now'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account? <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700">Login</Link>
          </p>
        </div>

        {/* Right side - Illustration */}
        <div className="w-1/2 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 flex items-center justify-center p-8 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-lg"></div>
          <div className="absolute bottom-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-lg"></div>

          <div className="relative z-10 text-center">
            {/* Illustration placeholder */}
            <div className="bg-white/10 backdrop-blur rounded-3xl p-8 border border-white/20 w-80 h-80 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-6xl mb-4">🚀</div>
                <p className="text-lg font-semibold">Grow Your</p>
                <p className="text-lg font-semibold">Business</p>
              </div>
            </div>

            {/* Floating element */}
            <div className="absolute bottom-12 right-8 bg-yellow-300 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
              <span className="text-3xl">⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
