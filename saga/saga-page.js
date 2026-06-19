(() => {
  const entries = (window.AXIOM_SAGA_ENTRIES || []).slice().sort((a, b) => a.order - b.order);
  const navMount = document.querySelector("[data-saga-nav]");
  const contentMount = document.querySelector("[data-saga-content]");

  if (!navMount || !contentMount || !entries.length) return;

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));

  const selectedSlug = () => decodeURIComponent(window.location.hash.replace(/^#/, "")) || entries[entries.length - 1].slug;

  const renderNav = (selected) => {
    navMount.innerHTML = entries.map((entry) => {
      const isActive = entry.slug === selected.slug;
      return `
        <a class="${isActive ? "active" : ""}" href="/saga/#${escapeHtml(entry.slug)}">
          <span>${escapeHtml(entry.title)}</span>
          <small>Episode ${escapeHtml(entry.order)} / ${escapeHtml(entry.postedDate || entry.date)}</small>
        </a>
      `;
    }).join("");
  };

  const renderEpisode = () => {
    const slug = selectedSlug();
    const selected = entries.find((entry) => entry.slug === slug) || entries[entries.length - 1];
    renderNav(selected);

    contentMount.innerHTML = `
      <section class="archive-hero saga-episode-hero">
        <p class="eyebrow">Axiom Saga</p>
        <h1>${escapeHtml(selected.title)}</h1>
        <p>Episode ${escapeHtml(selected.order)} / Posted ${escapeHtml(selected.postedDate || selected.date)}</p>
      </section>
      <section id="${escapeHtml(selected.slug)}" class="saga-post saga-episode-entry">
        <p class="saga-meta">${escapeHtml(selected.excerpt)}</p>
        ${selected.heroImage ? `
          <figure class="article-hero">
            <img src="${escapeHtml(selected.heroImage)}" alt="${escapeHtml(selected.heroAlt || selected.alt || selected.title)}" />
            ${selected.heroAlt ? `<figcaption>${escapeHtml(selected.heroAlt)}</figcaption>` : ""}
          </figure>
        ` : ""}
        ${selected.contentHtml || ""}
      </section>
    `;

    document.title = `${selected.title} | Axiom Saga | Project Axiom`;
    contentMount.scrollIntoView({ behavior: "auto", block: "start" });
  };

  window.addEventListener("hashchange", renderEpisode);
  renderEpisode();
})();
