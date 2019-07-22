import React, { Component } from "react";
import {
  Container,
  Header,
  Left,
  Right,
  Button,
  Text,
  Body,
  Form,
  Item as FormItem,
  Input,
  Label,
  Title,
  Content,
  View,
  Icon  
} from "native-base";
import { StyleSheet, Image, TouchableOpacity, PermissionsAndroid, Platform } from "react-native";
import { MainScreen } from "../../components";
import axios from "axios";
import { connect } from "react-redux";
import { setSettings, getSettings, setUserInfo} from "../../redux/actions";
import { SETTINGS_API } from "../../utils/constants";
import AsyncStorage from "@react-native-community/async-storage";
import { colors } from "../../styles/styles";
var RNFS = require("react-native-fs");
import RNFetchBlob from 'rn-fetch-blob'

const loginStyle = StyleSheet.create({
  contentContainer: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingBottom: 80,
    overflow: 'hidden'
  },
  loginButton: {
    marginTop: 20,
    marginBottom: 20,
    backgroundColor: colors.greenColor
  },
  logo: {
    width: "100%",        
    height: 150,
    resizeMode: "contain",    
  },
  errorText: {
    marginTop: 10,
    color: "red",
    textAlign: "center"
  }
});

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      waiting: false,      
      company: "",
      logo: null,
      errorString: "",
      username: "",
      password: ""
    };

    this.loginUser = this.loginUser.bind(this);
    this.getSettings = this.getSettings.bind(this);
    this.updateSettings = this.updateSettings.bind(this);
    this.downloadLogo = this.downloadLogo.bind(this);
  }

  static navigationOptions = {
    title: "Login",
    header: null
  };

  componentWillMount() {    
    this.getSettings();    
  }

  componentDidMount() {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE)
    }
  }

  async getSettings() {
    var settingsString = await AsyncStorage.getItem("settings");
    if (settingsString) {      
      this.props.getSettings();      
    } else {
      this.downloadData();
    }
  }

  async updateSettings(settings) {
    let company = "";
    let logo = "";

    for (let index = 0; index < settings.length; index++) {
      let item = settings[index];
      if (item.Type === "INFO" && item.Option === "Company") {
        company = item.Value;
      } else if (item.Type === "INFO" && item.Option === "Logo") {                                
        logo = item.Value
      }

      if (company !== "" && logo !== "") {
        break;
      }
    }

    if (!this.state.logo) {
      let logoBase64 = await AsyncStorage.getItem("logo");
      if(!logoBase64) {
        this.downloadLogo(logo)
      }
      else {
        this.setState({
          logo: logoBase64
        })
      }
    }

    this.setState({            
      company: company,      
    });
  }

  downloadLogo(logoURL) {
    let self = this
    // send http request in a new thread (using native code)
    RNFetchBlob.fetch('GET', logoURL, {
      // more headers  ..
    })
    // when response status code is 200
    .then(async (res) => {
      // the conversion is done in native code      
      let base64Str = res.base64()
      await AsyncStorage.setItem('logo', base64Str);
      self.setState({
        logo: base64Str
      })
    })
    // Status code is not 200
    .catch((errorMessage, statusCode) => {
      // error handling
      console.log(errorMessage);
    })
  }

  async loginUser(){
    const { username, password } = this.state;
    const { settings } = this.props;

    let isExist = false;
    if (!settings) {
      this.setState({
        errorString: "Please download Mobile Settings first."
      });
      return;
    }

    for (let index = 0; index < settings.length; index++) {
      let item = settings[index];
      if (
        item.Type === "USER" &&
        item.Option.toLowerCase() === username.toLowerCase() &&
        item.Value.toLowerCase() === password.toLowerCase()
      ) {
        await AsyncStorage.setItem('userInfo', JSON.stringify(item));
        this.props.setUserInfo(item)

        isExist = true;
        this.props.navigation.navigate("App");
        break;
      }
    }

    if (!isExist) {
      this.setState({
        errorString: "Username or Password is incorrect."
      });
    }
  };

   downloadData = async () => {
    const self = this;

    this.setState({
      waiting: true
    });

    axios
      .get(SETTINGS_API)
      .then(async response => {
        self.setState({
          waiting: false
        });
        await AsyncStorage.setItem("settings", JSON.stringify(response.data.Mobile_Settings));
        self.props.setSettings(response.data.Mobile_Settings);        
      })
      .catch(error => {
        self.setState({
          waiting: false
        });
      });
  };
  
  componentWillReceiveProps(nextProps) {
    this.updateSettings(nextProps.settings)
  }

  render() {
    const {
      waiting,
      company,      
      logo,
      errorString,
      username,
      password
    } = this.state;

    return (
      <MainScreen waiting={waiting}>
        <Container>
          <Header style={{ backgroundColor: colors.greenColor}}>
            <Left style={{ flex: 1 }} />
            <Body style={{ flex: 1 }}>
              <Title style={styles.headerTitle}>{company}</Title>
            </Body>
            <Right style={{ flex: 1 }}>
              <TouchableOpacity onPress={this.downloadData}>
                <Icon name="download" textColor={"black"} />
              </TouchableOpacity>
            </Right>
          </Header>

          <View style={loginStyle.contentContainer}>
            <Form style={{ width: "50%" }}>
              {logo && (
                <Image
                  source={{                    
                    uri: `data:image/png;base64,${logo}`
                  }}
                  style={loginStyle.logo}
                />
              )}
              <FormItem floatingLabel>
                <Label>Username</Label>
                <Input
                  onChangeText={value => this.setState({ username: value })}
                  value={username}
                />
              </FormItem>
              <FormItem floatingLabel>
                <Label>Password</Label>
                <Input
                  secureTextEntry={true}
                  onChangeText={value => this.setState({ password: value })}
                  value={password}
                />
              </FormItem>
              {errorString !== "" && (
                <Text style={loginStyle.errorText}>{errorString}</Text>
              )}
              <Button
                block
                primary
                style={loginStyle.loginButton}
                onPress={() => this.loginUser()}
              >
                <Text style={{ color: 'black'}}> Login </Text>
              </Button>              
            </Form>
          </View>
        </Container>
      </MainScreen>
    );
  }
}

const mapStateToProps = state => {
  return {
    settings: state.Reducers.settings,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setSettings: settings => {
      dispatch(setSettings(settings));
    },
    getSettings: () => {
      dispatch(getSettings());
    },
    setUserInfo: userInfo => {
      dispatch(setUserInfo(userInfo));
    },
  }
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginScreen);
