(() => {
  const STORAGE_KEY = "axiom-language";
  const languages = {
    en: { label: "English", shortLabel: "EN" },
    pl: { label: "Polski", shortLabel: "PL" },
  };

  const translations = {
    pl: {
      "Project Axiom": "Project Axiom",
      "Project Axiom home": "Strona główna Project Axiom",
      "Open navigation menu": "Otwórz menu nawigacji",
      "Primary navigation": "Nawigacja główna",
      "Product": "Produkt",
      "Status": "Status",
      "Current Status": "Aktualny status",
      "Timeline": "Oś czasu",
      "Project Status": "Status projektu",
      "Stories": "Historie",
      "Tester Insights": "Wnioski z testów",
      "Gallery": "Galeria",
      "Saga": "Saga",
      "Testers": "Testerzy",
      "Help shape it": "Pomóż go kształtować",
      "Help shape AxiomScale": "Pomóż kształtować AxiomScale",
      "Building AxiomScale in public.": "Budujemy AxiomScale publicznie.",
      "Building AxiomScale in public": "Budujemy AxiomScale publicznie",
      "Project Axiom is an active product-development journey.": "Project Axiom to żywa opowieść o tworzeniu produktu.",
      "We are building AxiomScale in the open: an ongoing attempt to make food logging less frustrating\n            through NFC tags, smart weighing, and thoughtful companion software. The product is working, but it\n            is still being tested, challenged, and shaped by real kitchen use.": "Budujemy AxiomScale otwarcie: to próba zmniejszenia frustracji związanej z zapisywaniem jedzenia dzięki tagom NFC, inteligentnemu ważeniu i przemyślanej aplikacji. Produkt działa, ale nadal jest testowany, podważany i kształtowany przez prawdziwe użycie w kuchni.",
      "We are building AxiomScale in the open: an ongoing attempt to make food logging less frustrating through NFC tags, smart weighing, and thoughtful companion software. The product is working, but it is still being tested, challenged, and shaped by real kitchen use.": "Budujemy AxiomScale otwarcie: to próba zmniejszenia frustracji związanej z zapisywaniem jedzenia dzięki tagom NFC, inteligentnemu ważeniu i przemyślanej aplikacji. Produkt działa, ale nadal jest testowany, podważany i kształtowany przez prawdziwe użycie w kuchni.",
      "Read the build journal": "Czytaj dziennik budowy",
      "See current status": "Zobacz aktualny status",
      "What is being built": "Co powstaje",
      "Food logging shouldn't require a phone every time you cook.": "Zapisywanie jedzenia nie powinno wymagać telefonu za każdym razem, gdy gotujesz.",
      "The working hypothesis is simple: if you already know what you're holding and you're already weighing it, logging should happen naturally in the kitchen. The app should be there when you want insight, not when you're preparing food.": "Założenie jest proste: jeśli już wiesz, co trzymasz, i właśnie to ważysz, zapis powinien wydarzyć się naturalnie w kuchni. Aplikacja powinna być potrzebna wtedy, gdy chcesz zobaczyć dane, a nie w trakcie przygotowywania jedzenia.",
      "Identify once": "Zidentyfikuj raz",
      "Tell Axiom what the ingredient is.": "Powiedz Axiomowi, czym jest składnik.",
      "Most people eat the same foods repeatedly. Assign an ingredient or recipe to a reusable Axiom token once, then simply place the token on the scale when preparing it again.": "Większość osób często wraca do tych samych produktów. Raz przypisz składnik albo przepis do wielorazowego tokena Axiom, a później po prostu połóż token na wadze, gdy przygotowujesz go ponownie.",
      "Weigh naturally": "Waż naturalnie",
      "Cook as normal. The scale captures the weight.": "Gotuj normalnie. Waga zapisze masę.",
      "The valuable effort is already happening when food is placed on the scale. Axiom aims to capture that information without introducing phone interaction into the cooking process.": "Najważniejsza czynność i tak dzieje się wtedy, gdy jedzenie trafia na wagę. Axiom ma zapisać tę informację bez dokładania telefonu do procesu gotowania.",
      "Review when convenient": "Sprawdź, gdy masz czas",
      "Use the app when you want insight, not while preparing food.": "Używaj aplikacji wtedy, gdy chcesz zobaczyć dane, a nie podczas przygotowywania jedzenia.",
      "Calories, macros, trends, meal history, and corrections can be reviewed later. The goal is to keep the phone out of the kitchen until it is actually useful.": "Kalorie, makroskładniki, trendy, historię posiłków i poprawki można przejrzeć później. Celem jest trzymanie telefonu poza kuchnią, dopóki naprawdę nie jest potrzebny.",
      "Current status": "Aktualny status",
      "Working prototype, active validation.": "Działający prototyp, aktywne testy.",
      "Project Axiom is past the pure concept stage, but not presented as a finished commercial product.": "Project Axiom wyszedł poza etap samej koncepcji, ale nie jest przedstawiany jako gotowy produkt komercyjny.",
      "Hardware prototype": "Prototyp sprzętu",
      "2 working prototypes assembled and out in households for testing.": "Złożono 2 działające prototypy, które są testowane w domach.",
      "Android app": "Aplikacja Android",
      "Working. NFC writing, local persistence, food search, and Bluetooth sync are in tester-baseline form.": "Działa. Zapis NFC, lokalne dane, wyszukiwanie jedzenia i synchronizacja Bluetooth są gotowe w wersji bazowej dla testerów.",
      "V2 hardware": "Sprzęt V2",
      "Slimmer second-generation prototype currently being assembled.": "Smuklejszy prototyp drugiej generacji jest obecnie składany.",
      "Testing programme": "Program testów",
      "3 independent users currently testing, with real-world validation as the current stage.": "3 niezależnych użytkowników testuje system; obecnym etapem jest sprawdzenie go w prawdziwym użyciu.",
      "View Full Project Status": "Zobacz pełny status projektu",
      "Project timeline": "Oś czasu projektu",
      "Every product decision leaves a trail.": "Każda decyzja produktowa zostawia ślad.",
      "This timeline highlights the key moments where the project changed direction, revealing how AxiomScale evolved from a kitchen labelling idea into a new approach to food logging.": "Ta oś czasu pokazuje kluczowe momenty, w których projekt zmieniał kierunek, i jak AxiomScale przeszedł od pomysłu na etykiety kuchenne do nowego podejścia do zapisywania jedzenia.",
      "Completed project timeline milestones": "Ukończone kamienie milowe projektu",
      "Idea": "Pomysł",
      "December 2025. A long-standing frustration with kitchen labelling finally became a project worth pursuing.": "Grudzień 2025. Długotrwała frustracja związana z etykietami kuchennymi w końcu stała się projektem wartym realizacji.",
      "Parts Ordered": "Zamówiono części",
      "January 2026. The first components were purchased and the project officially began.": "Styczeń 2026. Kupiono pierwsze komponenty i projekt oficjalnie się rozpoczął.",
      "First Assembly": "Pierwszy montaż",
      "February 2026. Individual parts started coming together into a working system.": "Luty 2026. Pojedyncze części zaczęły składać się w działający system.",
      "Hello World": "Hello World",
      "February 2026. The first successful communication proved the core electronics could work together.": "Luty 2026. Pierwsza udana komunikacja pokazała, że podstawowa elektronika może działać razem.",
      "First Label Printed": "Pierwsza wydrukowana etykieta",
      "March 2026. The system produced its first usable kitchen label.": "Marzec 2026. System wydrukował pierwszą użyteczną etykietę kuchenną.",
      "The Enclosure Problem": "Problem obudowy",
      "March 2026. A working prototype now needed a practical physical form.": "Marzec 2026. Działający prototyp potrzebował praktycznej fizycznej formy.",
      "Tester stories": "Historie testerów",
      "Real-world observations, not testimonials.": "Obserwacje z prawdziwego użycia, nie referencje.",
      "The useful stories are the ones that change the product: what confused people, what survived repeat use, and what failed in ordinary kitchens.": "Najbardziej przydatne historie to te, które zmieniają produkt: co ludzi myliło, co przetrwało powtarzalne użycie i co zawodziło w zwykłych kuchniach.",
      "More Is More": "Więcej znaczy więcej",
      "From the beginning, my philosophy was simple: more tokens meant less friction. If every ingredient had its own NFC token, identifying food would become effortless and logging would naturally become easier.": "Od początku moja filozofia była prosta: więcej tokenów miało oznaczać mniej przeszkód. Gdyby każdy składnik miał własny token NFC, identyfikowanie jedzenia stałoby się bezwysiłkowe, a zapisywanie naturalnie łatwiejsze.",
      "The Recipe Tag Surprise": "Zaskoczenie tagiem przepisu",
      "I assumed that needing to identify every ingredient individually would become frustrating, so I explored recipe tags, guided cooking workflows, and various ways of reducing the number of interactions required.": "Zakładałem, że identyfikowanie każdego składnika osobno szybko stanie się frustrujące, więc sprawdzałem tagi przepisów, prowadzone procesy gotowania i różne sposoby ograniczania liczby potrzebnych interakcji.",
      "Pretty Isn't Useful": "Ładne nie zawsze jest użyteczne",
      "I spent a surprising amount of time refining the visual language of the tokens. Food icons went through countless revisions as I searched for something that felt polished, modern, and attractive enough to live permanently on a kitchen worktop.": "Spędziłem zaskakująco dużo czasu na dopracowywaniu języka wizualnego tokenów. Ikony jedzenia przechodziły niezliczone wersje, bo szukałem czegoś dopracowanego, nowoczesnego i na tyle atrakcyjnego, by mogło na stałe leżeć na kuchennym blacie.",
      "Read More": "Czytaj dalej",
      "Axiom Visual Evolution": "Ewolucja wizualna Axiom",
      "The journey matters as much as the destination.": "Droga jest równie ważna jak cel.",
      "Axiom wasn't designed in a single breakthrough moment. It emerged through prototypes, failed assumptions, real-world testing, and continuous refinement.": "Axiom nie powstał w jednym przełomowym momencie. Wyłaniał się przez prototypy, błędne założenia, testy w prawdziwym użyciu i ciągłe dopracowywanie.",
      "Hardware Evolution": "Ewolucja sprzętu",
      "The complete journey from the label printer origins through the development of AxiomScale.": "Pełna droga od początków z drukarką etykiet do rozwoju AxiomScale.",
      "Token Evolution": "Ewolucja tokenów",
      "How NFC tags evolved into a physical interaction language designed around habits and reduced friction.": "Jak tagi NFC zmieniły się w fizyczny język interakcji zaprojektowany wokół nawyków i mniejszej liczby przeszkód.",
      "Icon Evolution": "Ewolucja ikon",
      "The development of a visual language for identifying ingredients, categories and actions at a glance.": "Rozwój języka wizualnego do rozpoznawania składników, kategorii i działań na pierwszy rzut oka.",
      "Open gallery": "Otwórz galerię",
      "From bench prototype to tested product.": "Od prototypu na biurku do testowanego produktu.",
      "A running journal of the AxiomScale build: hardware changes, software decisions, tester feedback, mistakes, fixes, and lessons learned.": "Bieżący dziennik budowy AxiomScale: zmiany sprzętowe, decyzje programowe, opinie testerów, błędy, poprawki i wnioski.",
      "View all entries": "Zobacz wszystkie wpisy",
      "Testing programme": "Program testów",
      "Help shape the product while it is still malleable.": "Pomóż kształtować produkt, dopóki wciąż można go łatwo zmieniać.",
      "Testers are not signing up for a finished beta. They are helping decide what AxiomScale becomes: which workflows survive, which assumptions break, and which problems are worth solving next.": "Testerzy nie zapisują się do gotowej bety. Pomagają zdecydować, czym stanie się AxiomScale: które ścieżki działania przetrwają, które założenia pękną i które problemy warto rozwiązać jako następne.",
      "Name": "Imię",
      "Email": "Email",
      "What kind of testing could you help with?": "W jakim rodzaju testów możesz pomóc?",
      "Public development dashboard": "Publiczny panel rozwoju",
      "A transparent snapshot of where Axiom stands today.": "Przejrzysty obraz tego, gdzie Axiom jest dzisiaj.",
      "This page documents current progress, active development work, testing activity, validation evidence, and upcoming milestones for AxiomScale.": "Ta strona pokazuje aktualne postępy, aktywne prace rozwojowe, testy, zebrane dowody i nadchodzące kamienie milowe AxiomScale.",
      "Current stage": "Aktualny etap",
      "Validation phase.": "Faza testów.",
      "AxiomScale is a working prototype system being tested in real households while hardware, app workflows, and setup friction are still being refined.": "AxiomScale to działający system prototypowy testowany w prawdziwych domach, podczas gdy sprzęt, sposób działania aplikacji i pierwsza konfiguracja są nadal dopracowywane.",
      "Real-world validation with active prototype and companion-app testing.": "Sprawdzanie w prawdziwym użyciu z działającym prototypem i aplikacją towarzyszącą.",
      "Key focus areas": "Główne obszary uwagi",
      "Reliability, setup friction, NFC workflows, Bluetooth sync, and whether the product remains useful during ordinary cooking.": "Niezawodność, pierwsza konfiguracja, procesy NFC, synchronizacja Bluetooth i to, czy produkt pozostaje użyteczny podczas zwykłego gotowania.",
      "Project snapshot": "Aktualny stan projektu",
      "Progress should be measurable, not just described.": "Postęp powinien być mierzalny, a nie tylko opisany.",
      "These indicators are intentionally practical. They show whether the project is accumulating real build and test evidence.": "Te wskaźniki są celowo praktyczne. Pokazują, czy projekt zbiera prawdziwe dowody budowy i testów.",
      "working prototypes assembled and out in households": "działające prototypy złożone i testowane w domach",
      "independent users currently testing": "niezależnych użytkowników aktualnie testuje",
      "days since first parts arrived on 5 January 2026": "dni od dotarcia pierwszych części 5 stycznia 2026",
      "tester baseline assembled for household validation": "wersja bazowa dla testerów złożona do testów domowych",
      "real-world validation, feedback capture, and V2 assembly": "testy w prawdziwym użyciu, zbieranie opinii i montaż V2",
      "Hardware status": "Status sprzętu",
      "Functional prototypes are in use, but the hardware is still evolving.": "Funkcjonalne prototypy są w użyciu, ale sprzęt nadal się rozwija.",
      "The priority is not polish for its own sake. The goal is a reliable kitchen object that can survive repeated use and communicate clearly.": "Priorytetem nie jest dopracowanie dla samego dopracowania. Celem jest niezawodny przedmiot kuchenny, który zniesie powtarzalne użycie i będzie jasno komunikował.",
      "Prototype version": "Wersja prototypu",
      "V1 tester baseline is assembled and being used for household validation. V2 is being assembled as a slimmer second-generation unit.": "Bazowa wersja V1 dla testerów jest złożona i używana w testach domowych. V2 jest składana jako smuklejsza jednostka drugiej generacji.",
      "Known issues": "Znane problemy",
      "Setup friction, surface fit, repeated-use reliability, enclosure refinement, and manufacturing practicality remain active questions.": "Pierwsza konfiguracja, dopasowanie powierzchni, niezawodność przy powtarzalnym użyciu, dopracowanie obudowy i praktyczność produkcji nadal wymagają sprawdzenia.",
      "Software status": "Status oprogramowania",
      "The Android app is functional enough for testing.": "Aplikacja Android działa na tyle dobrze, by prowadzić testy.",
      "The app is treated as review and recovery infrastructure rather than something that must interrupt the cooking moment.": "Aplikacja służy głównie do późniejszego przeglądu i poprawiania danych, a nie do przerywania gotowania.",
      "Android application": "Aplikacja Android",
      "Tester-baseline app is working with local persistence, food search, NFC writing, and Bluetooth sync.": "Bazowa aplikacja dla testerów działa z lokalnym zapisem, wyszukiwaniem jedzenia, zapisem NFC i synchronizacją Bluetooth.",
      "Testing is focused on product truth, not testimonials.": "Testy mają pokazać, jak produkt naprawdę działa, a nie zbierać pochwały.",
      "Recent learnings": "Ostatnie wnioski",
      "The project has changed because testing changed it.": "Projekt zmienił się, bo zmieniły go testy.",
      "These are validated product lessons rather than a list of completed features.": "To sprawdzone wnioski produktowe, a nie lista ukończonych funkcji.",
      "Passive logging matters": "Pasywne zapisywanie ma znaczenie",
      "More tokens can create more friction": "Więcej tokenów może oznaczać więcej przeszkód",
      "Setup friction is product friction": "Problemy z konfiguracją są problemami produktu",
      "Next milestones": "Następne kamienie milowe",
      "What happens next.": "Co dalej.",
      "The next stage is about broadening validation while tightening the parts of the system that testers actually touch.": "Następny etap polega na szerszych testach i dopracowaniu tych części systemu, z którymi testerzy faktycznie mają kontakt.",
      "Expand household testing": "Rozszerzyć testy domowe",
      "Refine app recovery flows": "Dopracować poprawianie danych w aplikacji",
      "Complete V2 hardware assembly": "Ukończyć montaż sprzętu V2",
      "Define validation goals": "Zdefiniować cele testów",
      "Deeper information": "Więcej szczegółów",
      "Follow the evidence trail.": "Zobacz ścieżkę dowodów.",
      "The dashboard is a snapshot. These pages hold the build history, visual evolution, and tester pathways behind it.": "Panel pokazuje aktualny stan. Te strony zawierają historię budowy, ewolucję wizualną i ścieżki testerów stojące za projektem.",
      "Build Journal": "Dziennik budowy",
      "Read the Axiom Saga episodes.": "Czytaj odcinki Axiom Saga.",
      "Tester Registration": "Rejestracja testerów",
      "Episodes": "Odcinki",
      "People": "Osoby",
      "Axiom Saga": "Axiom Saga",
      "Episode": "Odcinek",
      "Posted": "Opublikowano",
      "Insight": "Wniosek",
      "No published insights yet": "Brak opublikowanych wniosków",
      "Insights from this tester will appear here once feedback has been approved for publication.": "Wnioski od tego testera pojawią się tutaj, gdy opinie zostaną zatwierdzone do publikacji.",
      "This area is reserved for product-learning notes, tester observations, anonymised feedback summaries, and approved quotes.": "Ten obszar jest zarezerwowany na notatki produktowe, obserwacje testerów, anonimowe podsumowania opinii i zatwierdzone cytaty.",
      "The founder / first tester": "Założyciel / pierwszy tester",
      "Tester": "Tester",
      "Project Axiom": "Project Axiom",
      "Edinburgh": "Edynburg",
      "More tokens meant less friction, until the tokens themselves became something to manage.": "Więcej tokenów oznaczało mniej przeszkód, dopóki same tokeny nie stały się czymś, czym trzeba zarządzać.",
      "Trying to eliminate every interaction exposed the real problem: reaching for a phone.": "Próba usunięcia każdej interakcji pokazała prawdziwy problem: sięganie po telefon.",
      "The clearest token design was not always the prettiest one.": "Najczytelniejszy projekt tokena nie zawsze był najładniejszy.",
      "Engineering timeline": "Oś czasu inżynierii",
      "Visual evolution gallery navigation": "Nawigacja galerii ewolucji wizualnej",
      "Timeline chapters": "Rozdziały osi czasu",
      "Scrollable prototype development timeline": "Przewijana oś czasu rozwoju prototypu",
      "Transition": "Zwrot",
      "Learning": "Wniosek",
      "Pivot": "Zmiana kierunku",
      "Development stage": "Etap rozwoju",
      "Image preview": "Podgląd obrazu",
      "Close image preview": "Zamknij podgląd obrazu",
      "Close": "Zamknij",
      "Prev": "Poprzedni",
      "Previous image": "Poprzedni obraz",
      "Next": "Następny",
      "Next image": "Następny obraz",
      "View hardware evolution": "Zobacz ewolucję sprzętu",
      "View token evolution": "Zobacz ewolucję tokenów",
      "View icon evolution": "Zobacz ewolucję ikon",
      "From Label Printer to SmartScale": "Od drukarki etykiet do SmartScale",
      "A real product being built in public.": "Prawdziwy produkt budowany publicznie.",
      "From \"one token per thing\" to a language designed around habits.": "Od \"jeden token na rzecz\" do języka zaprojektowanego wokół nawyków.",
      "Building a visual language for the kitchen.": "Budowanie języka wizualnego dla kuchni.",
      "Label Printer Origins": "Początki drukarki etykiet",
      "The problem changed": "Problem się zmienił",
      "AxiomScale Evolution": "Ewolucja AxiomScale",
      "From markers to interaction language": "Od znaczników do języka interakcji",
      "What the tokens taught the product": "Czego tokeny nauczyły produkt",
      "From letters to symbols": "Od liter do symboli",
      "What the icons taught the product": "Czego ikony nauczyły produkt",
      "The Alphabet Soup": "Zupa alfabetowa",
      "Signs Of Life": "Oznaki życia",
      "Now We're Cooking": "Teraz zaczyna się gotowanie",
      "No Excuses": "Bez wymówek",
      "What Am I Building?": "Co ja buduję?",
      "Breadboards Are Not For Bread": "Płytki stykowe nie są do chleba",
      "1 June 2026": "1 czerwca 2026",
      "2 June 2026": "2 czerwca 2026",
      "5 June 2026": "5 czerwca 2026",
      "9 June 2026": "9 czerwca 2026",
      "11 June 2026": "11 czerwca 2026",
      "16 June 2026": "16 czerwca 2026",
      "Six months ago I decided to stop making excuses.": "Sześć miesięcy temu postanowiłem przestać szukać wymówek.",
      "Before working in IT, I spent time working as a chef.": "Zanim zacząłem pracować w IT, pracowałem jako kucharz.",
      "Having finally convinced myself that the mission was simply to print one label, I faced a new problem. I had absolutely no idea how to build a label printer.": "Gdy w końcu przekonałem sam siebie, że misja polega po prostu na wydrukowaniu jednej etykiety, pojawił się nowy problem. Nie miałem absolutnie pojęcia, jak zbudować drukarkę etykiet.",
      "The breadboard had taught me an important lesson:": "Płytka stykowa nauczyła mnie ważnej lekcji:",
      "Having finally defeated the Spaghetti Monster and convinced myself that the wires were connected correctly, it was time for the next logical step.": "Gdy w końcu pokonałem kabelkowy chaos i przekonałem siebie, że przewody są podłączone poprawnie, przyszedł czas na następny logiczny krok.",
      "Following the successful display of dlroW olleH, progress accelerated rapidly.": "Po udanym wyświetleniu dlroW olleH postępy szybko przyspieszyły.",
      "Language selector": "Wybór języka",
      "Project Status | Project Axiom": "Status projektu | Project Axiom",
      "Axiom Saga | Project Axiom": "Axiom Saga | Project Axiom",
      "Tester Insights | Project Axiom": "Wnioski z testów | Project Axiom",
      "Jack | Tester Insights | Project Axiom": "Jack | Wnioski z testów | Project Axiom",
      "Senda | Tester Insights | Project Axiom": "Senda | Wnioski z testów | Project Axiom",
      "Ivaylo | Tester Insights | Project Axiom": "Ivaylo | Wnioski z testów | Project Axiom",
      "Hardware Evolution | Project Axiom": "Ewolucja sprzętu | Project Axiom",
      "Token Evolution | Project Axiom": "Ewolucja tokenów | Project Axiom",
      "Icon Evolution | Project Axiom": "Ewolucja ikon | Project Axiom",
      "Axiom Saga episode navigation": "Nawigacja po odcinkach Axiom Saga",
      "Tester insight navigation": "Nawigacja po wnioskach testerów",
      "Saga homepage navigation": "Nawigacja po dzienniku na stronie głównej",
      "Open Hardware Evolution gallery": "Otwórz galerię ewolucji sprzętu",
      "Open Token Evolution gallery": "Otwórz galerię ewolucji tokenów",
      "Open Icon Evolution gallery": "Otwórz galerię ewolucji ikon",
      "Register Interest": "Zgłoszenie zainteresowania",
      "3D Printing Begins": "Początek druku 3D",
      "March 2026. The search for a suitable enclosure moved from ideas into physical prototypes.": "Marzec 2026. Poszukiwanie odpowiedniej obudowy przeszło od pomysłów do fizycznych prototypów.",
      "Fighting Physics": "Walka z fizyką",
      "March 2026. Multiple enclosure designs failed, revealing the realities of manufacturing and materials.": "Marzec 2026. Kolejne projekty obudowy zawodziły, pokazując realia produkcji i materiałów.",
      "First Test Prototype": "Pierwszy prototyp testowy",
      "March 2026. The first complete label-printing device was assembled and ready for testing.": "Marzec 2026. Pierwsze kompletne urządzenie do drukowania etykiet zostało złożone i było gotowe do testów.",
      "The Tester Problem": "Problem z testerami",
      "March 2026. Finding people willing to test the system proved harder than building it.": "Marzec 2026. Znalezienie osób chętnych do testowania systemu okazało się trudniejsze niż jego zbudowanie.",
      "Weight Loss Journey": "Droga do redukcji wagi",
      "A personal health journey unexpectedly brought the problem space much closer to home.": "Osobista droga zdrowotna niespodziewanie sprawiła, że problem stał się dużo bliższy.",
      "Becoming the User": "Stanie się użytkownikiem",
      "Daily calorie tracking transformed the problem from theory into lived experience.": "Codzienne liczenie kalorii zmieniło problem z teorii w osobiste doświadczenie.",
      "New Ideas Emerge": "Pojawiają się nowe pomysły",
      "March 2026. While refining the printer, new concepts around NFC and food tracking began to appear.": "Marzec 2026. Podczas dopracowywania drukarki zaczęły pojawiać się nowe pomysły związane z NFC i śledzeniem jedzenia.",
      "First AxiomScale Concepts": "Pierwsze koncepcje AxiomScale",
      "March 2026. Early ideas emerged for combining food identification and logging into a single workflow.": "Marzec 2026. Pojawiły się pierwsze pomysły na połączenie identyfikacji jedzenia i zapisywania w jeden proces.",
      "Commercial Reality": "Rzeczywistość komercyjna",
      "March 2026. Manufacturing, certification and support considerations forced a reassessment of the project's direction.": "Marzec 2026. Produkcja, certyfikacja i wsparcie wymusiły ponowne przemyślenie kierunku projektu.",
      "Choosing a Path": "Wybór kierunku",
      "March 2026. The decision was made to focus on a single product rather than multiple parallel ideas.": "Marzec 2026. Zapadła decyzja, by skupić się na jednym produkcie zamiast kilku równoległych pomysłów.",
      "Food Logging Friction Rediscovered": "Problem zapisywania jedzenia wraca",
      "April 2026. The biggest obstacle proved not to be food identification, but the effort required to log it.": "Kwiecień 2026. Największą przeszkodą okazała się nie identyfikacja jedzenia, ale wysiłek potrzebny, by je zapisać.",
      "Problem Redefined": "Problem zdefiniowany na nowo",
      "March 2026. The project's focus shifted from organisation and labelling towards reducing logging friction itself.": "Marzec 2026. Projekt przesunął się z organizacji i etykietowania w stronę ograniczania przeszkód w samym zapisywaniu.",
      "NFC Takes Centre Stage": "NFC trafia do centrum projektu",
      "March 2026. NFC emerged as the most natural way to identify food without disrupting kitchen workflows.": "Marzec 2026. NFC okazało się najbardziej naturalnym sposobem identyfikowania jedzenia bez zakłócania pracy w kuchni.",
      "The First AxiomScale Concepts": "Pierwsze koncepcje AxiomScale",
      "March 2026. The first ideas appeared for combining weighing and identification into a single action.": "Marzec 2026. Pojawiły się pierwsze pomysły na połączenie ważenia i identyfikacji w jedną czynność.",
      "The First AxiomScale Prototype": "Pierwszy prototyp AxiomScale",
      "April 2026. The first scale capable of weighing and identifying food became a reality.": "Kwiecień 2026. Pierwsza waga zdolna do ważenia i identyfikowania jedzenia stała się rzeczywistością.",
      "Building the Ecosystem": "Budowanie ekosystemu",
      "April 2026. Development expanded beyond hardware into firmware, tags and companion applications.": "Kwiecień 2026. Rozwój wyszedł poza sprzęt i objął firmware, tagi oraz aplikacje towarzyszące.",
      "The First App Connection": "Pierwsze połączenie z aplikacją",
      "April 2026. Data successfully moved between the scale and companion application for the first time.": "Kwiecień 2026. Dane po raz pierwszy poprawnie przeszły między wagą a aplikacją towarzyszącą.",
      "Identity Becomes Essential": "Tożsamość staje się kluczowa",
      "April 2026. The system evolved from tracking food to tracking who was consuming it.": "Kwiecień 2026. System przeszedł od śledzenia jedzenia do rozpoznawania, kto je spożywa.",
      "Recipe Workflows Emerge": "Pojawiają się procesy przepisów",
      "April 2026. Attention shifted from individual ingredients to complete meal preparation workflows.": "Kwiecień 2026. Uwaga przesunęła się z pojedynczych składników na pełne procesy przygotowywania posiłków.",
      "More Tokens, More Problems": "Więcej tokenów, więcej problemów",
      "April 2026. Solving identification by adding tokens revealed a new source of friction.": "Kwiecień 2026. Rozwiązywanie identyfikacji przez dodawanie tokenów ujawniło nowe przeszkody.",
      "Passive Logging Discovered": "Odkrycie pasywnego zapisywania",
      "April 2026. Fixed-location tags demonstrated a simpler way to capture repetitive actions.": "Kwiecień 2026. Tagi w stałych miejscach pokazały prostszy sposób zapisywania powtarzalnych działań.",
      "The Coffee Jar Insight": "Wniosek ze słoika z kawą",
      "April 2026. A simple sticker on a coffee jar validated the value of near-effortless logging.": "Kwiecień 2026. Prosta naklejka na słoiku z kawą potwierdziła wartość prawie bezwysiłkowego zapisywania.",
      "From Prototype to Product": "Od prototypu do produktu",
      "May 2026. Focus expanded from proving the concept to creating something others could use.": "Maj 2026. Uwaga przesunęła się z udowodnienia koncepcji na stworzenie czegoś, czego mogą używać inni.",
      "The First External Tester": "Pierwszy zewnętrzny tester",
      "June 2026. The device left the development environment and entered real-world use.": "Czerwiec 2026. Urządzenie opuściło środowisko projektowe i trafiło do prawdziwego użycia.",
      "Household Validation Begins": "Zaczynają się testy domowe",
      "June 2026. Testing moved into genuine household routines and daily habits.": "Czerwiec 2026. Testy weszły w prawdziwe domowe rutyny i codzienne nawyki.",
      "Public Development Begins": "Początek publicznego rozwoju",
      "June 2026. The project's journey started being documented publicly through the website and saga.": "Czerwiec 2026. Droga projektu zaczęła być publicznie dokumentowana na stronie i w sadze.",
      "The Current Testing Phase": "Obecna faza testów",
      "June 2026. Multiple testers are now evaluating the system while development continues.": "Czerwiec 2026. Kilku testerów ocenia system, a rozwój trwa dalej.",
      "Looking Beyond the Prototype": "Myślenie poza prototypem",
      "June 2026. Attention is beginning to shift from validation toward what a future product could become.": "Czerwiec 2026. Uwaga zaczyna przesuwać się z testów na to, czym może stać się przyszły produkt.",
      "Testers are not signing up for a finished product. They are helping influence the direction of AxiomScale while key decisions are still being made. Real-world use often reveals things that planning alone cannot, from unexpected frustrations to better ways of using the system.": "Testerzy nie zapisują się na gotowy produkt. Pomagają wpływać na kierunek AxiomScale, gdy kluczowe decyzje wciąż są podejmowane. Prawdziwe użycie często pokazuje rzeczy, których samo planowanie nie ujawni: od nieoczekiwanych frustracji po lepsze sposoby korzystania z systemu.",
      "The goal is not simply to find bugs. It is to understand how the device fits into everyday routines, which workflows feel natural, and which problems are genuinely worth solving. Feedback from testers helps guide where development goes next.": "Celem nie jest tylko znajdowanie błędów. Chodzi o zrozumienie, jak urządzenie pasuje do codziennych rutyn, które procesy są naturalne i które problemy naprawdę warto rozwiązać. Opinie testerów pomagają wyznaczać dalszy kierunek rozwoju.",
      "If you enjoy trying new ideas and providing honest feedback, we'd love to hear from you.": "Jeśli lubisz sprawdzać nowe pomysły i dawać szczerą opinię, chętnie się odezwiemy.",
      "V2": "V2",
      "V1": "V1",
      "Now": "Teraz",
      "Next": "Następny",
      "Current hardware focus": "Obecny kierunek prac nad sprzętem",
      "Improve durability, reduce physical bulk, tighten the NFC interaction area, and keep the device understandable during cooking.": "Poprawić trwałość, zmniejszyć gabaryty, dopracować obszar interakcji NFC i utrzymać urządzenie zrozumiałe podczas gotowania.",
      "Logging workflow": "Proces zapisywania",
      "The system is being tested around natural weighing, repeated foods, token assignment, and later review rather than live phone interaction.": "System jest testowany wokół naturalnego ważenia, powtarzalnych produktów, przypisywania tokenów i późniejszego przeglądu zamiast bieżącej pracy z telefonem.",
      "Current software focus": "Obecny kierunek prac nad oprogramowaniem",
      "Improve sync reliability, reduce setup confusion, refine correction flows, and capture logs in a way testers can understand later.": "Poprawić niezawodność synchronizacji, ograniczyć niejasności przy konfiguracji, dopracować poprawianie danych i zapisywać logi tak, by testerzy mogli je później zrozumieć.",
      "The useful feedback is the feedback that changes the product: what confused people, what survived repeat use, and what failed in ordinary kitchens.": "Najbardziej przydatna opinia to ta, która zmienia produkt: co ludzi myliło, co przetrwało powtarzalne użycie i co zawiodło w zwykłych kuchniach.",
      "Tester count": "Liczba testerów",
      "3 independent users currently testing or preparing to test the system in real household conditions.": "3 niezależnych użytkowników testuje albo przygotowuje się do testowania systemu w prawdziwych warunkach domowych.",
      "Current testing focus": "Obecny zakres testów",
      "Reliability, setup friction, repeated use, NFC token behaviour, and whether the workflow feels worth keeping.": "Niezawodność, pierwsza konfiguracja, powtarzalne użycie, zachowanie tokenów NFC i to, czy cały proces wydaje się wart zachowania.",
      "Open questions": "Otwarte pytania",
      "How much guidance is needed, which token patterns survive real kitchens, and which mistakes are easy to recover from later.": "Ile wskazówek potrzeba, które wzorce tokenów przetrwają prawdziwe kuchnie i które błędy da się łatwo poprawić później.",
      "Fixed-location or container-attached tags can make repeated behaviours feel natural rather than like another task.": "Tagi w stałym miejscu albo przymocowane do pojemników mogą sprawić, że powtarzalne działania będą naturalne, a nie kolejnym zadaniem.",
      "Adding identifiers solves one problem but can create another if tokens need too much management, storage, or remembering.": "Dodawanie identyfikatorów rozwiązuje jeden problem, ale może tworzyć kolejny, jeśli tokeny wymagają zbyt dużo zarządzania, przechowywania albo pamiętania.",
      "Pairing, NFC writing, first log setup, and sync instructions are part of the product experience, not admin around it.": "Parowanie, zapis NFC, pierwszy zapis i instrukcje synchronizacji są częścią doświadczenia produktu, a nie administracją obok niego.",
      "Bring more imperfect kitchens and more ordinary cooking routines into the feedback loop.": "Wprowadzić do pętli opinii więcej niedoskonałych kuchni i zwykłych rutyn gotowania.",
      "Make imperfect logs easier to understand, correct, and trust after the cooking moment.": "Ułatwić rozumienie, poprawianie i późniejsze zaufanie do niedoskonałych zapisów.",
      "Use the slimmer prototype to test whether the product form is moving in the right direction.": "Użyć smuklejszego prototypu, by sprawdzić, czy forma produktu idzie w dobrym kierunku.",
      "Turn tester observations into clearer evidence for reliability, repeat use, and product value.": "Przekuć obserwacje testerów w czytelniejsze dowody niezawodności, powtarzalnego użycia i wartości produktu.",
      "Follow the path from label printer to AxiomScale.": "Prześledź drogę od drukarki etykiet do AxiomScale.",
      "See how NFC tags became an interaction language.": "Zobacz, jak tagi NFC stały się językiem interakcji.",
      "Review the visual language work behind the tokens.": "Zobacz pracę nad językiem wizualnym stojącą za tokenami.",
      "Printer Wars: First Contact": "Wojny drukarek: Pierwszy kontakt",
      "Printer Wars: Ancient Dialects": "Wojny drukarek: Starożytne dialekty",
      "Printer Wars: Boat-Shaped Cubes": "Wojny drukarek: Kostki w kształcie łodzi",
      "19 June 2026": "19 czerwca 2026",
      "24 June 2026": "24 czerwca 2026",
      "2 July 2026": "2 lipca 2026",
      "The printer finally arrived.": "Drukarka w końcu dotarła.",
      "The USB-to-UART adapter arrived the next day.": "Adapter USB-to-UART dotarł następnego dnia.",
      "With the thermal printer finally behaving itself, the project had quietly reached a major milestone.": "Gdy drukarka termiczna w końcu zaczęła współpracować, projekt po cichu osiągnął ważny kamień milowy.",
      "electronic parts on a rubber soldering mat": "części elektroniczne na gumowej macie do lutowania",
      "food container label with date and alergy information": "etykieta pojemnika na jedzenie z datą i informacją o alergenach",
      "ESP board wiring disaster showing elecronics jumpers everywhere": "chaos przewodów na płytce ESP z przewodami połączeniowymi wszędzie",
      "port and wirind diagrams label for electronic device": "etykieta z portami i schematami przewodów urządzenia elektronicznego",
      "electronics component lcd screen": "ekran LCD jako komponent elektroniczny",
      "electronic device prototype with lcd screen and 4x4 keypad": "prototyp urządzenia elektronicznego z ekranem LCD i klawiaturą 4x4",
      "Thermal printer label with readable food item details": "etykieta z drukarki termicznej z czytelnymi szczegółami produktu",
      "Warped 3D printer enclosure lifting from the bed into a boat-shaped curve": "zdeformowana obudowa z drukarki 3D unosząca się z powierzchni w kształt łodzi",
      "Advanced AxiomScale prototype with dedicated controls, display and NFC interaction area.": "zaawansowany prototyp AxiomScale z dedykowanymi przyciskami, ekranem i obszarem interakcji NFC",
      "Advanced token set showing the evolution toward a consistent NFC interaction language.": "zaawansowany zestaw tokenów pokazujący rozwój w stronę spójnego języka interakcji NFC",
      "Advanced livestock and meat icon system designed for direct food identification.": "zaawansowany system ikon zwierząt i mięsa zaprojektowany do bezpośredniej identyfikacji jedzenia",
      "Label Printing Experiments": "Eksperymenty z drukowaniem etykiet",
      "First Electronics Bring-Up": "Pierwsze uruchomienie elektroniki",
      "Display Feedback": "Informacja zwrotna na ekranie",
      "Handheld Layout Testing": "Test układu urządzenia ręcznego",
      "Portable Form Study": "Badanie formy przenośnej",
      "Physical Input Decisions": "Decyzje o fizycznym sterowaniu",
      "Workshop Assembly": "Montaż warsztatowy",
      "Keypad Logic Testing": "Test logiki klawiatury",
      "Input Prototype": "Prototyp wejścia",
      "Handheld Printer Trial": "Próba drukarki ręcznej",
      "Connector Refinement": "Dopracowanie złącza",
      "Internal Wiring": "Wewnętrzne okablowanie",
      "Recycled Prototype": "Prototyp z materiałów z odzysku",
      "Thermal Printer Integration": "Integracja drukarki termicznej",
      "Refined Printer Body": "Dopracowana obudowa drukarki",
      "Working Label Printer": "Działająca drukarka etykiet",
      "Tracking Food Preparation": "Śledzenie przygotowania jedzenia",
      "First Scale Prototype": "Pierwszy prototyp wagi",
      "Measuring Weight Reliably": "Niezawodne mierzenie wagi",
      "The NFC Discovery": "Odkrycie NFC",
      "Combining Identification and Weight": "Połączenie identyfikacji i ważenia",
      "Sensor Placement": "Umieszczenie czujników",
      "Mounting Refinement": "Dopracowanie mocowania",
      "Control System Integration": "Integracja systemu sterowania",
      "Load Distribution Tests": "Testy rozkładu obciążenia",
      "Firmware Platform": "Platforma firmware",
      "Full-Size Weighing Surface": "Pełnowymiarowa powierzchnia ważenia",
      "Pre-Integration Assembly": "Montaż przed integracją",
      "Fully Wired Prototype": "W pełni okablowany prototyp",
      "First Complete Scale": "Pierwsza kompletna waga",
      "Building a Better Enclosure": "Budowanie lepszej obudowy",
      "Improving Rigidity": "Poprawa sztywności",
      "Internal Architecture": "Architektura wewnętrzna",
      "Manufacturing Lessons": "Lekcje z produkcji",
      "Rapid Enclosure Iteration": "Szybkie iteracje obudowy",
      "Real-World Weighing": "Ważenie w prawdziwym użyciu",
      "Accuracy Validation": "Sprawdzanie dokładności",
      "Towards a Consumer Product": "W stronę produktu konsumenckiego",
      "Current SmartScale Prototype": "Obecny prototyp SmartScale",
      "Container Tag Experiment": "Eksperyment z tagiem na pojemniku",
      "First Token Shapes": "Pierwsze kształty tokenów",
      "Letter-Based Shortcuts": "Skróty oparte na literach",
      "Testing Form Factors": "Testowanie form fizycznych",
      "Batch Prototype Run": "Seria prototypowych tokenów",
      "Category Language": "Język kategorii",
      "Visual Marker Trial": "Próba znaczników wizualnych",
      "Colour-Coded Groups": "Grupy oznaczone kolorami",
      "Expanding the Token Family": "Rozszerzanie rodziny tokenów",
      "Moving From Letters to Icons": "Przejście od liter do ikon",
      "Large Visual System Test": "Duży test systemu wizualnego",
      "Clearer Organisation": "Czytelniejsza organizacja",
      "Mature Token Ecosystem": "Dojrzalszy ekosystem tokenów",
      "A Consistent Interaction Language": "Spójny język interakcji",
      "First Category Icons": "Pierwsze ikony kategorii",
      "Improving Consistency": "Poprawa spójności",
      "Reduced Colour Test": "Test ograniczonej palety kolorów",
      "Contrast and Visibility": "Kontrast i widoczność",
      "Ingredient-Specific Detail": "Szczegóły konkretnych składników",
      "Actions and App Functions": "Akcje i funkcje aplikacji",
      "Hand-Drawn Language": "Ręcznie rysowany język",
      "Fruit Recognition": "Rozpoznawanie owoców",
      "Dairy Recognition": "Rozpoznawanie nabiału",
      "Protein Categories": "Kategorie białka",
      "System Icon Set": "Zestaw ikon systemowych",
      "Printed Token Trial": "Próba drukowanych tokenów",
      "Full Icon Sheet": "Pełna plansza ikon",
      "Style Comparison": "Porównanie stylów",
      "Simplifying for Manufacture": "Uproszczenie pod produkcję",
      "Vegetable Detail Set": "Zestaw szczegółowych ikon warzyw",
      "Advanced Ingredient Language": "Zaawansowany język składników"
    },
  };

  const normalise = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

  const translateString = (value, lang = getLanguage()) => {
    if (lang === "en") return value;
    const dictionary = translations[lang] || {};
    return dictionary[value] || dictionary[normalise(value)] || value;
  };

  const getLanguage = () => (localStorage.getItem(STORAGE_KEY) === "pl" ? "pl" : "en");

  const setLanguage = (lang) => {
    localStorage.setItem(STORAGE_KEY, lang === "pl" ? "pl" : "en");
    applyLanguage(document);
    window.dispatchEvent(new CustomEvent("axiom-language-change", { detail: { language: getLanguage() } }));
  };

  const shouldSkip = (node) => {
    const parent = node.parentElement;
    return !parent || parent.closest("script, style, textarea, input, [data-no-translate]");
  };

  const translateTextNodes = (root, lang) => {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach((node) => {
      if (shouldSkip(node) || !normalise(node.nodeValue)) return;
      if (!node.__axiomOriginalText) node.__axiomOriginalText = node.nodeValue;
      const original = node.__axiomOriginalText;
      const translated = translateString(original, lang);
      const leading = original.match(/^\s*/)?.[0] || "";
      const trailing = original.match(/\s*$/)?.[0] || "";
      node.nodeValue = lang === "en" ? original : `${leading}${translated}${trailing}`;
    });
  };

  const translateAttributes = (root, lang) => {
    root.querySelectorAll("[aria-label], [alt], [title], [placeholder]").forEach((node) => {
      ["aria-label", "alt", "title", "placeholder"].forEach((attr) => {
        if (!node.hasAttribute(attr)) return;
        const key = `axiomOriginal${attr.replace(/[^a-z0-9]/gi, "")}`;
        if (!node.dataset[key]) node.dataset[key] = node.getAttribute(attr);
        const original = node.dataset[key];
        node.setAttribute(attr, lang === "en" ? original : translateString(original, lang));
      });
    });
  };

  const ensureSwitcher = () => {
    const header = document.querySelector(".site-header");
    if (!header || header.querySelector(".language-switcher")) return;

    const switcher = document.createElement("div");
    switcher.className = "language-switcher";
    switcher.setAttribute("aria-label", "Language selector");
    switcher.innerHTML = Object.entries(languages).map(([code, language]) => `
      <button type="button" data-language="${code}" aria-label="${language.label}">
        ${language.shortLabel}
      </button>
    `).join("");

    header.appendChild(switcher);
    switcher.addEventListener("click", (event) => {
      const button = event.target.closest("[data-language]");
      if (button) setLanguage(button.dataset.language);
    });
  };

  const updateSwitcher = (lang) => {
    document.querySelectorAll("[data-language]").forEach((button) => {
      const isActive = button.dataset.language === lang;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  };

  const applyLanguage = (root = document) => {
    const lang = getLanguage();
    document.documentElement.lang = lang;
    document.body?.classList.toggle("language-pl", lang === "pl");
    translateTextNodes(root, lang);
    translateAttributes(root, lang);
    updateSwitcher(lang);
  };

  const initNavigation = () => {
    const header = document.querySelector(".site-header");
    const nav = document.querySelector(".site-nav");
    const toggle = document.querySelector(".nav-toggle");

    if (!header || !nav || !toggle) return;

    const closeMenu = () => {
      header.classList.remove("menu-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = header.classList.toggle("menu-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
  };

  const observeChanges = () => {
    let scheduled = false;
    const observer = new MutationObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        applyLanguage(document);
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });
  };

  window.AXIOM_I18N = {
    getLanguage,
    setLanguage,
    translate: translateString,
    translatePage: applyLanguage,
  };

  ensureSwitcher();
  initNavigation();
  applyLanguage(document);
  observeChanges();
})();
