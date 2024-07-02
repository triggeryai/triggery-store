import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="container mx-auto p-5">
      <div className="bg-white shadow-lg rounded-lg p-8 md:p-12 dark:bg-gray-800 dark:text-gray-50 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-5 text-blue-900">Polityka prywatności</h1>
        <p className="text-right text-sm mb-10 text-gray-600 dark:text-gray-400">Ostatnia aktualizacja: 20 czerwca 2024</p>
        <article className="prose lg:prose-xl dark:prose-dark mx-auto">
          <p>
            Niniejsza polityka prywatności ("Polityka") opisuje, w jaki sposób domestico.pl ("Sklep", "my", "nas" lub "nasz") gromadzi, chroni i wykorzystuje dane osobowe ("Dane Osobowe"), które przekazują nam użytkownicy ("Użytkownik", "Ty" lub "Twój"). Polityka ta dotyczy wszystkich produktów i usług oferowanych przez nasz Sklep.
          </p>

          <h2 className="text-2xl font-semibold mt-6">Gromadzenie danych osobowych</h2>
          <p>
            Gromadzimy dane osobowe, które świadomie nam przekazujesz podczas rejestracji konta, składania zamówień, zapisywania się do newslettera lub kontaktowania się z nami w inny sposób. Mogą to być dane takie jak imię i nazwisko, adres e-mail, numer telefonu, adres zamieszkania oraz inne informacje kontaktowe.
          </p>

          <h2 className="text-2xl font-semibold mt-6">Gromadzenie danych nieosobowych</h2>
          <p>
            Podczas odwiedzania naszej strony internetowej automatycznie zbieramy informacje wysyłane przez Twoją przeglądarkę. Mogą to być dane takie jak adres IP, typ przeglądarki, wersja przeglądarki, strony naszej witryny, które odwiedzasz, czas i data wizyty, czas spędzony na tych stronach oraz inne statystyki.
          </p>

          <h2 className="text-2xl font-semibold mt-6">Wykorzystanie zebranych informacji</h2>
          <p>Zebrane dane osobowe mogą być wykorzystywane do:</p>
          <ul className="list-disc pl-6">
            <li>Personalizacji Twojego doświadczenia</li>
            <li>Ulepszania naszej strony internetowej</li>
            <li>Poprawy obsługi klienta</li>
            <li>Przetwarzania transakcji</li>
            <li>Wysyłania powiadomień e-mail, takich jak przypomnienia hasła, aktualizacje itp.</li>
            <li>Przesyłania informacji o nowych produktach, ofertach specjalnych itp.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">Podstawy prawne przetwarzania danych</h2>
          <p>
            Przetwarzamy Twoje dane osobowe tylko wtedy, gdy mamy ku temu podstawy prawne. Może to być konieczne do wykonania umowy, której jesteś stroną, spełnienia naszych obowiązków prawnych, ochrony Twoich istotnych interesów lub na podstawie Twojej zgody.
          </p>

          <h2 className="text-2xl font-semibold mt-6">Przekazywanie i przechowywanie danych</h2>
          <p>
            Twoje dane mogą być przekazywane i przechowywane w krajach spoza Europejskiego Obszaru Gospodarczego (EOG), jeśli to konieczne. Podejmujemy wszelkie kroki, aby zapewnić, że Twoje dane są bezpieczne i przetwarzane zgodnie z niniejszą Polityką.
          </p>

          <h2 className="text-2xl font-semibold mt-6">Prawa użytkowników</h2>
          <p>Masz prawo do:</p>
          <ul className="list-disc pl-6">
            <li>Wycofania zgody na przetwarzanie danych</li>
            <li>Dostępu do swoich danych osobowych</li>
            <li>Sprostowania swoich danych osobowych</li>
            <li>Usunięcia swoich danych osobowych</li>
            <li>Ograniczenia przetwarzania swoich danych osobowych</li>
            <li>Przenoszenia swoich danych osobowych</li>
            <li>Sprzeciwu wobec przetwarzania danych</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">Bezpieczeństwo danych</h2>
          <p>
            Chronimy Twoje dane za pomocą odpowiednich środków technicznych i organizacyjnych, aby zapobiec nieautoryzowanemu dostępowi, użyciu lub ujawnieniu Twoich danych osobowych.
          </p>

          <h2 className="text-2xl font-semibold mt-6">Cookies</h2>
          <p>
            Nasza strona używa plików cookie do poprawy Twojego doświadczenia użytkownika. Możesz zarządzać ustawieniami cookies w swojej przeglądarce.
          </p>

          <h2 className="text-2xl font-semibold mt-6">Zmiany w polityce prywatności</h2>
          <p>
            Zastrzegamy sobie prawo do aktualizacji niniejszej Polityki w dowolnym czasie. Wszelkie zmiany zostaną opublikowane na tej stronie z odpowiednią datą aktualizacji.
          </p>

          <h2 className="text-2xl font-semibold mt-6">Kontakt</h2>
          <p>
            Jeśli masz jakiekolwiek pytania dotyczące naszej Polityki prywatności, skontaktuj się z nami pod adresem email: biuro.domestico@gmail.com lub numerem telefonu +48 609 258 191.
          </p>
          <p>
            Adres firmy: Dzierżoniów, Wrocławska 29, 58-200.
          </p>
        </article>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
