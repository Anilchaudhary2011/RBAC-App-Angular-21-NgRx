import { usersFeature } from './users.reducer';

export const {
  selectUsersState,
  selectUsers,
  selectLoading: selectUsersLoading,
  selectError: selectUsersError,
} = usersFeature;
