import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, role, loading } = useAuth()

  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>

  if (!user) return <Navigate to="/login" />

  if (requiredRole && role !== requiredRole) return <Navigate to="/" />

  return children
}
