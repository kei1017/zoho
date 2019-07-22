import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput
} from "react-native";
import styles, { colors, fonts } from "../styles/styles";

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
    width: 55
    // flex: 1,
  },
  unitValue: {
    flex: 1,
    color: "black",
    fontSize: 12,
    textAlign: "right",
    fontWeight: "bold"
  }
});

class TwoInputItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: props.quantity ? props.quantity.toString() : "0"
    };
  }

  valueChanged = value => {
    this.setState({ quantity: value });
    if (this.props.valueChanged) this.props.valueChanged(value);
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      quantity: nextProps.quantity.toString()
    });
  }

  render() {
    const { title, value, isText, unit, isOneField } = this.props;

    return (
      <View style={itemStyle.row}>
        <Text style={itemStyle.rowTitle}>{title}</Text>
        <Text style={[itemStyle.rowValue, { backgroundColor: "#eee" }]}>
          {value}
        </Text>
        {isOneField ? null : isText ? (
          <Text style={[itemStyle.rowValue, { backgroundColor: "#eee" }]}>
            {this.state.quantity}
          </Text>
        ) : (
          <TextInput
            style={itemStyle.rowValue}
            onChangeText={this.valueChanged}
            value={this.state.quantity}
            keyboardType="numeric"
          />
        )}
        {unit && <Text style={itemStyle.unitValue}>{unit}</Text>}
      </View>
    );
  }
}

export default TwoInputItem;
