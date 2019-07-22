import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView
} from "react-native";
import {
  Container,
  Header,
  Left,
  Right,
  Button,
  Body,
  Form,
  Item as FormItem,
  Input,
  Label,
  Title,
  Content,
  Icon
} from "native-base";
import styles, { colors, fonts } from "../../styles/styles";
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
  Cols,
  Cell
} from "react-native-table-component";
import { MainScreen } from "../../components";
import HTML from "react-native-render-html";
import { connect } from "react-redux";
import { getLogistics, setCurrentIndex } from "../../redux/actions";
import _ from "lodash";
import BackgroundTimer from "react-native-background-timer";

const widthList = [70, 200, 300, 100, 100, 80, 80, 80];
const tableTitle = [
  "Flags",
  "Company",
  "Pickup Address",
  "Name",
  "Phone",
  "Owner",
  "P State",
  "Intake State"
];
const listStyle = StyleSheet.create({
  tableText: {
    color: "black",
    padding: 5,
    fontSize: fonts.defualtSize
  },
  notification: {
    color: colors.greenColor,
    textAlign: 'center',    
    padding: 10,    
  }
});

class ListScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      waiting: false,
      tableData: {},
      keyList: [],
      notification: "",
    };

    this.updateLogistics = this.updateLogistics.bind(this);
    this.onPressLogistic = this.onPressLogistic.bind(this);
    this.getNotification = this.getNotification.bind(this);
  }

  static navigationOptions = {
    title: "List",
    header: null
  };

  componentWillMount() {
    this.isCancelled = false;
  }

  componentDidMount() {    
    this.props.getLogistics();
  }

  updateLogistics(logistics) {
    const groupByLogistics = _.groupBy(logistics, "Parent_Account");
    let sortedKeyList = Object.keys(groupByLogistics).sort(); 
        
    this.setState({        
      tableData: groupByLogistics,
      keyList: sortedKeyList
    });
  }

  componentWillUnmount() {
    this.isCancelled = true;
  }

  componentWillReceiveProps(nextProps) {    
    this.updateLogistics(nextProps.logistics)
    if (nextProps.settings && this.state.notification === "") {
      this.getNotification(nextProps.settings);
    }
  }

  getNotification(settings) {
    for (let index = 0; index < settings.length; index++) {
      let item = settings[index];
      if (item.Type === "INFO" && item.Option === "Notification") {        
        this.setState({
          notification: item.Value
        })
        break;
      }
    }
  }

  onPressLogistic(logistic) {    
    currentIndex = this.props.logistics.indexOf(logistic);
    this.props.setCurrentIndex(currentIndex)
    this.props.navigation.navigate("Detail")
  }

  render() {
    const { waiting, tableData, keyList } = this.state;

    return (
      <MainScreen waiting={waiting}>
        <Container>
          <Header style={{ backgroundColor: colors.greenColor }}>
            <Left style={{ flex: 1 }}>
              <TouchableOpacity
                onPress={() => this.props.navigation.toggleDrawer()}
              >
                <Icon name="menu" textColor="black" />
              </TouchableOpacity>
            </Left>
            <Body style={{ flex: 1 }}>
              <Title style={styles.headerTitle}>Logistics</Title>
            </Body>
            <Right style={{ flex: 1 }} />
          </Header>
          <Content padder>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}              
            >
              <Table borderStyle={{ borderColor: "#ddd" }}>
                <Row
                  data={tableTitle}
                  widthArr={widthList}
                  textStyle={listStyle.tableText}
                />
                {keyList &&
                  keyList.map((value, index) => [
                    <Row
                      key={index}
                      data={[value]}
                      style={{ backgroundColor: "#eee" }}
                      textStyle={listStyle.tableText}
                    />,
                    tableData[value].map((rowData, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => this.onPressLogistic(rowData)}
                      >
                        <TableWrapper
                          style={{ flexDirection: "row" }}
                          borderStyle={{ borderColor: "#ddd" }}
                        >
                          <Cell                          
                           data={rowData["Flags"].replace("[", "").replace("]","")}
                            // data={
                            //   rowData["Flags_Count"] ? (
                            //     <HTML
                            //       html={`<div>${rowData["Flags_Count"]}</div>`}
                            //       tagsStyles={{
                            //         div: { color: "black", padding: 5 }
                            //       }}
                            //     />
                            //   ) : (
                            //     ""
                            //   )
                            // }
                            width={widthList[0]}
                            textStyle={listStyle.tableText}
                          />
                          <Cell
                            data={rowData["Organization_Name"]}
                            width={widthList[1]}
                            textStyle={listStyle.tableText}
                          />
                          <Cell
                            data={rowData["Pickup_Address"]}
                            width={widthList[2]}
                            textStyle={listStyle.tableText}
                          />
                          <Cell
                            data={rowData["Name"]}
                            width={widthList[3]}
                            textStyle={listStyle.tableText}
                          />
                          <Cell
                            data={rowData["Phone_Number"]}
                            width={widthList[4]}
                            textStyle={listStyle.tableText}
                          />
                          <Cell
                            data={rowData["Owner"]}
                            width={widthList[5]}
                            textStyle={listStyle.tableText}
                          />
                          <Cell
                            data={rowData["Payment_State"]}
                            width={widthList[6]}
                            textStyle={listStyle.tableText}
                          />
                          <Cell
                            data={rowData["Intake_State"]}
                            width={widthList[7]}
                            textStyle={listStyle.tableText}
                          />
                        </TableWrapper>
                      </TouchableOpacity>
                    ))
                  ])}
              </Table>
            </ScrollView>            
          </Content>
          <Text style={listStyle.notification}>{this.state.notification}</Text>
        </Container>
      </MainScreen>
    );
  }
}

const mapStateToProps = state => {
  return {
    logistics: state.Reducers.logistics,
    settings: state.Reducers.settings,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getLogistics: () => {
      dispatch(getLogistics());
    },
    setCurrentIndex: currentIndex => {
      dispatch(setCurrentIndex(currentIndex));
    },
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ListScreen);
