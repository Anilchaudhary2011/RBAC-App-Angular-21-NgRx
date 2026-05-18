import { Injectable } from '@angular/core';
import { User } from '../models/user';

const USERS_KEY = 'rbac_users';
const SESSION_KEY = 'rbac_session_user_id';

@Injectable({ providedIn: 'root' })
export class StorageService {
  getUsers(): User[] {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      return [];
    }
    try {
      return JSON.parse(raw) as User[];
    } catch {
      return [];
    }
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  getSessionUserId(): string | null {
    return localStorage.getItem(SESSION_KEY);
  }

  setSessionUserId(userId: string | null): void {
    if (userId) {
      localStorage.setItem(SESSION_KEY, userId);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }
}
