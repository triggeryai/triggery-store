import AdminLayout from '@/components/admin/AdminLayout'
import Support from './Support'

export const metadata = {
  title: 'Admin Support',
}
const SupportPage = () => {
  return (
    <AdminLayout activeItem="support">
      <Support/>
    </AdminLayout>
  )
}

export default SupportPage
