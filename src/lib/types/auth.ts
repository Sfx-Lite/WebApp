export type User = {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type AuthState = {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isInitialized: boolean;
  isPinVerified: boolean;
};

export type AuthPayload = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type LoginResponse = {
  user: User;
  token: string;
};

export type LoginCredentials = {
  emailOrUsername: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  country: string;
  password: string;
};

export type AuthTokenResponse = {
  token: string;
};
