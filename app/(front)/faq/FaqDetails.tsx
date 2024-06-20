// plik: components/FaqDetails.tsx

import React from 'react';
import { FiChevronDown } from 'react-icons/fi';

const faqData = [
  {
    question: "Jakie produkty chemiczne oferujecie?",
    answer: "Oferujemy szeroką gamę produktów chemicznych, w tym środki czystości, detergenty, dezynfekcje oraz specjalistyczne preparaty do różnych zastosowań."
  },
  {
    question: "Czy wasze produkty są bezpieczne dla środowiska?",
    answer: "Tak, wiele naszych produktów posiada certyfikaty ekologiczne i jest bezpiecznych dla środowiska."
  },
  {
    question: "Jakie rodzaje papierów i ręczników macie w ofercie?",
    answer: "W naszej ofercie znajdą Państwo zarówno papier toaletowy, jak i ręczniki papierowe różnych marek i typów, w tym produkty przemysłowe oraz domowe."
  },
  {
    question: "Czy oferujecie produkty dla firm i instytucji?",
    answer: "Tak, specjalizujemy się w dostarczaniu produktów chemicznych i papierniczych zarówno dla klientów indywidualnych, jak i firm oraz instytucji."
  },
  {
    question: "Jak mogę złożyć zamówienie?",
    answer: "Zamówienia można składać poprzez naszą stronę internetową domestico.pl. Wystarczy dodać produkty do koszyka i przejść przez proces zamówienia."
  },
  {
    question: "Jakie są opcje płatności?",
    answer: "Akceptujemy różne formy płatności, w tym płatności kartą kredytową, przelewy bankowe oraz płatności online."
  },
  {
    question: "Jak długo trwa realizacja zamówienia?",
    answer: "Czas realizacji zamówienia wynosi zazwyczaj od 2 do 5 dni roboczych, w zależności od dostępności produktów."
  },
  {
    question: "Czy mogę zwrócić zakupione produkty?",
    answer: "Tak, oferujemy możliwość zwrotu produktów w ciągu 14 dni od daty zakupu, zgodnie z obowiązującymi przepisami."
  },
  {
    question: "Czy oferujecie rabaty dla stałych klientów?",
    answer: "Tak, mamy program lojalnościowy oraz specjalne oferty i rabaty dla naszych stałych klientów."
  },
  {
    question: "Jak mogę skontaktować się z obsługą klienta?",
    answer: "Z naszym działem obsługi klienta można skontaktować się telefonicznie pod numerem +48 609 258 191 lub mailowo na adres biuro.domestico@gmail.com."
  }
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
