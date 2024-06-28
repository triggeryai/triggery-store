// components/products/ActivationModal.tsx
import React from 'react'
import { useRouter } from 'next/navigation'

const ActivationModal = ({ onClose }: { onClose: () => void }) => {
  const router = useRouter()

  const handleClose = () => {
    onClose()
    router.push('/signin')
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-xl font-bold mb-4">Rejestracja zakończona!</h2>
        <p className="mb-4">Aby aktywować konto, kliknij w link aktywacyjny wysłany na Twój adres email.</p>
        <button
          onClick={handleClose}
          className="btn btn-primary w-full"
        >
          OK
        </button>
      </div>
    </div>
  )
}

export default ActivationModal
