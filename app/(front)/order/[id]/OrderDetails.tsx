'use client'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { OrderItem } from '@/lib/models/OrderModel'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { useEffect, useState } from 'react'
import Select from 'react-select'
import Image from 'next/image'
import confetti from 'canvas-confetti';

export default function OrderDetails({
  orderId,
  paypalClientId,
}: {
  orderId: string
  paypalClientId: string
}) {
  const { trigger: deliverOrder, isMutating: isDelivering } = useSWRMutation(
    `/api/orders/${orderId}`,
    async (url) => {
      const res = await fetch(`/api/admin/orders/${orderId}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      res.ok
        ? toast.success('Zamówienie dostarczone pomyślnie')
        : toast.error(data.message)
    }
  )

  const { data, error } = useSWR(`/api/orders/${orderId}`)
  const { data: bankAccountData } = useSWR('/api/admin/payments')
  const { data: taxData } = useSWR('/api/admin/tax')
  const { data: shippingData } = useSWR('/api/shipping')

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('')
  const [bankAccount, setBankAccount] = useState('1234 1234 1234 1234 1234 1234 1234')

  useEffect(() => {
    if (data && data.paymentMethod) {
      setSelectedPaymentMethod(data.paymentMethod)
    }
  }, [data])

  useEffect(() => {
    if (bankAccountData) {
      setBankAccount(bankAccountData.accountNumber)
    }
  }, [bankAccountData])

  useEffect(() => {
    if (shippingData && data && data.shippingAddress) {
      const selectedOption = shippingData.find(option => option.value === data.shippingAddress.shippingMethod)
      if (selectedOption) {
        data.shippingPrice = selectedOption.price
        data.totalPrice = data.itemsPrice + data.shippingPrice + data.taxPrice
      }
    }
  }, [shippingData, data])

  const handlePaymentMethodChange = (selectedOption) => {
    setSelectedPaymentMethod(selectedOption.value)
    updatePaymentMethodInDatabase(selectedOption.value)
  }

  const updatePaymentMethodInDatabase = async (newPaymentMethod) => {
    if (!newPaymentMethod) {
      toast.error('Nie wybrano metody płatności')
      return
    }
    try {
      const response = await fetch(`/api/orders/${orderId}/update-payment-method`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentMethod: newPaymentMethod }),
      })

      const data = await response.json()
      if (response.ok) {
        toast.success(`Metoda płatności zaktualizowana pomyślnie na ${newPaymentMethod}`)
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        toast.error(data.message || 'Nie udało się zaktualizować metody płatności')
      }
    } catch (error) {
      toast.error('Błąd sieci podczas próby aktualizacji metody płatności')
      console.error('Network error:', error)
    }
  }

  const { trigger: undeliverOrder, isMutating: isUndelivering } = useSWRMutation(
    `/api/admin/orders/${orderId}/undeliver`,
    async (url) => {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      res.ok
        ? toast.success('Zamówienie oznaczone jako niedostarczone')
        : toast.error(data.message)
    }
  )

  const { trigger: markOrderAsUnpaid, isMutating: isMarkingUnpaid } = useSWRMutation(
    `/api/admin/orders/${orderId}/unpaid`,
    async (url) => {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await res.json()
      if (res.ok) {
        toast.success('Zamówienie oznaczone jako nieopłacone')
        window.location.reload()
      } else {
        toast.error(data.message)
      }
    }
  )

  const [stripeSessionUrl, setStripeSessionUrl] = useState(null)

  const createStripeSession = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}/create-stripe-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const session = await response.json()
      if (response.ok) {
        setStripeSessionUrl(session.url)
      } else {
        toast.error('Nie udało się zainicjować płatności Stripe: ' + session.message)
      }
    } catch (error) {
      toast.error('Wystąpił błąd sieci podczas łączenia z bramką płatności.')
    }
  }

  useEffect(() => {
    if (stripeSessionUrl) {
      window.location.href = stripeSessionUrl
    }
  }, [stripeSessionUrl])

  const { data: session } = useSession()

  function createPayPalOrder() {
    return fetch(`/api/orders/${orderId}/create-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((order) => order.id)
  }

  function onApprovePayPalOrder(data: any) {
    return fetch(`/api/orders/${orderId}/capture-paypal-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((orderData) => {
        toast.success('Zamówienie opłacone pomyślnie')
      })
  }

  function markOrderAsPaid() {
    fetch(`/api/admin/orders/${orderId}/pay`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        toast.success('Zamówienie oznaczone jako opłacone pomyślnie')
        window.location.reload()
      })
      .catch((error) => {
        toast.error('Nie udało się oznaczyć zamówienia jako opłacone')
      })
  }

  const handleConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('success')) {
      handleConfetti();
      markOrderAsPaid();
    }
  }, []);

  if (error) return error.message
  if (!data) return 'Ładowanie...'
  if (!taxData) return 'Ładowanie ustawień podatkowych...'
  if (!shippingData) return 'Ładowanie opcji wysyłki...'

  const {
    paymentMethod,
    shippingAddress,
    items,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isDelivered,
    deliveredAt,
    isPaid,
    paidAt,
  } = data

  const shippingMethod = shippingAddress.shippingMethod
  const selectedPaczkomat = JSON.parse(shippingAddress.selectedPaczkomat || '{}')
  const selectedPocztex = shippingAddress.selectedPocztex

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
    toast.success('Skopiowano do schowka')
  }

  return (
    <div>
      <h1 className="text-2xl py-4">Zamówienie {orderId}</h1>
      <div className="grid md:grid-cols-4 md:gap-5 my-4">
        <div className="md:col-span-3">
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Adres dostawy</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}{' '}
              </p>
              <p>
                Metoda wysyłki: {shippingMethod} - PLN {shippingPrice}
              </p>
              {shippingMethod === 'Inpost Paczkomat' && selectedPaczkomat && (
                <p>Wybrany Paczkomat: {selectedPaczkomat.name}</p>
              )}

              {shippingMethod === 'Pocztex Poczta Odbior Punkt' && selectedPocztex && (
                <p>Wybrany punkt Pocztex: {selectedPocztex}</p>
              )}
              {isDelivered ? (
                <div className="text-success">Dostarczono {deliveredAt}</div>
              ) : (
                <div className="text-error">Niedostarczone</div>
              )}
            </div>
          </div>

          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Metoda płatności</h2>
              {!isPaid && (
                <Select
                  defaultValue={{ label: getLabelForPaymentMethod(paymentMethod), value: paymentMethod }}
                  onChange={handlePaymentMethodChange}
                  options={[
                    { label: 'PayPal', value: 'PayPal' },
                    { label: 'Płatność Stripe - Przelewy24 / Blik / Karta', value: 'Stripe' },
                    { label: 'Za pobraniem', value: 'CashOnDelivery' },
                    { label: 'Przelew bankowy na konto', value: 'DirectBankTransferToAccount' },
                  ]}
                  className="text-black"
                />
              )}
              {isPaid ? (
                <div className="text-success">Opłacone {paidAt}</div>
              ) : (
                <div className="text-error">Nieopłacone</div>
              )}
            </div>
          </div>

          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Przedmioty</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Przedmiot</th>
                    <th>Ilość</th>
                    <th>Cena</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item: OrderItem) => (
                    <tr key={item.slug}>
                      <td>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center"
                        >
                          {item.mainImage && (
                            <Image
                              src={item.mainImage}
                              alt={item.name}
                              width={50}
                              height={50}
                              className="object-cover"
                            />
                          )}
                          <span className="px-2">
                            {item.name} ({item.color} {item.size})
                          </span>
                        </Link>
                      </td>
                      <td>{item.qty}</td>
                      <td>{item.price} PLN</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Podsumowanie zamówienia</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Przedmioty</div>
                    <div>{itemsPrice} PLN</div>
                  </div>
                </li>
                {taxData.isActive && (
                  <li>
                    <div className="mb-2 flex justify-between">
                      <div>Podatek</div>
                      <div>{taxPrice} PLN</div>
                    </div>
                  </li>
                )}
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Wysyłka</div>
                    <div>{shippingPrice} PLN</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Łącznie</div>
                    <div>{taxData.isActive ? totalPrice : itemsPrice + shippingPrice} PLN</div>
                  </div>
                </li>
                {paymentMethod === 'DirectBankTransferToAccount' && !isPaid && (
                  <li>
                    <div className="mb-4 p-4 border rounded-lg bg-gray-100">
                      <div className="font-bold text-lg mb-2">Przelej pieniądze tutaj:</div>
                      <div className="flex flex-col space-y-1">
                        <div className="break-all">
                          <span className="font-semibold">Tytuł przelewu:</span>
                          <span
                            className="text-blue-600 ml-2 cursor-pointer"
                            onClick={() => copyToClipboard(orderId)}
                          >
                            {orderId}
                          </span>
                        </div>
                        <div className="break-all">
                          <span className="font-semibold">Numer konta:</span>
                          <span
                            className="text-blue-600 ml-2 cursor-pointer break-all"
                            onClick={() => copyToClipboard(bankAccount)}
                          >
                            {bankAccount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                )}
                {!isPaid && (
                  <li>
                    {paymentMethod === 'PayPal' ? (
                      <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                        <PayPalButtons createOrder={createPayPalOrder} onApprove={onApprovePayPalOrder} />
                      </PayPalScriptProvider>
                    ) : paymentMethod === 'Stripe' ? (
                      <button onClick={createStripeSession} className="btn btn-primary w-full my-2">
                        Zapłać
                      </button>
                    ) : null}
                  </li>
                )}
                {session?.user.isAdmin && (
                  <li>
                    {isDelivered ? (
                      <button
                        className="btn w-full my-2"
                        onClick={() => undeliverOrder()}
                        disabled={isUndelivering}
                      >
                        {isUndelivering && <span className="loading loading-spinner"></span>}
                        Oznacz jako niedostarczone
                      </button>
                    ) : (
                      <button
                        className="btn w-full my-2"
                        onClick={() => deliverOrder()}
                        disabled={isDelivering}
                      >
                        {isDelivering && <span className="loading loading-spinner"></span>}
                        Oznacz jako dostarczone
                      </button>
                    )}
                  </li>
                )}
                {session?.user.isAdmin && (
                  <ul>
                    {isPaid ? (
                      <li>
                        <button
                          className="btn btn-warning w-full my-2"
                          onClick={() => markOrderAsUnpaid()}
                          disabled={isMarkingUnpaid}
                        >
                          {isMarkingUnpaid ? 'Przetwarzanie...' : 'Oznacz jako nieopłacone'}
                        </button>
                      </li>
                    ) : (
                      <li>
                        <button className="btn btn-success w-full my-2" onClick={markOrderAsPaid}>
                          Oznacz jako opłacone
                        </button>
                      </li>
                    )}
                  </ul>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Helper function to get label for payment method
const getLabelForPaymentMethod = (value) => {
  const options = [
    { label: 'PayPal', value: 'PayPal' },
    { label: 'Płatność Stripe - Przelewy24 / Blik / Karta', value: 'Stripe' },
    { label: 'Za pobraniem', value: 'CashOnDelivery' },
    { label: 'Przelew bankowy na konto', value: 'DirectBankTransferToAccount' },
  ];
  const selectedOption = options.find(option => option.value === value);
  return selectedOption ? selectedOption.label : value;
}
