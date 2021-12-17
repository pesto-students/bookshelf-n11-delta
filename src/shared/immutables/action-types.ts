export enum APP_ACTIONS {
  UPDATE_SEARCH_TEXT = "UPDATE_SEARCH_TEXT",
  USER_ENTRY_MENU_CLICKED = "USER_ENTRY_MENU_CLICKED",
  USER_ENTRY_COMPLETED = "USER_ENTRY_COMPLETED",
  LOGOUT = "LOGOUT",
  LOGIN = "LOGIN",
  REGISTER_USER_INFO = "REGISTER_USER_INFO",
  SET_BOOKS = "SET_BOOKS",
}

export enum DASHBOARD_ACTIONS {
  GET_ALL_BOOKS = "GET_ALL_BOOKS",
  SET_ALL_BOOKS = "SET_ALL_BOOKS",
  SEARCH_BOOKS = "SEARCH_BOOKS",
  APPLY_FILTER = "APPLY_FILTER",
  CLEAR_FILTER = "CLEAR_FILTER",
  SORT_ACTION = "SORT_ACTION",
}

export enum USER_ENTRY_ACTIONS {
  SET_TITLE = "SET_TITLE",
  SET_USER_ENTRY_STATE = "SET_USER_ENTRY_STATE",
}
