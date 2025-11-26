
import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { useGameStore } from '../store/gameStore';
import { usePlayerStore } from '../store/playerStore';
import { useRoomStore } from '../store/roomStore';

// Mock the stores and services
jest.mock('../store/gameStore');
jest.mock('../store/playerStore');
jest.mock('../store/roomStore');
jest.mock('../services/socketService');
jest.mock('react-router-dom', () => ({
  useNavigate: () => jest.fn(),
}));

const mockUseGameStore = useGameStore as unknown as jest.Mock;
const mockUsePlayerStore = usePlayerStore as unknown as jest.Mock;
const mockUseRoomStore = useRoomStore as unknown as jest.Mock;

interface CustomRenderOptions extends RenderOptions {
  initialState?: {
    gameStore?: Partial<ReturnType<typeof useGameStore>>;
    playerStore?: Partial<ReturnType<typeof usePlayerStore>>;
    roomStore?: Partial<ReturnType<typeof useRoomStore>>;
  };
}

const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  );
};

const customRender = (
  ui: ReactElement,
  options?: CustomRenderOptions
) => {
  const { initialState, ...renderOptions } = options || {};

  // Set up mock implementations for each store
  mockUseGameStore.mockImplementation((selector) => {
    const state = {
      isConfigurable: false,
      gameState: null,
      setGameState: jest.fn(),
      clearGameState: jest.fn(),
      ...initialState?.gameStore,
    };
    return selector ? selector(state) : state;
  });

  mockUsePlayerStore.mockImplementation((selector) => {
    const state = {
      socketId: null,
      nickname: null,
      setSocketId: jest.fn(),
      setNickname: jest.fn(),
      ...initialState?.playerStore,
    };
    return selector ? selector(state) : state;
  });

  mockUseRoomStore.mockImplementation((selector) => {
    const state = {
      room: null,
      setRoom: jest.fn(),
      clearRoom: jest.fn(),
      ...initialState?.roomStore,
    };
    return selector ? selector(state) : state;
  });

  return render(ui, { wrapper: AllTheProviders, ...renderOptions });
};


export * from '@testing-library/react';
export { customRender as renderWithProviders };
