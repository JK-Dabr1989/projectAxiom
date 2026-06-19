(() => {
  const entries = window.AXIOM_SAGA_ENTRIES || [];
  const mount = document.querySelector("[data-saga-home]");
  const older = document.querySelector("[data-saga-older]");
  const newer = document.querySelector("[data-saga-newer]");

  if (!mount || !entries.length) return;

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));

  const render = () => {
    mount.innerHTML = entries.map((entry) => `
      <article class="info-card saga-card">
        <img class="saga-card-image" src="${escapeHtml(entry.image)}" alt="${escapeHtml(entry.alt)}" />
        <span class="meta-line">${escapeHtml(entry.date)}</span>
        <h3>${escapeHtml(entry.title)}</h3>
        <p>${escapeHtml(entry.excerpt)}</p>
        <a class="secondary-button saga-read-more" href="${escapeHtml(entry.url)}">Read More</a>
      </article>
    `).join("");
    older?.setAttribute("hidden", "");
    newer?.setAttribute("hidden", "");
    requestAnimationFrame(() => {
      mount.scrollLeft = mount.scrollWidth;
    });
  };

  render();
})();
