// components\ErrorModal.tsx
import React from 'react'

interface ErrorModalProps {
  error: string | null
  onClose: () => void
}

const ErrorModal: React.FC<ErrorModalProps> = ({ error, onClose }) => {
  if (!error) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded">
        <h2 className="text-xl font-bold">Błąd</h2>
        <p>{error}</p>
        <button onClick={onClose} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">
          Zamknij
        </button>
      </div>
    </div>
  )
}

export default ErrorModal
