// app/admin/shipping/page.tsx
import AdminLayout from '@/components/admin/AdminLayout'
import Shipping from './Shipping'

export const metadata = {
  title: 'Admin Shipping',
}

const AdminShippingPage = () => {
  return (
    <AdminLayout activeItem="shipping">
      <Shipping />
    </AdminLayout>
  )
}

export default AdminShippingPage
