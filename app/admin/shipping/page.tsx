// app\admin\payments\page.tsx
import AdminLayout from '@/components/admin/AdminLayout'
import Shipping from './Shipping'

export const metadata = {
  title: 'Admin Shipping',
}
const AdminOrdersPage = () => {
  return (
    <AdminLayout activeItem="shipping">
      <Shipping />
    </AdminLayout>
  )
}

export default AdminOrdersPage
