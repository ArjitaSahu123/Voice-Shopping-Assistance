// src/utils/translations.js

// 🌍 Multilingual dictionary
// You can expand this with more items / synonyms
export const TRANSLATIONS = {
  hi: { // Hindi
    add: ["जोड़ो", "डालो", "खरीदो", "ले आओ"],
    remove: ["निकालो", "हटाओ", "मिटाओ"],
    milk: ["दूध"],
    apple: ["सेब", "सेबों"],
    potato: ["आलू", "आलुओं"],
    tomato: ["टमाटर", "टमाटरों"],
    bread: ["ब्रेड", "रोटी"],
    rice: ["चावल"],
  },
  es: { // Spanish
    add: ["añadir", "agregar", "comprar"],
    remove: ["quitar", "eliminar", "borrar"],
    milk: ["leche"],
    apple: ["manzana", "manzanas"],
    potato: ["patata", "papas"],
    tomato: ["tomate", "tomates"],
    bread: ["pan"],
    rice: ["arroz"],
  },
  fr: { // French
    add: ["ajouter", "acheter"],
    remove: ["supprimer", "retirer", "enlever"],
    milk: ["lait"],
    apple: ["pomme", "pommes"],
    potato: ["pomme de terre", "pommes de terre"],
    tomato: ["tomate", "tomates"],
    bread: ["pain"],
    rice: ["riz"],
  },
  de: { // German
    add: ["hinzufügen", "kaufen"],
    remove: ["entfernen", "löschen"],
    milk: ["milch"],
    apple: ["apfel", "äpfel"],
    potato: ["kartoffel", "kartoffeln"],
    tomato: ["tomate", "tomaten"],
    bread: ["brot"],
    rice: ["reis"],
  },
  en: { // English
    add: ["add", "buy", "include", "put", "need", "want"],
    remove: ["remove", "delete", "drop"],
    milk: ["milk"],
    apple: ["apple", "apples"],
    potato: ["potato", "potatoes"],
    tomato: ["tomato", "tomatoes"],
    bread: ["bread"],
    rice: ["rice"],
  }
};

// 🔎 Translate a single word into normalized key
export function translateWord(word, lang = "en") {
  const map = TRANSLATIONS[lang];
  if (!map) return word;

  for (const [key, values] of Object.entries(map)) {
    if (values.includes(word.toLowerCase())) {
      return key; // normalized word
    }
  }
  return word;
}
