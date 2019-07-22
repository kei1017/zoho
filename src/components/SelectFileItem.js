import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet, TextInput } from "react-native";
import styles, { colors, fonts } from "../styles/styles";
import ImagePicker from "react-native-image-picker";

const itemStyle = StyleSheet.create({
  row: {
    flexDirection: "row",
    marginTop: 5,
    marginBottom: 5,    
  },
  rowTitle: {
    color: colors.grayColor,
    fontSize: 12,    
    width:'50%',
    fontWeight:'bold'
    // flex: 1
  },
  rowValue: {
    color: colors.grayColor,
    fontSize: fonts.defualtSize,
    borderColor: "lightgray",
    borderWidth: 1,
    padding: 5,
    marginRight: 10,    
    height: 27,
    width: 200,
    overflow: 'hidden'
    // flex: 1,
  }
});

class SelectFileItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: props.value !=="" ? "Signature File Selected" : ""
    };
  }

  valueChanged = (value) => {
    this.setState({ value: value })
    if (this.props.valueChanged)
      this.props.valueChanged(value)
  }

  pickImageHandler = () => {
    ImagePicker.launchImageLibrary(
      { title: "Pick an Image" },
      async res => {
        if (res.didCancel) {
          console.log("User cancelled!");
        } else if (res.error) {
          console.log("Error", res.error);
        } else {          
          if (this.props.fileSelected) this.props.fileSelected(res.uri);
          this.setState({
            value: "Signature File Selected"
          })
        }
      }
    );
  };

  render() {
    const { title, isText } = this.props;
    const { value } = this.state;

    return (
      <View style={itemStyle.row}>
        <Text style={itemStyle.rowTitle}>{title}</Text>        
        {isText ? (
          <Text style={[itemStyle.rowValue, {backgroundColor: '#eee'}]}>{value}</Text>
        ) : (
          <TouchableOpacity
            style={itemStyle.rowValue}        
            onPress={this.pickImageHandler.bind(this)}             
          >
            <Text>{value}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default SelectFileItem;
