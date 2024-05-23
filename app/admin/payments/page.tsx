// app\admin\payments\page.tsx
import AdminLayout from '@/components/admin/AdminLayout'
import Payments from './Payments'

export const metadata = {
  title: 'Admin Payments',
}
const AdminOrdersPage = () => {
  return (
    <AdminLayout activeItem="payments">
      <Payments />
    </AdminLayout>
  )
}

export default AdminOrdersPage
