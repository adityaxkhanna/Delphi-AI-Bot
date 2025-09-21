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
  // 1) Renders the header title so users see the product name.
it("renders the header title", () => {
  renderDash();
  expect(screen.getByText("Delphi AI Bot")).toBeInTheDocument();
});

// 2) Renders children inside <main> to confirm slotting.
it("renders children passed as props", () => {
  renderDash(
    <Dashboard>
      <p>Child here</p>
    </Dashboard>
  );
  expect(screen.getByText("Child here")).toBeInTheDocument();
});

// 3) SearchBar is present in header middle section.
it("renders the SearchBar", () => {
  renderDash();
  expect(screen.getByTestId("search-bar")).toBeInTheDocument();
});

  beforeEach(() => {
    vi.clearAllMocks();
    onSearchSpy.mockClear?.();
    mockPathname = "/dashboard";
    window.innerWidth = 1024; // desktop default
    document.body.innerHTML = "";
  });

  // 4) Desktop: hamburger collapses sidebar (collapsed=true).
it("desktop: toggles collapsed state on hamburger click", () => {
  renderDash();
  const toggleBtn = screen.getByRole("button", { name: /collapse sidebar/i });
  fireEvent.click(toggleBtn);
  expect(screen.getByTestId("sidebar")).toHaveTextContent("collapsed=true");
});

// 5) Desktop: aria-label flips from 'Collapse' to 'Expand' after collapse.
it("desktop: aria-label flips from 'Collapse' to 'Expand' when collapsed", () => {
  renderDash();
  const toggleBtn = screen.getByRole("button", { name: /collapse sidebar/i });
  fireEvent.click(toggleBtn);
  expect(screen.getByRole("button", { name: /expand sidebar/i })).toBeInTheDocument();
});
// 6) Mobile: toggling opens sidebar and shows overlay.
it("mobile: opening sidebar shows overlay", () => {
  window.innerWidth = 500;
  renderDash();
  fireEvent.click(screen.getByRole("button", { name: /collapse sidebar/i }));
  expect(screen.getByTestId("sidebar")).toHaveTextContent("open=true");
  expect(document.querySelector(".sidebar-overlay")).toBeTruthy();
});

// 7) Mobile: clicking overlay closes sidebar (open=false).
it("mobile: overlay click closes sidebar", () => {
  window.innerWidth = 500;
  renderDash();
  fireEvent.click(screen.getByRole("button", { name: /collapse sidebar/i }));
  const overlay = document.querySelector(".sidebar-overlay");
  expect(overlay).toBeTruthy();
  fireEvent.click(overlay);
  expect(screen.getByTestId("sidebar")).toHaveTextContent("open=false");
});
// 8) Resize: mobile(open) → desktop closes overlay and resets open=false.
it("resize: mobile(open) → desktop closes overlay and resets open=false", () => {
  window.innerWidth = 500;
  renderDash();
  fireEvent.click(screen.getByRole("button", { name: /collapse sidebar/i }));
  expect(document.querySelector(".sidebar-overlay")).toBeTruthy();

  act(() => {
    window.innerWidth = 1200;
    window.dispatchEvent(new Event("resize"));
  });

  expect(screen.getByTestId("sidebar")).toHaveTextContent("mobile=false");
  expect(screen.getByTestId("sidebar")).toHaveTextContent("open=false");
  expect(document.querySelector(".sidebar-overlay")).toBeFalsy();
});

// 9) Resize: desktop → mobile sets isMobile=true.
it("resize: switching to mobile sets isMobile=true", () => {
  renderDash();
  act(() => {
    window.innerWidth = 700;
    window.dispatchEvent(new Event("resize"));
  });
  expect(screen.getByTestId("sidebar")).toHaveTextContent("mobile=true");
});
// 10) Sign out triggers navigation to /login.
it("navigates to /login on sign out click", () => {
  renderDash();
  fireEvent.click(screen.getByRole("button", { name: /sign out/i }));
  expect(mockNavigate).toHaveBeenCalledWith("/login");
});

// 11) RecentActivity appears on /dashboard/chat route.
it("shows RecentActivity on /dashboard/chat", () => {
  mockPathname = "/dashboard/chat";
  renderDash();
  expect(screen.getByTestId("recent-activity")).toBeInTheDocument();
});

// 12) RecentActivity hidden on non-chat routes.
it("hides RecentActivity on non-chat routes", () => {
  mockPathname = "/dashboard/settings";
  renderDash();
  expect(screen.queryByTestId("recent-activity")).not.toBeInTheDocument();
});
// 13) SearchBar onSearch is invoked with typed value.
it("SearchBar triggers onSearch with typed value", () => {
  renderDash();
  const input = screen.getByTestId("search-bar");
  fireEvent.change(input, { target: { value: "iron" } });
  expect(require("./Dashboard.test.jsx").onSearchSpy).toHaveBeenCalledWith("iron");
});

});
