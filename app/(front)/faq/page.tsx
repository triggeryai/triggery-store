import { Metadata } from 'next'
import FaqDetails from './FaqDetails'

export const metadata: Metadata = {
  title: 'Faq',
}
export default function OrderHistory() {
  return (
    <>
      <h1 className="text-2xl py-2">FAQ</h1>
      <FaqDetails />
    </>
  )
}
