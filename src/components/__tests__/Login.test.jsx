
// This is the very first, minimal "smoke test" for the Login page.
// Goal: Prove the component renders without crashing and shows the main H1 text.
// We wrap <Login/> in a MemoryRouter because the component calls useNavigate(),
// which requires a Router context even if we aren’t navigating in this test.

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../pages/auth/Login.jsx';

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
});
