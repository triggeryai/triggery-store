// app\admin\emails\page.tsx
import AdminLayout from '@/components/admin/AdminLayout'
import Emails from './Emails'

export const metadata = {
  title: 'Admin Emails',
}
const AdminEmailsPage = () => {
  return (
    <AdminLayout activeItem="emails">
      <Emails />
    </AdminLayout>
  )
}

export default AdminEmailsPage
