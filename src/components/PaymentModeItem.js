import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput
} from "react-native";
import styles, { colors, fonts } from "../styles/styles";
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel
} from "react-native-simple-radio-button";

const paymentModes = [
  { label: "CC 4 Digits" },
  { label: "Check #" },
  { label: "Cash" }
];

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
  rowValue: {
    color: colors.grayColor,
    fontSize: fonts.defualtSize,
    borderColor: "lightgray",
    borderWidth: 1,
    padding: 5,
    marginLeft: 10,
    height: 27,
    width: 80
    // flex: 1,
  }
});

class PaymentModeItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modeIndex: this.getModeIndex(props),
      value: props.value ? props.value.toString() : "0"
    };

    this.getModeIndex = this.getModeIndex.bind(this);
  }

  getModeIndex(props) {        
    for (let index = 0; index < paymentModes.length; index++) {
      if (paymentModes[index].label === props.mode) {        
        return index;        
      }
    }

    return -1;
  }

  valueChanged = value => {
    if (this.props.valueChanged) this.props.valueChanged(value);
    this.setState({ value: value });
  };

  modeChanged = (value, index) => {            
    if (this.props.modeChanged)
      this.props.modeChanged(paymentModes[index].label);
  };

  render() {
    const { title } = this.props;

    return (
      <View style={itemStyle.row}>
        <Text style={itemStyle.rowTitle}>{title}</Text>

        <RadioForm
          radio_props={paymentModes}
          initial={this.state.modeIndex}
          onPress={this.modeChanged}
          buttonColor={"gray"}
          selectedButtonColor={"gray"}
          buttonSize={10}
        />

        <TextInput
          style={itemStyle.rowValue}
          onChangeText={this.valueChanged}
          value={this.state.value}
          keyboardType="numeric"
        />
      </View>
    );
  }
}

export default PaymentModeItem;
