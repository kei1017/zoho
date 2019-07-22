import React, { Component } from "react";
import { View, TouchableOpacity, Text } from "react-native";
import styles, { colors } from "../styles/styles";
import { Icon } from "native-base";

class MenuItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { itemClicked, title } = this.props;

    return (
      <View style={styles.selection_item} >
        <TouchableOpacity style={styles.selection_item_content} onPress={itemClicked}>
          <Text style={styles.selection_item_title}>{title}</Text>          
        </TouchableOpacity>        
      </View>
    );
  }
}

export default MenuItem;
