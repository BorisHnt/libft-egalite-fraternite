import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";

const paths = ["data/catalog.js","data/references.js","data/deepdives.js","data/traces.js","data/precisions.js"];
const context = {window:{}};
vm.createContext(context);
for (const path of paths) {
  vm.runInContext(fs.readFileSync(path,"utf8"),context,{filename:path});
}
const list = context.window.MANUAL;
const lessons = context.window.DEEP_DIVES;
const traces = context.window.MANUAL_TRACES;
const precisions = context.window.MANUAL_PRECISIONS;
assert(Array.isArray(list),"Missing catalog");
assert.equal(list.length,57,"Expected 57 individual function fiches");
const libftItems=list.filter(item=>item.kind==="libft");
assert.equal(libftItems.length,43,"Expected 43 Libft functions");
assert.equal(list.filter(item=>item.kind==="cousin").length,14);
assert.equal(new Set(list.map(f=>f.name)).size,57);
for(const entry of list) {
  const precision=precisions[entry.name];
  assert(precision, "Missing precision: " + entry.name);
  for (const field of ["reason","mechanics","memory","question"]) {
    assert(precision[field]?.length >= 80, "Incomplete precision " + field + " for " + entry.name);
  }
  const lesson=lessons[entry.name];
  assert(lesson,"Missing deep dive: "+entry.name);
  for(const field of ["intuition","params","complexity","nuance"]) {
    assert(lesson[field]?.length>=12,"Incomplete "+field+" of "+entry.name);
  }
  assert(lesson.steps.length>=3,"Missing steps: "+entry.name);
  assert(lesson.demo.length>=10,"Missing example: "+entry.name);
  assert(lesson.outcome.length>=1,"Missing expected outcome: "+entry.name);
  assert(lesson.edges.length>=1,"Missing boundary cases: "+entry.name);
  if(entry.kind==="libft"){
    assert(entry.ref?.length>=20,"Missing reference source: "+entry.name);
  }
}
assert.equal(Object.keys(lessons).length,57);
assert.equal(Object.keys(precisions).length,57);
assert.equal(Object.keys(traces).length,10);
for(const [name, trace] of Object.entries(traces)) {
  assert(list.some(f=>f.name===name),"Unknown traced function: "+name);
  assert(trace.steps.length>=3);
  for(const step of trace.steps) {
    assert(Array.isArray(step.cells) && step.cells.length>0);
    assert(Number.isInteger(step.index));
    assert(step.why && step.label);
  }
}
console.log("Validated 57 deep dives, 43 references, 14 cousins and 10 memory traces.");
