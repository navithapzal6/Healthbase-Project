export interface UserLogRecord {
  id: string;
  date: string;
  userId: string;
  user: string;
  logIn: string;
  logOut: string;
}

export interface UserLogFilters {
  search: string;
  userId: string;
}
