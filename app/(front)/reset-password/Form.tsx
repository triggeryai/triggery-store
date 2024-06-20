'use client'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

type ForgotPasswordInputs = {
  email: string;
}

const ForgotPasswordForm = () => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordInputs>()

  const onSubmit = async (data: ForgotPasswordInputs) => {
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Wystąpił błąd podczas wysyłania e-maila z resetowaniem hasła.');
      }

      // Pokaż wiadomość o sukcesie i ewentualnie przekieruj
      toast.success('Jeśli email jest powiązany z kontem, zostanie wysłany e-mail z resetowaniem hasła.');
      // Opcjonalnie, przekieruj na stronę logowania lub stronę informującą o sprawdzeniu e-maila
    } catch (error: any) {
      toast.error(error.message || 'Nie udało się wysłać e-maila z resetowaniem hasła.');
    }
  }

  return (
    <div className="max-w-sm mx-auto card bg-base-300 my-4">
      <div className="card-body">
        <h1 className="card-title">Zapomniałeś Hasła</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="my-2">
            <label htmlFor="email" className="label">
              Email
            </label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email jest wymagany',
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: 'Wprowadzona wartość nie jest w formacie email',
                },
              })}
              className="input input-bordered w-full max-w-xs"
            />
            {errors.email && <p className="text-error">{errors.email.message}</p>}
          </div>
          <div className="my-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
            >
              {isSubmitting ? (
                <span className="loading loading-spinner"></span>
              ) : (
                'Wyślij'
              )}
            </button>
          </div>
        </form>
        <div>
          Pamiętasz hasło?{' '}
          <Link href="/signin">
            <button className="link">Zaloguj się</button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordForm
