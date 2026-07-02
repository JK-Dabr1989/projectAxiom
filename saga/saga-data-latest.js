(() => {
  const latestEntry = {
    "url": "/saga/#printer-wars-boat-shaped-cubes",
    "slug": "printer-wars-boat-shaped-cubes",
    "excerpt": "With the thermal printer finally behaving itself, the project had quietly reached a major milestone.",
    "heroImage": "/saga/assets/printer-wars-boat-shaped-cubes/warped-print.jpeg",
    "order": 9,
    "contentHtml": "        <div class=\"article-body\">\n          <p>With the thermal printer finally behaving itself, the project had quietly reached a major milestone.</p>\n          <p>The app generated prep lists.</p>\n          <p>The device received them.</p>\n          <p>The keypad let me complete a prep.</p>\n          <p>The printer produced exactly the label I&#39;d imagined months earlier.</p>\n          <p>It worked.</p>\n          <p>Properly.</p>\n          <p>For the first time, this strange collection of code, wires and stubbornness actually behaved like a product.</p>\n          <p>Surely the difficult part was behind me.</p>\n          <p>All that remained was a simple plastic box.</p>\n          <p>Fortunately, before attempting anything ambitious, I&#39;d printed the traditional calibration cube.</p>\n          <p>It was beautiful.</p>\n          <p>Sharp corners.</p>\n          <p>Perfect dimensions.</p>\n          <p>Crisp layers.</p>\n          <p>Exactly what every beginner hopes to see.</p>\n          <figure>\n            <img src=\"/saga/assets/printer-wars-boat-shaped-cubes/calibration-cube-x.jpeg\" alt=\"Calibration cube showing clean square sides\" />\n            <figcaption>Calibration cube showing clean square sides</figcaption>\n          </figure>\n          <figure>\n            <img src=\"/saga/assets/printer-wars-boat-shaped-cubes/calibration-cube-y.jpeg\" alt=\"Calibration cube showing crisp printed layers\" />\n            <figcaption>Calibration cube showing crisp printed layers</figcaption>\n          </figure>\n          <p>Clearly, I&#39;d mastered 3D printing.</p>\n          <p>There was one slight complication.</p>\n          <p>I couldn&#39;t actually design anything in CAD.</p>\n          <p>Fortunately, I had a secret weapon.</p>\n          <p>Iwona Dabrowska</p>\n          <p>Armed with remarkable patience and an uncanny ability to translate &quot;sort of... like this...&quot; into an actual 3D model, she designed the first enclosure exactly as I&#39;d imagined it.</p>\n          <p>Perfect.</p>\n          <p>And we weren&#39;t exactly going in blind.</p>\n          <p>I&#39;d spent hours reading about warping.</p>\n          <p>Rounded corners.</p>\n          <p>Brims.</p>\n          <p>First-layer calibration.</p>\n          <p>Bed adhesion.</p>\n          <p>Print temperatures.</p>\n          <p>I deployed every anti-warping trick the internet could offer.</p>\n          <p>I wasn&#39;t unprepared.</p>\n          <p>The printer simply disagreed.</p>\n          <p>Several hours later it proudly produced my first enclosure.</p>\n          <p>Three perfectly respectable walls...</p>\n          <p>...and what can only be described as the hull of a small boat.</p>\n          <figure>\n            <img src=\"/saga/assets/printer-wars-boat-shaped-cubes/warped-print.jpeg\" alt=\"Warped 3D printer enclosure lifting from the bed into a boat-shaped curve\" />\n            <figcaption>Warped 3D printer enclosure lifting from the bed into a boat-shaped curve</figcaption>\n          </figure>\n          <p>Interesting.</p>\n          <p>Clearly just bad luck.</p>\n          <p>So I printed another.</p>\n          <p>This one developed a graceful arch.</p>\n          <p>The next preferred lifting a single corner.</p>\n          <p>Another bowed across the entire base.</p>\n          <p>One somehow managed to warp both inwards and outwards, which I still don&#39;t fully understand.</p>\n          <p>Thirty print hours later I had assembled an impressive collection of failures.</p>\n          <p>Full bow.</p>\n          <p>Half bow.</p>\n          <p>Corner bow.</p>\n          <p>Diagonal bow.</p>\n          <p>Lens-shaped bow.</p>\n          <p>Apparently I had successfully manufactured every conceivable variation of the bottom of a box...</p>\n          <p>...apart from a flat one.</p>\n          <p>Meanwhile, the calibration cube continued sitting on my desk looking absolutely flawless.</p>\n          <p>Almost as if it was mocking me.</p>\n          <p>At this point I began to suspect that 3D printing wasn&#39;t actually about printing plastic.</p>\n          <p>It was about negotiating with the laws of thermodynamics.</p>\n          <p>And I was losing the negotiation.</p>\n        </div>",
    "image": "/saga/assets/printer-wars-boat-shaped-cubes/warped-print.jpeg",
    "date": "2 July 2026",
    "heroAlt": "Warped 3D printer enclosure lifting from the bed into a boat-shaped curve",
    "postedDate": "2 July 2026",
    "alt": "Warped 3D printer enclosure lifting from the bed into a boat-shaped curve",
    "title": "Printer Wars: Boat-Shaped Cubes"
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
