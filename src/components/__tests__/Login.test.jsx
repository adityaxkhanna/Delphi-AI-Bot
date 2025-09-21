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


})
