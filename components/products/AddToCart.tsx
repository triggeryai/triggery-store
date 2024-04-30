'use client'
import useCartService from '@/lib/hooks/useCartStore'
import { OrderItem } from '@/lib/models/OrderModel'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

export default function AddToCart({ item }: { item: OrderItem }) {
  const router = useRouter()
  const { items, increase, decrease } = useCartService()
  const [existItem, setExistItem] = useState<OrderItem | undefined>()

  useEffect(() => {
    setExistItem(items.find((x) => x.slug === item.slug))
  }, [item, items])

  const addToCartHandler = () => {
    if (item.countInStock > 0) {
      increase(item)
    } else {
      toast.error('This product is out of stock and cannot be added to the cart.')
    }
  }

  const isDisabled = item.countInStock <= 0;  // Check if the item is out of stock

  return existItem ? (
    <div>
      <button className="btn" type="button" onClick={() => decrease(existItem)}>
        -
      </button>
      <span className="px-2">{existItem.qty}</span>
      <button className="btn" type="button" onClick={() => {
        if (existItem.countInStock > existItem.qty) {
          increase(existItem)
        } else {
          toast.error('No more stock available.')
        }
      }}>
        +
      </button>
    </div>
  ) : (
    <button
      className="btn btn-primary w-full"
      type="button"
      onClick={addToCartHandler}
      disabled={isDisabled}  // Disable the button if the item is out of stock
    >
      {isDisabled ? 'Lack of Products' : 'Add to cart'}
    </button>
  )
}
