'use client'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import confetti from 'canvas-confetti'
import ActivationModal from '@/components/ActivationModal'

type Inputs = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const Form = () => {
  const { data: session } = useSession()
  const [showModal, setShowModal] = useState(false)

  const params = useSearchParams()
  const router = useRouter()
  let callbackUrl = params.get('callbackUrl') || '/'
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (session && session.user) {
      router.push(callbackUrl)
    }
  }, [callbackUrl, params, router, session])

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { name, email, password } = form

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })
      if (res.ok) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
        toast.success('Rejestracja zakończona sukcesem! Sprawdź email aby aktywować konto.')
        setShowModal(true)
      } else {
        const data = await res.json()
        throw new Error(data.message)
      }
    } catch (err: any) {
      const error =
        err.message && err.message.indexOf('E11000') === 0
          ? 'Email jest już używany'
          : err.message
      toast.error(error || 'error')
    }
  }

  return (
    <>
      <div className="max-w-sm mx-auto card bg-base-300 my-4">
        <div className="card-body">
          <h1 className="card-title">Rejestracja</h1>
          <form onSubmit={handleSubmit(formSubmit)}>
            <div className="my-2">
              <label className="label" htmlFor="name">
                Imię
              </label>
              <input
                type="text"
                id="name"
                {...register('name', {
                  required: 'Imię jest wymagane',
                })}
                className="input input-bordered w-full max-w-sm"
              />
              {errors.name?.message && (
                <div className="text-error">{errors.name.message}</div>
              )}
            </div>
            <div className="my-2">
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                type="text"
                id="email"
                {...register('email', {
                  required: 'Email jest wymagany',
                  pattern: {
                    value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                    message: 'Nieprawidłowy email',
                  },
                })}
                className="input input-bordered w-full max-w-sm"
              />
              {errors.email?.message && (
                <div className="text-error">{errors.email.message}</div>
              )}
            </div>
            <div className="my-2">
              <label className="label" htmlFor="password">
                Hasło
              </label>
              <input
                type="password"
                id="password"
                {...register('password', {
                  required: 'Hasło jest wymagane',
                })}
                className="input input-bordered w-full max-w-sm"
              />
              {errors.password?.message && (
                <div className="text-error">{errors.password.message}</div>
              )}
            </div>
            <div className="my-2">
              <label className="label" htmlFor="confirmPassword">
                Potwierdź Hasło
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register('confirmPassword', {
                  required: 'Potwierdzenie hasła jest wymagane',
                  validate: (value) => {
                    const { password } = getValues()
                    return password === value || 'Hasła muszą być takie same!'
                  },
                })}
                className="input input-bordered w-full max-w-sm"
              />
              {errors.confirmPassword?.message && (
                <div className="text-error">{errors.confirmPassword.message}</div>
              )}
            </div>
            <div className="my-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary w-full"
              >
                {isSubmitting && (
                  <span className="loading loading-spinner"></span>
                )}
                Zarejestruj się
              </button>
            </div>
          </form>

          <div className="divider"> </div>
          <div>
            Masz już konto?{' '}
            <Link className="link" href={`/signin?callbackUrl=${callbackUrl}`}>
              Zaloguj się
            </Link>
          </div>
        </div>
      </div>
      {showModal && (
        <ActivationModal onClose={() => router.push(`/signin?callbackUrl=${callbackUrl}`)} />
      )}
    </>
  )
}

export default Form
