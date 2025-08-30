// src/utils/recommendations.js
import { substitutes, seasonal } from "../data/suggestions";

// --- small helpers ---
const toArray = (v) => (Array.isArray(v) ? v : v ? [v] : []);
const lower = (s) => String(s || "").toLowerCase();
const uniq = (arr) => Array.from(new Set(arr.map((s) => lower(s))));

// --- Base associations (manually defined pairs) ---
const BASE_ASSOC = {
  bread: ["butter", "jam", "eggs"],
  milk: ["bread", "eggs", "cornflakes"],
  rice: ["dal", "oil", "spices"],
  apple: ["banana", "orange"],
  butter: ["bread", "jam"],
  jam: ["bread", "butter"],
  eggs: ["bread"],
  cornflakes: ["milk"],
  dal: ["rice"],
  oil: ["rice"],
  spices: ["rice"],
};

// Build symmetric association map
function buildAssoc(base) {
  const assoc = {};
  const add = (a, b) => {
    const A = lower(a), B = lower(b);
    assoc[A] = assoc[A] || new Set();
    assoc[A].add(B);
  };
  Object.entries(base).forEach(([k, arr]) => {
    toArray(arr).forEach((v) => {
      add(k, v);
      add(v, k); // symmetry
    });
  });
  const out = {};
  Object.entries(assoc).forEach(([k, set]) => (out[k] = Array.from(set)));
  return out;
}

const ASSOCIATIONS = buildAssoc(BASE_ASSOC);

// seasonal + substitutes helpers
const monthKey = () => String(new Date().getMonth() + 1);
const getSeasonal = () => toArray(seasonal[monthKey()] || []);
const getSubs = (name) => toArray(substitutes[lower(name)] || []);
const getAssoc = (name) => toArray(ASSOCIATIONS[lower(name)] || []);

/**
 * history: [{ name: "bread" }, ...]
 * shoppingList: [{ name: "bread", qty: 1 }, ...]
 * Returns array<string> of item names (no sentences).
 */
export function getRecommendations(history = [], shoppingList = []) {
  const have = new Set((shoppingList || []).map((i) => lower(i.name)));

  // Prefer last from history; else fall back to last item in the list
  const lastFromHistory = (history || []).slice(-1)[0]?.name;
  const lastFromList = (shoppingList || []).slice(-1)[0]?.name;
  const last = lastFromHistory || lastFromList;

  let priority = [];
  let secondary = [];

  if (last) {
    // 1) Substitutes for the last item → highest priority
    priority = getSubs(last);

    // 2) Associations for the last item → medium priority
    secondary = getAssoc(last);
  }

  // 3) Seasonal for current month → lowest priority
  const season = getSeasonal();

  // Merge in order: substitutes > associations > seasonal
  const merged = uniq([...priority, ...secondary, ...season]).filter((n) => !have.has(n));

  return merged;
}
