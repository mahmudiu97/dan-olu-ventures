import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import Dashboard from '../pages/Dashboard'
import InventoryList from '../pages/Inventory/InventoryList'
import SalesList from '../pages/Sales/SalesList'
import CreditsList from '../pages/Credits/CreditsList'
import ProtectedRoute from '../components/layouts/ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/inventory"
        element={
          <ProtectedRoute>
            <InventoryList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/sales"
        element={
          <ProtectedRoute>
            <SalesList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/credits"
        element={
          <ProtectedRoute>
            <CreditsList />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
