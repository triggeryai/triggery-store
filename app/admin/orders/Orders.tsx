'use client'
import { useState } from 'react'
import { Order } from '@/lib/models/OrderModel'
import Link from 'next/link'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import toast from 'react-hot-toast'

export default function Orders() {
  const [page, setPage] = useState(1)
  const [mounted, setMounted] = useState(false)
  const { data: ordersData, error, mutate } = useSWR(`/api/admin/orders?page=${page}&limit=15`)
  const [showModal, setShowModal] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState(null)

  const { trigger: deleteOrder } = useSWRMutation(
    `/api/admin/orders`,
    async (url, { arg }: { arg: { orderId: string } }) => {
      const toastId = toast.loading('Deleting order...')
      const res = await fetch(`${url}/${arg.orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      setShowModal(false) // Hide modal after operation
      if (res.ok) {
        toast.success('Order deleted successfully', {
          id: toastId,
        })
        mutate() // Revalidate the orders data
      } else {
        toast.error(data.message, {
          id: toastId,
        })
      }
    }
  )

  if (error) return <p>An error has occurred.</p>
  if (!ordersData) return <p>Loading...</p>

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

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1)
  }

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1)
  }

  return (
    <div>
      <h1 className="py-4 text-2xl">Orders</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2"><div className="badge">ID</div></th>
              <th className="border px-4 py-2"><div className="badge">USER</div></th>
              <th className="border px-4 py-2"><div className="badge">DATE</div></th>
              <th className="border px-4 py-2"><div className="badge">TOTAL</div></th>
              <th className="border px-4 py-2"><div className="badge">PAID</div></th>
              <th className="border px-4 py-2"><div className="badge">DELIVERED</div></th>
              <th className="border px-4 py-2"><div className="badge">ACTION</div></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order: Order) => (
              <tr key={order._id}>
                <td className="border px-4 py-2">..{order._id.substring(20, 24)}</td>
                <td className="border px-4 py-2">{order.user?.name || 'Deleted user'}</td>
                <td className="border px-4 py-2">{order.createdAt.substring(0, 10)}</td>
                <td className="border px-4 py-2">${order.totalPrice}</td>
                <td className="border px-4 py-2">
                  {order.isPaid && order.paidAt
                    ? `${order.paidAt.substring(0, 10)}`
                    : 'not paid'}
                </td>
                <td className="border px-4 py-2">
                  {order.isDelivered && order.deliveredAt
                    ? `${order.deliveredAt.substring(0, 10)}`
                    : 'not delivered'}
                </td>
                <td className="border px-4 py-2">
                  <Link href={`/order/${order._id}`} passHref>
                    <button className="btn btn-primary">
                      Details
                    </button>
                  </Link>
                  &nbsp;
                  <button
                    onClick={() => handleDeleteOrderClick(order._id)}
                    type="button"
                    className="btn btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center items-center mt-4 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700">Page {page} of {totalPages}</span>
        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className="bg-blue-500 text-white py-2 px-4 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              Are you sure you want to delete this order?
            </h3>
            <div className="modal-action">
              <button onClick={confirmDelete} className="btn btn-error">
                Delete
              </button>
              <button onClick={() => setShowModal(false)} className="btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
