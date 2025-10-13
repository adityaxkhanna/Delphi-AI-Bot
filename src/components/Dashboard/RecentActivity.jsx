
import React from "react";
import "./RecentActivity.css";

export default function RecentActivity({ chats = [] }) {
  return (
    <aside className="recent-rail" aria-label="Recent activity">
      <h3>Recent Activity</h3>

      <div className="ra-block">
        <h4>Chats</h4>
        {chats.length === 0 ? (
          <p className="muted">No recent chats</p>
        ) : (
          <ul>
            {chats.map((c) => (
              <li key={c.id}>
                <div className="item-title">{c.title}</div>
                <div className="meta">{c.when}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
