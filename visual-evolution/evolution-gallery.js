(() => {
  const galleries = window.AXIOM_VISUAL_EVOLUTION || {};
  const mount = document.querySelector("[data-evolution-gallery]");
  if (!mount) return;

  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[char]));

  const parts = window.location.pathname.split("/").filter(Boolean);
  const galleryId = parts[1] || "hardware";
  const gallery = galleries[galleryId] || galleries.hardware;
  const allImages = [];

  const imageMarkup = (image) => {
    allImages.push(image);
    const index = allImages.length - 1;
    return `
      <figure class="evolution-image-card">
        <button type="button" data-lightbox-index="${index}" aria-label="Open image: ${escapeHtml(image.alt)}">
          <img loading="lazy" src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" />
        </button>
        <figcaption>${escapeHtml(image.alt)}</figcaption>
      </figure>
    `;
  };

  const sectionMarkup = (section) => {
    if (section.type === "transition" || section.type === "closing") {
      return `
        <section class="evolution-text-block ${section.type === "transition" ? "is-transition" : ""}">
          <p class="eyebrow">${section.type === "transition" ? "Transition" : "Learning"}</p>
          <h2>${escapeHtml(section.title)}</h2>
          <p>${escapeHtml(section.text)}</p>
        </section>
      `;
    }

    const sectionText = Array.isArray(section.text) ? section.text : [section.text].filter(Boolean);
    return `
      <section class="evolution-chapter">
        <div class="section-heading">
          <p class="eyebrow">${escapeHtml(section.tagline || "Development stage")}</p>
          <h2>${escapeHtml(section.title)}</h2>
          ${sectionText.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </div>
        <div class="evolution-flow">
          ${(section.images || []).map(imageMarkup).join("")}
        </div>
      </section>
    `;
  };

  const buildTimelineMilestones = () => {
    const milestones = [];
    let imageIndex = 0;

    gallery.sections.forEach((section) => {
      if (section.type === "transition" || section.type === "closing") {
        milestones.push({
          type: "transition",
          label: section.type === "transition" ? "Pivot" : "Learning",
          title: section.title,
          text: section.text,
        });
        return;
      }

      (section.images || []).forEach((image) => {
        allImages.push(image);
        milestones.push({
          type: "image",
          image,
          index: allImages.length - 1,
          title: gallery.milestoneTitles?.[imageIndex] || section.title,
          text: image.alt,
          chapter: section.title,
        });
        imageIndex += 1;
      });
    });

    return milestones;
  };

  const timelineMarkup = () => {
    const milestones = buildTimelineMilestones();
    const currentImageIndex = milestones.filter((milestone) => milestone.type === "image").length - 1;
    const chapterLabels = [...new Set(milestones.filter((milestone) => milestone.type === "image").map((milestone) => milestone.chapter))];
    let imagePosition = -1;

    return `
      <section class="startup-timeline-section" aria-labelledby="startup-timeline-title">
        <div class="startup-timeline-intro">
          <p class="eyebrow">Engineering timeline</p>
          <h1 id="startup-timeline-title">${escapeHtml(gallery.title)}</h1>
          <p>${escapeHtml(gallery.tagline)}</p>
          <div class="evolution-gallery-nav" aria-label="Visual evolution gallery navigation">
            <a class="${galleryId === "hardware" ? "active" : ""}" href="/visual-evolution/hardware/">Hardware Evolution</a>
            <a class="${galleryId === "tokens" ? "active" : ""}" href="/visual-evolution/tokens/">Token Evolution</a>
            <a class="${galleryId === "icons" ? "active" : ""}" href="/visual-evolution/icons/">Icon Evolution</a>
          </div>
        </div>
        <div class="startup-timeline-summary">
          ${gallery.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
        </div>
        <div class="startup-timeline-chapters" aria-label="Timeline chapters">
          ${chapterLabels.map((label) => `<span>${escapeHtml(label)}</span>`).join("")}
        </div>
        <div class="startup-timeline-scroll" tabindex="0" aria-label="Scrollable prototype development timeline">
          <ol class="startup-timeline">
            ${milestones.map((milestone) => {
              if (milestone.type === "transition") {
                return `
                  <li class="startup-timeline-transition">
                    <span>${escapeHtml(milestone.label)}</span>
                    <h2>${escapeHtml(milestone.title)}</h2>
                    <p>${escapeHtml(milestone.text)}</p>
                  </li>
                `;
              }

              imagePosition += 1;
              const stateClass = imagePosition === currentImageIndex ? " is-current" : imagePosition < currentImageIndex - 7 ? " is-early" : "";
              return `
                <li class="startup-timeline-item${stateClass}">
                  <article>
                    <button type="button" data-lightbox-index="${milestone.index}" aria-label="Open image: ${escapeHtml(milestone.text)}">
                      <img loading="lazy" src="${escapeHtml(milestone.image.src)}" alt="${escapeHtml(milestone.text)}" />
                    </button>
                    <h2>${escapeHtml(milestone.title)}</h2>
                    <p>${escapeHtml(milestone.text)}</p>
                  </article>
                </li>
              `;
            }).join("")}
          </ol>
        </div>
        <div class="startup-timeline-actions">
          ${galleryId !== "hardware" ? `<a class="secondary-button" href="/visual-evolution/hardware/">View hardware evolution</a>` : ""}
          ${galleryId !== "tokens" ? `<a class="secondary-button" href="/visual-evolution/tokens/">View token evolution</a>` : ""}
          ${galleryId !== "icons" ? `<a class="secondary-button" href="/visual-evolution/icons/">View icon evolution</a>` : ""}
        </div>
      </section>
    `;
  };

  mount.classList.toggle("timeline-gallery", gallery.timelineStyle === "engineering");
  mount.innerHTML = gallery.timelineStyle === "engineering" ? timelineMarkup() : `
    <section class="archive-hero evolution-hero">
      <p class="eyebrow">Axiom Visual Evolution</p>
      <h1>${escapeHtml(gallery.title)}</h1>
      <p>${escapeHtml(gallery.tagline)}</p>
      <div class="evolution-gallery-nav" aria-label="Visual evolution gallery navigation">
        <a class="${galleryId === "hardware" ? "active" : ""}" href="/visual-evolution/hardware/">Hardware Evolution</a>
        <a class="${galleryId === "tokens" ? "active" : ""}" href="/visual-evolution/tokens/">Token Evolution</a>
        <a class="${galleryId === "icons" ? "active" : ""}" href="/visual-evolution/icons/">Icon Evolution</a>
      </div>
    </section>
    <section class="evolution-intro">
      ${gallery.intro.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
    </section>
    ${gallery.sections.map(sectionMarkup).join("")}
  `;

  const dialog = document.createElement("div");
  dialog.className = "lightbox";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.setAttribute("aria-label", "Image preview");
  dialog.hidden = true;
  dialog.innerHTML = `
    <button class="lightbox-close" type="button" aria-label="Close image preview">Close</button>
    <button class="lightbox-prev" type="button" aria-label="Previous image">Prev</button>
    <figure>
      <img alt="" />
      <figcaption></figcaption>
    </figure>
    <button class="lightbox-next" type="button" aria-label="Next image">Next</button>
  `;
  document.body.appendChild(dialog);

  let activeIndex = 0;
  const image = dialog.querySelector("img");
  const caption = dialog.querySelector("figcaption");
  const closeButton = dialog.querySelector(".lightbox-close");

  const showImage = (index) => {
    activeIndex = (index + allImages.length) % allImages.length;
    const active = allImages[activeIndex];
    image.src = active.src;
    image.alt = active.alt;
    caption.textContent = active.alt;
  };

  const openLightbox = (index) => {
    showImage(index);
    dialog.hidden = false;
    document.body.classList.add("lightbox-open");
    closeButton.focus();
  };

  const closeLightbox = () => {
    dialog.hidden = true;
    document.body.classList.remove("lightbox-open");
  };

  mount.addEventListener("click", (event) => {
    const button = event.target.closest("[data-lightbox-index]");
    if (!button) return;
    openLightbox(Number(button.dataset.lightboxIndex));
  });

  closeButton.addEventListener("click", closeLightbox);
  dialog.querySelector(".lightbox-prev").addEventListener("click", () => showImage(activeIndex - 1));
  dialog.querySelector(".lightbox-next").addEventListener("click", () => showImage(activeIndex + 1));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeLightbox();
  });
  window.addEventListener("keydown", (event) => {
    if (dialog.hidden) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showImage(activeIndex - 1);
    if (event.key === "ArrowRight") showImage(activeIndex + 1);
  });
})();
