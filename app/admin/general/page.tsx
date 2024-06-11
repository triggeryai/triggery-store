// app\admin\general\page.tsx
import AdminLayout from '@/components/admin/AdminLayout'
import General from './General'

export const metadata = {
  title: 'Admin General',
}
const AdminGeneralPage = () => {
  return (
    <AdminLayout activeItem="general">
      <General />
    </AdminLayout>
  )
}

export default AdminGeneralPage
