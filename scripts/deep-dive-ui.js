/* Progressive disclosure: the answer and complete implementation remain hidden on first view. */
(() => {
  "use strict";
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  function heading(parent, label, subtitle) {
    const title = make("div", "lesson-heading");
    title.append(make("span","eyebrow",label),make("h3","",subtitle));
    parent.append(title);
  }
  function visualTrace(parent, trace) {
    const panel = make("section","trace-panel");
    heading(panel,"Visualiser","Ce qui se passe en mémoire");
    panel.append(make("p","lesson-muted",trace.subtitle));
    const stage = make("div","trace-stage");
    stage.setAttribute("aria-live","polite");
    stage.setAttribute("aria-atomic","true");
    const progress = make("div","trace-progress");
    const label = make("strong","","");
    const info = make("p","","");
    const line = make("div","memory-line");
    const summary = make("div","trace-stepper");
    const prev = make("button","secondary-button","← Précédent");
    const position = make("span","step-position","");
    const next = make("button","primary-button","Suivant →");
    for (const btn of [prev,next]) btn.type="button";
    summary.append(prev,position,next);
    stage.append(progress,line,label,info,summary);
    panel.append(stage);
    let index=0;
    function refresh() {
      const step=trace.steps[index];
      progress.textContent="Étape "+(index+1)+" / "+trace.steps.length+" · "+trace.title;
      line.replaceChildren();
      step.cells.forEach((value,i) => {
        const cell=make("div","memory-cell",value);
        if (i===step.index) cell.classList.add("active");
        const num=make("small","",String(i));
        cell.append(num);
        line.append(cell);
      });
      label.textContent=step.label;
      info.textContent=step.why;
      position.textContent=step.metric;
      prev.disabled=index===0;
      next.disabled=index===trace.steps.length-1;
      next.textContent=next.disabled?"Terminé ✓":"Suivant →";
    }
    prev.addEventListener("click",()=>{if(index>0){index--;refresh();}});
    next.addEventListener("click",()=>{if(index<trace.steps.length-1){index++;refresh();}});
    refresh();
    parent.append(panel);
  }
  function readout(parent,f,lesson,sourceSection) {
    const group = make("section","lesson-block");
    heading(group,"Apprendre sans recopier","Avant d'ouvrir le code");
    const intuition = make("p","lesson-intuition",lesson.intuition);
    group.append(intuition);
    const params = make("div","parameter-explainer");
    params.append(make("strong","","Comprendre les paramètres"));
    params.append(make("p","",lesson.params));
    group.append(params);
    heading(group,"Le raisonnement","Déroulement pas à pas");
    const steps = make("ol","reasoning-steps");
    for (const step of lesson.steps) {
      steps.append(make("li","",step));
    }
    group.append(steps);
    parent.append(group);
    const trace = window.MANUAL_TRACES && window.MANUAL_TRACES[f.name];
    if (trace) visualTrace(parent,trace);
    const challenge = make("section","challenge-panel");
    heading(challenge,"Petit défi","À toi de prévoir le résultat");
    challenge.append(make("p","lesson-muted","Lis l'appel, imagine ce qui change en mémoire ou la valeur retournée, puis révèle le résultat."));
    sourceSection(challenge,"L'appel à examiner",lesson.demo,"Fragment pédagogique : l'exemple ne constitue pas à lui seul un programme C complet.");
    const answer = make("div","answer-wrap");
    const reveal = make("button","secondary-button","Voir le résultat");
    reveal.type="button";
    reveal.setAttribute("aria-expanded","false");
    const result = make("p","answer-text",lesson.outcome);
    result.hidden=true;
    reveal.addEventListener("click",()=> {
      result.hidden = !result.hidden;
      const opened=!result.hidden;
      reveal.textContent=opened?"Cacher le résultat":"Voir le résultat";
      reveal.setAttribute("aria-expanded",String(opened));
    });
    answer.append(reveal,result);
    challenge.append(answer);
    parent.append(challenge);
    const more=make("section","lesson-block");
    heading(more,"Au-delà du cas heureux","Les cas limites à maîtriser");
    const cases=make("ul","edge-list");
    for(const line of lesson.edges) {
      if(line.trim()) cases.append(make("li","",line.trim()));
    }
    more.append(cases);
    const perf=make("div","spec-grid");
    const cost=make("div","spec-card");
    cost.append(make("h4","","Coût algorithmique"),make("p","",lesson.complexity));
    const note=make("div","spec-card");
    note.append(make("h4","","Contrat et nuance"),make("p","",lesson.nuance));
    perf.append(cost,note);
    more.append(perf);
    parent.append(more);
  }
  window.renderDeepDive=function(body,f,sourceSection) {
    const lesson=window.DEEP_DIVES && window.DEEP_DIVES[f.name];
    if(!lesson) return;
    readout(body,f,lesson,sourceSection);
  };
})();
