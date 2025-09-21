// src/components/__tests__/Dashboard.test.jsx
import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

// CUT
import Dashboard from "../Dashboard/Dashboard.jsx";

// ---- Router mocks (navigate + location) ----
const mockNavigate = vi.fn();
let mockPathname = "/dashboard";
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: mockPathname }),
  };
});

// ---- Child component mocks ----
vi.mock("../Dashboard/Sidebar.jsx", () => ({
  default: ({ collapsed, mobileOpen, isMobile, onToggle }) => (
    <div data-testid="sidebar">
      Sidebar (collapsed={String(collapsed)}, mobile={String(isMobile)}, open={String(mobileOpen)})
      <button onClick={onToggle}>toggle</button>
    </div>
  ),
}));

export const onSearchSpy = vi.fn();
vi.mock("../Dashboard/SearchBar.jsx", () => ({
  default: ({ onSearch }) => (
    <input
      data-testid="search-bar"
      placeholder="search..."
      onChange={(e) => {
        onSearch(e.target.value);
        // expose to tests
        require("./Dashboard.test.jsx").onSearchSpy(e.target.value);
      }}
    />
  ),
}));

vi.mock("../Dashboard/RecentActivity.jsx", () => ({
  default: ({ chats, docs }) => (
    <div data-testid="recent-activity">
      Recent: {chats.length} chats, {docs.length} docs
    </div>
  ),
}));

const renderDash = (ui = null) =>
  render(<MemoryRouter>{ui ?? <Dashboard />}</MemoryRouter>);

describe("Dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    onSearchSpy.mockClear?.();
    mockPathname = "/dashboard";
    window.innerWidth = 1024; // desktop default
    document.body.innerHTML = "";
  });

  // tests will be added in subsequent steps
});
