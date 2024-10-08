// next-amazona-v2/app/(front)/profile/Form.tsx
'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

type Inputs = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

const Form = () => {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true) // Loading state for entire component

  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (session && session.user) {
      setValue('name', session.user.name!)
      setValue('email', session.user.email!)
    }
    setLoading(false) // Stop loading after session data is set
  }, [router, session, setValue])

  const formSubmit: SubmitHandler<Inputs> = async (form) => {
    const { name, email, password } = form;
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.status === 200) {
        toast.success('Profil został pomyślnie zaktualizowany');

        // Usuwamy signOut i signIn - nie będziemy już wylogowywać i ponownie logować użytkownika
        // Aktualizujemy sesję bez potrzeby ponownego logowania
        await update({
          ...session,
          user: {
            ...session?.user,
            name,
            email,
          },
        });

        // Przekierowanie użytkownika na stronę profilu
        router.push('/profile');
      } else if (res.status === 409) {
        toast.error('Email jest już używany przez innego użytkownika. Użyj innego emaila.');
      } else {
        const data = await res.json();
        toast.error(data.message || 'error');
      }
    } catch (err: any) {
      const error = err.response?.data?.message || err.message;
      toast.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
        <span className="ml-4 text-lg text-blue-500 font-semibold">Ładowanie...</span>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 rounded-lg shadow-lg">
      <div className="card-body">
        <h1 className="text-3xl font-bold mb-6 text-center">Profil</h1>
        <form onSubmit={handleSubmit(formSubmit)}>
          <div className="mb-4">
            <label className="block" htmlFor="name">
              Imię
            </label>
            <input
              type="text"
              id="name"
              {...register('name', {
                required: 'Imię jest wymagane',
              })}
              className="input input-bordered w-full mt-2 p-2 border rounded-lg"
            />
            {errors.name?.message && (
              <div className="text-red-600 mt-2">{errors.name.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="block" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email jest wymagany',
                pattern: {
                  value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                  message: 'Email jest nieprawidłowy',
                },
              })}
              className="input input-bordered w-full mt-2 p-2 border rounded-lg"
            />
            {errors.email?.message && (
              <div className="text-red-600 mt-2">{errors.email.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="block" htmlFor="password">
              Nowe hasło
            </label>
            <input
              type="password"
              id="password"
              {...register('password', {})}
              className="input input-bordered w-full mt-2 p-2 border rounded-lg"
            />
            {errors.password?.message && (
              <div className="text-red-600 mt-2">{errors.password.message}</div>
            )}
          </div>
          <div className="mb-4">
            <label className="block" htmlFor="confirmPassword">
              Potwierdź nowe hasło
            </label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                validate: (value) => {
                  const { password } = getValues()
                  return password === value || 'Hasła muszą się zgadzać'
                },
              })}
              className="input input-bordered w-full mt-2 p-2 border rounded-lg"
            />
            {errors.confirmPassword?.message && (
              <div className="text-red-600 mt-2">{errors.confirmPassword.message}</div>
            )}
          </div>

          <div className="mt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full py-2 rounded-lg"
            >
              {isSubmitting && (
                <span className="loading loading-spinner mr-2"></span>
              )}
              Aktualizuj
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Form
