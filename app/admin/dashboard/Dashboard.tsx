'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Bar, Doughnut, Line } from 'react-chartjs-2'
import useSWR from 'swr'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement
)

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
  },
}

// Funkcja do formatowania liczb
function formatLargeNumbers(number) {
  if (Math.abs(number) >= 1.0e+9) {
    return (number / 1.0e+9).toFixed(1) + "B"; // Milardy
  } else if (Math.abs(number) >= 1.0e+6) {
    return (number / 1.0e+6).toFixed(1) + "M"; // Miliony
  } else if (Math.abs(number) >= 1.0e+3) {
    return (number / 1.0e+3).toFixed(1) + "K"; // Tysiące
  } else {
    return number; // Mniejsze liczby pozostają bez zmian
  }
}

const Dashboard = () => {
  const [period, setPeriod] = useState('monthly')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [year, setYear] = useState(new Date().getFullYear())

  const { data: summary, error } = useSWR(
    `/api/admin/orders/summary?period=${period}&startDate=${startDate}&endDate=${endDate}&year=${year}`
  )

  if (error) return error.message

  // Zmieniamy prosty tekst "Ładowanie..." na duży loader
  if (!summary)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-700">Loading...</h2>
        </div>
      </div>
    )

  const handlePeriodChange = (e) => {
    setPeriod(e.target.value)
    setStartDate('')
    setEndDate('')
    setYear(new Date().getFullYear())
  }

  const salesData = {
    labels: summary.salesData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        fill: true,
        label: 'Sprzedaż',
        data: summary.salesData.map(
          (x: { totalSales: number }) => x.totalSales
        ),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }
  const ordersData = {
    labels: summary.salesData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        fill: true,
        label: 'Zamówienia',
        data: summary.salesData.map(
          (x: { totalOrders: number }) => x.totalOrders
        ),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }
  const productsData = {
    labels: summary.productsData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        label: 'Kategoria',
        data: summary.productsData.map(
          (x: { totalProducts: number }) => x.totalProducts
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
      },
    ],
  }
  const usersData = {
    labels: summary.usersData.map((x: { _id: string }) => x._id),
    datasets: [
      {
        label: 'Użytkownicy',
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        data: summary.usersData.map(
          (x: { totalUsers: number }) => x.totalUsers
        ),
      },
    ],
  }

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-2 sm:mb-0">Dashboard</h1>
        <div className="flex flex-col sm:flex-row items-center">
          <label htmlFor="period" className="mr-2">Wybierz okres:</label>
          <select
            id="period"
            value={period}
            onChange={handlePeriodChange}
            className="p-2 border rounded mb-2 sm:mb-0"
          >
            <option value="daily">Dzienny</option>
            <option value="weekly">Tygodniowy</option>
            <option value="monthly">Miesięczny</option>
            <option value="yearly">Roczny</option>
          </select>
          {period === 'daily' && (
            <div className="flex items-center mt-2 sm:mt-0">
              <label htmlFor="startDate" className="mr-2">Od:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 border rounded mr-2"
              />
              <label htmlFor="endDate" className="mr-2">Do:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
          )}
          {(period === 'monthly' || period === 'yearly') && (
            <div className="mt-2 sm:mt-0 sm:ml-4">
              <label htmlFor="year" className="mr-2">Wybierz rok:</label>
              <select
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="p-2 border rounded"
              >
                {Array.from(new Array(10), (_, i) => {
                  const y = new Date().getFullYear() - i;
                  return <option key={y} value={y}>{y}</option>
                })}
              </select>
            </div>
          )}
        </div>
      </div>

      <div className="my-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="stat">
          <div className="stat-title">Sprzedaż</div>
          <div className="stat-value text-primary">
            PLN {formatLargeNumbers(summary.ordersPrice)}
          </div>
          <div className="stat-desc">
            <Link href="/admin/orders">Zobacz sprzedaż</Link>
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Zamówienia</div>
          <div className="stat-value text-primary">{formatLargeNumbers(summary.ordersCount)}</div>
          <div className="stat-desc">
            <Link href="/admin/orders">Zobacz zamówienia</Link>
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Produkty</div>
          <div className="stat-value text-primary">{formatLargeNumbers(summary.productsCount)}</div>
          <div className="stat-desc">
            <Link href="/admin/products">Zobacz produkty</Link>
          </div>
        </div>
        <div className="stat">
          <div className="stat-title">Użytkownicy</div>
          <div className="stat-value text-primary">{formatLargeNumbers(summary.usersCount)}</div>
          <div className="stat-desc">
            <Link href="/admin/users">Zobacz użytkowników</Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl py-2">Raport sprzedaży</h2>
          <div className="h-60">
            <Line data={salesData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div>
          <h2 className="text-xl py-2">Raport zamówień</h2>
          <div className="h-60">
            <Line data={ordersData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl py-2">Raport produktów</h2>
          <div className="flex items-center justify-center h-60 w-full">
            <Doughnut data={productsData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div>
          <h2 className="text-xl py-2">Raport użytkowników</h2>
          <div className="h-60">
            <Bar data={usersData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
 