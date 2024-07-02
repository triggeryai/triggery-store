// plik: components/ReturnPolicy.tsx

import React from 'react';

const ReturnPolicy: React.FC = () => {
  return (
    <div className="container mx-auto p-5">
      <div className="bg-white shadow-lg rounded-lg p-8 md:p-12 dark:bg-gray-800 dark:text-gray-50 max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-5 text-blue-900">Polityka Zwrotów</h1>
        <p className="text-right text-sm mb-10 text-gray-600 dark:text-gray-400">Ostatnia aktualizacja: 20 czerwca 2024</p>
        <article className="prose lg:prose-xl dark:prose-dark mx-auto">
          <h2 className="text-2xl font-semibold mt-6">1. Postanowienia ogólne</h2>
          <p>
            1.1. Niniejsza Polityka Zwrotów dotyczy zakupów dokonanych w sklepie internetowym Domestico.pl, prowadzonym przez Martę Byczek prowadzącą działalność gospodarczą pod nazwą Domestico z siedzibą w Dzierżoniowie, ul. Wrocławska 29, 58-200 Dzierżoniów, NIP: 8822142440, REGON: 523678177.
          </p>
          <p>
            1.2. Sklep internetowy Domestico.pl dokłada wszelkich starań, aby oferowane produkty były najwyższej jakości. Jeżeli jednak zakupiony towar nie spełnia Twoich oczekiwań, masz prawo do jego zwrotu zgodnie z warunkami opisanymi poniżej.
          </p>

          <h2 className="text-2xl font-semibold mt-6">2. Prawo odstąpienia od umowy</h2>
          <p>
            2.1. Konsument, który zawarł umowę na odległość, może w terminie 14 dni kalendarzowych odstąpić od niej bez podawania przyczyny i bez ponoszenia kosztów, z wyjątkiem kosztów określonych w pkt 2.6 niniejszej Polityki.
          </p>
          <p>
            2.2. Termin do odstąpienia od umowy wygasa po upływie 14 dni kalendarzowych od dnia, w którym Konsument wszedł w posiadanie rzeczy lub w którym osoba trzecia inna niż przewoźnik i wskazana przez Konsumenta weszła w posiadanie rzeczy.
          </p>
          <p>
            2.3. Aby skorzystać z prawa odstąpienia od umowy, Konsument musi poinformować Sprzedawcę o swojej decyzji o odstąpieniu od umowy w drodze jednoznacznego oświadczenia (np. pismo wysłane pocztą lub pocztą elektroniczną).
          </p>
          <p>
            2.4. Konsument może skorzystać z wzoru formularza odstąpienia od umowy, jednak nie jest to obowiązkowe.
          </p>
          <p>
            2.5. Aby zachować termin do odstąpienia od umowy, wystarczy, aby Konsument wysłał informację dotyczącą wykonania przysługującego mu prawa odstąpienia od umowy przed upływem terminu do odstąpienia od umowy.
          </p>
          <p>
            2.6. Konsument ponosi bezpośrednie koszty zwrotu rzeczy.
          </p>

          <h2 className="text-2xl font-semibold mt-6">3. Skutki odstąpienia od umowy</h2>
          <p>3.1. W przypadku odstąpienia od umowy, Sprzedawca zwraca wszystkie otrzymane od Konsumenta płatności, w tym koszty dostarczenia rzeczy (z wyjątkiem dodatkowych kosztów wynikających z wybranego przez Konsumenta sposobu dostarczenia innego niż najtańszy zwykły sposób dostarczenia oferowany przez Sprzedawcę), niezwłocznie, a w każdym przypadku nie później niż 14 dni od dnia, w którym Sprzedawca został poinformowany o decyzji Konsumenta o wykonaniu prawa odstąpienia od umowy.</p>
          <p>3.2. Zwrotu płatności Sprzedawca dokonuje przy użyciu takich samych metod płatności, jakie zostały przez Konsumenta użyte w pierwotnej transakcji, chyba że Konsument wyraźnie zgodził się na inne rozwiązanie; w każdym przypadku Konsument nie ponosi żadnych opłat w związku z tym zwrotem.</p>
          <p>3.3. Sprzedawca może wstrzymać się ze zwrotem płatności do czasu otrzymania rzeczy lub do czasu dostarczenia dowodu jej odesłania, w zależności od tego, które zdarzenie nastąpi wcześniej.</p>
          <p>3.4. Konsument powinien odesłać rzecz na adres Sprzedawcy niezwłocznie, a w każdym razie nie później niż 14 dni od dnia, w którym poinformował Sprzedawcę o odstąpieniu od umowy. Termin jest zachowany, jeżeli Konsument odeśle rzecz przed upływem terminu 14 dni.</p>
          <p>3.5. Konsument odpowiada tylko za zmniejszenie wartości rzeczy wynikające z korzystania z niej w sposób inny niż było to konieczne do stwierdzenia charakteru, cech i funkcjonowania rzeczy.</p>

          <h2 className="text-2xl font-semibold mt-6">4. Wyjątki od prawa odstąpienia od umowy</h2>
          <p>4.1. Prawo odstąpienia od umowy nie przysługuje Konsumentowi w odniesieniu do umów:</p>
          <ul className="list-disc pl-6">
            <li>o świadczenie usług, jeżeli Sprzedawca wykonał w pełni usługę za wyraźną zgodą Konsumenta;</li>
            <li>w której cena lub wynagrodzenie zależy od wahań na rynku finansowym, nad którymi Sprzedawca nie sprawuje kontroli, i które mogą wystąpić przed upływem terminu do odstąpienia od umowy;</li>
            <li>w której przedmiotem świadczenia jest rzecz nieprefabrykowana, wyprodukowana według specyfikacji Konsumenta lub służąca zaspokojeniu jego zindywidualizowanych potrzeb;</li>
            <li>w której przedmiotem świadczenia jest rzecz ulegająca szybkiemu zepsuciu lub mająca krótki termin przydatności do użycia;</li>
            <li>w której przedmiotem świadczenia jest rzecz dostarczona w zapieczętowanym opakowaniu, której po otwarciu opakowania nie można zwrócić ze względu na ochronę zdrowia lub ze względów higienicznych, jeżeli opakowanie zostało otwarte po dostarczeniu;</li>
            <li>w której przedmiotem świadczenia są rzeczy, które po dostarczeniu, ze względu na swój charakter, zostają nierozłącznie połączone z innymi rzeczami;</li>
            <li>w której przedmiotem świadczenia są napoje alkoholowe, których cena została uzgodniona przy zawarciu umowy sprzedaży, a których dostarczenie może nastąpić dopiero po upływie 30 dni i których wartość zależy od wahań na rynku, nad którymi Sprzedawca nie ma kontroli;</li>
            <li>w której Konsument wyraźnie żądał, aby Sprzedawca do niego przyjechał w celu dokonania pilnej naprawy lub konserwacji; jeżeli Sprzedawca świadczy dodatkowo inne usługi niż te, których wykonania Konsument żądał, lub dostarcza rzeczy inne niż części zamienne niezbędne do wykonania naprawy lub konserwacji, prawo odstąpienia od umowy przysługuje Konsumentowi w odniesieniu do dodatkowych usług lub rzeczy;</li>
            <li>w której przedmiotem świadczenia są nagrania dźwiękowe lub wizualne albo programy komputerowe dostarczane w zapieczętowanym opakowaniu, jeżeli opakowanie zostało otwarte po dostarczeniu;</li>
            <li>o dostarczanie dzienników, periodyków lub czasopism, z wyjątkiem umowy o prenumeratę;</li>
            <li>zawartej w drodze aukcji publicznej;</li>
            <li>o świadczenie usług w zakresie zakwaterowania, innych niż do celów mieszkalnych, przewozu rzeczy, najmu samochodów, gastronomii, usług związanych z wypoczynkiem, wydarzeniami rozrywkowymi, sportowymi lub kulturalnymi, jeżeli w umowie oznaczono dzień lub okres świadczenia usługi;</li>
            <li>o dostarczanie treści cyfrowych, które nie są zapisane na nośniku materialnym, jeżeli spełnianie świadczenia rozpoczęło się za wyraźną zgodą Konsumenta przed upływem terminu do odstąpienia od umowy i po poinformowaniu go przez Sprzedawcę o utracie prawa odstąpienia od umowy.</li>
          </ul>

          <h2 className="text-2xl font-semibold mt-6">5. Reklamacje</h2>
          <p>5.1. W przypadku wystąpienia wady zakupionego towaru, Konsument ma prawo do reklamacji na podstawie przepisów dotyczących rękojmi określonych w Kodeksie cywilnym.</p>
          <p>5.2. Reklamacje można składać pisemnie na adres: ul. Wrocławska 29, 58-200 Dzierżoniów lub za pośrednictwem poczty elektronicznej na adres: biuro@domestico.pl.</p>
          <p>5.3. Zaleca się, aby w reklamacji zawrzeć: zwięzły opis wady, okoliczności (w tym datę) jej wystąpienia, dane Klienta składającego reklamację oraz żądanie Klienta w związku z wadą towaru.</p>
          <p>5.4. Sprzedawca ustosunkuje się do reklamacji Klienta w terminie 14 dni kalendarzowych od dnia jej otrzymania. Brak odpowiedzi w tym terminie oznacza, że reklamacja została uznana za uzasadnioną.</p>

          <h2 className="text-2xl font-semibold mt-6">6. Zwrot Produktów w przypadkach uszkodzeń</h2>
          <p>6.1. Zwrot produktów będzie odrzucony, jeżeli stwierdzimy, że produkt został uszkodzony z winy Konsumenta, w wyniku niewłaściwego użytkowania, przechowywania lub konserwacji.</p>
          <p>6.2. Produkty muszą być zwrócone w stanie niezmienionym, chyba że zmiana była konieczna w granicach zwykłego zarządu.</p>
          <p>6.3. Zwroty otwartych lub używanych produktów, takich jak proszki do prania, chemia gospodarcza, szczotki i papiery toaletowe, nie będą akceptowane. Produkty muszą być zwrócone w oryginalnym, nieotwartym opakowaniu.</p>

          <h2 className="text-2xl font-semibold mt-6">7. Postanowienia końcowe</h2>
          <p>7.1. Niniejsza Polityka Zwrotów obowiązuje od dnia 20 czerwca 2024 roku.</p>
          <p>7.2. Sklep internetowy Domestico.pl zastrzega sobie prawo do zmiany niniejszej Polityki Zwrotów z ważnych przyczyn, takich jak zmiany przepisów prawa, zmiany sposobów płatności i dostaw - w zakresie, w jakim te zmiany wpływają na realizację postanowień niniejszej Polityki.</p>
          <p>7.3. W sprawach nieuregulowanych niniejszą Polityką Zwrotów mają zastosowanie powszechnie obowiązujące przepisy prawa polskiego, w szczególności przepisy Kodeksu cywilnego oraz ustawy o prawach konsumenta.</p>
        </article>
      </div>
    </div>
  );
};

export default ReturnPolicy;
