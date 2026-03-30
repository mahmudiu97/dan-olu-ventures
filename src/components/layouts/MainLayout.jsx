import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useState } from 'react'

export default function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/login')
    } catch (e) {
      console.error('Logout failed', e)
    }
  }

  const navLinks = [
    { to: '/', label: 'Dashboard' },
    { to: '/inventory', label: 'Inventory' },
    { to: '/categories', label: 'Categories' },
    { to: '/customers', label: 'Customers' },
    { to: '/pos', label: 'POS' },
    { to: '/sales', label: 'Sales' },
    { to: '/credits', label: 'Credits' },
    { to: '/reports', label: 'Reports' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-lg sm:text-xl font-bold text-indigo-600">OLU Ventures</span>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1 lg:space-x-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `px-2 lg:px-3 py-2 rounded-md text-xs lg:text-sm font-medium ${
                      isActive ? 'text-gray-700 bg-indigo-100' : 'text-gray-500 hover:text-gray-700'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-2 lg:space-x-4">
              {user && (
                <>
                  <span className="hidden sm:block text-xs lg:text-sm text-gray-700 truncate max-w-[100px] lg:max-w-[200px]">
                    {user.email}
                  </span>
                  <button 
                    onClick={handleLogout} 
                    className="text-xs lg:text-sm text-red-600 hover:text-red-800"
                  >
                    Logout
                  </button>
                </>
              )}
              
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium ${
                        isActive ? 'text-gray-700 bg-indigo-100' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                      }`
                    }
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
                {user && (
                  <div className="border-t border-gray-200 pt-2">
                    <div className="px-3 py-2 text-xs text-gray-500 truncate">
                      {user.email}
                    </div>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-3 py-2 text-base font-medium text-red-600 hover:text-red-800 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="py-4 sm:py-8">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
