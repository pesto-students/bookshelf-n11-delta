import {USER_ENTRY_ACTIONS} from '../shared/immutables';

export const userEntryReducer = (state, action) => {
  const newState = {...state};
  switch (action.type) {
    case USER_ENTRY_ACTIONS.SET_TITLE:
      newState.title = action.data;
      break;
    case USER_ENTRY_ACTIONS.SET_USER_ENTRY_STATE:
      newState.userEntryState = action.data;
      break;
  }
  return newState;
};
