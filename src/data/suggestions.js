// src/data/suggestions.js

// Seasonal fruits & veggies by month (India-centric example)
export const seasonal = {
  1: ["oranges", "carrots", "spinach"],           // January
  2: ["strawberries", "peas"],                    // February
  3: ["mangoes", "pineapple"],                    // March
  4: ["watermelon", "cucumber"],                  // April
  5: ["mangoes", "lychees"],                      // May
  6: ["cherries", "corn"],                        // June
  7: ["jamun", "ladyfinger"],                     // July
  8: ["plums", "grapes"],                         // August
  9: ["apple", "pomegranate"],                    // September
  10: ["guava", "sweet potato"],                  // October
  11: ["cauliflower", "peas"],                    // November
  12: ["beetroot", "oranges"],                    // December
};

// Smarter substitutes
export const substitutes = {
  // Dairy
  milk: ["almond milk", "soy milk", "oat milk", "coconut milk"],
  butter: ["ghee", "margarine", "olive oil", "peanut butter"],
  cheese: ["paneer", "tofu", "cashew cheese"],

  // Bakery
  bread: ["multigrain bread", "brown bread", "gluten-free bread", "naan", "chapati"],
  jam: ["marmalade", "honey", "peanut butter", "chocolate spread"],

  // Grains & staples
  rice: ["quinoa", "millets", "couscous", "brown rice"],
  flour: ["atta", "multigrain flour", "almond flour", "oats flour"],
  sugar: ["jaggery", "honey", "stevia", "brown sugar"],

  // Vegetables
  potato: ["sweet potato", "yam", "taro"],
  tomato: ["canned tomatoes", "tomato puree", "red bell pepper"],
  onion: ["spring onion", "shallots", "leeks"],
  spinach: ["kale", "amaranth leaves", "methi (fenugreek) leaves"],
  peas: ["green beans", "edamame"],

  // Fruits
  apple: ["pear", "guava", "peach"],
  banana: ["plantain", "jackfruit (ripe)", "papaya"],
  orange: ["mandarin", "sweet lime", "grapefruit"],
  grapes: ["raisins", "blueberries", "cherries"],

  // Protein
  chicken: ["tofu", "paneer", "soy chunks", "mushrooms"],
  eggs: ["tofu scramble", "chickpea flour omelette"],

  // Beverages
  tea: ["green tea", "herbal tea", "lemongrass tea"],
  coffee: ["chicory coffee", "green tea", "matcha"],
  water: ["sparkling water", "coconut water"],

  // Personal care
  toothpaste: ["ayurvedic toothpaste", "herbal tooth powder"],
  soap: ["body wash", "shower gel"],
  shampoo: ["hair cleanser", "herbal rinse"],
};
