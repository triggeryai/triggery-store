// next-amazona-v2/app/(front)/signin/Form.tsx
'use client'
import { signIn, useSession } from 'next-auth/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import confetti from 'canvas-confetti'
import toast from 'react-hot-toast'

type Inputs = {
  email: string
  password: string
  captcha: string
}

const Form = () => {
  const { data: session } = useSession()

  const params = useSearchParams()
  let callbackUrl = params.get('callbackUrl') || '/'
  const router = useRouter()

  const [captchaNum1, setCaptchaNum1] = useState<number>(0);
  const [captchaNum2, setCaptchaNum2] = useState<number>(0);

  useEffect(() => {
    // Generate two random numbers between 1 and 10 for CAPTCHA
    setCaptchaNum1(Math.floor(Math.random() * 10) + 1);
    setCaptchaNum2(Math.floor(Math.random() * 10) + 1);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<Inputs>({
    defaultValues: {
      email: '',
      password: '',
      captcha: '',
    },
  })

  useEffect(() => {
    if (session && session.user) {
      // Display confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })

      // Display toast notification
      toast.success('Zalogowano pomyślnie!')

      // Redirect
      router.push(callbackUrl)
    }
  }, [callbackUrl, params, router, session])

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { email, password, captcha } = form

    // Check if the CAPTCHA is correct
    const captchaResult = parseInt(captcha);
    if (captchaResult !== captchaNum1 + captchaNum2) {
      setError('captcha', { type: 'manual', message: 'CAPTCHA jest nieprawidłowy' });
      return;
    }

    signIn('credentials', {
      email,
      password,
    })
  }

  return (
    <div className="max-w-sm mx-auto card bg-base-300 my-5 p-5">
      <div className="card-body">
        <h1 className="card-title text-center mb-4">Zaloguj się</h1>
        {params.get('error') && (
          <div className="alert text-error mb-4">
            {params.get('error') === 'CredentialsSignin'
              ? 'Nieprawidłowy email lub hasło'
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
            <label className="label">
              CAPTCHA
            </label>
            <div className="flex items-center">
              <span className="mr-2">{captchaNum1} + {captchaNum2} =</span>
              <input
                type="text"
                id="captcha"
                {...register('captcha', {
                  required: 'CAPTCHA jest wymagany',
                  pattern: {
                    value: /^\d+$/,
                    message: 'Wprowadzona wartość musi być liczbą',
                  },
                })}
                className="input input-bordered w-full max-w-sm"
              />
            </div>
            {errors.captcha && <p className="text-error">{errors.captcha.message}</p>}
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
              Zaloguj się
            </button>
          </div>
        </form>
        <div className="my-2 text-center">
         Nie masz konta?{' '}
          <Link className="link" href={`/register?callbackUrl=${callbackUrl}`}>
            Zarejestruj się
          </Link>
        </div>
        <div className="my-2 text-center">
          Zapomniałeś hasła?{' '}
          <Link className="link" href={`/reset-password`}>
            Przypomnij hasło
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Form
