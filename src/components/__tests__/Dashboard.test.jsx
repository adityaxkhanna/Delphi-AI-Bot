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
      onChange={(e) => onSearch(e.target.value)}
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
// 13) SearchBar onSearch flows to Dashboard's console.log("search:", term).
it("SearchBar triggers onSearch with typed value", () => {
  const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});
  renderDash();

  const input = screen.getByTestId("search-bar");
  fireEvent.change(input, { target: { value: "iron" } });

  expect(logSpy).toHaveBeenCalledWith("search:", "iron");
  logSpy.mockRestore();
});

// 14) Mobile open state shouldn't interfere with later desktop collapsed state.
it("mobile open state doesn't interfere with later desktop collapsed state", () => {
  window.innerWidth = 500;
  renderDash();
  // open mobile
  fireEvent.click(screen.getByRole("button", { name: /collapse sidebar/i }));
  expect(screen.getByTestId("sidebar")).toHaveTextContent("open=true");

  // resize to desktop and collapse
  act(() => {
    window.innerWidth = 1100;
    window.dispatchEvent(new Event("resize"));
  });
  const btn = screen.getByRole("button", { name: /collapse sidebar/i });
  fireEvent.click(btn);

  expect(screen.getByTestId("sidebar")).toHaveTextContent("collapsed=true");
  expect(screen.getByTestId("sidebar")).toHaveTextContent("open=false");
});

// 15) Desktop: double toggle returns collapsed=false.
it("desktop: double toggle returns collapsed=false", () => {
  renderDash();
  const btn1 = screen.getByRole("button", { name: /collapse sidebar/i });
  fireEvent.click(btn1);
  expect(screen.getByTestId("sidebar")).toHaveTextContent("collapsed=true");

  const btn2 = screen.getByRole("button", { name: /expand sidebar/i });
  fireEvent.click(btn2);
  expect(screen.getByTestId("sidebar")).toHaveTextContent("collapsed=false");
});
// 16) Desktop: overlay should never appear on toggle.
it("desktop: no overlay should be present even after toggling", () => {
  renderDash();
  fireEvent.click(screen.getByRole("button", { name: /collapse sidebar/i }));
  expect(document.querySelector(".sidebar-overlay")).toBeFalsy();
});

// 17) Initial accessible name confirms non-collapsed (Collapse sidebar).
it("initial aria-label is 'Collapse sidebar' when not collapsed", () => {
  renderDash();
  expect(screen.getByRole("button", { name: /collapse sidebar/i })).toBeInTheDocument();
});
// 18) Resize listener is added on mount and removed on unmount (cleanup).
it("adds and removes resize listener on mount/unmount", () => {
  const addSpy = vi.spyOn(window, "addEventListener");
  const removeSpy = vi.spyOn(window, "removeEventListener");

  const { unmount } = renderDash();
  expect(addSpy).toHaveBeenCalledWith("resize", expect.any(Function));

  unmount();
  expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));

  addSpy.mockRestore();
  removeSpy.mockRestore();
});

// 19) dashboard-content gets 'collapsed' class when collapsed on desktop.
it("adds 'collapsed' class to .dashboard-content when collapsed (desktop)", () => {
  renderDash();
  const container = document.querySelector(".dashboard-content");
  expect(container).toBeTruthy();
  expect(container.classList.contains("collapsed")).toBe(false);

  const toggle = screen.getByRole("button", { name: /collapse sidebar/i });
  fireEvent.click(toggle);

  expect(container.classList.contains("collapsed")).toBe(true);
});

});
