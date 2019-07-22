import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
  Image,
  Platform
} from "react-native";
import styles, { colors, fonts } from "../styles/styles";
import SignatureCapture from "react-native-signature-capture";
var RNFS = require('react-native-fs');
import RNFetchBlob from 'rn-fetch-blob'

const itemStyle = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5
  },
  rowTitle: {
    color: colors.grayColor,
    fontSize: 12,
    width: "50%",
    fontWeight: "bold"
    // flex: 1
  },
  signatureContainer: {
    width: 300,
    height: 150,
    borderWidth: 1,
    borderColor: "lightgray",
    flexDirection: "column"
  },
  signatureHeader: {
    flexDirection: "row",
    height: 30,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "lightgray"
  },
  clearButton: {
    color: "#4e6ae6"
  },
  signature: {
    flex: 1,
    resizeMode: 'contain'
  }
});

class SignatureItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,      
      isImage: (props.signature &&  props.signature !== "") ? true: false,
      currentTime: new Date().getTime()
    };

    this.saveSign = this.saveSign.bind(this);
    this.resetSign = this.resetSign.bind(this);
    this._onDragEvent = this._onDragEvent.bind(this);
    this._onSaveEvent = this._onSaveEvent.bind(this);
  }

  saveSign() {
    this.refs.sign.saveImage();
  }

  resetSign() {    
    if (this.state.isImage) {
      this.setState({
        isImage: false
      })
    }
    else {
      this.refs.sign.resetImage();
    }
  }

  _onSaveEvent(result) {
    //result.encoded - for the base64 encoded png
    //result.pathName - for the file path name

    const base64String = `data:image/png;base64,${result.encoded}`;
    this.setState({ data: result.encoded });

    const dirs = RNFetchBlob.fs.dirs
    // const file_path = dirs.PictureDir + `/${this.props.R_ID}_sign_${this.state.currentTime}.png`
    const file_path = dirs.DocumentDir + `/${this.props.R_ID}_sign_${this.state.currentTime}.png`

    // write the file
    RNFS.writeFile(file_path, result.encoded, 'base64')
      .then((success) => {
        console.log('FILE WRITTEN! = ', success);
        // RNFetchBlob.fs.scanFile([ { path : file_path, mime : 'image/png' } ])
        if (this.props.signatureChanged) this.props.signatureChanged(file_path);
      })
      .catch((err) => {
        console.log('FILE WRITTEN FAILURE = ', err.message);
      });

  }
  _onDragEvent() {
    // This callback will be called when the user enters signature            
    this.saveSign();    
  }

  render() {
    const { title } = this.props;

    return (
      <View style={itemStyle.row}>
        <Text style={itemStyle.rowTitle}>{title}</Text>
        <View style={itemStyle.signatureContainer}>
          <View style={itemStyle.signatureHeader}>
            <Text style={itemStyle.headerTitle}>Draw your signature</Text>
            <TouchableOpacity
              onPress={() => {
                this.resetSign();
              }}
            >
              <Text style={itemStyle.clearButton}>[Clear]</Text>
            </TouchableOpacity>
          </View>
          {this.state.isImage ? (
            <Image
              style={itemStyle.signature}
              source={{
                // uri: `data:image/png;base64,${this.props.signature}`
                // uri: this.props.signature
                uri: Platform.OS === 'android' ? `file://${this.props.signature}` : `${this.props.signature}`
              }}
            />
          ) : (
            <SignatureCapture
              style={itemStyle.signature}
              ref="sign"
              onSaveEvent={this._onSaveEvent}
              onDragEvent={this._onDragEvent}
              saveImageFileInExtStorage={false} //False on Device becuae of Permission.
              showNativeButtons={false}
            />
          )}
        </View>
      </View>
    );
  }
}

export default SignatureItem;
