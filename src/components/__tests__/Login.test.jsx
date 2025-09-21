// Step-1
// This is the very first, minimal "smoke test" for the Login page.
// Goal: Prove the component renders without crashing and shows the main H1 text.
// We wrap <Login/> in a MemoryRouter because the component calls useNavigate(),
// which requires a Router context even if we aren’t navigating in this test.

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../pages/auth/Login.jsx';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

// mock react-router's useNavigate so we can assert the path
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});
describe('Login', () => {
  it('renders the welcome title', () => {
    // Render the page at a fake route so react-router hooks work.
    render(
      <MemoryRouter initialEntries={['/login']}>
        <Login />
      </MemoryRouter>
    );

    // Assertion: the main H1 should read "Welcome back".
    // We use role-based query (more a11y-accurate) and a case-insensitive regex.
    expect(
      screen.getByRole('heading', { name: /welcome back/i })
    ).toBeInTheDocument();
  });
// Step 2: structure & branding assertions 

// Proves the main landmark exists and key branding text is rendered.
it('renders main landmark and branding text', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>
  );

  // Landmark present
  expect(screen.getByRole('main')).toBeInTheDocument();

  // Branding present
  expect(screen.getByText(/DELPHI/i)).toBeInTheDocument();
  expect(screen.getByText(/Decision insights for Lifeblood/i)).toBeInTheDocument();
});

// Verifies the H1 has the expected id used by aria-labelledby on the section.
it('heading has the expected id (welcome-title)', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>
  );

  const heading = screen.getByRole('heading', { name: /welcome back/i, level: 1 });
  expect(heading.id).toBe('welcome-title');
});
// -- Step 3: button accessibility --
// Confirms the Microsoft sign-in button is exposed with a clear accessible name.
it('shows the Microsoft sign-in button with accessible name', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>
  );

  const btn = screen.getByRole('button', { name: /sign in with microsoft/i });
  expect(btn).toBeEnabled(); // interactive and not disabled
});
// -- Step 3: button accessibility --
// Confirms the Microsoft sign-in button is exposed with a clear accessible name.
it('shows the Microsoft sign-in button with accessible name', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>
  );

  const btn = screen.getByRole('button', { name: /sign in with microsoft/i });
  expect(btn).toBeEnabled(); // interactive and not disabled
});
// -- Step 4: click navigates to /dashboard --
it('navigates to /dashboard and logs on button click', async () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>
  );

  await userEvent.click(screen.getByRole('button', { name: /sign in with microsoft/i }));

  expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
});
// -- Step 5: keyboard activation (Enter/Space) --
it('activates sign-in via Enter key', async () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>
  );

  const btn = screen.getByRole('button', { name: /sign in with microsoft/i });
  btn.focus();
  await userEvent.keyboard('{Enter}');
  expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
});

it('activates sign-in via Space key', async () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>
  );

  const btn = screen.getByRole('button', { name: /sign in with microsoft/i });
  btn.focus();
  await userEvent.keyboard(' ');
  expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
});
// -- Step 6: legal links, aside label, presentational image --

it('renders legal links (Terms, Privacy Policy)', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>
  );
  expect(screen.getByRole('link', { name: /terms/i })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /privacy policy/i })).toBeInTheDocument();
});

it('aside has a descriptive aria-label', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>
  );
  expect(screen.getByLabelText(/brand illustration/i)).toBeInTheDocument();
});

it('decorative image is presentational (alt="" + aria-hidden)', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>
  );
  // Decorative images with alt="" + aria-hidden are role=presentation
  const img = screen.getByRole('presentation', { hidden: true });
  expect(img).toHaveAttribute('alt', '');
  expect(img).toHaveAttribute('aria-hidden', 'true');
});
// -- Step 7: logs to console on click --
it('logs "Login clicked" when the sign-in button is pressed', async () => {
  const originalLog = console.log;
  console.log = vi.fn();

  render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>
  );

  await userEvent.click(screen.getByRole('button', { name: /sign in with microsoft/i }));
  expect(console.log).toHaveBeenCalledWith('Login clicked');

  console.log = originalLog; // restore
});

// -- Step 8: button has correct aria-label AND visible text --
it('exposes a precise aria-label and visible text for the sign-in button', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>
  );

  const btn = screen.getByRole('button', { name: /sign in with microsoft/i });
  expect(btn).toHaveAttribute('aria-label', 'Sign in with Microsoft'); // exact case
  expect(screen.getByText('Sign in with Microsoft')).toBeInTheDocument(); // visible text node
});

// -- Step 9: section uses aria-labelledby that points to the H1 id --
it('section aria-labelledby references the H1 id', () => {
  render(
    <MemoryRouter initialEntries={['/login']}>
      <Login />
    </MemoryRouter>
  );

  const section = screen.getByRole('region', { name: /welcome back/i });
  const heading = screen.getByRole('heading', { name: /welcome back/i, level: 1 });

  expect(section).toHaveAttribute('aria-labelledby', heading.id);
});


})
