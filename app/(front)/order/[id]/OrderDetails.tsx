// app\(front)\order\[id]\OrderDetails.tsx
'use client'
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'
import { OrderItem } from '@/lib/models/OrderModel'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import toast from 'react-hot-toast'
import useSWR from 'swr'
import useSWRMutation from 'swr/mutation'
import { useEffect, useState } from 'react'
import Select from 'react-select';

export default function OrderDetails({
  orderId,
  paypalClientId,
}: {
  orderId: string
  paypalClientId: string
}) {

  console.log("Order ID on entry:", orderId); // Log przy wejściu do komponentu
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
        ? toast.success('Order delivered successfully')
        : toast.error(data.message)
    }
  )
  const { data, error } = useSWR(`/api/orders/${orderId}`)

  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

  useEffect(() => {
    if (data && data.paymentMethod) {
      console.log("Loaded payment method from data:", data.paymentMethod);
      setSelectedPaymentMethod(data.paymentMethod);
    }
}, [data]);

  const handlePaymentMethodChange = (selectedOption) => {
    console.log("Selected payment method:", selectedOption.value);
    console.log("Current state before update:", selectedPaymentMethod);
    setSelectedPaymentMethod(selectedOption.value);
    console.log("New state after update:", selectedOption.value); // Stan zmieni się asynchronicznie
    updatePaymentMethodInDatabase(selectedOption.value);
};

  

const updatePaymentMethodInDatabase = async (newPaymentMethod) => {
  console.log("Order ID before sending request:", orderId); // Log before sending the request
  console.log("Value before sending:", newPaymentMethod);
  const payload = JSON.stringify({ paymentMethod: newPaymentMethod });
  console.log("Sending paymentMethod update with payload:", payload);
  console.log("Value before sending:", newPaymentMethod);
  console.log("Sending paymentMethod update with value:", newPaymentMethod);
  if (!newPaymentMethod) {
      toast.error('No payment method selected');
      return;
  }
  try {
      const response = await fetch(`/api/orders/${orderId}/update-payment-method`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ paymentMethod: newPaymentMethod })
      });
      
      const data = await response.json();
      console.log("Response from server:", data);  // Server response to the update request
      if (response.ok) {
          toast.success('Payment method updated successfully');
          // Reload the page to reflect the updated data
          window.location.reload();
      } else {
          toast.error(data.message || 'Failed to update payment method');
      }
  } catch (error) {
      toast.error('Network error when trying to update payment method');
      console.error("Network error:", error);
  }
};


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
        ? toast.success('Order marked as not delivered')
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
      res.ok
        ? toast.success('Order marked as unpaid')
        : toast.error(data.message)
    }
  )
  const [stripeSessionUrl, setStripeSessionUrl] = useState(null);
  // Dodaj funkcję do inicjowania płatności Stripe


const createStripeSession = async () => {
  try {
    const response = await fetch(`/api/orders/${orderId}/create-stripe-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const session = await response.json();
    if (response.ok) {
      setStripeSessionUrl(session.url);
    } else {
      console.error('Failed to initiate Stripe payment:', session.message);
      toast.error('Could not initiate Stripe payment: ' + session.message);
    }
  } catch (error) {
    console.error('Network error when connecting to the payment gateway:', error);
    toast.error('There was a network error connecting to the payment gateway.');
  }
};



useEffect(() => {
  if (stripeSessionUrl) {
    window.location.href = stripeSessionUrl; // Przekieruj do Stripe
  }
}, [stripeSessionUrl]);

  const { data: session } = useSession()
  console.log(session)
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
        toast.success('Order paid successfully')
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
      toast.success('Order marked as paid successfully');
      // Możesz również odświeżyć dane zamówienia, aby UI odzwierciedlało zmianę
    })
    .catch((error) => {
      toast.error('Failed to mark order as paid');
    });
  }


  if (error) return error.message
  if (!data) return 'Loading...'

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

  return (
    <div>
      <h1 className="text-2xl py-4">Order {orderId}</h1>
      <div className="grid md:grid-cols-4 md:gap-5 my-4">
        <div className="md:col-span-3">
          <div className="card bg-base-300">
            <div className="card-body">
              <h2 className="card-title">Shipping Address</h2>
              <p>{shippingAddress.fullName}</p>
              <p>
                {shippingAddress.address}, {shippingAddress.city},{' '}
                {shippingAddress.postalCode}, {shippingAddress.country}{' '}
              </p>
              {isDelivered ? (
                <div className="text-success">Delivered at {deliveredAt}</div>
              ) : (
                <div className="text-error">Not Delivered</div>
              )}
            </div>
          </div>

          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Payment Method</h2>
              {!isPaid && (
                <Select
                  defaultValue={{ label: paymentMethod, value: paymentMethod }}
                  onChange={handlePaymentMethodChange}
                  options={[
                    { label: 'PayPal', value: 'PayPal' },
                    { label: 'Stripe', value: 'Stripe' },
                    { label: 'Cash On Delivery', value: 'CashOnDelivery' },
                  ]}
                />
                
              )}
              {isPaid ? (
                <div className="text-success">Paid at {paidAt}</div>
              ) : (
                <div className="text-error">Not Paid</div>
              )}
            </div>
          </div>

          <div className="card bg-base-300 mt-4">
            <div className="card-body">
              <h2 className="card-title">Items</h2>
              <table className="table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
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
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={50}
                            height={50}
                          ></Image>
                          <span className="px-2">
                            {item.name} ({item.color} {item.size})
                          </span>
                        </Link>
                      </td>
                      <td>{item.qty}</td>
                      <td>${item.price}</td>
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
              <h2 className="card-title">Order Summary</h2>
              <ul>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Items</div>
                    <div>${itemsPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Tax</div>
                    <div>${taxPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Shipping</div>
                    <div>${shippingPrice}</div>
                  </div>
                </li>
                <li>
                  <div className="mb-2 flex justify-between">
                    <div>Total</div>
                    <div>${totalPrice}</div>
                  </div>
                </li>

                {!isPaid && (
                  
                <li>
                  {paymentMethod === 'PayPal' ? (
                    <PayPalScriptProvider options={{ clientId: paypalClientId }}>
                      <PayPalButtons createOrder={createPayPalOrder} onApprove={onApprovePayPalOrder} />
                    </PayPalScriptProvider>
                  ) : paymentMethod === 'Stripe' ? (
                    <button onClick={createStripeSession} className="btn btn-primary w-full my-2">
                      Pay with Stripe
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
          {isUndelivering && (
            <span className="loading loading-spinner"></span>
          )}
          Mark as undelivered
        </button>
      ) : (
        <button
          className="btn w-full my-2"
          onClick={() => deliverOrder()}
          disabled={isDelivering}
        >
          {isDelivering && (
            <span className="loading loading-spinner"></span>
          )}
          Mark as delivered
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
                {isMarkingUnpaid ? 'Processing...' : 'Mark as Unpaid'}
              </button>
            </li>
          ) : (
            <li>
              <button
                className="btn btn-success w-full my-2"
                onClick={markOrderAsPaid}
              >
                Mark as Paid
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
