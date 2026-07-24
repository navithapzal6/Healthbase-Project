export interface StoredAuthUser {
  id?: number | string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  avatar?: string;
  isActive?: boolean;
}

export interface AuthSession {
  token: string;
  user: StoredAuthUser;
}
