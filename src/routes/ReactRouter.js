import React from "react";
import {
  AuthLoadingScreen,
  LoginScreen,
  ListScreen,
  MenuScreen,
  DetailScreen,
} from "../navigations";
import {
  createStackNavigator,
  createSwitchNavigator,
  createDrawerNavigator,  
  createAppContainer
} from "react-navigation";
import { Dimensions } from "react-native";

const AuthRouter = createStackNavigator(
  {
    Login: LoginScreen,
  },
  {
    initialRouteName: "Login"
  }
);

const AppStackRouter = createStackNavigator(
  {
    List: ListScreen,
    Detail: DetailScreen,
  },
  {
    initialRouteName: "List"
  }
);

const DrawerRouter = createDrawerNavigator(
  {
    AppStack: AppStackRouter
  },
  {
    initialRouteName: "AppStack",
    contentComponent: MenuScreen,
    drawerWidth: Dimensions.get('window').width / 4.0,
  }
);

const ZohoRouter = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,    
    Auth: AuthRouter,
    App: DrawerRouter
  },
  {
    initialRouteName: "AuthLoading",
    animationEnabled: false
  }
);

const ReactRouter = createAppContainer(ZohoRouter);

export default ReactRouter;
