import { Injectable } from '@angular/core';
import { UserRole } from '../models/user-role';
import {
  AuthCredentials,
  CreateUserRequest,
  RegisterRequest,
  User,
} from '../models/user';
import { StorageService } from './storage.service';

const SEED_ADMIN: User = {
  id: 'seed-admin',
  email: 'admin@example.com',
  displayName: 'Anil Chaudhary',
  role: UserRole.Admin,
  password: 'Anil@123',
};

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  constructor(private readonly storage: StorageService) {}

  ensureSeedData(): void {
    const users = this.storage.getUsers();
    if (!users.some((user) => user.email === SEED_ADMIN.email)) {
      this.storage.saveUsers([SEED_ADMIN, ...users]);
    }
  }

  findByEmail(email: string): User | undefined {
    return this.storage
      .getUsers()
      .find((user) => user.email.toLowerCase() === email.toLowerCase());
  }

  findById(id: string): User | undefined {
    return this.storage.getUsers().find((user) => user.id === id);
  }

  getAllUsers(): User[] {
    return this.storage.getUsers().map((user) => this.withoutPassword(user));
  }

  login(credentials: AuthCredentials): User {
    const user = this.findByEmail(credentials.email);
    if (!user || user.password !== credentials.password) {
      throw new Error('Invalid email or password.');
    }
    return this.withoutPassword(user);
  }

  register(request: RegisterRequest): User {
    if (this.findByEmail(request.email)) {
      throw new Error('An account with this email already exists.');
    }

    const user: User = {
      id: crypto.randomUUID(),
      email: request.email.trim().toLowerCase(),
      displayName: request.displayName.trim(),
      role: UserRole.Viewer,
      password: request.password,
    };

    const users = this.storage.getUsers();
    this.storage.saveUsers([...users, user]);
    return this.withoutPassword(user);
  }

  createUser(request: CreateUserRequest): User {
    if (this.findByEmail(request.email)) {
      throw new Error('A user with this email already exists.');
    }

    const user: User = {
      id: crypto.randomUUID(),
      email: request.email.trim().toLowerCase(),
      displayName: request.displayName.trim(),
      role: request.role,
      password: request.password,
    };

    const users = this.storage.getUsers();
    this.storage.saveUsers([...users, user]);
    return this.withoutPassword(user);
  }

  restoreSession(): User | null {
    const userId = this.storage.getSessionUserId();
    if (!userId) {
      return null;
    }
    const user = this.findById(userId);
    return user ? this.withoutPassword(user) : null;
  }

  persistSession(user: User | null): void {
    this.storage.setSessionUserId(user?.id ?? null);
  }

  private withoutPassword(user: User): User {
    const { password: _password, ...safeUser } = user;
    return safeUser;
  }
}
