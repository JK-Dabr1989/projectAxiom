(() => {
  const testers = window.AXIOM_TESTER_INSIGHTS || [];
  const navMount = document.querySelector("[data-tester-nav]");
  const contentMount = document.querySelector("[data-tester-content]");

  if (!navMount || !contentMount || !testers.length) return;

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));

  const slugFromPath = () => {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const testerIndex = parts.indexOf("tester-insights");
    return parts[testerIndex + 1] || "jack-the-founder";
  };

  const selectedId = slugFromPath();
  const selectedTester = testers.find((tester) => tester.testerId === selectedId) || testers[0];

  navMount.innerHTML = testers.map((tester) => {
    const href = `/tester-insights/${escapeHtml(tester.testerId)}/`;
    const isActive = tester.testerId === selectedTester.testerId;
    const meta = [tester.label, tester.location].filter(Boolean).join(" / ");
    return `
      <a class="${isActive ? "active" : ""}" href="${href}">
        <span>${escapeHtml(tester.name)}</span>
        <small>${escapeHtml(meta)}</small>
      </a>
    `;
  }).join("");

  const meta = [selectedTester.label, selectedTester.location].filter(Boolean).join(" / ");
  const insightMarkup = selectedTester.insights.length
    ? selectedTester.insights.map((insight, index) => `
        <section id="${escapeHtml(insight.id)}" class="saga-post tester-insight-entry">
          <p class="saga-meta">Insight ${index + 1}${insight.date ? ` &middot; ${escapeHtml(insight.date)}` : ""}</p>
          <h2>${escapeHtml(insight.title)}</h2>
          ${insight.excerpt ? `<p class="tester-insight-excerpt">${escapeHtml(insight.excerpt)}</p>` : ""}
          ${insight.image ? `
            <figure class="article-hero">
              <img src="${escapeHtml(insight.image)}" alt="${escapeHtml(insight.alt || insight.title)}" />
              ${insight.caption ? `<figcaption>${escapeHtml(insight.caption)}</figcaption>` : ""}
            </figure>
          ` : ""}
          <div class="article-body">
            ${(insight.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
          </div>
        </section>
      `).join("")
    : `
        <section class="saga-post tester-insight-entry">
          <p class="saga-meta">No published insights yet</p>
          <h2>Insights from this tester will appear here once feedback has been approved for publication.</h2>
          <div class="article-body">
            <p>This area is reserved for product-learning notes, tester observations, anonymised feedback summaries, and approved quotes.</p>
          </div>
        </section>
      `;

  contentMount.innerHTML = `
    <section class="archive-hero tester-insight-hero">
      <p class="eyebrow">Tester Insights</p>
      <h1>${escapeHtml(selectedTester.name)}</h1>
      <p>${escapeHtml(meta)}</p>
      ${selectedTester.heroImage ? `
        <figure class="article-hero">
          <img src="${escapeHtml(selectedTester.heroImage)}" alt="${escapeHtml(selectedTester.name)}" />
        </figure>
      ` : ""}
    </section>
    ${insightMarkup}
  `;

  const scrollToHash = () => {
    const id = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    const target = id ? document.getElementById(id) : null;
    if (target) {
      const offset = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      window.scrollTo({ top: target.offsetTop - offset, behavior: "auto" });
    }
  };

  window.addEventListener("load", () => {
    scrollToHash();
    window.setTimeout(scrollToHash, 250);
  });
  window.addEventListener("hashchange", scrollToHash);
})();
