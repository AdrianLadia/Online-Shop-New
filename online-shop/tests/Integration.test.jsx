import { render, screen } from '@testing-library/react';
import { AppContext } from '../src/AppContext';
import NavBar from '../src/components/NavBar';

describe('NavBar Component', () => {
  const mockSetUserData = jest.fn();
  const mockSetUserLoaded = jest.fn();
  const mockSetUserState = jest.fn();
  const mockSetUserId = jest.fn();
  const mockSetCart = jest.fn();

  const appContextValue = {
    userdata: null,
    setUserData: mockSetUserData,
    auth: {},
    setUserLoaded: mockSetUserLoaded,
    setUserState: mockSetUserState,
    setUserId: mockSetUserId,
    setCart: mockSetCart,
  };

  test('renders NavBar component and displays login button when not logged in', () => {
    render(
      <AppContext.Provider value={appContextValue}>
        <NavBar />
      </AppContext.Provider>
    );

    expect(screen.getByText(/Login with Google/i)).toBeInTheDocument();
    expect(screen.getByText(/Login with Facebook/i)).toBeInTheDocument();
  });

  test('renders NavBar component and displays account menu when logged in', () => {
    const loggedInContextValue = {
      ...appContextValue,
      userdata: {
        displayName: 'John Doe',
      },
    };

    render(
      <AppContext.Provider value={loggedInContextValue}>
        <NavBar />
      </AppContext.Provider>
    );

    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
  });

  // Add more tests here to cover additional integration scenarios.
});