// next-amazona-v2/app/admin/discounts/page.tsx
import AdminLayout from '@/components/admin/AdminLayout'
import Discounts from './Discounts'

export const metadata = {
  title: 'Admin Discounts',
}
const DiscountsPage = () => {
  return (
    <AdminLayout activeItem="discounts">
      <Discounts />
    </AdminLayout>
  )
}

export default DiscountsPage
