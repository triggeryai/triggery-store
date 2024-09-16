'use client'
import { useState, useEffect } from 'react'
import { Order } from '@/lib/models/OrderModel'
import Link from 'next/link'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import toast from 'react-hot-toast'

export default function Orders() {
  const [page, setPage] = useState(1)
  const { data: ordersData, error, mutate } = useSWR(`/api/admin/orders?page=${page}&limit=15`)
  const [showModal, setShowModal] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState(null)

  const { trigger: deleteOrder } = useSWRMutation(
    `/api/admin/orders`,
    async (url, { arg }: { arg: { orderId: string } }) => {
      const toastId = toast.loading('Usuwanie zamówienia...')
      const res = await fetch(`${url}/${arg.orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      setShowModal(false)
      if (res.ok) {
        toast.success('Zamówienie pomyślnie usunięte', {
          id: toastId,
        })
        mutate()
      } else {
        toast.error(data.message, {
          id: toastId,
        })
      }
    }
  )

  if (error) return <p>Wystąpił błąd.</p>

  // Zmieniamy tekst "Ładowanie..." na ładny spinner
  if (!ordersData)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    )

  const { orders, totalPages } = ordersData

  const handleDeleteOrderClick = (orderId: string) => {
    setOrderToDelete(orderId)
    setShowModal(true)
  }

  const confirmDelete = () => {
    if (orderToDelete) {
      deleteOrder({ orderId: orderToDelete })
    }
  }

  const handlePageClick = (pageNumber: number) => {
    setPage(pageNumber)
  }

  const generatePageNumbers = () => {
    const pageNumbers = []
    const maxPageButtons = 5
    const startPage = Math.max(1, page - 2)
    const endPage = Math.min(totalPages, page + 2)

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  return (
    <div className="p-4">
      <h1 className="py-4 text-2xl">Zamówienia</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse hidden md:table">
          <thead>
            <tr>
              <th className="border px-4 py-2"><div className="badge">ID</div></th>
              <th className="border px-4 py-2"><div className="badge">UŻYTKOWNIK</div></th>
              <th className="border px-4 py-2"><div className="badge">DATA</div></th>
              <th className="border px-4 py-2"><div className="badge">ŁĄCZNIE</div></th>
              <th className="border px-4 py-2"><div className="badge">OPŁACONE</div></th>
              <th className="border px-4 py-2"><div className="badge">DOSTARCZONE</div></th>
              <th className="border px-4 py-2"><div className="badge">AKCJA</div></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: Order) => (
              <tr key={order._id}>
                <td className="border px-4 py-2">..{order._id.substring(20, 24)}</td>
                <td className="border px-4 py-2">{order.user?.name || 'Usunięty użytkownik'}</td>
                <td className="border px-4 py-2">{order.createdAt.substring(0, 10)}</td>
                <td className="border px-4 py-2">{order.totalPrice} PLN</td>
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
                    <button className="btn btn-primary btn-sm">
                      Szczegóły
                    </button>
                  </Link>
                  &nbsp;
                  <button
                    onClick={() => handleDeleteOrderClick(order._id)}
                    type="button"
                    className="btn btn-error btn-sm"
                  >
                    Usuń
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile view */}
        <div className="md:hidden">
          {orders.map((order: Order) => (
            <div key={order._id} className="mb-4 p-4 rounded-lg border">
              <p><strong>ID:</strong> ..{order._id.substring(20, 24)}</p>
              <p><strong>Użytkownik:</strong> {order.user?.name || 'Usunięty użytkownik'}</p>
              <p><strong>Data:</strong> {order.createdAt.substring(0, 10)}</p>
              <p><strong>Łącznie:</strong> {order.totalPrice} PLN</p>
              <p><strong>Opłacone:</strong> {order.isPaid && order.paidAt ? `${order.paidAt.substring(0, 10)}` : 'nieopłacone'}</p>
              <p><strong>Dostarczone:</strong> {order.isDelivered && order.deliveredAt ? `${order.deliveredAt.substring(0, 10)}` : 'niedostarczone'}</p>
              <div className="flex flex-col items-center mt-4 space-y-2">
                <Link href={`/order/${order._id}`} passHref>
                  <button className="btn btn-primary w-full max-w-xs">Szczegóły</button>
                </Link>
                <button
                  onClick={() => handleDeleteOrderClick(order._id)}
                  type="button"
                  className="btn btn-error w-full max-w-xs"
                >
                  Usuń
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center mt-4 space-x-2 flex-wrap">
        <button
          onClick={() => handlePageClick(page - 1)}
          disabled={page === 1}
          className="bg-blue-500 text-white py-1 px-3 sm:py-2 sm:px-4 rounded disabled:opacity-50"
        >
          Poprzednia
        </button>
        {generatePageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => handlePageClick(pageNumber)}
            className={`px-3 py-1 sm:px-4 sm:py-2 rounded ${page === pageNumber ? 'bg-blue-700 text-white' : 'bg-blue-500 text-white'}`}
          >
            {pageNumber}
          </button>
        ))}
        <button
          onClick={() => handlePageClick(page + 1)}
          disabled={page === totalPages}
          className="bg-blue-500 text-white py-1 px-3 sm:py-2 sm:px-4 rounded disabled:opacity-50"
        >
          Następna
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Czy na pewno chcesz usunąć to zamówienie?
            </h3>
            <div className="modal-action">
              <button onClick={confirmDelete} className="btn btn-error">
                Usuń
              </button>
              <button onClick={() => setShowModal(false)} className="btn">
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
