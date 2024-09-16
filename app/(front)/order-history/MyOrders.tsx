'use client'
import { Order } from '@/lib/models/OrderModel';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';

export default function MyOrders() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [mounted, setMounted] = useState(false);

  const fetchOrders = async (url: string) => {
    const response = await fetch(url);
    if (response.status === 401) {
      router.push('/signin');
    }
    if (!response.ok) {
      throw new Error('An error occurred while fetching the data.');
    }
    const data = await response.json();
    return data;
  };

  const { data: ordersData, error } = useSWR(
    session ? `/api/orders/mine?page=${page}&limit=15` : null,
    fetchOrders
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
    }
  }, [status, router]);

  if (!mounted || status === 'loading') return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      <span className="ml-4 text-lg text-blue-500 font-semibold">Ładowanie...</span>
    </div>
  );

  if (error) return 'Wystąpił błąd.';

  if (!ordersData) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      <span className="ml-4 text-lg text-blue-500 font-semibold">Ładowanie zamówień...</span>
    </div>
  );

  const { orders, totalPages } = ordersData;

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="p-4 dark:bg-gray-800 dark:text-gray-200">
      <h2 className="text-2xl font-bold mb-4">Historia zamówień</h2>
      <div className="overflow-x-auto hidden md:block">
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
                <td className="border border-gray-400 px-4 py-2 dark:border-gray-600">
                  {order.totalPrice.toFixed(2)} PLN {/* Użyj totalPrice z bazy danych */}
                </td>
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
      </div>
      {/* Mobile View */}
      <div className="md:hidden">
        {orders.map((order: Order) => (
          <div key={order._id} className="mb-4 p-4 rounded-lg border dark:border-gray-600 dark:bg-gray-700">
            <p><strong>ID:</strong> {order._id.substring(20, 24)}</p>
            <p><strong>Data:</strong> {order.createdAt.substring(0, 10)}</p>
            <p><strong>Łączna kwota:</strong> {order.totalPrice.toFixed(2)} PLN</p> {/* Użyj totalPrice z bazy danych */}
            <p><strong>Opłacone:</strong> {order.isPaid && order.paidAt ? `${order.paidAt.substring(0, 10)}` : 'nieopłacone'}</p>
            <p><strong>Dostarczone:</strong> {order.isDelivered && order.deliveredAt ? `${order.deliveredAt.substring(0, 10)}` : 'niedostarczone'}</p>
            <div className="flex flex-col items-center mt-4 space-y-2">
              <Link href={`/order/${order._id}`} passHref>
                <button className="btn btn-primary w-full">Szczegóły</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
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
  );
}
