# 🛍️ Voice Shopping Assistant

A **voice-powered shopping list manager** with smart suggestions and **multilingual support (5 languages)**.  
Built as part of a **technical assessment** for the Software Engineer role.

---

## 🌍 Supported Languages

This app supports commands in **5 languages**:

1. 🇬🇧 English  
2. 🇮🇳 Hindi (हिंदी)  
3. 🇪🇸 Spanish (Español)  
4. 🇫🇷 French (Français)  
5. 🇩🇪 German (Deutsch)  

---

## 🎤 How to Use (Voice Commands)

Speak into the mic using natural phrases. Examples:

### ➕ Adding Items
- **English**: "Add milk", "I need 2 kilos of tomatoes"  
- **Hindi**: "एक किलो टमाटर जोड़ो", "दो पैकेट दूध चाहिए"  
- **Spanish**: "Añadir pan", "Quiero comprar tres manzanas"  
- **French**: "Ajoute du lait", "Acheter deux bananes"  
- **German**: "Füge Milch hinzu", "Kaufe fünf Äpfel"  

### ➖ Removing Items
- "Remove milk" | "हटा दो आलू" | "Eliminar pan" | "Supprime les pommes" | "Entferne Brot"  

### 📊 Managing Quantities
- "Add 3 bottles of water" | "तीन बोतल पानी जोड़ो" | "Agrega 2 kilos de arroz" | "Ajoute deux litres de jus" | "Füge 1 Kilo Zucker hinzu"  

### 🔍 Searching
- "Find Amul milk" | "ऑर्गेनिक सेब ढूँढो" | "Busca leche orgánica" | "Trouve du lait bio" | "Finde Bio-Milch"  

---

## 🚀 Features

- 🎤 **Voice Input with NLP** (multilingual, flexible phrases)  
- 🛒 **Smart shopping list management** (add/remove, categorize, quantity parsing)  
- 🤖 **Smart suggestions** (frequent, seasonal, substitutes)  
- 🔍 **Voice search with filters** (brand, price, size)  
- 🎨 **UI/UX**: Minimalist, glassmorphism, dark/light themes, real-time transcript  

---

## 🛠️ Tech Stack

- **Frontend:** React  
- **Voice Recognition:** Web Speech API  
- **Language Parsing:** Custom NLP parser (`utils/parser.js`)  
- **Multilingual Translations:** `utils/translations.js`  
- **Styling:** CSS3 (glassy theme, animations)  
- **Deployment:** Vercel  

---

## ⚙️ Installation & Setup

```bash
# Clone repository
git clone https://github.com/ArjitaSahu123/Voice-Shopping-Assistance.git
cd Voice-Shopping-Assistance
```

### Install dependencies
``` bash
    npm install
```

### Run locally
``` bash
  npm start
```

### Build for production
``` bash
    npm run build
```

### Deploy (if vercel CLI installed)
```bash
  vercel
```

## 📖 My Approach

This project was completed as part of a time-boxed assessment (8 hours).
Here’s how I approached each requirement:

### 🎤 Voice Input & NLP

1. Integrated Web Speech API for live voice recognition.

2. Built a custom parser (utils/parser.js) to extract:

3. Item name (e.g., milk, apples, प्याज)

4. Quantity (e.g., 2, दो)

5. Units (e.g., kg, litre, पैकेट)

6. Added multilingual mapping to handle inputs across 5 languages.

###  🛒 Shopping List Management

1. Designed a reusable ShoppingList.js component.

2. Items stored in structured format { name, qty, unit, category }.

3. Auto-categorization into groups (Dairy, Bakery, Vegetables, etc.).

4. Implemented both manual delete button and voice-based remove commands.

### 🤖 Smart Suggestions

1. Created recommendations.js for:

2. Frequently purchased items

3. Seasonal recommendations

4. Substitutes (e.g., "milk → almond milk").

### 🔍 Voice Search

1. Built SearchResults.js to show search results.

2. Parser enhanced to detect filters (brand, price, "under ₹50").

### 🎨 UI/UX

1. Developed a minimal, glassy design (style.css).

2. Dark & light themes with smooth transitions.

3. Added category icons for quick recognition (🥛 Dairy, 🍞 Bakery).

4. Transcript area shows “Last Heard” so users know what was recognized.

### 🚀 Deployment

1. Hosted on Vercel for fast and reliable deployment.

2. GitHub repo maintained with clean commits & this README as documentation.

### ✨ Deliverables

Working App URL:
👉 https://voice-shopping-assistant.vercel.app

GitHub Repository:
👉 https://github.com/ArjitaSahu123/Voice-Shopping-Assistance

Documentation:
This README + inline code comments

