'use client'
import { useSearchParams } from 'next/navigation'

export const SearchBox = () => {
  const searchParams = useSearchParams()
  const q = searchParams.get('q') || ''

  return (
    <form action="/search?category=all" method="GET" className="w-full">
      <div className="join">
        <input
          className="join-item input input-bordered w-full md:w-48"
          placeholder="Szukaj"
          defaultValue={q}
          name="q"
        />
        <button className="join-item btn">Szukaj</button>
      </div>
    </form>
  )
}
