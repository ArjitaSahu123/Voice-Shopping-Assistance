import React from "react";

const Tag = ({ children }) => <span className="chip">{children}</span>;

export default function SearchResults({ results = [], filters = {}, onAdd }) {
  if (!results || results.length === 0) return null;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="section-title">🔎 Search Results ({results.length})</h3>
        <div className="chips">
          {filters?.item && <Tag>item: {String(filters.item)}</Tag>}
          {filters?.brand && <Tag>brand: {String(filters.brand)}</Tag>}
          {filters?.size && <Tag>size: {String(filters.size)}</Tag>}
          {filters?.minPrice != null && <Tag>min: {filters.minPrice}</Tag>}
          {filters?.maxPrice != null && <Tag>max: {filters.maxPrice}</Tag>}
          {filters?.organic && <Tag>organic</Tag>}
        </div>
      </div>

      <div className="grid">
        {results.map((p) => (
          <div key={p.id} className="product">
            <div className="title">
              <strong>{p.brand}</strong> {p.name}{p.organic ? " · Organic" : ""}
            </div>
            <div className="meta">
              {p.size ? `${p.size} ` : ""} — ₹{p.price}
            </div>
            <div style={{ marginTop: "auto" }}>
              <button className="btn" onClick={() => onAdd?.(p)}>+ Add</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
