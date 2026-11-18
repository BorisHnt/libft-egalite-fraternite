
(() => {
  "use strict";
  const $ = (s, root = document) => root.querySelector(s);
  const catalog = Array.isArray(window.MANUAL) ? window.MANUAL : [];
  const state = {view:"all", family:"all", level:"all", query:"", current:null, origin:null};
  const families = [...new Set(catalog.map(item => item.group))].sort((a,b) => a.localeCompare(b,"fr"));
  const normalize = text => (text || "").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
  const el = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function count() {
    $("#count-all").textContent = catalog.length;
    $("#count-libft").textContent = catalog.filter(f => f.kind === "libft").length;
    $("#count-cousins").textContent = catalog.filter(f => f.kind === "cousin").length;
    $("#nav-total").textContent = catalog.length;
    $("#nav-libft").textContent = catalog.filter(f => f.kind === "libft").length;
    $("#nav-cousins").textContent = catalog.filter(f => f.kind === "cousin").length;
  }
  function initFilters() {
    for (const group of families) {
      const option = el("option","",group);
      option.value = group;
      $("#family-filter").append(option);
      const button = el("button","family-item",group);
      button.type = "button";
      button.dataset.family = group;
      button.addEventListener("click",() => {state.family = group; $("#family-filter").value = group; selectView("all");});
      $("#family-nav").append(button);
    }
    document.querySelectorAll("[data-view]").forEach(button => button.addEventListener("click", () => selectView(button.dataset.view)));
  }
  function selectView(view) {
    state.view = view;
    document.querySelectorAll("[data-view]").forEach(button => button.classList.toggle("selected",button.dataset.view === view));
    document.querySelectorAll("[data-family]").forEach(button => button.classList.toggle("selected",button.dataset.family === state.family));
    if (view === "concepts") {
      $("#concepts").scrollIntoView({behavior:"smooth",block:"start"});
      closeNavigation();
      return;
    }
    $("#section-title").textContent = view === "libft" ? "Fonctions de ma Libft" : view === "cousins" ? "Fonctions cousines" : state.family === "all" ? "Toutes les fonctions" : state.family;
    $("#breadcrumb").textContent = $("#section-title").textContent;
    $("#section-subtitle").textContent = view === "libft" ? "Le contenu identifié dans l'archive fournie." : view === "cousins" ? "Pour approfondir, comparer et comprendre les différences." : "Une question, une fonction, une explication.";
    render();
    $("#workspace").scrollIntoView({behavior:"smooth",block:"start"});
    closeNavigation();
  }
  function matches(f) {
    if (state.view !== "all" && state.view !== "concepts" && f.kind !== state.view) return false;
    if (state.family !== "all" && f.group !== state.family) return false;
    if (state.level !== "all" && f.level !== state.level) return false;
    const words = [f.name,f.group,f.purpose,f.mechanism,f.trap,f.prototype,...f.related].join(" ");
    return normalize(words).includes(normalize(state.query));
  }
  function render() {
    const matching = catalog.filter(matches).sort((a,b) => a.name.localeCompare(b.name,"fr"));
    $("#result-count").textContent = matching.length + " fonction" + (matching.length > 1 ? "s" : "") + " trouvée" + (matching.length > 1 ? "s" : "");
    $("#empty-state").hidden = matching.length > 0;
    const cards = $("#cards");
    cards.replaceChildren();
    matching.forEach((f,index) => {
      const card = el("button","function-card");
      card.type = "button";
      const header = el("div","card-top");
      header.append(el("span","tag " + f.kind,f.kind === "libft" ? "Dans l'archive" : "Pour aller plus loin"),el("span","card-index",String(index+1).padStart(2,"0")));
      card.append(header,el("h3","",f.name),el("p","",f.purpose));
      const meta = el("div","card-meta");
      meta.append(el("span","",f.group + " · " + f.level),el("span","card-arrow","→"));
      card.append(meta);
      card.addEventListener("click",() => openFunction(f));
      cards.append(card);
    });
  }
  function section(parent,title,content,pitfall = false) {
    const wrap = el("section","manual-section");
    wrap.append(el("h3","",title));
    wrap.append(el("p",pitfall ? "pitfall" : "",content));
    parent.append(wrap);
  }
  function sourceSection(parent,heading,code,detail) {
    const sectionBox = el("section","manual-section");
    const head = el("div","source-head");
    head.append(el("h3","",heading),el("span","source-label","Code masqué au départ"));
    sectionBox.append(head);
    const block = el("div","source-lock is-locked");
    const pre = el("pre","");
    const formatted = el("code","",code);
    pre.append(formatted);
    block.append(pre);
    const cover = el("div","source-cover");
    cover.append(el("strong","","◉ Contenu masqué"),el("p","","Essaie de résoudre le problème avant de consulter l'implémentation."));
    const reveal = el("button","reveal-button","Révéler le code");
    reveal.type = "button";
    reveal.setAttribute("aria-expanded","false");
    reveal.addEventListener("click",() => {
      block.classList.remove("is-locked");
      cover.remove();
      reveal.setAttribute("aria-expanded","true");
    });
    cover.append(reveal);
    block.append(cover);
    sectionBox.append(block);
    const actions = el("div","code-actions");
    const copy = el("button","","Copier le code");
    copy.type = "button";
    copy.hidden = true;
    const hide = el("button","","Masquer à nouveau");
    hide.type = "button";
    hide.hidden = true;
    reveal.addEventListener("click",() => { copy.hidden = false; hide.hidden = false; });
    hide.addEventListener("click",() => {
      block.classList.add("is-locked");
      block.append(cover);
      copy.hidden = true;
      hide.hidden = true;
      reveal.setAttribute("aria-expanded","false");
      reveal.focus();
    });
    copy.addEventListener("click",async () => {
      try {
        await navigator.clipboard.writeText(code);
        copy.textContent = "Copié !";
      } catch {
        copy.textContent = "Copie indisponible";
      }
    });
    actions.append(hide,copy);
    sectionBox.append(actions);
    sectionBox.append(el("p","source-note",detail));
    parent.append(sectionBox);
  }
  function openFunction(f) {
    state.origin = document.activeElement;
    state.current = f;
    const drawer = $("#drawer");
    const body = $("#drawer-body");
    body.replaceChildren();
    $("#drawer-kind").textContent = f.kind === "libft" ? "Dans l'archive" : "Fonction cousine";
    $("#drawer-kind").className = "tag " + f.kind;
    body.append(el("span","eyebrow",f.group + " · " + f.level),el("h2","",f.name),el("p","drawer-intro",f.purpose));
    body.append(el("pre","prototypeline",f.prototype));
    section(body,"En une phrase",f.purpose);
    section(body,"Comment ça fonctionne",f.mechanism);
    section(body,"Valeur de retour",f.result);
    section(body,"Attention au piège",f.trap,true);
    if (f.example) sourceSection(body,"Exemple d'utilisation",f.example,"Exemple pédagogique : adapter les includes, le contexte et les arguments.");
    if (f.ref) sourceSection(body,"Implémentation de référence",f.ref,"Extrait de référence rédigé pour ce manuel. Ne pas confondre avec un contrôle automatisé Norminette. Chaque fonction reste à tester sur des cas limites.");
    else if (f.kind === "libft") section(body,"Implémentation de référence","Une version relue et testée sera ajoutée ici ; aucun code non vérifié n'est présenté comme solution parfaite.");
    const related = f.related.map(name => catalog.find(item => item.name === name)).filter(Boolean);
    if (related.length) {
      const group = el("section","manual-section");
      group.append(el("h3","","Fonctions cousines"));
      const buttons = el("div","related-buttons");
      related.forEach(target => {
        const button = el("button","",target.name);
        button.type = "button";
        button.addEventListener("click",() => openFunction(target));
        buttons.append(button);
      });
      group.append(buttons);
      body.append(group);
    }
    drawer.hidden = false;
    document.body.style.overflow = "hidden";
    body.scrollTop = 0;
    $("#close-drawer").focus();
  }
  function closeDrawer() {
    if ($("#drawer").hidden) return;
    $("#drawer").hidden = true;
    document.body.style.overflow = "";
    if (state.origin && state.origin.isConnected) state.origin.focus();
  }
  function closeNavigation() {
    $("#sidebar").classList.remove("open");
    $("#open-nav").setAttribute("aria-expanded","false");
  }
  function setup() {
    count();
    initFilters();
    render();
    $("#search").addEventListener("input",event => {state.query=event.target.value;render();});
    $("#family-filter").addEventListener("change",event => {state.family=event.target.value;render();document.querySelectorAll("[data-family]").forEach(button => button.classList.toggle("selected",button.dataset.family === state.family));});
    $("#level-filter").addEventListener("change",event => {state.level=event.target.value;render();});
    $("#reset-filters").addEventListener("click",() => {
      state.query="";state.family="all";state.level="all";
      $("#search").value="";$("#family-filter").value="all";$("#level-filter").value="all";
      selectView("all");
    });
    $("#start-reading").addEventListener("click",() => {
      const f = catalog.find(item => item.name === "ft_strlen");
      if (f) openFunction(f);
    });
    $("#jump-guide").addEventListener("click",() => $("#concepts").scrollIntoView({behavior:"smooth"}));
    $("#close-drawer").addEventListener("click",closeDrawer);
    $("[data-close-drawer]").addEventListener("click",closeDrawer);
    $("#open-nav").addEventListener("click",() => {
      const open=$("#sidebar").classList.toggle("open");
      $("#open-nav").setAttribute("aria-expanded",String(open));
    });
    $("#close-nav").addEventListener("click",closeNavigation);
    document.addEventListener("keydown",event => {
      if (event.key === "Escape") {closeDrawer();closeNavigation();}
      if (event.key === "/" && $("#drawer").hidden && !["INPUT","TEXTAREA","SELECT"].includes(document.activeElement.tagName)) {
        event.preventDefault();$("#search").focus();
      }
      if (event.key === "Tab" && !$("#drawer").hidden) {
        const items = [...$("#drawer").querySelectorAll("button:not([hidden]):not(:disabled)")].filter(b => b.offsetParent !== null);
        const first=items[0],last=items[items.length-1];
        if (event.shiftKey && document.activeElement === first) {event.preventDefault();last.focus();}
        else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
      }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded",setup);
  else setup();
})();
