import { createActionGroup, emptyProps, props } from '@ngrx/store';
import {
  AuthCredentials,
  CreateUserRequest,
  RegisterRequest,
  User,
} from '../../core/models/user';

export const AuthActions = createActionGroup({
  source: 'Auth',
  events: {
    'Init Session': emptyProps(),
    'Init Session Success': props<{ user: User }>(),
    'Init Session Empty': emptyProps(),

    Login: props<{ credentials: AuthCredentials }>(),
    'Login Success': props<{ user: User }>(),
    'Login Failure': props<{ error: string }>(),

    Register: props<{ request: RegisterRequest }>(),
    'Register Success': props<{ user: User }>(),
    'Register Failure': props<{ error: string }>(),

    Logout: emptyProps(),
    'Logout Success': emptyProps(),

    'Clear Error': emptyProps(),
  },
});

export const UsersActions = createActionGroup({
  source: 'Users',
  events: {
    'Load Users': emptyProps(),
    'Load Users Success': props<{ users: User[] }>(),
    'Load Users Failure': props<{ error: string }>(),

    'Create User': props<{ request: CreateUserRequest }>(),
    'Create User Success': props<{ user: User }>(),
    'Create User Failure': props<{ error: string }>(),

    'Clear Users Error': emptyProps(),
  },
});
