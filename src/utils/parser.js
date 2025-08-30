// src/utils/parser.js

// ======================= Helpers =======================

// English + Hindi number words
const NUMBER_WORDS = {
  // English
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5,
  six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
  dozen: 12,

  // Hindi
  "शून्य": 0, "एक": 1, "दो": 2, "तीन": 3, "चार": 4, "पांच": 5,
  "छह": 6, "सात": 7, "आठ": 8, "नौ": 9, "दस": 10,
  "आधा": 0.5, "दर्जन": 12,

  // (Optional future: Spanish/French/German number words can be added here)
};

// Normalize Hindi units → English equivalents
function normalizeUnits(text) {
  return text
    .replace(/किलो|केजी/g, "kg")
    .replace(/ग्राम/g, "g")
    .replace(/लीटर/g, "l")
    .replace(/मिली|एमएल/g, "ml")
    .replace(/पैकेट/g, "pack")
    .replace(/बोतल/g, "bottle")
    .replace(/दर्जन/g, "dozen");
}

// General clean-up
const clean = (s = "") =>
  s.toLowerCase().replace(/[,]/g, "").replace(/\s+/g, " ").trim();

// word → number (works for English + Hindi)
const wordToNumber = (w) => (NUMBER_WORDS[w] != null ? NUMBER_WORDS[w] : null);

const extractQty = (text) => {
  // numeric digits
  const num = text.match(/\b(\d+(?:\.\d+)?)\b/);
  if (num) return parseFloat(num[1]);

  // number words
  const word = text.match(/\b(शून्य|एक|दो|तीन|चार|पांच|छह|सात|आठ|नौ|दस|आधा|दर्जन|zero|one|two|three|four|five|six|seven|eight|nine|ten|dozen)\b/);
  if (word) {
    const n = wordToNumber(word[1]);
    if (n != null) return n;
  }
  return 1;
};

// Units (English + Hindi)
const UNIT_REGEX =
  /\b(kg|g|gram|grams|l|ml|liter|litre|pack|packet|bottle|pcs|pieces|dozen|किलो|केजी|ग्राम|लीटर|मिली|एमएल|पैकेट|बोतल|दर्जन)\b/;

const extractUnit = (text) => {
  const normalized = normalizeUnits(text);
  const m = normalized.match(UNIT_REGEX);
  return m ? m[1] : "";
};

// singularize simple plurals (English only for now)
const singularize = (name) => {
  if (/\bpotatoes\b/.test(name)) return name.replace(/\bpotatoes\b/, "potato");
  if (/\btomatoes\b/.test(name)) return name.replace(/\btomatoes\b/, "tomato");
  return name.replace(/\b([a-z]+?)s\b/g, (m, base) =>
    base.endsWith("s") ? m : base
  );
};

// Remove helper verbs etc.
const stripToItem = (text) =>
  normalizeUnits(text)
    .replace(/\b(add|buy|need|want|put|include|remove|delete|drop|search|find|show|look|for)\b/gi, "")
    .replace(/\b(खरीदो|चाहिए|निकालो|हटाओ|डालो|लिस्ट|सूची)\b/g, "")
    .replace(/\b\d+(?:\.\d+)?\b/g, "")
    .replace(/\b(शून्य|एक|दो|तीन|चार|पांच|छह|सात|आठ|नौ|दस|आधा|दर्जन|zero|one|two|three|four|five|six|seven|eight|nine|ten|dozen)\b/g, "")
    .replace(UNIT_REGEX, "")
    .replace(/\s+/g, " ")
    .trim();

// ======================= Add/Remove Parser =======================

export function parseCommand(input) {
  const text = clean(normalizeUnits(input));
  if (!text) return null;

  const qty = extractQty(text);
  const unit = extractUnit(text);
  const isRemove = /\b(remove|delete|drop|निकालो|हटाओ)\b/.test(text);

  let name = stripToItem(text);
  if (!name) return null;

  name = name.replace(/[.?!,:;]+$/g, ""); // strip trailing punctuation
  name = singularize(name);

  return {
    intent: isRemove ? "remove" : "add",
    name,
    qty: isRemove ? 0 : qty,
    unit,
    category: "uncategorized",
  };
}

// ======================= Search Parser =======================

export function parseSearchCommand(input) {
  const original = input || "";
  let text = clean(normalizeUnits(original));

  const isSearch = /\b(find|search|look for|show me|सर्च|ढूंढो|खोजो)\b/.test(text);
  if (!isSearch) return { intent: "none", filters: {} };

  let organic = /\borganic|ऑर्गेनिक\b/.test(text);

  let minPrice = null;
  let maxPrice = null;

  const between = text.match(
    /\bbetween\s*(?:₹|rs\.?\s*|\$)?\s*(\d+(?:\.\d+)?)\s*(?:and|to|-)\s*(?:₹|rs\.?\s*|\$)?\s*(\d+(?:\.\d+)?)/i
  );
  if (between) {
    minPrice = parseFloat(between[1]);
    maxPrice = parseFloat(between[2]);
  } else {
    const under = text.match(
      /\b(under|below|less than|कम|नीचे)\s*(?:₹|rs\.?\s*|\$)?\s*(\d+(?:\.\d+)?)/i
    );
    const over = text.match(
      /\b(over|above|more than|greater than|ज्यादा|ऊपर)\s*(?:₹|rs\.?\s*|\$)?\s*(\d+(?:\.\d+)?)/i
    );
    if (under) maxPrice = parseFloat(under[2]);
    if (over) minPrice = parseFloat(over[2]);
  }

  let brand = null;
  const byBrand = text.match(/\bby\s+([a-z0-9\s-]+)|के\s*द्वारा\s*([a-zअ-ह0-9\s-]+)/i);
  if (byBrand) {
    brand = clean(byBrand[1] || byBrand[2]);
    text = text.replace(byBrand[0], " ");
  }

  let size = null;
  const sizeMatch = text.match(
    /\b(\d+(?:\.\d+)?)\s*(kg|g|gram|grams|l|litre|liter|ml|pack|packet|bottle|pcs|pieces|किलो|केजी|ग्राम|लीटर|मिली|एमएल|पैकेट|बोतल|दर्जन)\b/i
  );
  if (sizeMatch) {
    size = `${sizeMatch[1]} ${sizeMatch[2]}`.toLowerCase();
    text = text.replace(sizeMatch[0], " ");
  }

  text = text
    .replace(/\b(find|search|look for|show me|सर्च|ढूंढो|खोजो|please|pls|plz)\b/gi, " ")
    .replace(/\borganic|ऑर्गेनिक\b/gi, " ")
    .replace(/\s+/g, " ")
    .trim();

  let item = text || null;
  if (item) {
    item = item.replace(/[.?!,:;]+$/g, ""); // strip punctuation
  }

  return {
    intent: "search",
    filters: {
      item,
      brand,
      size,
      minPrice,
      maxPrice,
      organic,
    },
  };
}
