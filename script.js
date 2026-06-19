(() => {
  const STORAGE_KEY = "axiom-language";
  const languages = {
    en: { label: "English", shortLabel: "EN" },
    pl: { label: "Polski", shortLabel: "PL" },
  };

  const translations = {
    pl: {
      "Project Axiom": "Project Axiom",
      "Project Axiom home": "Strona glowna Project Axiom",
      "Open navigation menu": "Otworz menu nawigacji",
      "Primary navigation": "Nawigacja glowna",
      "Product": "Produkt",
      "Status": "Status",
      "Current Status": "Aktualny status",
      "Timeline": "Oś czasu",
      "Project Status": "Status projektu",
      "Stories": "Historie",
      "Tester Insights": "Wnioski testerow",
      "Gallery": "Galeria",
      "Saga": "Saga",
      "Testers": "Testerzy",
      "Help shape it": "Pomoz go ksztaltowac",
      "Help shape AxiomScale": "Pomoz ksztaltowac AxiomScale",
      "Building AxiomScale in public.": "Budujemy AxiomScale publicznie.",
      "Building AxiomScale in public": "Budujemy AxiomScale publicznie",
      "Project Axiom is an active product-development journey.": "Project Axiom to aktywna droga tworzenia produktu.",
      "We are building AxiomScale in the open: an ongoing attempt to make food logging less frustrating\n            through NFC tags, smart weighing, and thoughtful companion software. The product is working, but it\n            is still being tested, challenged, and shaped by real kitchen use.": "Budujemy AxiomScale otwarcie: to trwajaca proba zmniejszenia frustracji zwiazanej z zapisywaniem jedzenia dzieki tagom NFC, inteligentnemu wazeniu i przemyslanej aplikacji. Produkt dziala, ale nadal jest testowany, kwestionowany i ksztaltowany przez prawdziwe uzycie w kuchni.",
      "Read the build journal": "Czytaj dziennik budowy",
      "See current status": "Zobacz aktualny status",
      "What is being built": "Co powstaje",
      "Food logging shouldn't require a phone every time you cook.": "Zapisywanie jedzenia nie powinno wymagac telefonu za kazdym razem, gdy gotujesz.",
      "The working hypothesis is simple: if you already know what you're holding and you're already weighing it, logging should happen naturally in the kitchen. The app should be there when you want insight, not when you're preparing food.": "Hipoteza jest prosta: jesli juz wiesz, co trzymasz, i juz to wazysz, zapis powinien wydarzyc sie naturalnie w kuchni. Aplikacja powinna byc tam, gdy chcesz wgladu, a nie wtedy, gdy przygotowujesz jedzenie.",
      "Identify once": "Zidentyfikuj raz",
      "Tell Axiom what the ingredient is.": "Powiedz Axiomowi, czym jest skladnik.",
      "Most people eat the same foods repeatedly. Assign an ingredient or recipe to a reusable Axiom token once, then simply place the token on the scale when preparing it again.": "Wiekszosc ludzi je te same produkty wielokrotnie. Przypisz skladnik albo przepis do wielorazowego tokena Axiom raz, a pozniej po prostu poloz token na wadze, gdy przygotowujesz go ponownie.",
      "Weigh naturally": "Waz naturalnie",
      "Cook as normal. The scale captures the weight.": "Gotuj normalnie. Waga przechwytuje mase.",
      "The valuable effort is already happening when food is placed on the scale. Axiom aims to capture that information without introducing phone interaction into the cooking process.": "Najcenniejsza czynnosc juz dzieje sie wtedy, gdy jedzenie trafia na wage. Axiom ma przechwytywac te informacje bez wprowadzania telefonu do procesu gotowania.",
      "Review when convenient": "Sprawdz, gdy wygodnie",
      "Use the app when you want insight, not while preparing food.": "Uzywaj aplikacji, gdy chcesz wgladu, a nie podczas przygotowywania jedzenia.",
      "Calories, macros, trends, meal history, and corrections can be reviewed later. The goal is to keep the phone out of the kitchen until it is actually useful.": "Kalorie, makroskladniki, trendy, historia posilkow i poprawki mozna przejrzec pozniej. Celem jest trzymanie telefonu poza kuchnia, dopoki naprawde nie jest potrzebny.",
      "Current status": "Aktualny status",
      "Working prototype, active validation.": "Dzialajacy prototyp, aktywna walidacja.",
      "Project Axiom is past the pure concept stage, but not presented as a finished commercial product.": "Project Axiom wyszedl poza etap samej koncepcji, ale nie jest przedstawiany jako gotowy produkt komercyjny.",
      "Hardware prototype": "Prototyp sprzetu",
      "2 working prototypes assembled and out in households for testing.": "Zlozono 2 dzialajace prototypy, ktore sa testowane w domach.",
      "Android app": "Aplikacja Android",
      "Working. NFC writing, local persistence, food search, and Bluetooth sync are in tester-baseline form.": "Dziala. Zapis NFC, lokalne przechowywanie, wyszukiwanie jedzenia i synchronizacja Bluetooth sa w wersji bazowej dla testerow.",
      "V2 hardware": "Sprzet V2",
      "Slimmer second-generation prototype currently being assembled.": "Smuklejszy prototyp drugiej generacji jest obecnie skladany.",
      "Testing programme": "Program testow",
      "3 independent users currently testing, with real-world validation as the current stage.": "3 niezaleznych uzytkownikow aktualnie testuje system; obecnym etapem jest walidacja w realnych warunkach.",
      "View Full Project Status": "Zobacz pelny status projektu",
      "Project timeline": "Oś czasu projektu",
      "Every product decision leaves a trail.": "Kazda decyzja produktowa zostawia slad.",
      "This timeline highlights the key moments where the project changed direction, revealing how AxiomScale evolved from a kitchen labelling idea into a new approach to food logging.": "Ta o czasu pokazuje kluczowe momenty, w ktorych projekt zmienial kierunek, ujawniajac jak AxiomScale przeszedl od pomyslu na etykiety kuchenne do nowego podejscia do zapisywania jedzenia.",
      "Completed project timeline milestones": "Ukonczone kamienie milowe projektu",
      "Idea": "Pomysl",
      "December 2025. A long-standing frustration with kitchen labelling finally became a project worth pursuing.": "Grudzien 2025. Dlugotrwala frustracja zwiazana z etykietami kuchennymi w koncu stala sie projektem wartym realizacji.",
      "Parts Ordered": "Zamowiono czesci",
      "January 2026. The first components were purchased and the project officially began.": "Styczen 2026. Kupiono pierwsze komponenty i projekt oficjalnie sie rozpoczal.",
      "First Assembly": "Pierwszy montaz",
      "February 2026. Individual parts started coming together into a working system.": "Luty 2026. Pojedyncze czesci zaczely skladac sie w dzialajacy system.",
      "Hello World": "Hello World",
      "February 2026. The first successful communication proved the core electronics could work together.": "Luty 2026. Pierwsza udana komunikacja pokazala, ze podstawowa elektronika moze dzialac razem.",
      "First Label Printed": "Pierwsza wydrukowana etykieta",
      "March 2026. The system produced its first usable kitchen label.": "Marzec 2026. System wydrukowal pierwsza uzyteczna etykiete kuchenna.",
      "The Enclosure Problem": "Problem obudowy",
      "March 2026. A working prototype now needed a practical physical form.": "Marzec 2026. Dzialajacy prototyp potrzebowal praktycznej formy fizycznej.",
      "Tester stories": "Historie testerow",
      "Real-world observations, not testimonials.": "Obserwacje z realnego swiata, nie referencje.",
      "The useful stories are the ones that change the product: what confused people, what survived repeat use, and what failed in ordinary kitchens.": "Przydatne historie to te, ktore zmieniaja produkt: co ludzi mylilo, co przetrwalo powtarzalne uzycie i co zawodzilo w zwyklych kuchniach.",
      "More Is More": "Wiecej znaczy wiecej",
      "From the beginning, my philosophy was simple: more tokens meant less friction. If every ingredient had its own NFC token, identifying food would become effortless and logging would naturally become easier.": "Od poczatku moja filozofia byla prosta: wiecej tokenow oznaczalo mniej tarcia. Gdyby kazdy skladnik mial wlasny token NFC, identyfikowanie jedzenia staloby sie bezwysilkowe, a zapisywanie naturalnie latwiejsze.",
      "The Recipe Tag Surprise": "Zaskoczenie tagiem przepisu",
      "I assumed that needing to identify every ingredient individually would become frustrating, so I explored recipe tags, guided cooking workflows, and various ways of reducing the number of interactions required.": "Zakladalem, ze identyfikowanie kazdego skladnika osobno stanie sie frustrujace, wiec badalem tagi przepisow, prowadzone przeplywy gotowania i rozne sposoby ograniczania liczby potrzebnych interakcji.",
      "Pretty Isn't Useful": "Ladne nie zawsze jest uzyteczne",
      "I spent a surprising amount of time refining the visual language of the tokens. Food icons went through countless revisions as I searched for something that felt polished, modern, and attractive enough to live permanently on a kitchen worktop.": "Spedzilem zaskakujaco duzo czasu dopracowujac jezyk wizualny tokenow. Ikony jedzenia przechodzily niezliczone wersje, gdy szukalem czegos dopracowanego, nowoczesnego i na tyle atrakcyjnego, by stale mieszkalo na blacie kuchennym.",
      "Read More": "Czytaj dalej",
      "Axiom Visual Evolution": "Ewolucja wizualna Axiom",
      "The journey matters as much as the destination.": "Droga jest rownie wazna jak cel.",
      "Axiom wasn't designed in a single breakthrough moment. It emerged through prototypes, failed assumptions, real-world testing, and continuous refinement.": "Axiom nie powstal w jednym przelomowym momencie. Wyłonil sie przez prototypy, bledne zalozenia, testy w realnym swiecie i ciagle dopracowywanie.",
      "Hardware Evolution": "Ewolucja sprzetu",
      "The complete journey from the label printer origins through the development of AxiomScale.": "Pelna droga od poczatkow z drukarka etykiet do rozwoju AxiomScale.",
      "Token Evolution": "Ewolucja tokenow",
      "How NFC tags evolved into a physical interaction language designed around habits and reduced friction.": "Jak tagi NFC ewoluowaly w fizyczny jezyk interakcji zaprojektowany wokol nawykow i mniejszego tarcia.",
      "Icon Evolution": "Ewolucja ikon",
      "The development of a visual language for identifying ingredients, categories and actions at a glance.": "Rozwoj jezyka wizualnego do rozpoznawania skladnikow, kategorii i akcji na pierwszy rzut oka.",
      "Open gallery": "Otworz galerie",
      "From bench prototype to tested product.": "Od prototypu na biurku do testowanego produktu.",
      "A running journal of the AxiomScale build: hardware changes, software decisions, tester feedback, mistakes, fixes, and lessons learned.": "Biezacy dziennik budowy AxiomScale: zmiany sprzetowe, decyzje programowe, opinie testerow, bledy, poprawki i wnioski.",
      "View all entries": "Zobacz wszystkie wpisy",
      "Testing programme": "Program testow",
      "Help shape the product while it is still malleable.": "Pomoz ksztaltowac produkt, dopoki nadal mozna go latwo zmieniac.",
      "Testers are not signing up for a finished beta. They are helping decide what AxiomScale becomes: which workflows survive, which assumptions break, and which problems are worth solving next.": "Testerzy nie zapisują sie na gotowa bete. Pomagaja zdecydowac, czym stanie sie AxiomScale: ktore przeplywy przetrwaja, ktore zalozenia pekna i ktore problemy warto rozwiazac jako nastepne.",
      "Name": "Imie",
      "Email": "Email",
      "What kind of testing could you help with?": "W jakim rodzaju testow moglbys pomoc?",
      "Public development dashboard": "Publiczny panel rozwoju",
      "A transparent snapshot of where Axiom stands today.": "Przejrzysty obraz tego, gdzie Axiom jest dzisiaj.",
      "This page documents current progress, active development work, testing activity, validation evidence, and upcoming milestones for AxiomScale.": "Ta strona dokumentuje aktualne postepy, aktywne prace rozwojowe, testy, dowody walidacji i nadchodzace kamienie milowe AxiomScale.",
      "Current stage": "Aktualny etap",
      "Validation phase.": "Faza walidacji.",
      "AxiomScale is a working prototype system being tested in real households while hardware, app workflows, and setup friction are still being refined.": "AxiomScale to dzialajacy system prototypowy testowany w prawdziwych domach, podczas gdy sprzet, przeplywy aplikacji i tarcie przy konfiguracji sa nadal dopracowywane.",
      "Real-world validation with active prototype and companion-app testing.": "Walidacja w realnych warunkach z aktywnym testowaniem prototypu i aplikacji towarzyszacej.",
      "Key focus areas": "Glowne obszary uwagi",
      "Reliability, setup friction, NFC workflows, Bluetooth sync, and whether the product remains useful during ordinary cooking.": "Niezawodnosc, tarcie przy konfiguracji, przeplywy NFC, synchronizacja Bluetooth i to, czy produkt pozostaje uzyteczny podczas zwyklego gotowania.",
      "Project snapshot": "Migawka projektu",
      "Progress should be measurable, not just described.": "Postep powinien byc mierzalny, a nie tylko opisany.",
      "These indicators are intentionally practical. They show whether the project is accumulating real build and test evidence.": "Te wskazniki sa celowo praktyczne. Pokazuja, czy projekt zbiera prawdziwe dowody budowy i testow.",
      "working prototypes assembled and out in households": "dzialajace prototypy zlozone i testowane w domach",
      "independent users currently testing": "niezaleznych uzytkownikow aktualnie testuje",
      "days since first parts arrived on 5 January 2026": "dni od dotarcia pierwszych czesci 5 stycznia 2026",
      "tester baseline assembled for household validation": "wersja bazowa dla testerow zlozona do walidacji domowej",
      "real-world validation, feedback capture, and V2 assembly": "walidacja w realnych warunkach, zbieranie opinii i montaz V2",
      "Hardware status": "Status sprzetu",
      "Functional prototypes are in use, but the hardware is still evolving.": "Funkcjonalne prototypy sa w uzyciu, ale sprzet nadal ewoluuje.",
      "The priority is not polish for its own sake. The goal is a reliable kitchen object that can survive repeated use and communicate clearly.": "Priorytetem nie jest dopracowanie samo w sobie. Celem jest niezawodny przedmiot kuchenny, ktory zniesie powtarzalne uzycie i bedzie jasno komunikowal.",
      "Prototype version": "Wersja prototypu",
      "V1 tester baseline is assembled and being used for household validation. V2 is being assembled as a slimmer second-generation unit.": "Bazowa wersja V1 dla testerow jest zlozona i uzywana do walidacji domowej. V2 jest skladana jako smuklejsza jednostka drugiej generacji.",
      "Known issues": "Znane problemy",
      "Setup friction, surface fit, repeated-use reliability, enclosure refinement, and manufacturing practicality remain active questions.": "Tarcie przy konfiguracji, dopasowanie powierzchni, niezawodnosc przy powtarzalnym uzyciu, dopracowanie obudowy i praktycznosc produkcji pozostaja aktywnymi pytaniami.",
      "Software status": "Status oprogramowania",
      "The Android app is functional enough for testing.": "Aplikacja Android jest wystarczajaco funkcjonalna do testow.",
      "The app is treated as review and recovery infrastructure rather than something that must interrupt the cooking moment.": "Aplikacja jest traktowana jako infrastruktura przegladu i odzyskiwania, a nie cos, co musi przerywac moment gotowania.",
      "Android application": "Aplikacja Android",
      "Tester-baseline app is working with local persistence, food search, NFC writing, and Bluetooth sync.": "Bazowa aplikacja dla testerow dziala z lokalnym zapisem, wyszukiwaniem jedzenia, zapisem NFC i synchronizacja Bluetooth.",
      "Testing is focused on product truth, not testimonials.": "Testy skupiaja sie na prawdzie o produkcie, nie na referencjach.",
      "Recent learnings": "Ostatnie wnioski",
      "The project has changed because testing changed it.": "Projekt zmienil sie, bo testy go zmienily.",
      "These are validated product lessons rather than a list of completed features.": "To zwalidowane lekcje produktowe, a nie lista ukonczonych funkcji.",
      "Passive logging matters": "Pasywne zapisywanie ma znaczenie",
      "More tokens can create more friction": "Wiecej tokenow moze tworzyc wiecej tarcia",
      "Setup friction is product friction": "Tarcie przy konfiguracji jest tarciem produktu",
      "Next milestones": "Nastepne kamienie milowe",
      "What happens next.": "Co dalej.",
      "The next stage is about broadening validation while tightening the parts of the system that testers actually touch.": "Nastepny etap polega na rozszerzeniu walidacji przy jednoczesnym dopracowaniu czesci systemu, ktorych testerzy faktycznie dotykaja.",
      "Expand household testing": "Rozszerzyc testy domowe",
      "Refine app recovery flows": "Dopracowac przeplywy korekty w aplikacji",
      "Complete V2 hardware assembly": "Ukonczyc montaz sprzetu V2",
      "Define validation goals": "Zdefiniowac cele walidacji",
      "Deeper information": "Glebsze informacje",
      "Follow the evidence trail.": "Podazaj za sladem dowodow.",
      "The dashboard is a snapshot. These pages hold the build history, visual evolution, and tester pathways behind it.": "Panel jest migawka. Te strony zawieraja historie budowy, ewolucje wizualna i sciezki testerow stojace za projektem.",
      "Build Journal": "Dziennik budowy",
      "Read the Axiom Saga episodes.": "Czytaj odcinki Axiom Saga.",
      "Tester Registration": "Rejestracja testerow",
      "Episodes": "Odcinki",
      "People": "Osoby",
      "Axiom Saga": "Axiom Saga",
      "Episode": "Odcinek",
      "Posted": "Opublikowano",
      "Insight": "Wniosek",
      "No published insights yet": "Brak opublikowanych wnioskow",
      "Insights from this tester will appear here once feedback has been approved for publication.": "Wnioski od tego testera pojawia sie tutaj, gdy opinie zostana zatwierdzone do publikacji.",
      "This area is reserved for product-learning notes, tester observations, anonymised feedback summaries, and approved quotes.": "Ten obszar jest zarezerwowany na notatki produktowe, obserwacje testerow, anonimowe podsumowania opinii i zatwierdzone cytaty.",
      "The founder / first tester": "Zalozyciel / pierwszy tester",
      "Tester": "Tester",
      "Project Axiom": "Project Axiom",
      "Edinburgh": "Edynburg",
      "More tokens meant less friction, until the tokens themselves became something to manage.": "Wiecej tokenow oznaczalo mniej tarcia, dopoki same tokeny nie staly sie czyms do zarzadzania.",
      "Trying to eliminate every interaction exposed the real problem: reaching for a phone.": "Proba wyeliminowania kazdej interakcji ujawnila prawdziwy problem: sieganie po telefon.",
      "The clearest token design was not always the prettiest one.": "Najczytelniejszy projekt tokena nie zawsze byl najladniejszy.",
      "Engineering timeline": "O czasu inzynierii",
      "Visual evolution gallery navigation": "Nawigacja galerii ewolucji wizualnej",
      "Timeline chapters": "Rozdzialy osi czasu",
      "Scrollable prototype development timeline": "Przewijana o czasu rozwoju prototypu",
      "Transition": "Zwrot",
      "Learning": "Wniosek",
      "Pivot": "Zmiana kierunku",
      "Development stage": "Etap rozwoju",
      "Image preview": "Podglad obrazu",
      "Close image preview": "Zamknij podglad obrazu",
      "Close": "Zamknij",
      "Prev": "Poprzedni",
      "Previous image": "Poprzedni obraz",
      "Next": "Nastepny",
      "Next image": "Nastepny obraz",
      "View hardware evolution": "Zobacz ewolucje sprzetu",
      "View token evolution": "Zobacz ewolucje tokenow",
      "View icon evolution": "Zobacz ewolucje ikon",
      "From Label Printer to SmartScale": "Od drukarki etykiet do SmartScale",
      "A real product being built in public.": "Prawdziwy produkt budowany publicznie.",
      "From \"one token per thing\" to a language designed around habits.": "Od \"jeden token na rzecz\" do jezyka zaprojektowanego wokol nawykow.",
      "Building a visual language for the kitchen.": "Budowanie jezyka wizualnego dla kuchni.",
      "Label Printer Origins": "Poczatki drukarki etykiet",
      "The problem changed": "Problem sie zmienil",
      "AxiomScale Evolution": "Ewolucja AxiomScale",
      "From markers to interaction language": "Od znacznikow do jezyka interakcji",
      "What the tokens taught the product": "Czego tokeny nauczyly produkt",
      "From letters to symbols": "Od liter do symboli",
      "What the icons taught the product": "Czego ikony nauczyly produkt",
      "The Alphabet Soup": "Zupa alfabetowa",
      "Signs Of Life": "Oznaki zycia",
      "Now We're Cooking": "Teraz zaczyna sie gotowanie",
      "No Excuses": "Bez wymowek",
      "What Am I Building?": "Co ja buduje?",
      "Breadboards Are Not For Bread": "Plytki stykowe nie sa do chleba",
      "1 June 2026": "1 czerwca 2026",
      "2 June 2026": "2 czerwca 2026",
      "5 June 2026": "5 czerwca 2026",
      "9 June 2026": "9 czerwca 2026",
      "11 June 2026": "11 czerwca 2026",
      "16 June 2026": "16 czerwca 2026",
      "Six months ago I decided to stop making excuses.": "Szesc miesiecy temu postanowilem przestac szukac wymowek.",
      "Before working in IT, I spent time working as a chef.": "Zanim zaczalem pracowac w IT, pracowalem jako kucharz.",
      "Having finally convinced myself that the mission was simply to print one label, I faced a new problem. I had absolutely no idea how to build a label printer.": "Gdy w koncu przekonalem sam siebie, ze misja polega po prostu na wydrukowaniu jednej etykiety, pojawil sie nowy problem. Nie mialem absolutnie pojecia, jak zbudowac drukarke etykiet.",
      "The breadboard had taught me an important lesson:": "Plytka stykowa nauczyla mnie waznej lekcji:",
      "Having finally defeated the Spaghetti Monster and convinced myself that the wires were connected correctly, it was time for the next logical step.": "Gdy w koncu pokonalem kabelkowy chaos i przekonalem siebie, ze przewody sa podlaczone poprawnie, przyszedl czas na nastepny logiczny krok.",
      "Following the successful display of dlroW olleH, progress accelerated rapidly.": "Po udanym wyswietleniu dlroW olleH postepy szybko przyspieszyly."
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
