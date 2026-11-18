/* A second pedagogical reading layer for the central documentation view. */
(() => {
  "use strict";
  function element(tag, className, content) {
    const value = document.createElement(tag);
    if (className) value.className = className;
    if (content !== undefined) value.textContent = content;
    return value;
  }

  function part(icon, heading, body, className) {
    const section = element("article", "precision-card " + (className || ""));
    const header = element("div", "precision-card-title");
    header.append(element("span", "precision-icon", icon),
      element("h4", "", heading));
    section.append(header, element("p", "", body));
    return section;
  }

  window.renderPrecisions = (target, functionData) => {
    const precise = window.MANUAL_PRECISIONS &&
      window.MANUAL_PRECISIONS[functionData.name];
    if (!precise) return;
    const introduction = element("p", "precision-intro",
      "Qu'est-ce qui rend cette fonction correcte ? Quels invariants la maintiennent, " +
      "et quels détails doivent être maîtrisés pour la réécrire sans copier ?");
    const grid = element("div", "precision-grid");
    grid.append(
      part("01", "Pourquoi ça fonctionne", precise.reason, "precision-main"),
      part("02", "Le raisonnement à conserver", precise.mechanics, ""),
      part("03", "Ce qui se passe en mémoire", precise.memory, ""),
      part("04", "Vérifie que tu as compris", precise.question, "precision-question")
    );
    target.append(introduction, grid);
  };
})();
