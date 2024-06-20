// plik: components/TermsOfService.tsx

import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <div className="container mx-auto p-5">
      <div className="bg-white shadow-lg rounded-lg p-8 md:p-12 dark:bg-gray-800 dark:text-gray-50 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-5 text-blue-900">Regulamin sklepu Domestico.pl</h1>
        <p className="text-right text-sm mb-10 text-gray-600 dark:text-gray-400">Ostatnia aktualizacja: 20 czerwca 2024</p>
        <article className="prose lg:prose-xl dark:prose-dark mx-auto">
          <h2 className="text-2xl font-semibold mt-6">1. Postanowienia ogólne</h2>
          <p>
            1.1. Sklep internetowy Domestico.pl, dostępny pod adresem internetowym <a href="https://www.domestico.pl" className="text-blue-600 hover:underline">www.domestico.pl</a>, prowadzony jest przez [Nazwa firmy] z siedzibą w [Adres firmy], NIP: [Numer NIP], REGON: [Numer REGON].
          </p>
          <p>
            1.2. Niniejszy Regulamin skierowany jest zarówno do konsumentów, jak i do przedsiębiorców korzystających ze Sklepu i określa zasady korzystania ze Sklepu oraz zasady i tryb zawierania Umów Sprzedaży z Klientem na odległość za pośrednictwem Sklepu.
          </p>

          <h2 className="text-2xl font-semibold mt-6">2. Definicje</h2>
          <p>
            2.1. Konsument – osoba fizyczna zawierająca ze Sprzedawcą umowę w ramach Sklepu, której przedmiot nie jest związany bezpośrednio z jej działalnością gospodarczą lub zawodową.
          </p>
          <p>
            2.2. Sprzedawca – [Nazwa firmy] z siedzibą w [Adres firmy], NIP: [Numer NIP], REGON: [Numer REGON].
          </p>
          <p>
            2.3. Klient – każdy podmiot dokonujący zakupów za pośrednictwem Sklepu.
          </p>
          <p>
            2.4. Umowa zawarta na odległość – umowa zawarta z Klientem w ramach zorganizowanego systemu zawierania umów na odległość (w ramach Sklepu), bez jednoczesnej fizycznej obecności stron, z wyłącznym wykorzystaniem jednego lub większej liczby środków porozumiewania się na odległość do chwili zawarcia umowy włącznie.
          </p>

          <h2 className="text-2xl font-semibold mt-6">3. Informacje ogólne</h2>
          <p>
            3.1. Sprzedawca w najszerszym dopuszczalnym przez prawo zakresie nie ponosi odpowiedzialności za zakłócenia, w tym przerwy w funkcjonowaniu Sklepu spowodowane siłą wyższą, niedozwolonym działaniem osób trzecich lub niekompatybilnością Sklepu z infrastrukturą techniczną Klienta.
          </p>
          <p>
            3.2. Przeglądanie asortymentu Sklepu nie wymaga zakładania Konta. Składanie zamówień przez Klienta na Produkty znajdujące się w asortymencie Sklepu możliwe jest albo po założeniu Konta zgodnie z postanowieniami § 4 Regulaminu, albo przez podanie niezbędnych danych osobowych i adresowych umożliwiających realizację Zamówienia bez zakładania Konta.
          </p>

          <h2 className="text-2xl font-semibold mt-6">4. Zakładanie Konta w Sklepie</h2>
          <p>
            4.1. Aby założyć Konto w Sklepie, należy wypełnić Formularz rejestracji. Niezbędne jest podanie następujących danych: imię, nazwisko, adres e-mail, hasło.
          </p>
          <p>
            4.2. Założenie Konta w Sklepie jest darmowe.
          </p>
          <p>
            4.3. Logowanie się na Konto odbywa się poprzez podanie adresu e-mail i hasła ustanowionego w Formularzu rejestracji.
          </p>
          <p>
            4.4. Klient ma możliwość w każdej chwili, bez podania przyczyny i bez ponoszenia jakichkolwiek opłat, usunięcia Konta poprzez wysłanie stosownego żądania do Sprzedawcy, w szczególności za pośrednictwem poczty elektronicznej lub pisemnie na adresy podane w § 3.
          </p>

          <h2 className="text-2xl font-semibold mt-6">5. Zasady składania Zamówienia</h2>
          <p>
            5.1. W celu złożenia Zamówienia należy:
            <ul className="list-decimal pl-6">
              <li>wybrać Produkt będący przedmiotem Zamówienia, a następnie kliknąć przycisk „Dodaj do koszyka” (lub równoznaczny);</li>
              <li>zalogować się lub skorzystać z możliwości złożenia Zamówienia bez rejestracji;</li>
              <li>jeżeli wybrano możliwość złożenia Zamówienia bez rejestracji – wypełnić Formularz zamówienia poprzez wpisanie danych odbiorcy Zamówienia oraz adresu, na który ma nastąpić dostawa Produktu, wybrać rodzaj przesyłki (sposób dostarczenia Produktu), wpisać dane do faktury, jeśli są inne niż dane odbiorcy Zamówienia;</li>
              <li>kliknąć przycisk „Zamawiam i płacę” / „Zamówienie z obowiązkiem zapłaty” i potwierdzić zamówienie;</li>
              <li>wybrać jeden z dostępnych sposobów płatności i w zależności od sposobu płatności, opłacić zamówienie w określonym terminie.</li>
            </ul>
          </p>

          <h2 className="text-2xl font-semibold mt-6">6. Oferowane metody dostawy oraz płatności</h2>
          <p>
            6.1. Klient może skorzystać z następujących metod dostawy lub odbioru zamówionego Produktu:
            <ul className="list-disc pl-6">
              <li>Przesyłka kurierska</li>
              <li>Odbiór osobisty dostępny pod adresem: [Adres sklepu]</li>
            </ul>
          </p>
          <p>
            6.2. Klient może skorzystać z następujących metod płatności:
            <ul className="list-disc pl-6">
              <li>Płatność przelewem na konto Sprzedawcy</li>
              <li>Płatności elektroniczne</li>
              <li>Karty płatnicze</li>
            </ul>
          </p>

          <h2 className="text-2xl font-semibold mt-6">7. Wykonanie umowy sprzedaży</h2>
          <p>
            7.1. Zawarcie Umowy Sprzedaży między Klientem a Sprzedawcą następuje po uprzednim złożeniu przez Klienta Zamówienia za pomocą Formularza zamówienia w Sklepie internetowym zgodnie z § 5 Regulaminu.
          </p>
          <p>
            7.2. Po złożeniu Zamówienia Sprzedawca potwierdza jego otrzymanie oraz jednocześnie przyjmuje Zamówienie do realizacji. Potwierdzenie otrzymania Zamówienia i jego przyjęcie do realizacji następuje poprzez przesłanie Klientowi stosownej wiadomości e-mail na podany w trakcie składania Zamówienia adres poczty elektronicznej Klienta.
          </p>
          <p>
            7.3. W przypadku wyboru przez Klienta:
            <ul className="list-decimal pl-6">
              <li>płatności przelewem, płatności elektronicznych lub płatności kartą płatniczą, Klient obowiązany jest do dokonania płatności w terminie 7 dni kalendarzowych od dnia zawarcia Umowy Sprzedaży – w przeciwnym razie zamówienie zostanie anulowane.</li>
              <li>płatności gotówką przy odbiorze osobistym przesyłki, Klient obowiązany jest do dokonania płatności przy odbiorze przesyłki.</li>
            </ul>
          </p>

          <h2 className="text-2xl font-semibold mt-6">8. Prawo odstąpienia od umowy</h2>
          <p>
            8.1. Konsument może w terminie 14 dni odstąpić od Umowy Sprzedaży bez podania jakiejkolwiek przyczyny.
          </p>
          <p>
            8.2. Bieg terminu określonego w ust. 1 rozpoczyna się od dostarczenia Produktu Konsumentowi lub wskazanej przez niego osobie trzeciej innej niż przewoźnik.
          </p>
          <p>
            8.3. Konsument może odstąpić od Umowy, składając Sprzedawcy oświadczenie o odstąpieniu od Umowy. Do zachowania terminu odstąpienia od Umowy wystarczy wysłanie przez Konsumenta oświadczenia przed upływem tego terminu.
          </p>

          <h2 className="text-2xl font-semibold mt-6">9. Reklamacja i gwarancja</h2>
          <p>
            9.1. Umową Sprzedaży objęte są nowe Produkty.
          </p>
          <p>
            9.2. W przypadku wystąpienia wady zakupionego u Sprzedawcy towaru Klient ma prawo do reklamacji w oparciu o przepisy dotyczące rękojmi w kodeksie cywilnym.
          </p>
          <p>
            9.3. Reklamację należy zgłosić pisemnie lub drogą elektroniczną na podane w niniejszym Regulaminie adresy Sprzedawcy.
          </p>
          <p>
            9.4. Zaleca się, aby w reklamacji zawrzeć m.in. zwięzły opis wady, okoliczności (w tym datę) jej wystąpienia, dane Klienta składającego reklamację oraz żądanie Klienta w związku z wadą towaru.
          </p>

          <h2 className="text-2xl font-semibold mt-6">10. Postanowienia końcowe</h2>
          <p>
            10.1. Umowy zawierane poprzez Sklep internetowy zawierane są w języku polskim.
          </p>
          <p>
            10.2. Zmiana Regulaminu:
            <ul className="list-decimal pl-6">
              <li>Sprzedawca zastrzega sobie prawo do dokonywania zmian Regulaminu z ważnych przyczyn to jest: zmiany przepisów prawa, zmiany sposobów płatności i dostaw - w zakresie, w jakim te zmiany wpływają na realizację postanowień niniejszego Regulaminu.</li>
              <li>W przypadku zawarcia na podstawie niniejszego Regulaminu umów o charakterze ciągłym (np. świadczenie usług drogą elektroniczną - Konto) zmieniony regulamin wiąże Klienta, jeżeli zostały zachowane wymagania określone w art. 384 oraz 384 [1] kodeksu cywilnego, to jest Klient został prawidłowo powiadomiony o zmianach i nie wypowiedział umowy w terminie 14 dni kalendarzowych od dnia powiadomienia.</li>
              <li>W przypadku zawarcia umów innych niż umowy o charakterze ciągłym (np. Umowa Sprzedaży) zmiany Regulaminu nie będą w żaden sposób naruszać praw nabytych Klientów będących Konsumentami przed dniem wejścia w życie zmian Regulaminu, w szczególności zmiany Regulaminu nie będą miały wpływu na złożone lub realizowane zamówienia.</li>
            </ul>
          </p>
          <p>
            10.3. W sprawach nieuregulowanych niniejszym Regulaminem mają zastosowanie powszechnie obowiązujące przepisy prawa polskiego, w szczególności: kodeksu cywilnego; ustawy o świadczeniu usług drogą elektroniczną; ustawy o prawach konsumenta, ustawy o ochronie danych osobowych.
          </p>
        </article>
      </div>
    </div>
  );
};

export default TermsOfService;
