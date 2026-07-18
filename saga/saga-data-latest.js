(() => {
  const latestEntry = {
    "url": "/saga/#best-prototype-nobody-wanted",
    "slug": "best-prototype-nobody-wanted",
    "excerpt": "Eventually... I got there.",
    "heroImage": "/saga/assets/best-prototype-nobody-wanted/finished-prototype.jpg",
    "order": 10,
    "contentHtml": "        <div class=\"article-body\">\n          <p>Eventually...</p>\n          <p>I got there.</p>\n          <p>The printer worked.</p>\n          <p>The enclosure was finally straight.</p>\n          <p>The firmware behaved itself.</p>\n          <p>For the first time, I could place a prep list into the app, send it to the device, complete each item and print a finished label.</p>\n          <p>Exactly as I&#39;d imagined months earlier.</p>\n          <p>It wasn&#39;t just a pile of components anymore.</p>\n          <p>It was a product.</p>\n          <figure>\n            <img src=\"/saga/assets/best-prototype-nobody-wanted/finished-prototype.jpg\" alt=\"Completed label printer prototype with LCD keypad and thermal printer\" />\n            <figcaption>Completed label printer prototype with LCD keypad and thermal printer</figcaption>\n          </figure>\n          <p>Or at least, something that looked remarkably like one.</p>\n          <p>Naturally, I assumed the hard part was over.</p>\n          <p>After all, I&#39;d spent months building it.</p>\n          <p>Surely finding people to test it would be easy.</p>\n          <p>I knew exactly who to ask.</p>\n          <p>I&#39;d spent fourteen years working as a chef.</p>\n          <p>I started calling former colleagues.</p>\n          <p>The first had retired.</p>\n          <p>The second had retired.</p>\n          <p>The third had left catering entirely.</p>\n          <p>The fourth now worked in a completely different industry.</p>\n          <p>Somewhere between me changing careers into IT...</p>\n          <p>...and quietly building this project in the evenings...</p>\n          <p>...my entire pool of potential testers had simply disappeared.</p>\n          <p>Which wasn&#39;t a problem I&#39;d ever considered.</p>\n          <p>I&#39;d built a product.</p>\n          <p>I just didn&#39;t have anyone left to use it.</p>\n          <p>Turns out finding people to test your idea can be every bit as difficult as building the idea itself.</p>\n          <p>Fortunately...</p>\n          <p>...that wasn&#39;t quite the end of the story.</p>\n        </div>",
    "image": "/saga/assets/best-prototype-nobody-wanted/finished-prototype.jpg",
    "date": "18 July 2026",
    "heroAlt": "Completed label printer prototype with LCD keypad and thermal printer",
    "postedDate": "18 July 2026",
    "alt": "Completed label printer prototype with LCD keypad and thermal printer",
    "title": "The Best Prototype Nobody Wanted"
  };

  const entries = Array.isArray(window.AXIOM_SAGA_ENTRIES) ? window.AXIOM_SAGA_ENTRIES : [];
  const existingIndex = entries.findIndex((entry) => entry && entry.slug === latestEntry.slug);

  if (existingIndex >= 0) {
    entries[existingIndex] = latestEntry;
  } else {
    entries.push(latestEntry);
  }

  window.AXIOM_SAGA_ENTRIES = entries;
})();
