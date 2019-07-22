import * as types from "../actions/ActionTypes";

const initialState = {
  settings: null,
  userInfo: null,
  logistics: null,
  currentIndex: 0,
  syncUpActiveValue: 0
};

export default function(state = initialState, action) {
  switch (action.type) {
    case types.SET_SETTINGS:
      if (action.settings)
        return {
          ...state,
          settings: action.settings
        };
      else return state;
    case types.SET_USER:
      if (action.userInfo)
        return {
          ...state,
          userInfo: action.userInfo
        };
      else return state;
    case types.SET_LOGISTICS:
      if (action.logistics)
        return {
          ...state,
          logistics: action.logistics
        };
      else return state;
    case types.SELECT_LOGISTIC:
      if (action.currentIndex >= 0)
        return {
          ...state,
          currentIndex: action.currentIndex
        };
      else return state;
    case types.SYNC_UP_ACTIVE:
      return {
        ...state,
        syncUpActiveValue: action.syncUpActiveValue
      };
    default:
      return state;
  }
}
