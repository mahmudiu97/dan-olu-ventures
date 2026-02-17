import { useAuth } from '../hooks/useAuth'

export default function Dashboard() {
  const { user, role, logout } = useAuth()

  return (
    <div className="p-8">
      <div className="mb-4">
        <nav className="flex gap-3">
          <a href="/" className="text-sm text-gray-700 font-medium">Home</a>
          <a href="/inventory" className="text-sm text-gray-700 font-medium">Inventory</a>
        </nav>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        {user && (
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-700">{user.email} {role && `· ${role}`}</div>
            <button
              className="bg-red-600 text-white px-3 py-1 rounded"
              onClick={async () => {
                try {
                  await logout()
                } catch (e) {
                  console.error(e)
                }
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <p>Welcome to Dan Olu Global Ventures admin panel.</p>
    </div>
  )
}
