// src/App.js
import React, { useEffect, useMemo, useState } from "react";
import VoiceInput from "./components/VoiceInput";
import ShoppingList from "./components/ShoppingList";
import SearchResults from "./components/SearchResults";
import StatusToast from "./components/StatusToast";
import { parseCommand, parseSearchCommand } from "./utils/parser";
import products from "./data/products";
import { getRecommendations } from "./utils/recommendations";

// ---------- small helpers (UI only; logic unchanged) ----------
const CORRECTIONS = { floor: "flour", breads: "bread", apples: "apple" };
const CATEGORY_MAP = {
  milk: "Dairy", butter: "Dairy", ghee: "Dairy", curd: "Dairy", yogurt: "Dairy", cheese: "Dairy",
  bread: "Bakery", "brown bread": "Bakery", "multigrain bread": "Bakery", jam: "Bakery",
  apple: "Produce", banana: "Produce", orange: "Produce", grapes: "Produce", plums: "Produce",
  potato: "Vegetables", onion: "Vegetables", tomato: "Vegetables", carrot: "Vegetables",
  cucumber: "Vegetables", cabbage: "Vegetables", spinach: "Vegetables",
  cauliflower: "Vegetables", capsicum: "Vegetables", brinjal: "Vegetables",
  peas: "Vegetables", beans: "Vegetables", okra: "Vegetables", ladyfinger: "Vegetables",
  beetroot: "Vegetables", corn: "Vegetables",
  flour: "Grains", atta: "Grains", rice: "Grains", wheat: "Grains",
  eggs: "Protein", chicken: "Protein",
  toothpaste: "Personal Care", soap: "Personal Care", shampoo: "Personal Care",
  water: "Beverages", tea: "Beverages", coffee: "Beverages",
};

const sanitizeName = (s) =>
  String(s || "").toLowerCase().replace(/[.?!,:;]+$/g, "").trim();
const correctName = (name) => CORRECTIONS[name] || name;

const resolveCategory = (name) => {
  const key = correctName(sanitizeName(name));
  if (CATEGORY_MAP[key]) return CATEGORY_MAP[key];
  if (/milk|butter|ghee|curd|yogurt|cheese/.test(key)) return "Dairy";
  if (/bread|jam/.test(key)) return "Bakery";
  if (/apple|banana|orange|grape|plum/.test(key)) return "Produce";
  if (/potato|onion|tomato|carrot|cucumber|cabbage|spinach|cauli|capsicum|brinjal|pea|beans|okra|ladyfinger|beetroot|corn/.test(key))
    return "Vegetables";
  if (/flour|atta|rice|wheat/.test(key)) return "Grains";
  if (/egg|chicken/.test(key)) return "Protein";
  if (/toothpaste|soap|shampoo/.test(key)) return "Personal Care";
  if (/water|tea|coffee/.test(key)) return "Beverages";
  return "Other";
};

const unitFromSize = (size = "") => {
  const s = String(size).toLowerCase();
  if (s.includes("kg")) return "kg";
  if (s.includes("grams") || s.includes("gram") || s.includes(" g")) return "g";
  if (s.includes("litre") || s.includes("liter") || s.includes(" l")) return "l";
  if (s.includes("ml")) return "ml";
  if (s.includes("bottle")) return "bottle";
  if (s.includes("pack")) return "pack";
  if (s.includes("pcs") || s.includes("pieces")) return "pcs";
  if (s.includes("dozen")) return "dozen";
  return "";
};

function App() {
  // data state
  const [shoppingList, setShoppingList] = useState([]);
  const [history, setHistory] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [lastSearchFilters, setLastSearchFilters] = useState({});

  // UI state
  const [toast, setToast] = useState({ message: "", type: "info" });
  const [isListening, setIsListening] = useState(false);
  const [lastHeard, setLastHeard] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "dark");

  // 🌍 Track current language (important for parser)
  const [currentLang, setCurrentLang] = useState("en-US");

  // apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // one-time cleanup
  useEffect(() => {
    setShoppingList((prev) =>
      prev.map((i) => {
        const clean = correctName(sanitizeName(i.name));
        const cat = i.category && i.category !== "uncategorized" ? i.category : resolveCategory(clean);
        return { ...i, name: clean, category: cat };
      })
    );
  }, []);

  const addItem = (item) => {
    if (!item?.name) return;
    const name = correctName(sanitizeName(item.name));
    const category = resolveCategory(name);

    setShoppingList((prev) => {
      const idx = prev.findIndex((i) => sanitizeName(i.name) === name);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          qty: (copy[idx].qty || 1) + (item.qty || 1),
          unit: item.unit || copy[idx].unit || "",
          category: copy[idx].category && copy[idx].category !== "uncategorized" ? copy[idx].category : category,
          spoken: item.spoken || copy[idx].spoken,
        };
        return copy;
      }
      return [...prev, { ...item, name, qty: item.qty || 1, unit: item.unit || "", category, spoken: item.spoken }];
    });

    setHistory((h) => [...h, { name }]);
    setToast({ message: `Added ${name} × ${item.qty || 1}`, type: "success" });
  };

  const removeItem = (name) => {
    const key = sanitizeName(name);
    setShoppingList((prev) => prev.filter((i) => sanitizeName(i.name) !== key));
    setToast({ message: `Removed ${key}`, type: "info" });
  };

  const handleAddFromSearch = (p) => {
    addItem({ name: p.name, qty: 1, unit: unitFromSize(p.size), category: resolveCategory(p.name) });
  };

  const handleVoiceCommand = (text, lang = currentLang) => {
    setLastHeard(text);

    // ---- SEARCH ----
    const { intent, filters } = parseSearchCommand(text, lang);
    if (intent === "search") {
      const norm = (s) => String(s || "").toLowerCase().replace(/[\s.?!,:;_-]+/g, "").trim();
      let results = products.slice();

      if (filters.item) {
        const needle = norm(filters.item);
        results = results.filter(
          (p) => norm(p.name).includes(needle) || norm(p.type).includes(needle) || norm(p.brand).includes(needle)
        );
      }
      if (filters.brand) {
        const b = norm(filters.brand);
        results = results.filter((p) => norm(p.brand) === b);
      }
      if (filters.size) {
        const want = norm(filters.size).replace(/litre|liter/g, "l").replace(/grams?/g, "g");
        results = results.filter((p) => {
          const have = norm(p.size || "").replace(/litre|liter/g, "l").replace(/grams?/g, "g");
          return have.includes(want);
        });
      }
      if (filters.minPrice != null) results = results.filter((p) => p.price >= filters.minPrice);
      if (filters.maxPrice != null) results = results.filter((p) => p.price <= filters.maxPrice);
      if (filters.organic) {
        results = results.filter(
          (p) => p.organic === true || norm(p.brand).includes("organic") || norm(p.name).includes("organic")
        );
      }

      setSearchResults(results);
      setLastSearchFilters(filters);
      setToast({ message: `Found ${results.length} result${results.length === 1 ? "" : "s"}`, type: "info" });
      return;
    }

    // ---- ADD / REMOVE ----
    const parsed = parseCommand(text, lang);
    if (!parsed) return;

    if (parsed.items) {
      parsed.items.forEach((it) => {
        if (parsed.intent === "remove") removeItem(it.name);
        else addItem(it);
      });
    } else {
      if (parsed.intent === "remove") removeItem(parsed.name);
      else addItem(parsed);
    }
  };

  const suggestions = useMemo(() => getRecommendations(history, shoppingList), [history, shoppingList]);

  const statItems = shoppingList.reduce((sum, i) => sum + (i.qty || 1), 0);
  const statCats = new Set(shoppingList.map((i) => i.category || "Other")).size;
  const statResults = searchResults.length;

  return (
    <div className="app">
      {/* Header */}
      <div className="header fade-in">
        <div className="brand">
          <div className="logo">🛍️</div>
          <h1>Voice Shopping Assistant</h1>
        </div>
        <button
          className="btn"
          onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          {theme === "dark" ? "🌞 Light" : "🌙 Dark"}
        </button>
      </div>

      {/* Stats */}
      <div className="card fade-in">
        <div className="stats">
          <div className="stat"><div className="k">{statItems}</div><div className="l">Total items</div></div>
          <div className="stat"><div className="k">{statCats}</div><div className="l">Categories</div></div>
          <div className="stat"><div className="k">{statResults}</div><div className="l">Search results</div></div>
          <div className="stat">
            <div className="k" title={lastHeard || "—"} style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {lastHeard || "—"}
            </div>
            <div className="l">Last heard</div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="card fade-in" style={{ textAlign: "left" }}>
          <h3 className="section-title">🔎 Suggestions</h3>
          <div className="chips">
            {suggestions
              .filter((s) => !shoppingList.some((i) => sanitizeName(i.name) === sanitizeName(String(s))))
              .map((s, i) => (
                <button
                  key={`${s}-${i}`}
                  className="chip chip-suggest"
                  onClick={() => addItem({ name: String(s), qty: 1, unit: "", category: resolveCategory(String(s)) })}
                >
                  + {String(s)}
                </button>
              ))}
          </div>
        </div>
      )}

      <ShoppingList items={shoppingList} removeItem={removeItem} />
      <SearchResults results={searchResults} filters={lastSearchFilters} onAdd={handleAddFromSearch} />

      <VoiceInput
        onVoiceCommand={(text, lang) => {
          setCurrentLang(lang);
          handleVoiceCommand(text, lang);
        }}
        onListeningChange={setIsListening}
        defaultLanguage="en-US"
      />

      <StatusToast message={toast.message} type={toast.type} onClose={() => setToast({ message: "", type: "info" })} />
    </div>
  );
}

export default App;
