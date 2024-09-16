// components\admin\AdminLayout.tsx
import { auth } from '@/lib/auth'
import Link from 'next/link'

const AdminLayout = async ({
  activeItem = 'dashboard',
  children,
}: {
  activeItem: string
  children: React.ReactNode
}) => {
  const session = await auth()
  if (!session || !session.user.isAdmin) {
    return (
      <div className="relative flex flex-grow p-4">
        <div>
          <h1 className="text-2xl">Nieautoryzowany</h1>
          <p>Wymagane uprawnienia administratora</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-grow">
      <div className="w-full grid md:grid-cols-5">
        <div className="bg-base-200">
          <ul className="menu">
            <li>
              <Link
                className={'dashboard' === activeItem ? 'active' : ''}
                href="/admin/dashboard"
              >
                Panel
              </Link>
            </li>
            <li>
              <Link
                className={'orders' === activeItem ? 'active' : ''}
                href="/admin/orders"
              >
                Zamówienia
              </Link>
            </li>
            <li>
              <Link
                className={'products' === activeItem ? 'active' : ''}
                href="/admin/products"
              >
                Produkty
              </Link>
            </li>
            <li>
              <Link
                className={'categories' === activeItem ? 'active' : ''}
                href="/admin/categories"
              >
                Kategorie
              </Link>
            </li>
            <li>
              <Link
                className={'users' === activeItem ? 'active' : ''}
                href="/admin/users"
              >
                Użytkownicy
              </Link>
            </li>
            <li>
              <Link
                className={'payments' === activeItem ? 'active' : ''}
                href="/admin/payments"
              >
                Płatności
              </Link>
            </li>
            <li>
              <Link
                className={'shipping' === activeItem ? 'active' : ''}
                href="/admin/shipping"
              >
                Wysyłka
              </Link>
            </li>
            <li>
              <Link
                className={'support' === activeItem ? 'active' : ''}
                href="/admin/support"
              >
                Wsparcie
              </Link>
            </li>
            <li>
              <Link
                className={'emails' === activeItem ? 'active' : ''}
                href="/admin/emails"
              >
                E-maile
              </Link>
            </li>
            <li>
              <Link
                className={'general' === activeItem ? 'active' : ''}
                href="/admin/general"
              >
                Ogólne
              </Link>
            </li>
            <li>
              <Link
                className={'discounts' === activeItem ? 'active' : ''}
                href="/admin/discounts"
              >
                Kody rabatowe
              </Link>
            </li>
          </ul>
        </div>
        <div className="md:col-span-4 px-4">{children} </div>
      </div>
    </div>
  )
}

export default AdminLayout
