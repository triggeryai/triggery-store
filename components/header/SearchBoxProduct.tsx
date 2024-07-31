// next-amazona-v2/components/header/SearchBoxProduct.tsx
'use client'
import { useState } from 'react'

export const SearchBox = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="join">
        <input
          className="join-item input input-bordered w-48"
          placeholder="Szukaj"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          name="q"
        />
        <button type="submit" className="join-item btn">Szukaj</button>
      </div>
    </form>
  )
}
