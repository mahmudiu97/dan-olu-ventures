import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login, loginWithGoogle, loginWithFacebook } = useAuth()
  const { resetPassword } = useAuth()
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetMessage, setResetMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">LOGIN</h1>
            <p className="text-gray-600 text-sm">How to i get started lorem ipsum dolor at?</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Username"
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

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {loading ? 'Logging in...' : 'Login Now'}
            </button>
          </form>

          {/* Forgot password */}
          <div className="mt-4 text-center">
            {!showReset ? (
              <button onClick={() => { setShowReset(true); setResetMessage(''); setResetEmail(email) }} className="text-sm text-purple-600 hover:underline">Forgot password?</button>
            ) : (
              <div className="mt-3">
                <div className="mb-2">
                  <input value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} type="email" placeholder="Enter your email" className="w-full border px-3 py-2 rounded" />
                </div>
                <div className="flex justify-center gap-2">
                  <button
                    className="bg-indigo-600 text-white px-4 py-2 rounded"
                    onClick={async () => {
                      setResetMessage('')
                      try {
                        await resetPassword(resetEmail)
                        setResetMessage('Password reset email sent. Check your inbox.')
                      } catch (err) {
                        console.error('reset error', err)
                        setResetMessage(err.message || 'Failed to send reset email')
                      }
                    }}
                  >
                    Send reset link
                  </button>
                  <button onClick={() => setShowReset(false)} className="bg-white border px-4 py-2 rounded">Cancel</button>
                </div>
                {resetMessage && <div className="mt-2 text-sm text-center text-gray-700">{resetMessage}</div>}
              </div>
            )}
          </div>

          {/* Social Login */}
          <div className="mt-8">
            <p className="text-center text-gray-700 font-medium mb-4">
              <span className="text-gray-600">Login</span> with Others
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* Google Login */}
              <button
                type="button"
                onClick={async () => {
                  setError('')
                  setLoading(true)
                  try {
                    await loginWithGoogle()
                    navigate('/')
                  } catch (err) {
                    console.error('Google login error', err)
                    setError(err.message || 'Google sign-in failed')
                  }
                  setLoading(false)
                }}
                className="flex items-center justify-center border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <text x="2" y="18" className="fill-red-500 font-bold text-lg">G</text>
                </svg>
                <span className="ml-2 text-sm text-gray-700"><span className="font-medium">Login with</span> google</span>
              </button>

              {/* Facebook Login */}
              <button
                type="button"
                onClick={async () => {
                  setError('')
                  setLoading(true)
                  try {
                    await loginWithFacebook()
                    navigate('/')
                  } catch (err) {
                    console.error('Facebook login error', err)
                    setError(err.message || 'Facebook sign-in failed')
                  }
                  setLoading(false)
                }}
                className="flex items-center justify-center border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition"
              >
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="ml-2 text-sm text-gray-700"><span className="font-medium">Login with</span> facebook</span>
              </button>
            </div>
          </div>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account? <Link to="/register" className="font-semibold text-purple-600 hover:text-purple-700">Register</Link>
          </p>
        </div>

        {/* Right side - Illustration */}
        <div className="w-1/2 bg-gradient-to-br from-indigo-500 via-purple-500 to-purple-600 flex items-center justify-center p-8 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-white/10 rounded-full blur-lg"></div>
          <div className="absolute bottom-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-lg"></div>

          <div className="relative z-10 text-center">
            {/* Illustration placeholder - woman with tablet */}
            <div className="bg-white/10 backdrop-blur rounded-3xl p-8 border border-white/20 w-80 h-80 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-6xl mb-4">👩‍💼</div>
                <p className="text-lg font-semibold">Welcome to</p>
                <p className="text-lg font-semibold">Dan Olu Ventures</p>
              </div>
            </div>

            {/* Floating element */}
            <div className="absolute bottom-12 right-8 bg-yellow-300 rounded-full w-16 h-16 flex items-center justify-center shadow-lg">
              <span className="text-3xl">✨</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
