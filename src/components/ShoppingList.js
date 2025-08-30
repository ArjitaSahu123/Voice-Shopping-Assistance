// src/components/ShoppingList.js
import React from "react";

const CAT_ICON = {
  Dairy: "🥛",
  Bakery: "🍞",
  Produce: "🍎",
  Vegetables: "🥕",
  Grains: "🌾",
  Protein: "🍳",
  "Personal Care": "🧴",
  Beverages: "☕",
  Other: "🛒",
};

export default function ShoppingList({ items = [], removeItem }) {
  return (
    <div className="card fade-in">
      <div className="card-header">
        <h3 className="section-title">🛒 Shopping List</h3>
      </div>

      {(!items || items.length === 0) ? (
        <div style={{ color: "#9aa6b2" }}>Your list is empty. Try “Add bread”.</div>
      ) : (
        <div className="list">
          {items.map((i, idx) => {
            const cat = i.category || "Other";
            return (
              <div key={`${i.name}-${idx}`} className="list-item">
                <div className="item-left">
                  <span className="qty-badge">
                    {i.qty ?? 1}{i.unit ? ` ${i.unit}` : ""}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div className="item-name">
                      {i.name}
                      {/* 🔑 show original spoken word if different */}
                      {i.spoken && i.spoken !== i.name && (
                        <span
                          style={{
                            fontSize: "12px",
                            color: "#888",
                            marginLeft: "6px"
                          }}
                        >
                          ({i.spoken})
                        </span>
                      )}
                    </div>
                    <div className="item-meta">
                      <span className="category-pill" title={cat}>
                        {CAT_ICON[cat] || "🛒"} {cat}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  className="btn btn-icon btn-danger"
                  aria-label={`Remove ${i.name}`}
                  onClick={() => removeItem?.(i.name)}
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
