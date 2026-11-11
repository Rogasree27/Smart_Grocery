export type UserRole = 'admin' | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  mobile?: string;
  password?: string;
  createdAt: string;
}

export interface AuthSession {
  user: Omit<User, 'password'>;
  token: string;
  loginTime: string;
}
