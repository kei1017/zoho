import * as types from "./ActionTypes";
import AsyncStorage from "@react-native-community/async-storage";

export function setSettings(settings) {
  return { type: types.SET_SETTINGS, settings: settings };
}

export function getSettings() {
  return async dispatch => {
    try {
      var settingsString = await AsyncStorage.getItem("settings");
      dispatch(setSettings(JSON.parse(settingsString)));
    } catch (error) {
      return error;
    }
    return null;
  };
}

export function setUserInfo(userInfo) {
  return { type: types.SET_USER, userInfo: userInfo };
}

export function getUserInfo() {
  return async dispatch => {
    try {
      var userInfoString = await AsyncStorage.getItem("userInfo");
      dispatch(setUserInfo(JSON.parse(userInfoString)));
    } catch (error) {
      return error;
    }
    return null;
  };
}

export function setLogistics(logistics) {  
  return { type: types.SET_LOGISTICS, logistics: logistics };
}

export function getLogistics() {
  return async dispatch => {
    try {
      var logisticsString = await AsyncStorage.getItem("logistics");
      dispatch(setLogistics(JSON.parse(logisticsString)));
    } catch (error) {
      return error;
    }
    return null;
  };
}

export function setCurrentIndex(index) {
  return { type: types.SELECT_LOGISTIC, currentIndex: index };
}

export function setSyncUpActiveValue(value) {
  return { type: types.SYNC_UP_ACTIVE, syncUpActiveValue: value };
}

export function setSyncUpActive(value) {  
  return async dispatch => {
    try {
      await AsyncStorage.setItem("sync_up_active", value.toString());
      dispatch(setSyncUpActiveValue(value));
    } catch (error) {      
      return error;
    }
    return null;
  };
}

export function getSyncUpActive() {
  return async dispatch => {
    try {
      var value = await AsyncStorage.getItem("sync_up_active");
      dispatch(setSyncUpActiveValue(parseInt(value)));
    } catch (error) {
      return error;
    }
    return null;
  };
}
