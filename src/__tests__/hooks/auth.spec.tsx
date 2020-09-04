import { renderHook, act } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';

import { useAuth, AuthProvider } from '../../hooks/auth';

import api from '../../services/api';

const apiMock = new MockAdapter(api);

const any_email = 'any_mail@test.com';
const any_password = 'any-password';
const any_token = 'any-token';

const tokenStorageKey = '@GoBarber:token';
const userStorageKey = '@GoBarber:user';

const any_user = {
  id: 'any-id',
  name: 'Any User',
  email: any_email,
  avatar_url: 'any-avatar.jpg',
};

describe('Auth hook', () => {
  it('should be able to sign in', async () => {
    apiMock.onPost('sessions').reply(200, {
      user: any_user,
      token: any_token,
    });

    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: any_email,
      password: any_password,
    });

    await waitForNextUpdate();

    expect(setItemSpy).toHaveBeenCalledWith(tokenStorageKey, any_token);

    expect(setItemSpy).toHaveBeenCalledWith(
      userStorageKey,
      JSON.stringify(any_user),
    );

    expect(result.current.user.email).toEqual(any_email);
  });

  it('should restore saved data from storage when auth inits', async () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case tokenStorageKey:
          return any_token;
        case userStorageKey:
          return JSON.stringify(any_user);
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toEqual(any_email);
  });

  it('should be able to sign out', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case tokenStorageKey:
          return any_token;
        case userStorageKey:
          return JSON.stringify(any_user);
        default:
          return null;
      }
    });

    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => result.current.signOut());

    expect(removeItemSpy).toHaveBeenCalledWith(tokenStorageKey);
    expect(removeItemSpy).toHaveBeenCalledWith(userStorageKey);

    expect(result.current.user).toBeUndefined();
  });

  it('should be able to update user data', async () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => result.current.updateUser(any_user));

    expect(setItemSpy).toHaveBeenCalledWith(
      userStorageKey,
      JSON.stringify(any_user),
    );

    expect(result.current.user).toEqual(any_user);
  });
});
