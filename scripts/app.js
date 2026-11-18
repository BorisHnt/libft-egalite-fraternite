(() => {
  "use strict";

  const $ = (selector, root = document) => root.querySelector(selector);
  const catalogue = Array.isArray(window.MANUAL) ? window.MANUAL : [];
  const byName = new Map(catalogue.map(item => [item.name, item]));
  const families = [...new Set(catalogue.map(item => item.group))].sort((a, b) => a.localeCompare(b, "fr"));
  const state = { view: "all", family: "all", level: "all", query: "", current: null };
  const normalize = value => String(value || "").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").toLowerCase();

  function node(tag, className = "", value) {
    const result = document.createElement(tag);
    if (className) result.className = className;
    if (value !== undefined) result.textContent = value;
    return result;
  }

  function setCounts() {
    const libft = catalogue.filter(f => f.kind === "libft").length;
    const cousins = catalogue.length - libft;
    const counts = [
      ["count-all", catalogue.length], ["count-libft", libft],
      ["count-cousins", cousins], ["nav-total", catalogue.length],
      ["nav-libft", libft], ["nav-cousins", cousins]
    ];
    for (const [id, count] of counts) $("#" + id).textContent = String(count);
  }

  function closeNavigation() {
    $("#sidebar").classList.remove("open");
    $("#open-nav").setAttribute("aria-expanded", "false");
  }

  function visibleItems() {
    return catalogue.filter(f => {
      if (state.view === "libft" && f.kind !== "libft") return false;
      if (state.view === "cousins" && f.kind !== "cousin") return false;
      if (state.family !== "all" && f.group !== state.family) return false;
      if (state.level !== "all" && f.level !== state.level) return false;
      const deep = window.DEEP_DIVES && window.DEEP_DIVES[f.name];
      const extra = deep ? [deep.intuition, deep.params, ...deep.steps, deep.nuance] : [];
      const words = [f.name, f.group, f.purpose, f.mechanism, f.trap,
        f.prototype, ...f.related, ...extra].join(" ");
      return normalize(words).includes(normalize(state.query));
    }).sort((a, b) => a.name.localeCompare(b.name, "fr"));
  }

  function renderCards() {
    const items = visibleItems();
    const cards = $("#cards");
    cards.replaceChildren();
    $("#result-count").textContent = items.length + " fonction" +
      (items.length !== 1 ? "s" : "") + " trouvée" + (items.length !== 1 ? "s" : "");
    $("#empty-state").hidden = items.length > 0;

    for (const [index, f] of items.entries()) {
      const card = node("button", "function-card");
      card.type = "button";
      card.setAttribute("aria-label", "Lire la fiche de " + f.name);
      const top = node("div", "card-top");
      top.append(
        node("span", "tag " + f.kind, f.kind === "libft" ? "Fonction Libft" : "Fonction cousine"),
        node("span", "card-index", String(index + 1).padStart(2, "0"))
      );
      const meta = node("div", "card-meta");
      meta.append(node("span", "", f.group + " · " + f.level),
        node("span", "card-arrow", "→"));
      card.append(top, node("h3", "", f.name), node("p", "", f.purpose), meta);
      card.addEventListener("click", () => openFunction(f));
      cards.append(card);
    }
  }

  function chooseView(view, family = state.family) {
    state.view = view;
    state.family = family;
    $("#family-filter").value = family;
    const names = {libft:"Les fonctions Libft", cousins:"Les fonctions cousines", all:"Toutes les fonctions"};
    $("#section-title").textContent = family !== "all" && view === "all"
      ? family : (names[view] || names.all);
    $("#section-subtitle").textContent = view === "libft"
      ? "Les fonctions du cursus Libft, expliquées de la première ligne aux cas limites."
      : view === "cousins"
      ? "Les interfaces voisines du C standard, de POSIX et des extensions BSD."
      : "Une question, une fonction, une explication progressive.";
    document.querySelectorAll("[data-view]").forEach(button => {
      button.classList.toggle("selected", button.dataset.view === view);
    });
    document.querySelectorAll("[data-family]").forEach(button => {
      button.classList.toggle("selected", button.dataset.family === family);
    });
    renderCards();
    if (window.location.hash.startsWith("#/fonction/")) {
      window.location.hash = "#/fonctions";
    } else {
      renderOverview();
    }
    $("#workspace").scrollIntoView({behavior:"smooth", block:"start"});
    closeNavigation();
  }

  function createSection(parent, id, title, text, className = "") {
    const section = node("section", "reader-section " + className);
    section.id = "section-" + id;
    section.dataset.toc = title;
    section.append(node("h3", "", title));
    if (text) section.append(node("p", "reader-prose", text));
    parent.append(section);
    return section;
  }

  function createCodeBlock(parent, title, source, detail) {
    const container = node("section", "manual-section");
    const head = node("div", "source-head");
    head.append(node("h4", "", title), node("span", "source-label", "Masqué avant révélation"));
    container.append(head);
    const box = node("div", "source-lock is-locked");
    const pre = node("pre");
    pre.setAttribute("aria-hidden", "true");
    pre.append(node("code", "", source));
    const cover = node("div", "source-cover");
    cover.append(node("strong", "", "Code masqué"),
      node("p", "", "Essaie d'abord de comprendre ou de résoudre le problème, puis révèle la solution."));
    const show = node("button", "reveal-button", "Révéler le code");
    show.type = "button";
    show.setAttribute("aria-expanded", "false");
    cover.append(show);
    box.append(pre, cover);

    const controls = node("div", "code-actions");
    const hide = node("button", "", "Masquer à nouveau");
    const copy = node("button", "", "Copier le code");
    hide.type = "button";
    copy.type = "button";
    hide.hidden = true;
    copy.hidden = true;

    function display(open) {
      box.classList.toggle("is-locked", !open);
      if (open) cover.remove();
      else box.append(cover);
      if (open) pre.removeAttribute("aria-hidden");
      else pre.setAttribute("aria-hidden", "true");
      show.setAttribute("aria-expanded", String(open));
      hide.hidden = !open;
      copy.hidden = !open;
    }
    show.addEventListener("click", () => display(true));
    hide.addEventListener("click", () => { display(false); show.focus(); });
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(source);
        copy.textContent = "Copié";
      } catch {
        copy.textContent = "Copie indisponible";
      }
    });

    controls.append(hide, copy);
    container.append(box, controls, node("p", "source-note", detail));
    parent.append(container);
    return container;
  }

  function createHeader(f) {
    const header = $("#reader-header");
    header.replaceChildren();
    const line = node("div", "reader-labels");
    line.append(node("span", "tag " + f.kind,
      f.kind === "libft" ? "Fonction Libft" : "Fonction cousine"),
      node("span", "reader-level", f.group + " · " + f.level));
    const title = node("h2", "", f.name);
    title.id = "reader-title";
    header.append(line, title, node("p", "reader-subtitle", f.purpose));
    const prototype = node("div", "reader-prototype");
    prototype.append(node("span", "prototype-caption", "Prototype"),
      node("pre", "", f.prototype));
    header.append(prototype);
  }

  function renderRelated(parent, f) {
    const related = f.related.map(name => byName.get(name)).filter(Boolean);
    if (!related.length) return;
    const section = createSection(parent, "related", "Fonctions cousines",
      "Une fonction prend tout son sens quand on sait à quoi la comparer.");
    const links = node("div", "reader-related");
    for (const entry of related) {
      const button = node("button", "reader-related-button", entry.name + " →");
      button.type = "button";
      button.addEventListener("click", () => openFunction(entry));
      links.append(button);
    }
    section.append(links);
  }

  function buildToc() {
    const toc = $("#reader-toc");
    toc.replaceChildren();
    const parts = [...$("#reader-body").querySelectorAll(".reader-section[data-toc]")];
    for (const section of parts) {
      const link = node("a", "", section.dataset.toc);
      link.href = "#" + section.id;
      link.addEventListener("click", event => {
        event.preventDefault();
        section.scrollIntoView({behavior:"smooth", block:"start"});
        history.replaceState(null, "", "#/fonction/" +
          encodeURIComponent(state.current.name));
      });
      toc.append(link);
    }
  }

  function updatePagination(f) {
    const ordered = catalogue.slice().sort((a, b) => a.name.localeCompare(b.name, "fr"));
    const index = ordered.findIndex(item => item.name === f.name);
    const previous = ordered[index - 1];
    const next = ordered[index + 1];
    for (const [ids, entry, side] of [
      [["reader-prev", "reader-prev-bottom"], previous, "Précédente"],
      [["reader-next", "reader-next-bottom"], next, "Suivante"]
    ]) {
      for (const id of ids) {
        const button = $("#" + id);
        button.disabled = !entry;
        button.textContent = entry
          ? (side === "Précédente" ? "← " : "") + entry.name +
            (side === "Suivante" ? " →" : "")
          : (side === "Précédente" ? "Début du catalogue" : "Fin du catalogue");
        button.onclick = () => { if (entry) openFunction(entry); };
      }
    }
  }

  function renderReader(f) {
    state.current = f;
    $("#overview").hidden = true;
    $("#reader").hidden = false;
    $("#breadcrumb").textContent = f.name;
    createHeader(f);

    const body = $("#reader-body");
    body.replaceChildren();
    const intro = createSection(body, "essentiel", "L'essentiel",
      f.mechanism, "reader-essential");
    const definition = node("div", "reader-definition");
    definition.append(node("strong", "", "Ce que la fonction renvoie"),
      node("p", "", f.result));
    intro.append(definition);

    const warning = createSection(body, "pieges", "Les pièges à anticiper",
      f.trap, "reader-warning");

    const lesson = createSection(body, "comprendre", "Comprendre le fonctionnement",
      "Avant de lire une solution, examine les paramètres et le déroulement de la fonction.");
    if (typeof window.renderDeepDive === "function") {
      window.renderDeepDive(lesson, f, createCodeBlock);
    }

    if (typeof window.renderPrecisions === "function") {
      const deeper = createSection(body, "approfondir", "Aller vraiment plus loin",
        "Comprendre les raisons techniques, les garanties et les limites de l'interface.");
      window.renderPrecisions(deeper, f);
    }

    if (f.example) {
      const demo = createSection(body, "exemple", "Exemple d'utilisation",
        "Un court exemple à explorer ; il reste masqué tant que tu ne décides pas de le consulter.");
      createCodeBlock(demo, "Code de l'exemple", f.example,
        "Fragment pédagogique, pas nécessairement un programme autonome.");
    }

    if (f.ref) {
      const implementation = createSection(body, "implementation",
        "Implémentation de référence",
        "Voici une réalisation pédagogique distincte. Elle respecte les contrôles de compilation et de style en CI, sans constituer une preuve absolue pour toutes les entrées.");
      createCodeBlock(implementation, "Code C — solution masquée", f.ref,
        "Implémentation pédagogique : la compilation, la Norminette et les tests automatisés ne remplacent pas une revue exhaustive.");
    }
    renderRelated(body, f);
    buildToc();
    updatePagination(f);
    closeNavigation();
    window.scrollTo({top:0, behavior:"instant"});
    $("#reader").focus({preventScroll:true});
  }

  function renderOverview() {
    state.current = null;
    $("#overview").hidden = false;
    $("#reader").hidden = true;
    const titles = {all:"Toutes les fonctions",libft:"Les fonctions Libft",cousins:"Les fonctions cousines"};
    $("#breadcrumb").textContent = state.family === "all" ? titles[state.view] || titles.all : state.family;
    closeNavigation();
  }

  function openFunction(f) {
    if (!f || !byName.has(f.name)) return;
    const hash = "#/fonction/" + encodeURIComponent(f.name);
    if (window.location.hash === hash) renderReader(f);
    else window.location.hash = hash;
  }

  function route() {
    const match = window.location.hash.match(/^#\/fonction\/([^/?#]+)$/);
    if (match) {
      let name = "";
      try { name = decodeURIComponent(match[1]); } catch { name = ""; }
      const f = byName.get(name);
      if (f) { renderReader(f); return; }
    }
    renderOverview();
  }

  function bind() {
    setCounts();
    for (const family of families) {
      const option = node("option", "", family);
      option.value = family;
      $("#family-filter").append(option);
      const button = node("button", "family-item", family);
      button.type = "button";
      button.dataset.family = family;
      button.addEventListener("click", () => chooseView("all", family));
      $("#family-nav").append(button);
    }
    document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => {
      if (button.dataset.view === "concepts") {
        if (state.current) {
          window.location.hash = "#/fonctions";
          window.setTimeout(() => $("#concepts").scrollIntoView({behavior:"smooth"}), 0);
        } else $("#concepts").scrollIntoView({behavior:"smooth"});
      } else chooseView(button.dataset.view, "all");
    }));
    $("#search").addEventListener("input", event => {
      state.query = event.target.value;
      renderCards();
    });
    $("#family-filter").addEventListener("change", event => {
      state.family = event.target.value;
      renderCards();
    });
    $("#level-filter").addEventListener("change", event => {
      state.level = event.target.value;
      renderCards();
    });
    $("#reset-filters").addEventListener("click", () => {
      state.query = "";
      state.family = "all";
      state.level = "all";
      $("#search").value = "";
      $("#family-filter").value = "all";
      $("#level-filter").value = "all";
      chooseView("all", "all");
    });
    $("#start-reading").addEventListener("click", () => openFunction(byName.get("ft_strlen")));
    $("#jump-guide").addEventListener("click", () => $("#concepts").scrollIntoView({behavior:"smooth"}));
    $("#reader-back").addEventListener("click", () => {
      window.location.hash = "#/fonctions";
    });
    $("#reader-copy-link").addEventListener("click", async () => {
      if (!state.current) return;
      try {
        await navigator.clipboard.writeText(window.location.href);
        $("#reader-copy-link").textContent = "Lien copié";
      } catch {
        $("#reader-copy-link").textContent = "Copie indisponible";
      }
    });
    $("#open-nav").addEventListener("click", () => {
      const open = $("#sidebar").classList.toggle("open");
      $("#open-nav").setAttribute("aria-expanded", String(open));
    });
    $("#close-nav").addEventListener("click", closeNavigation);
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") closeNavigation();
      if (event.key === "/" && !state.current &&
          !["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)) {
        event.preventDefault();
        $("#search").focus();
      }
    });
    window.addEventListener("hashchange", route);
    renderCards();
    route();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
})();
