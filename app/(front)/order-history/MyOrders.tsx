// app(front)/order-history/MyOrders.tsx
'use client'

import { Order } from '@/lib/models/OrderModel'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'
import { useSession } from 'next-auth/react'

export default function MyOrders() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [mounted, setMounted] = useState(false)

  const fetchOrders = async (url: string) => {
    const response = await fetch(url)
    if (response.status === 401) {
      router.push('/signin')
    }
    if (!response.ok) {
      throw new Error('An error occurred while fetching the data.')
    }
    return response.json()
  }

  const { data: ordersData, error } = useSWR(
    session ? `/api/orders/mine?page=${page}&limit=15` : null,
    fetchOrders
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
    }
  }, [status, router])

  if (!mounted || status === 'loading') return <></>

  if (error) return 'Wystąpił błąd.'
  if (!ordersData) return 'Ładowanie...'

  const { orders, totalPages } = ordersData

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1)
  }

  return (
    <div className="overflow-x-auto p-4 dark:bg-gray-800 dark:text-gray-200">
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="dark:bg-gray-700">
            <th className="border border-gray-400 px-4 py-2 dark:border-gray-600">ID</th>
            <th className="border border-gray-400 px-4 py-2 dark:border-gray-600">DATA</th>
            <th className="border border-gray-400 px-4 py-2 dark:border-gray-600">ŁĄCZNA KWOTA</th>
            <th className="border border-gray-400 px-4 py-2 dark:border-gray-600">OPŁACONE</th>
            <th className="border border-gray-400 px-4 py-2 dark:border-gray-600">DOSTARCZONE</th>
            <th className="border border-gray-400 px-4 py-2 dark:border-gray-600">AKCJA</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: Order) => (
            <tr key={order._id} className="dark:bg-gray-700">
              <td className="border border-gray-400 px-4 py-2 dark:border-gray-600">{order._id.substring(20, 24)}</td>
              <td className="border border-gray-400 px-4 py-2 dark:border-gray-600">{order.createdAt.substring(0, 10)}</td>
              <td className="border border-gray-400 px-4 py-2 dark:border-gray-600">{order.totalPrice} PLN</td>
              <td className="border border-gray-400 px-4 py-2 dark:border-gray-600">
                {order.isPaid && order.paidAt
                  ? `${order.paidAt.substring(0, 10)}`
                  : 'nieopłacone'}
              </td>
              <td className="border border-gray-400 px-4 py-2 dark:border-gray-600">
                {order.isDelivered && order.deliveredAt
                  ? `${order.deliveredAt.substring(0, 10)}`
                  : 'niedostarczone'}
              </td>
              <td className="border border-gray-400 px-4 py-2 dark:border-gray-600">
                <Link href={`/order/${order._id}`} passHref>
                  <button className="btn btn-primary">
                    Szczegóły
                  </button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Poprzednia
        </button>
        <span className="dark:text-gray-200">Strona {page} z {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Następna
        </button>
      </div>
    </div>
  )
}
