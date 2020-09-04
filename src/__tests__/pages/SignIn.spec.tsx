import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import SignIn from '../../pages/SignIn';

jest.mock('react-router-dom', () => {
  return {
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

const mockedSignIn = jest.fn();
jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({ signIn: mockedSignIn }),
  };
});

const mockedAddToast = jest.fn();
jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({ addToast: mockedAddToast }),
  };
});

const invalid_email = 'invalid_email';

const any_email = 'any_email@test.com';
const any_password = '123456';

describe('SignIn Page', () => {
  beforeEach(() => mockedSignIn.mockClear());

  it('should be able to sign in', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: any_email } });
    fireEvent.change(passwordField, { target: { value: any_password } });

    fireEvent.click(buttonElement);

    await waitFor(() =>
      expect(mockedSignIn).toHaveBeenCalledWith({
        email: any_email,
        password: any_password,
      }),
    );
  });

  it('should not be able to sign in with invalid credentials', async () => {
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: invalid_email } });
    fireEvent.change(passwordField, { target: { value: any_password } });

    fireEvent.click(buttonElement);

    await waitFor(() => expect(mockedSignIn).not.toHaveBeenCalled());
  });

  it('should display an error if login fails', async () => {
    mockedSignIn.mockImplementation(() => {
      throw new Error();
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    const passwordField = getByPlaceholderText('Senha');
    const buttonElement = getByText('Entrar');

    fireEvent.change(emailField, { target: { value: any_email } });
    fireEvent.change(passwordField, { target: { value: any_password } });

    fireEvent.click(buttonElement);

    await waitFor(() =>
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({ type: 'error' }),
      ),
    );
  });
});
