import { Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import Dashboard from '../pages/Dashboard'
import InventoryList from '../pages/Inventory/InventoryList'
import InventoryDetail from '../pages/Inventory/InventoryDetail'
import POS from '../pages/Sales/POS'
import SalesList from '../pages/Sales/SalesList'
import SalesDetail from '../pages/Sales/SalesDetail'
import CreditsList from '../pages/Credits/CreditsList'
import CreditsDetail from '../pages/Credits/CreditsDetail'
import CategoryList from '../pages/Categories/CategoryList'
import CustomerList from '../pages/Customers/CustomerList'
import DataSeeder from '../pages/Admin/DataSeeder'
import Reports from '../pages/Reports/Reports'
import ProtectedRoute from '../components/layouts/ProtectedRoute'
import MainLayout from '../components/layouts/MainLayout'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<InventoryList />} />
        <Route path="/inventory/:id" element={<InventoryDetail />} />
        <Route path="/categories" element={<CategoryList />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/admin/seeder" element={<DataSeeder />} />
        <Route path="/pos" element={<POS />} />
        <Route path="/sales" element={<SalesList />} />
        <Route path="/sales/:id" element={<SalesDetail />} />
        <Route path="/credits" element={<CreditsList />} />
        <Route path="/credits/:id" element={<CreditsDetail />} />
        <Route path="/reports" element={<Reports />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
