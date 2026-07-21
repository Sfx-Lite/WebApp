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
  hasPin: boolean;
};

export type AuthPayload = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
  isPin: boolean;
};

export type GoogleSessionResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
  isNewUser: boolean;
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
  accessToken: string;
};
