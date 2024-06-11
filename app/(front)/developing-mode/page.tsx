// app\(front)\developing-mode\page.tsx
import { Metadata } from 'next'
import Form from './DevelopingMode'

export const metadata: Metadata = {
  title: 'Developing Mode',
}

export default async function DevelopingPage() {
  return <Form />
}
