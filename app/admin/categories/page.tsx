// app\admin\categories\page.tsx
import AdminLayout from '@/components/admin/AdminLayout'
import Categories from './Categories'

export const metadata = {
  title: 'Admin Products',
}
const AdminProductsPage = () => {
  return (
    <AdminLayout activeItem="categories">
      <Categories />
    </AdminLayout>
  )
}

export default AdminProductsPage
