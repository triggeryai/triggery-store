// app(front)/signin/Form.tsx
'use client'
import { signIn, useSession } from 'next-auth/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import toast from 'react-hot-toast'

type Inputs = {
  email: string
  password: string
}

const Form = () => {
  const { data: session } = useSession()

  const params = useSearchParams()
  let callbackUrl = params.get('callbackUrl') || '/'
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (session && session.user) {
      // Wyświetl confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      // Wyświetl powiadomienie toast
      toast.success('Logged in successfully!')

      // Przekierowanie
      router.push(callbackUrl)
    }
  }, [callbackUrl, params, router, session])

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { email, password } = form
    signIn('credentials', {
      email,
      password,
    })
  }

  return (
    <div className="max-w-sm mx-auto card bg-base-300 my-5 p-5">
      <div className="card-body">
        <h1 className="card-title text-center mb-4">Sign in</h1>
        {params.get('error') && (
          <div className="alert text-error mb-4">
            {params.get('error') === 'CredentialsSignin'
              ? 'Invalid email or password'
              : params.get('error')}
          </div>
        )}
        {params.get('success') && (
          <div className="alert text-success mb-4">{params.get('success')}</div>
        )}
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="my-2">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              type="text"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                  message: 'Email is invalid',
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
              Password
            </label>
            <input
              type="password"
              id="password"
              {...register('password', {
                required: 'Password is required',
              })}
              className="input input-bordered w-full max-w-sm"
            />
            {errors.password?.message && (
              <div className="text-error">{errors.password.message}</div>
            )}
          </div>
          <div className="my-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting && (
                <span className="loading loading-spinner"></span>
              )}
              Sign in
            </button>
          </div>
        </form>
        <div className="my-2 text-center">
          Need an account?{' '}
          <Link className="link" href={`/register?callbackUrl=${callbackUrl}`}>
            Register
          </Link>
        </div>
        <div className="my-2 text-center">
          Forgot password?{' '}
          <Link className="link" href={`/reset-password`}>
            Remind password
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Form
