// components/products/AddToCartGoCart.tsx
'use client'
import useCartService from '@/lib/hooks/useCartStore'
import { OrderItem } from '@/lib/models/OrderModel'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

export default function AddToCartGoCart({ item }: { item: OrderItem }) {
  const router = useRouter()
  const { items, increase, decrease } = useCartService()
  const [existItem, setExistItem] = useState<OrderItem | undefined>()

  useEffect(() => {
    setExistItem(items.find((x) => x.slug === item.slug))
  }, [item, items])

  const addToCartHandler = () => {
    if (item.countInStock > 0) {
      increase(item)
      toast.success('Produkt dodany do koszyka!') // Display success toast
    } else {
      toast.error('Ten produkt jest niedostępny i nie może zostać dodany do koszyka.')
    }
  }

  const decreaseHandler = (item: OrderItem) => {
    decrease(item)
    toast.success('Produkt usunięty z koszyka!') // Display success toast
  }

  const goToCartHandler = () => {
    router.push('/cart') // Use Next.js router to redirect to the cart page
  }

  const isDisabled = item.countInStock <= 0;  // Check if the item is out of stock

  return existItem && existItem.qty > 0 ? (
    <div>
      <button className="btn" type="button" onClick={() => decreaseHandler(existItem)}>
        -
      </button>
      <span className="px-2">{existItem.qty}</span>
      <button className="btn" type="button" onClick={() => {
        if (existItem.countInStock > existItem.qty) {
          increase(existItem)
          toast.success('Produkt dodany do koszyka!') // Display success toast
        } else {
          toast.error('Brak dostępnego zapasu.')
        }
      }}>
        +
      </button>
      <button className="btn btn-secondary ml-2" type="button" onClick={goToCartHandler}>
        Idź do koszyka
      </button>
    </div>
  ) : (
    <button
      className="btn btn-primary w-full"
      type="button"
      onClick={addToCartHandler}
      disabled={isDisabled}  // Disable the button if the item is out of stock
    >
      {isDisabled ? 'Brak produktu' : 'Dodaj do koszyka'}
    </button>
  )
}
