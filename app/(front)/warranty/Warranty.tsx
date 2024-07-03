// plik: components/WarrantyPolicy.tsx

import React from 'react';

const WarrantyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto p-5">
      <div className="bg-white shadow-lg rounded-lg p-8 md:p-12 dark:bg-gray-800 dark:text-gray-50 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-5 text-blue-900">Polityka Gwarancyjna</h1>
        <p className="text-right text-sm mb-10 text-gray-600 dark:text-gray-400">Ostatnia aktualizacja: 20 czerwca 2024</p>
        <article className="prose lg:prose-xl dark:prose-dark mx-auto text-black">
          <h2 className="text-2xl font-semibold mt-6">1. Postanowienia ogólne</h2>
          <p>
            1.1. Niniejsza Polityka Gwarancyjna dotyczy produktów zakupionych w sklepie internetowym Domestico.pl, prowadzonym przez Martę Byczek prowadzącą działalność gospodarczą pod nazwą Domestico z siedzibą w Dzierżoniowie, ul. Wrocławska 29, 58-200 Dzierżoniów, NIP: 8822142440, REGON: 523678177.
          </p>
          <p>
            1.2. Sklep internetowy Domestico.pl oferuje produkty najwyższej jakości, w tym chemię gospodarczą, ręczniki i inne produkty. Nasze produkty objęte są gwarancją zgodnie z warunkami opisanymi poniżej.
          </p>

          <h2 className="text-2xl font-semibold mt-6">2. Zakres gwarancji</h2>
          <p>2.1. Gwarancja obejmuje wady fabryczne produktów oraz uszkodzenia powstałe w trakcie normalnego użytkowania produktów zgodnie z ich przeznaczeniem.</p>
          <p>2.2. Gwarancja nie obejmuje:</p>
          <ul className="list-disc pl-6">
            <li>Uszkodzeń mechanicznych wynikających z niewłaściwego użytkowania, przechowywania lub konserwacji produktu.</li>
            <li>Uszkodzeń wynikających z użycia produktów niezgodnie z ich przeznaczeniem.</li>
            <li>Normalnego zużycia produktów wynikającego z ich użytkowania.</li>
            <li>Uszkodzeń spowodowanych czynnikami zewnętrznymi, takimi jak pożar, powódź, burza itp.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">3. Okres gwarancji</h2>
          <p>3.1. Okres gwarancji wynosi 24 miesiące od daty zakupu produktu, chyba że producent określił inny okres gwarancji w dokumentacji produktu.</p>
          <p>3.2. Dla produktów, które mają inny okres gwarancji określony przez producenta, obowiązuje okres gwarancji określony w dokumentacji produktu.</p>

          <h2 className="text-2xl font-semibold mt-6">4. Procedura reklamacyjna</h2>
          <p>4.1. W przypadku stwierdzenia wady produktu, Konsument powinien niezwłocznie zgłosić reklamację, kontaktując się ze Sprzedawcą pisemnie na adres: ul. Wrocławska 29, 58-200 Dzierżoniów lub za pośrednictwem poczty elektronicznej na adres: biuro@domestico.pl.</p>
          <p>4.2. Reklamacja powinna zawierać: zwięzły opis wady, okoliczności (w tym datę) jej wystąpienia, dane Klienta składającego reklamację oraz żądanie Klienta w związku z wadą towaru.</p>
          <p>4.3. Sprzedawca ustosunkuje się do reklamacji Klienta w terminie 14 dni kalendarzowych od dnia jej otrzymania. Brak odpowiedzi w tym terminie oznacza, że reklamacja została uznana za uzasadnioną.</p>

          <h2 className="text-2xl font-semibold mt-6">5. Sposoby rozpatrzenia reklamacji</h2>
          <p>5.1. W przypadku uznania reklamacji za zasadną, Sprzedawca zobowiązuje się do:</p>
          <ul className="list-disc pl-6">
            <li>Naprawy wadliwego produktu.</li>
            <li>Wymiany wadliwego produktu na nowy.</li>
            <li>Zwrotu zapłaconej kwoty za wadliwy produkt.</li>
          </ul>
          <p>5.2. Wybór sposobu rozpatrzenia reklamacji należy do Sprzedawcy.</p>

          <h2 className="text-2xl font-semibold mt-6">6. Postanowienia końcowe</h2>
          <p>6.1. Niniejsza Polityka Gwarancyjna obowiązuje od dnia 20 czerwca 2024 roku.</p>
          <p>6.2. Sklep internetowy Domestico.pl zastrzega sobie prawo do zmiany niniejszej Polityki Gwarancyjnej z ważnych przyczyn, takich jak zmiany przepisów prawa, zmiany sposobów płatności i dostaw - w zakresie, w jakim te zmiany wpływają na realizację postanowień niniejszej Polityki.</p>
          <p>6.3. W sprawach nieuregulowanych niniejszą Polityką Gwarancyjną mają zastosowanie powszechnie obowiązujące przepisy prawa polskiego, w szczególności przepisy Kodeksu cywilnego oraz ustawy o prawach konsumenta.</p>
        </article>
      </div>
    </div>
  );
};

export default WarrantyPolicy;
