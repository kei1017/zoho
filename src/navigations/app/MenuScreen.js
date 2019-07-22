import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
  ScrollView,
  DeviceEventEmitter,
  NativeAppEventEmitter,
  Platform
} from "react-native";
import styles, { colors } from "../../styles/styles";
import { DrawerActions, NavigationActions } from "react-navigation";
import { Icon } from "native-base";
import { MenuItem } from "../../components";
import AsyncStorage from "@react-native-community/async-storage";
import { connect } from "react-redux";
import {
  setSettings,
  getSettings,
  getUserInfo,
  setLogistics,
  getLogistics,
  setSyncUpActive,
  getSyncUpActive
} from "../../redux/actions";
import axios from "axios";
import moment from "moment";
import _ from "lodash";
import { MainScreen } from "../../components";
import { SETTINGS_API } from "../../utils/constants";
import BackgroundTimer from "react-native-background-timer";
var JSONBigInt = require("json-bigint");
import BackgroundJob from 'react-native-background-job'; 

class MenuScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      waiting: false
    };

    this.logOut = this.logOut.bind(this);
    this.syncDown = this.syncDown.bind(this);
    this.syncUp = this.syncUp.bind(this);
    this.refreshSettings = this.refreshSettings.bind(this);

    this.downloadData = this.downloadData.bind(this);
    this.uploadData = this.uploadData.bind(this);
    this.downloadSettings = this.downloadSettings.bind(this);
    this.startBackgroundTimer = this.startBackgroundTimer.bind(this);
  }

  componentWillMount() {
    let self = this;
    this.props.getSettings();
    this.props.getUserInfo();
    this.props.getLogistics();
    this.props.getSyncUpActive();

    this.startBackgroundTimer();
  }

  startBackgroundTimer() {    
    let self = this;
    if (!this.props.settings || !this.props.settings.length) return;

    let upMin = 0;
    let downHour = 0;
    let downMin = 0;
    for (let index = 0; index < this.props.settings.length; index++) {
      let item = this.props.settings[index];
      if (item.Type === "REFRESH" && item.Option === "Up") {
        upMin = item.Value;     
      }
      if (item.Type === "REFRESH" && item.Option === "Down") {
        downHour = parseInt(item.Value.split(":")[0]);        
        downMin = parseInt(item.Value.split(":")[1]);        
      }
    }

    this._startedTimer = true;

    if (Platform.OS === 'android') {
      const downloadJob = {
        jobKey: "downloadJob",
        job: () => {
          let date = new Date();
          let hours = date.getHours();
          let minutes = date.getMinutes();
          if (hours === downHour && minutes === downMin) {         
            self.downloadData();
          }
        }
      };
      
      BackgroundJob.register(downloadJob);
      
      var downloadSchedule = {
        jobKey: "downloadJob",
        allowWhileIdle : true,
        allowExecutionInForeground : true,
        exact: true,
        period: 60000
      }
      
      BackgroundJob.schedule(downloadSchedule);


      const uploadJob = {
        jobKey: "uploadJob",
        job: () => {
          // if (self.props.syncUpActiveValue === 1) {          
            self.uploadData();
          // }
        }
      };
      
      BackgroundJob.register(uploadJob);
      
      var uploadSchedule = {
        jobKey: "uploadJob",
        allowWhileIdle : true,
        allowExecutionInForeground : true,
        exact: true,
        period: parseInt(upMin) * 60000      
      }
      
      BackgroundJob.schedule(uploadSchedule);
    }
    else {
      BackgroundTimer.stop()
      BackgroundTimer.start()

      this._downloadBackgroundTimer = BackgroundTimer.setInterval(() => {
        let date = new Date();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        if (hours === downHour && minutes === downMin) {
          this.downloadData();
        }
      }, 60000);
  
      this._uploadBackgroundTimer = BackgroundTimer.setInterval(() => {
        // if (self.props.syncUpActiveValue === 1) {
          self.uploadData();
        // }                  
      }, parseInt(upMin) * 60000);      
    }

  }

  componentWillUnmount() {    
    if (Platform.OS === 'android') {
      BackgroundJob.cancel({jobKey: 'downloadJob'});
      BackgroundJob.cancel({jobKey: 'uploadJob'});
    }
    else {
      if (this._downloadBackgroundTimer)
      BackgroundTimer.clearTimeout(this._downloadBackgroundTimer);
      if (this._uploadBackgroundTimer)
        BackgroundTimer.clearTimeout(this._uploadBackgroundTimer);
      
      BackgroundTimer.stop()
    } 
      
    this._startedTimer = false;
  }

  navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.dispatch(navigateAction);
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
  };

  async logOut() {
    await AsyncStorage.removeItem("userInfo");
    this.props.navigation.navigate("Auth");
  }

  syncDown() {
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
    this.downloadData();    
  }

  downloadData() {    
    const self = this;

    let url = "";
    let timeZone = 0;
    let formname = "";
    for (let index = 0; index < this.props.settings.length; index++) {
      let item = this.props.settings[index];
      if (item.Type === "SYNC" && item.Option === "Down") {
        url = item.Value;
      }
      else if (item.Type === "INFO" && item.Option === "Timezone") {
        timeZone = parseInt(item.Value);
      }
      else if (item.Type === "INFO" && item.Option === "Formname") {
        formname = item.Value;
      }
    }
    
    this.setState({
      waiting: true
    });

    let dateString = moment(new Date()).utcOffset(60 * timeZone).format("DD-MMM-YYYY")    
    url = url.replace("[DATE]", dateString);
    url = url.replace("[USER]", this.props.userInfo.Option);    
    axios
      .get(url, { transformResponse: [data => data] })      
      .then(async response => {        
        self.setState({
          waiting: false
        });
        // let logistics = JSONBigInt.parse(response.data).Offline;
        let logistics = JSONBigInt.parse(response.data)[formname];
        await AsyncStorage.setItem("logistics", JSON.stringify(logistics));
        self.props.setLogistics(logistics);        
      })
      .catch(error => {
        console.log("error=", error);
        self.setState({
          waiting: false
        });
      });
  }

  syncUp() {
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
    this.uploadData();
  }

  async uploadImage(url, logistic) {    
    let self = this;
    let formname = "";
    for (let index = 0; index < this.props.settings.length; index++) {
      let item = this.props.settings[index];
      if (item.Type === "INFO" && item.Option === "Formname") {
        formname = item.Value;
        break;
      }
    }

    const data = new FormData();
    data.append("applinkname", "pickup-intake");
    // data.append("formname", "Offline");
    data.append("formname", formname);
    data.append("recordId", logistic.R_ID);
    data.append("fieldname", "Signature_File");
    data.append("filename", logistic.R_ID + "_sign.png");
    data.append("file", {
      uri:  Platform.OS === 'android' ? `file://${logistic.Signature}`: logistic.Signature,
      type: "image/png",
      name: "sign"
    });

    axios
      .post(url, data, {
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data; charset=utf-8;"
        }
      })
      .then(res => {
        console.log(res.data);
        self.setState({
          waiting: false
        });
      })
      .catch(err => {
        console.log(err.message);
        self.setState({
          waiting: false
        });
      });
  }

  uploadData() {          
    let self = this;
    let syncUpURL = "";
    let syncFileURL = "";
    for (let index = 0; index < this.props.settings.length; index++) {
      let item = this.props.settings[index];
      if (item.Type === "SYNC" && item.Option === "Up") {
        syncUpURL = item.Value;
      } else if (item.Type === "SYNC" && item.Option === "File") {
        syncFileURL = item.Value;
      }

      if (syncUpURL !== "" && syncFileURL !== "") {
        break;
      }
    }

    if (!this.state.waiting) {
      this.setState({
        waiting: true
      });
    }

    this._apiCallCount = 0;

    for (let index = 0; index < this.props.logistics.length; index++) {
      let logistic = this.props.logistics[index];
      let url = syncUpURL.replace("[R_ID]", logistic.R_ID);

      url = url + "QA_1=" + logistic.QA_1;
      url = url + "&QA_2=" + logistic.QA_2;
      url = url + "&QA_3=" + logistic.QA_3;
      url = url + "&QA_4=" + logistic.QA_4;
      url = url + "&QA_5=" + logistic.QA_5;

      url = url + "&QB_1=" + logistic.QB_1;
      url = url + "&QB_2=" + logistic.QB_2;
      url = url + "&QB_3=" + logistic.QB_3;
      url = url + "&QB_4=" + logistic.QB_4;
      url = url + "&QB_5=" + logistic.QB_5;

      url = url + "&QC_1=" + logistic.QC_1;
      url = url + "&QC_2=" + logistic.QC_2;
      url = url + "&QC_3=" + logistic.QC_3;
      url = url + "&QC_4=" + logistic.QC_4;
      url = url + "&QC_5=" + logistic.QC_5;
      url = url + "&QC_6=" + logistic.QC_6;

      url = url + "&NQ_1=" + logistic.NQ_1;
      url = url + "&NQ_2=" + logistic.NQ_2;
      url = url + "&NQ_3=" + logistic.NQ_3;
      url = url + "&NQ_4=" + logistic.NQ_4;
      url =
        url +
        "&Please_Describe_Items_Here=" +
        encodeURIComponent(logistic.Please_Describe_Items_Here);

      url = url + "&CD_1=" + logistic.CD_1;
      url = url + "&CD_2=" + logistic.CD_2;
      url = url + "&CD_3=" + logistic.CD_3;
      url = url + "&CD_4=" + logistic.CD_4;
      url = url + "&CD_5=" + logistic.CD_5;

      url = url + "&IT_1=" + logistic.IT_1;
      url =
        url +
        "&Detail_Description_for_Quote=" + 
        encodeURIComponent(logistic.Detail_Description_for_Quote);

      url = url + "&AF_1=" + logistic.AF_1;
      url = url + "&AF_2=" + logistic.AF_2;
      url = url + "&AF_3=" + logistic.AF_3;
      url = url + "&AF_4=" + logistic.AF_4;
      url = url + "&AF_5=" + logistic.AF_5;
      url = url + "&AF_6=" + logistic.AF_6;
      url = url + "&AF_7=" + logistic.AF_7;
      url = url + "&AF_8=" + logistic.AF_8;
      url =
        url +
        "&Please_Describe_fee_Items_here=" + 
        encodeURIComponent(logistic.Please_Describe_fee_Items_here);

      url = url + "&Last_Name=" + encodeURIComponent(logistic.Last_Name);
      url = url + "&Mode_of_Payment=" + encodeURIComponent(logistic.Mode_of_Payment);
      url = url + "&Payment_Details=" + logistic.Payment_Details;
      url = url + "&Payment_State=" + encodeURIComponent(logistic.Payment_State);

      if(logistic.Payment_State !== null && logistic.Payment_State !== ""){
        url = url + "&Intake_State=Completed";
      }

      this._apiCallCount++;    
      axios
        .post(url)
        .then(response => {
          console.log("success=", response);          
          self._apiCallCount--;
          if (self._apiCallCount <= 0) {
            console.log("upload success");  
            self.props.setSyncUpActive(0);          
            self.setState({
              waiting: false
            });            
          }
        })
        .catch(error => {
          console.log("upload failure=", error);
          self._apiCallCount--;          
          if (self._apiCallCount <= 0) {
            self.props.setSyncUpActive(0);
            self.setState({
              waiting: false
            });
          }
        });

      if(logistic.Signature && logistic.Signature !== "") {
        this.uploadImage(syncFileURL, logistic);
      }
    }
  }

  refreshSettings() {
    this.props.navigation.dispatch(DrawerActions.closeDrawer());
    this.downloadSettings();
  }

  downloadSettings() {
    const self = this;
    this.setState({
      waiting: true
    });
    axios
      .get(SETTINGS_API)
      .then(async response => {        
        await AsyncStorage.setItem(
          "settings",
          JSON.stringify(response.data.Mobile_Settings)
        );
        self.props.setSettings(response.data.Mobile_Settings);

        self.setState({
          waiting: false
        });
      })
      .catch(error => {
        console.log("error=", error);
        self.setState({
          waiting: false
        });
      });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.syncUpActiveValue === 1) {
      this.uploadData();
    }
    if (nextProps.settings && !this._startedTimer) {
      this.startBackgroundTimer();
    }
  }

  render() {
    return (
      <MainScreen waiting={this.state.waiting}>
        <TouchableOpacity
          onPress={() =>
            this.props.navigation.dispatch(DrawerActions.closeDrawer())
          }
          style={styles.menu_close}
        >
          <Icon name="close" size={24} color="gray" />
        </TouchableOpacity>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ paddingTop: 20 }}
        >
          <MenuItem title="Sync Down" itemClicked={() => this.syncDown()} />
          <MenuItem title="Sync Up" itemClicked={() => this.syncUp()} />
          <MenuItem
            title="Refresh Settings"
            itemClicked={() => this.refreshSettings()}
          />
          <MenuItem title="Log Out" itemClicked={() => this.logOut()} />
        </ScrollView>
      </MainScreen>
    );
  }
}

const mapStateToProps = state => {
  return {
    settings: state.Reducers.settings,
    userInfo: state.Reducers.userInfo,
    logistics: state.Reducers.logistics,
    syncUpActiveValue: state.Reducers.syncUpActiveValue
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
    getUserInfo: () => {
      dispatch(getUserInfo());
    },
    setLogistics: logistics => {
      dispatch(setLogistics(logistics));
    },
    getLogistics: () => {
      dispatch(getLogistics());
    },
    setSyncUpActive: value => {
      dispatch(setSyncUpActive(value));
    },
    getSyncUpActive: () => {
      dispatch(getSyncUpActive());
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MenuScreen);
