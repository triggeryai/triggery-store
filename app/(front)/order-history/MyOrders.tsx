'use client'

import { Order } from '@/lib/models/OrderModel'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import useSWR from 'swr'

export default function MyOrders() {
  const router = useRouter()
  const [page, setPage] = useState(1)
  const [mounted, setMounted] = useState(false)
  const { data: ordersData, error } = useSWR(`/api/orders/mine?page=${page}&limit=15`)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <></>

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
    <div className="overflow-x-auto p-4">
      <table className="table-auto w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">DATA</th>
            <th className="border px-4 py-2">ŁĄCZNA KWOTA</th>
            <th className="border px-4 py-2">OPŁACONE</th>
            <th className="border px-4 py-2">DOSTARCZONE</th>
            <th className="border px-4 py-2">AKCJA</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order: Order) => (
            <tr key={order._id}>
              <td className="border px-4 py-2">{order._id.substring(20, 24)}</td>
              <td className="border px-4 py-2">{order.createdAt.substring(0, 10)}</td>
              <td className="border px-4 py-2">${order.totalPrice}</td>
              <td className="border px-4 py-2">
                {order.isPaid && order.paidAt
                  ? `${order.paidAt.substring(0, 10)}`
                  : 'nieopłacone'}
              </td>
              <td className="border px-4 py-2">
                {order.isDelivered && order.deliveredAt
                  ? `${order.deliveredAt.substring(0, 10)}`
                  : 'niedostarczone'}
              </td>
              <td className="border px-4 py-2">
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
        <span className="text-gray-700">Strona {page} z {totalPages}</span>
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
