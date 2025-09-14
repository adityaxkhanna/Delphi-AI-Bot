import React from "react";
import "./KPICards.css";

export default function KPICards({ stats }) {
  return (
    <div className="kpi-cards">
      {stats.map((s, i) => (
        <div key={i} className="kpi-card" role="status" aria-label={s.label}>
          <div className="kpi-value">{s.value}</div>
          <div className="kpi-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
