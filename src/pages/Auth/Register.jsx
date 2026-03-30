import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const { register } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      const user = await register(email, password, name, 'salesperson')
      if (!user) {
        console.warn('register() did not return a user object')
      }
      setSuccess(
        `Registration successful for ${user?.email || 'your account'}! You can now log in.`,
      )
      setEmail('')
      setPassword('')
      setName('')
      // setRole('salesperson')
    } catch (err) {
      console.error('registration error', err)
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-purple-50 to-purple-100 overflow-hidden relative">
      
      {/* Decorative Circles */}
      <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full -translate-x-20 -translate-y-20"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-16 translate-y-16 opacity-40"></div>

      <div className="flex w-full max-w-6xl mx-auto shadow-2xl rounded-3xl overflow-hidden">

        {/* LEFT SIDE - FORM */}
        <div className="w-1/2 bg-white flex flex-col justify-center px-16 py-12 relative z-10">

          <div className="mb-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">REGISTER</h1>
            <p className="text-gray-600 text-sm">
              Join Dan Olu Global Ventures Team
            </p>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          {/* SUCCESS MESSAGE */}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">
              <p>{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* NAME */}
            <div className="relative">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                placeholder="Full Name"
                required
                className="w-full bg-gray-100 border-0 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
              />
            </div>

            {/* EMAIL */}
            <div className="relative">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email Address"
                required
                className="w-full bg-gray-100 border-0 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
              />
            </div>

            {/* PASSWORD */}
            <div className="relative">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
                required
                className="w-full bg-gray-100 border-0 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Registering...' : 'Register Now'}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-semibold text-purple-600 hover:text-purple-700"
            >
              Login
            </Link>
          </p>
        </div>

        {/* RIGHT SIDE - ILLUSTRATION */}
        <div className="w-1/2 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 flex items-center justify-center p-8 relative overflow-hidden">

          <div className="relative z-10 text-center">
            <div className="bg-white/10 backdrop-blur rounded-3xl p-8 border border-white/20 w-80 h-80 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-6xl mb-4">🚀</div>
                <p className="text-lg font-semibold">Grow Your</p>
                <p className="text-lg font-semibold">Business</p>
              </div>
            </div>

            <div className="absolute bottom-12 right-8 bg-yellow-300 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
              <span className="text-3xl">⭐</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}