import React from 'react';
import { FiChevronDown } from 'react-icons/fi';
import Link from 'next/link';

const faqData = [
  {
    question: "Jak zarejestrować konto?",
    answer: (
      <>
        Aby zarejestrować konto, przejdź <Link href="/register" legacyBehavior><a className="text-blue-500 hover:underline">tutaj</a></Link>. Po rejestracji, musisz zatwierdzić link, który przyjdzie na Twój email podany przy rejestracji.
      </>
    ),
  },
  {
    question: "Jak się zalogować?",
    answer: (
      <>
        Logowanie odbywa się <Link href="/signin" legacyBehavior><a className="text-blue-500 hover:underline">tutaj</a></Link>. Możesz się zalogować dopiero po aktywowaniu linku, który został wysłany na Twój email po rejestracji.
      </>
    ),
  },
  {
    question: "Jak przypomnieć hasło?",
    answer: (
      <>
        Jeśli zapomniałeś hasła, możesz je przypomnieć <Link href="/reset-password" legacyBehavior><a className="text-blue-500 hover:underline">tutaj</a></Link>. Wpisz swój email, a na niego przyjdzie link z aktywacją, po której zatwierdzeniu nowe hasło zostanie wysłane na Twój email.
      </>
    ),
  },
  {
    question: "Gdzie znajdę informacje o Domestico?",
    answer: (
      <>
        Informacje o sklepie Domestico znajdziesz <Link href="/about" legacyBehavior><a className="text-blue-500 hover:underline">tutaj</a></Link>.
      </>
    ),
  },
  {
    question: "Jak skontaktować się z nami?",
    answer: (
      <>
        Kontakt z nami znajdziesz <Link href="/contact" legacyBehavior><a className="text-blue-500 hover:underline">tutaj</a></Link>.
      </>
    ),
  },
  {
    question: "Gdzie znajduje się nasz sklep stacjonarny?",
    answer: "Nasz sklep stacjonarny znajduje się na ul. Wrocławska 29, Dzierżoniów, Polska 58-260.",
  },
  {
    question: "Jak rozpocząć zakupy?",
    answer: (
      <>
        Aby rozpocząć zakupy, wejdź <Link href="/search" legacyBehavior><a className="text-blue-500 hover:underline">tutaj</a></Link>. Znajdziesz tam listę dostępnych produktów.
      </>
    ),
  },
  {
    question: "Gdzie znajdę politykę prywatności?",
    answer: (
      <>
        Politykę prywatności znajdziesz <Link href="/privacy" legacyBehavior><a className="text-blue-500 hover:underline">tutaj</a></Link>.
      </>
    ),
  },
  {
    question: "Gdzie znajdę regulamin sklepu?",
    answer: (
      <>
        Regulamin sklepu znajdziesz <Link href="/terms" legacyBehavior><a className="text-blue-500 hover:underline">tutaj</a></Link>.
      </>
    ),
  },
  {
    question: "Gdzie znajdę politykę zwrotów?",
    answer: (
      <>
        Politykę zwrotów znajdziesz <Link href="/return-policy" legacyBehavior><a className="text-blue-500 hover:underline">tutaj</a></Link>.
      </>
    ),
  },
  {
    question: "Gdzie znajdę informacje o gwarancji produktów?",
    answer: (
      <>
        Informacje o gwarancji produktów znajdziesz <Link href="/warranty" legacyBehavior><a className="text-blue-500 hover:underline">tutaj</a></Link>.
      </>
    ),
  },
  {
    question: "Gdzie mogę zarządzać swoim kontem?",
    answer: (
      <>
        Wszystkie informacje o swoim koncie, w tym zmiana hasła, emaila itp., znajdziesz <Link href="/profile" legacyBehavior><a className="text-blue-500 hover:underline">tutaj</a></Link> po zalogowaniu.
      </>
    ),
  },
  {
    question: "Gdzie znajdę swoje zamówienia?",
    answer: (
      <>
        Swoje zamówienia znajdziesz <Link href="/order-history" legacyBehavior><a className="text-blue-500 hover:underline">tutaj</a></Link>.
      </>
    ),
  },
  {
    question: "Gdzie znajdę swój koszyk?",
    answer: (
      <>
        Koszyk znajdziesz <Link href="/cart" legacyBehavior><a className="text-blue-500 hover:underline">tutaj</a></Link>.
      </>
    ),
  },
  {
    question: "Jakie są opcje płatności i dostawy?",
    answer: "Istnieje wiele opcji płatności, w tym płatność przy odbiorze w sklepie stacjonarnym, przelew bankowy bezpośrednio na konto oraz bramki płatności. Sklep może modyfikować dostępne opcje w zależności od potrzeb. Opcje dostawy obejmują kurierów oraz paczkomaty InPost.",
  },
];

const FaqDetails: React.FC = () => {
  return (
    <section className="py-10 bg-gray-100 dark:bg-gray-800 dark:text-gray-50">
      <h2 className="text-3xl font-bold text-center mb-6">Często zadawane pytania</h2>
      <ul className="max-w-2xl mx-auto divide-y divide-gray-300 dark:divide-gray-700 shadow-lg rounded-xl bg-white dark:bg-gray-900">
        {faqData.map((faq, index) => (
          <li key={index}>
            <details className="group p-5">
              <summary className="flex items-center justify-between cursor-pointer font-medium text-lg transition-all duration-300 group-hover:text-blue-500 dark:group-hover:text-blue-400">
                <span>{faq.question}</span>
                <FiChevronDown className="w-6 h-6 text-gray-500 dark:text-gray-400 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <article className="mt-4 overflow-hidden transition-all duration-300 max-h-0 group-open:max-h-screen">
                <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
              </article>
            </details>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default FaqDetails;
