import { UserRole } from './user-role';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  password?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RegisterRequest extends AuthCredentials {
  displayName: string;
}

export interface CreateUserRequest extends RegisterRequest {
  role: UserRole;
}
