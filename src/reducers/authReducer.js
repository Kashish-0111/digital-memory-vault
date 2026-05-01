import { authService } from '../services/auth.js';

export const initialAuthState = {
  isAuthenticated: false,
  hasPIN: false,
  isLoading: false,
  error: null,
};

export const authActions = {
  SETUP_PIN: 'SETUP_PIN',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_AUTH_STATE: 'SET_AUTH_STATE',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING',
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case authActions.SET_LOADING:
      return { ...state, isLoading: true, error: null };

    case authActions.SETUP_PIN: {
      authService.initializePIN(action.payload);
      return {
        ...state,
        isAuthenticated: true,
        hasPIN: true,
        isLoading: false,
        error: null,
      };
    }

    case authActions.LOGIN: {
      const result = action.payload;
      if (result.success) {
        return {
          ...state,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        };
      }
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: result.error,
      };
    }

    case authActions.LOGOUT:
      authService.logout();
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case authActions.SET_AUTH_STATE:
      return {
        ...state,
        isAuthenticated: action.payload.isAuthenticated,
        hasPIN: action.payload.hasPIN,
        isLoading: false,
        error: null,
      };

    case authActions.CLEAR_ERROR:
      return { ...state, error: null };

    default:
      return state;
  }
};

