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

const paymentStates = [
  { label: "Free" },
  { label: "Invoice Pending" },
  { label: "Invoiced" },
  { label: "Paid" }
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
    marginRight: 10,
    height: 27,
    width: 200
    // flex: 1,
  }
});

class PaymentStateItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stateIndex: this.getPaymentState(props)
    };

    this.getPaymentState = this.getPaymentState.bind(this);
  }

  getPaymentState(props) {
    for (let index = 0; index < paymentStates.length; index++) {
      if (paymentStates[index].label === props.state) {        
        return index;        
      }
    }
    return -1;
  }

  stateChanged = (value, index) => {
    if (this.props.stateChanged)
      this.props.stateChanged(paymentStates[index].label);
  };

  render() {
    const { title } = this.props;

    return (
      <View style={itemStyle.row}>
        <Text style={itemStyle.rowTitle}>{title}</Text>

        <RadioForm
          radio_props={paymentStates}
          initial={this.state.stateIndex}
          onPress={this.stateChanged}
          buttonColor={"gray"}
          selectedButtonColor={"gray"}
          buttonSize={10}
        />
      </View>
    );
  }
}

export default PaymentStateItem;
