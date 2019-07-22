import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet, TextInput } from "react-native";
import styles, { colors, fonts } from "../styles/styles";

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
    width: 200
    // flex: 1,
  }
});

class OneInputItem extends Component {
  constructor(props) {
    super(props);    
    this.state = {
      value: (props.value || props.value === "") ? props.value.toString() : "0"
    };
  }

  valueChanged = (value) => {
    this.setState({ value: value })
    if (this.props.valueChanged)
      this.props.valueChanged(value)
  }

  render() {
    const { title, isText } = this.props;
    const { value } = this.state;

    return (
      <View style={itemStyle.row}>
        <Text style={itemStyle.rowTitle}>{title}</Text>        
        {isText ? (
          <Text style={[itemStyle.rowValue, {backgroundColor: '#eee'}]}>{value}</Text>
        ) : (
          <TextInput
            style={itemStyle.rowValue}
            onChangeText={this.valueChanged}
            value={this.state.value}            
          />
        )}
      </View>
    );
  }
}

export default OneInputItem;
