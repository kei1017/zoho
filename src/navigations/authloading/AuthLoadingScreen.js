import React from 'react';
import { MainScreen } from '../../components';
import {
  ActivityIndicator,
  View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const userInfo = await AsyncStorage.getItem('userInfo');        
    this.props.navigation.navigate(userInfo ? 'App' : 'Auth');
  };

  render() {
    return (
        <MainScreen>
            <View style={{ flex: 1, justifyContent:'center', alignItems:'center'}}>
            <ActivityIndicator size = "large"/>
            </View>
        </MainScreen>
    );
  }
}

export default AuthLoadingScreen;