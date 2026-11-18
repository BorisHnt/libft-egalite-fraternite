import assert from "node:assert/strict";
import fs from "node:fs";
import {JSDOM} from "jsdom";

const html = fs.readFileSync("index.html", "utf8");
const paths = [
  "data/catalog.js", "data/references.js", "data/deepdives.js",
  "data/traces.js", "data/precisions.js", "scripts/precision-ui.js",
  "scripts/deep-dive-ui.js", "scripts/app.js"
];
const url = "https://example.org/libft-egalite-fraternite/";
const delay = () => new Promise(resolve => setTimeout(resolve, 40));

async function load(hash = "") {
  const dom = new JSDOM(html, {
    runScripts: "dangerously",
    url: url + hash,
    pretendToBeVisual: true
  });
  dom.window.scrollTo = () => {};
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  for (const path of paths) {
    dom.window.eval(fs.readFileSync(path, "utf8"));
  }
  dom.window.document.dispatchEvent(new dom.window.Event("DOMContentLoaded", {bubbles:true}));
  await delay();
  return dom;
}

const dom = await load();
const {window} = dom;
const doc = window.document;
assert.equal(doc.querySelectorAll(".function-card").length, 57,
  "All functions should appear in the centre catalogue");
assert.equal(doc.querySelector("#reader").hidden, true);
assert.equal(doc.querySelector("#overview").hidden, false);

const first = [...doc.querySelectorAll(".function-card")]
  .find(card => card.querySelector("h3").textContent === "ft_strlen");
assert(first, "At least one function is listed");
const fName = first.querySelector("h3").textContent;
first.click();
await delay();
assert.equal(doc.querySelector("#overview").hidden, true,
  "The catalogue must hide on article view");
assert.equal(doc.querySelector("#reader").hidden, false,
  "The full-size central article must appear");
assert.equal(doc.querySelector("#reader-title").textContent, fName);
assert(!doc.querySelector(".drawer"), "No side drawer remains");
assert(doc.querySelector("#reader-toc a"), "The chapter table of contents must render");
assert(doc.querySelector(".precision-grid"), "The deep explanations must render");
assert(doc.querySelector("#section-implementation"), "Libft reference code must render");

const cover = doc.querySelector("#section-implementation .source-cover");
assert(cover, "Implementation must be hidden before the user asks");
const code = doc.querySelector("#section-implementation pre");
assert.equal(code.getAttribute("aria-hidden"), "true");
cover.querySelector("button").click();
assert.equal(code.hasAttribute("aria-hidden"), false,
  "Reveal must unhide code for sighted and screen reader users");
const rehide = doc.querySelector("#section-implementation .code-actions button");
rehide.click();
assert.equal(code.getAttribute("aria-hidden"), "true");

doc.querySelector("#reader-next").click();
await delay();
assert.notEqual(doc.querySelector("#reader-title").textContent, fName,
  "Next button must navigate to a different function");
assert.match(window.location.hash, /^#\/fonction\//);

doc.querySelector("#reader-back").click();
await delay();
assert.equal(doc.querySelector("#overview").hidden, false);
assert.equal(doc.querySelector("#reader").hidden, true);

const deeplink = await load("#/fonction/ft_memmove");
assert.equal(deeplink.window.document.querySelector("#reader").hidden, false,
  "A direct link must open the full article");
assert.equal(deeplink.window.document.querySelector("#reader-title").textContent,"ft_memmove");
assert(deeplink.window.document.querySelector(".trace-panel"),
  "The memory simulator must be visible in the memmove article");
const buttons = deeplink.window.document.querySelectorAll(".trace-stepper button");
assert.equal(buttons.length, 2);
buttons[1].click();
assert.match(deeplink.window.document.querySelector(".trace-progress").textContent,
  /Étape 2/);

assert(!/\barchive\b/i.test(html), "Do not imply any unsupported source attribution");
for (const instance of [dom, deeplink]) instance.window.close();
console.log("UI check passed: list, centred reader, deep link, TOC, blurred code and memory trace.");
