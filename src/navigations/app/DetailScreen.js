import React, { Component } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
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
import { connect } from "react-redux";
import {
  getLogistics,
  setLogistics,
  setSyncUpActive
} from "../../redux/actions";
import AsyncStorage from "@react-native-community/async-storage";
import {
  OneInputItem,
  TwoInputItem,
  OneTextAreaItem,
  PaymentModeItem,
  PaymentStateItem,
  SignatureItem,
  SelectFileItem
} from "../../components";

const detailStyle = StyleSheet.create({
  section: {
    color: "black",
    fontSize: fonts.defualtSize,
    fontWeight: "bold",
    backgroundColor: colors.greenColor,
    padding: 5,
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10
  },
  btnUpdate: {
    backgroundColor: colors.greenColor,
    width: "30%",
    alignSelf: "center",
    marginTop: 20,
    marginBottom: 10
  },
  updateText: {
    color: "black",
    textAlign: "center",
    fontSize: fonts.defualtSize,
    padding: 10,
    fontWeight: "bold"
  }
});

class DetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logistic: null,
      paymentState: null
    };

    this.updateAction = this.updateAction.bind(this);
    this.calcQATotal = this.calcQATotal.bind(this);
    this.calcQBTotal = this.calcQBTotal.bind(this);
    this.calcQCTotal = this.calcQCTotal.bind(this);
    this.calcNQTotal = this.calcNQTotal.bind(this);
    this.calcITTotal = this.calcITTotal.bind(this);
    this.calcCDTotal = this.calcCDTotal.bind(this);
    this.calcAFTotal = this.calcAFTotal.bind(this);
    this.calcGrandTotal = this.calcGrandTotal.bind(this);
    this.calcQPickupFee = this.calcQPickupFee.bind(this);
  }

  static navigationOptions = {
    title: "Detail",
    header: null
  };

  componentWillMount() {
    this.props.getLogistics();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      logistic: nextProps.logistics[nextProps.currentIndex]
    });
  }

  async updateAction() {
    let newLogistics = [...this.props.logistics];
    let newLogistic = this.state.logistic;
    newLogistics[this.props.currentIndex] = newLogistic;
    await AsyncStorage.setItem("logistics", JSON.stringify(newLogistics));
    this.props.setLogistics(newLogistics);
    this.props.setSyncUpActive(1);
    this.props.navigation.goBack();
  }

  calcQATotal() {
    const { logistic } = this.state;

    logistic.QA_Total =
      parseInt(logistic.QA_1) +
      parseInt(logistic.QA_2) +
      parseInt(logistic.QA_3) +
      parseInt(logistic.QA_4) +
      parseInt(logistic.QA_5);

    this.setState({
      logistic: logistic
    });

    this.calcQPickupFee()
  }

  calcQBTotal() {
    const { logistic } = this.state;

    logistic.QB_Total =
      parseInt(logistic.QB_1) +
      parseInt(logistic.QB_2) +
      parseInt(logistic.QB_3) +
      parseInt(logistic.QB_4) +
      parseInt(logistic.QB_5);

    this.setState({
      logistic: logistic
    });

    this.calcQPickupFee()
  }

  calcQCTotal() {
    const { logistic } = this.state;

    logistic.QC_Total =
      parseInt(logistic.QC_1) +
      parseInt(logistic.QC_2) +
      parseInt(logistic.QC_3) +
      parseInt(logistic.QC_4) +
      parseInt(logistic.QC_5) +
      parseInt(logistic.QC_6);

    this.setState({
      logistic: logistic
    });

    this.calcQPickupFee()
  }

  calcNQTotal() {
    const { logistic } = this.state;

    logistic.NQ_Total =
      parseInt(logistic.NQ_1) +
      parseInt(logistic.NQ_2) +
      parseInt(logistic.NQ_3) +
      parseInt(logistic.NQ_4);

    this.setState({
      logistic: logistic
    });
  }

  calcITTotal() {
    const { logistic } = this.state;

    logistic.IT_Total = parseInt(logistic.IT_1);

    this.setState({
      logistic: logistic
    });
  }

  calcCDTotal() {
    const { logistic } = this.state;

    logistic.CD_Total =
      parseInt(logistic.CD_1) * 20 +
      parseInt(logistic.CD_2) * 15 +
      parseInt(logistic.CD_3) * 8 +
      parseInt(logistic.CD_4) * 5 +
      parseInt(logistic.CD_5) * 3;

    this.setState({
      logistic: logistic
    });

    this.calcGrandTotal();
  }

  calcAFTotal() {
    const { logistic } = this.state;

    logistic.AF_Total =
      parseInt(logistic.AF_1) * 20 +
      parseInt(logistic.AF_2) * 2 +
      parseInt(logistic.AF_3) * 50 +
      parseInt(logistic.AF_4) * 1 +
      parseInt(logistic.AF_5) * 0.5 +
      parseInt(logistic.AF_6) * 100 +
      parseInt(logistic.AF_7) * 100 +
      parseInt(logistic.AF_8) * 200;

    this.setState({
      logistic: logistic
    });

    this.calcGrandTotal();
  }

  calcGrandTotal() {
    const { logistic } = this.state;

    let Q_Pickup_Fee = 0;
    if (logistic.Q_Pickup_Fee !== "FREE") {
      Q_Pickup_Fee = logistic.Q_Pickup_Fee;
    }

    logistic.Q_Grand_Total =
      parseInt(logistic.CD_Total) +
      parseFloat(logistic.AF_Total) +
      parseInt(Q_Pickup_Fee);

    this.setState({
      logistic: logistic
    });
  }

  calcQPickupFee() {
    const { logistic } = this.state;    
    if (
      logistic.Pickup_Type == "Tenant Pays" ||
      logistic.Pickup_Type == "Tenant-Pays" ||
      logistic.Pickup_Type == "Property Pays" ||
      logistic.Pickup_Type == "Property-Pays" ||
      logistic.Contracted_Building == "Contracted" ||
      ((parseInt(logistic.QA_1) +
      parseInt(logistic.QA_2) +
      parseInt(logistic.QA_3) +
      parseInt(logistic.QA_4) +
      parseInt(logistic.QA_5)) >=
        1) ||
      ((parseInt(logistic.QB_1) +
      parseInt(logistic.QB_2) +
      parseInt(logistic.QB_3) +
      parseInt(logistic.QB_4) +
      parseInt(logistic.QB_5)) >=
        5) ||
      ((parseInt(logistic.QB_1) +
      parseInt(logistic.QB_2) +
      parseInt(logistic.QB_3) +
      parseInt(logistic.QB_4) +
      parseInt(logistic.QB_5) +
      parseInt(logistic.QC_1) +
      parseInt(logistic.QC_2) +
      parseInt(logistic.QC_3) +
      parseInt(logistic.QC_4) +
      parseInt(logistic.QC_5) +
      parseInt(logistic.QC_6)) >=
        10)
    ) {
      logistic.Q_Pickup_Fee = "FREE";
    } else if (
      ((parseInt(logistic.QB_1) +
      parseInt(logistic.QB_2) +
      parseInt(logistic.QB_3) +
      parseInt(logistic.QB_4) +
      parseInt(logistic.QB_5) +
      parseInt(logistic.QC_1) +
      parseInt(logistic.QC_2) +
      parseInt(logistic.QC_3) +
      parseInt(logistic.QC_4) +
      parseInt(logistic.QC_5) +
      parseInt(logistic.QC_6)) >
        4) &&
      ((parseInt(logistic.QB_1) +
      parseInt(logistic.QB_2) +
      parseInt(logistic.QB_3) +
      parseInt(logistic.QB_4) +
      parseInt(logistic.QB_5) +
      parseInt(logistic.QC_1) +
      parseInt(logistic.QC_2) +
      parseInt(logistic.QC_3) +
      parseInt(logistic.QC_4) +
      parseInt(logistic.QC_5) +
      parseInt(logistic.QC_6)) <
        10)
    ) {
      logistic.Q_Pickup_Fee = 100;
    } else {
      logistic.Q_Pickup_Fee = 200;
    }

    this.setState({
      logistic: logistic
    });

    this.calcGrandTotal();
  }

  render() {
    const { logistic } = this.state;

    return (
      <Container>
        <Header style={{ backgroundColor: colors.greenColor }}>
          <Left style={{ flex: 1 }}>
            <TouchableOpacity
              style={{ padding: 5 }}
              onPress={() => this.props.navigation.goBack()}
            >
              <Icon name="ios-arrow-back" textColor="black" />
            </TouchableOpacity>
          </Left>
          <Body style={{ flex: 1 }}>
            <Title style={styles.headerTitle}>Logistic</Title>
          </Body>
          <Right style={{ flex: 1 }} />
        </Header>
        <Content padder>
          {logistic && (
            <View style={{ paddingLeft: 10, paddingRight: 10 }}>
              <OneInputItem
                isText={true}
                title={"Owner"}
                value={logistic.Owner}
              />
              <OneInputItem
                isText={true}
                title={"Assigned Pickup Date"}
                value={logistic.Assigned_Pickup_Date}
              />
              <OneInputItem
                isText={true}
                title={"Pickup Time Slot"}
                value={logistic.Pickup_Time_Slot}
              />
              <OneInputItem
                isText={true}
                title={"Logistics Team"}
                value={logistic.Logistics_Team}
              />
              <OneTextAreaItem
                isText={true}
                title={"Account Instruction"}
                value={logistic.Account_Instruction}
              />
              <OneInputItem
                isText={true}
                title={"Estimated Number of Gaylords"}
                value={logistic.Estimated_Number_of_Gaylords}
              />
              <OneInputItem
                isText={true}
                title={"Assets Tracked"}
                value={logistic.Assets_Tracked}
              />
              <OneInputItem
                isText={true}
                title={"Weight"}
                value={logistic.Weight}
              />
              <OneInputItem
                isText={true}
                title={"Bypass Pickup Fee"}
                value={logistic.Bypass_Pickup_Fee}
              />
              <OneInputItem
                isText={true}
                title={"Bypass Additional Fee Services"}
                value={logistic.Bypass_Additional_Fee}
              />

              <Text style={detailStyle.section}>
                Business Pickup Intake Form
              </Text>
              <OneInputItem
                isText={true}
                title={"Pickup Intake ID"}
                value={logistic.Pickup_Intake_ID}
              />
              <OneInputItem
                isText={true}
                title={"Organization"}
                value={logistic.Organization_Name}
              />
              <OneInputItem
                isText={true}
                title={"Contact ID"}
                value={logistic.Contact_ID}
              />
              <OneInputItem
                isText={true}
                title={"Account_ID"}
                value={logistic.Account_ID}
              />
              <OneInputItem
                isText={true}
                title={"Parent Account"}
                isParent = {true}
                value={logistic.Parent_Account}
              />
              <OneInputItem
                isText={true}
                title={"Parent ID"}
                value={logistic.Parent_ID}
              />
              <OneInputItem
                isText={true}
                title={"Name"}
                value={logistic.Name}
              />
              <OneInputItem
                isText={true}
                title={"Title"}
                value={logistic.Title}
              />
              <OneInputItem
                isText={true}
                title={"Email"}
                value={logistic.Email}
              />
              <OneInputItem
                isText={true}
                title={"Phone Number"}
                value={logistic.Phone_Number}
              />
              <OneInputItem
                isText={true}
                title={"Pickup Address"}
                value={logistic.Pickup_Address}
              />
              <OneInputItem
                isText={true}
                title={"Preferred Pick Date"}
                value={logistic.Preferred_Pick_Date}
              />
              <OneTextAreaItem
                isText={true}
                title={"Pickup Instruction"}
                value={logistic.Pickup_Instruction}
              />

              {/* Laptops/Desktops (i5, i7 or i9; 2015 or newer) in Working Condition\nWorking = Power ON and Functioning */}
              <Text style={detailStyle.section}>
                {
                  "Laptops/Desktops (i5, i7 or i9; 2015 or newer) in Working Condition\nWorking = Power ON and Functioning"
                }
              </Text>
              <TwoInputItem
                title={"2015/newer Apple Laptop/Desktop"}
                value={logistic.Top_newer_Apple_Laptop_Desktop}
                quantity={logistic.QA_1}
                valueChanged={value => {
                  logistic.QA_1 = value;
                  this.calcQATotal();
                }}
              />
              <TwoInputItem
                title={"2015/newer iMac"}
                value={logistic.Top_newer_iMac}
                quantity={logistic.QA_2}
                valueChanged={value => {
                  logistic.QA_2 = value;
                  this.calcQATotal();
                }}
              />
              <TwoInputItem
                title={"2015/newer Laptop i5,i7,i9"}
                value={logistic.Top_newer_Laptop_i3_i5_i7}
                quantity={logistic.QA_3}
                valueChanged={value => {
                  logistic.QA_3 = value;
                  this.calcQATotal();
                }}
              />
              <TwoInputItem
                title={"2015/newer Desktop i5,i7,i9"}
                value={logistic.Top_newer_Desktop_i3_i5_i7}
                quantity={logistic.QA_4}
                valueChanged={value => {
                  logistic.QA_4 = value;
                  this.calcQATotal();
                }}
              />
              <TwoInputItem
                title={"2015/newer Cisco Enterprise Networking Equipment"}
                value={logistic.Top_newer_Cisco_Enterprise_Networking_Equipment}
                quantity={logistic.QA_5}
                valueChanged={value => {
                  logistic.QA_5 = value;
                  this.calcQATotal();
                }}
              />

              {/* Laptops/Desktops (i5, or i7; 2014 or newer) in Working Condition\nWorking = Power ON and Functioning */}
              <Text style={detailStyle.section}>
                {
                  "Laptops/Desktops (i5, or i7; 2014 or newer) in Working Condition\nWorking = Power ON and Functioning"
                }
              </Text>
              <TwoInputItem
                title={"2014/newer Apple Laptop/Desktop"}
                value={logistic.Top_newer_Apple_Laptop_Desktop}
                quantity={logistic.QB_1}
                valueChanged={value => {
                  logistic.QB_1 = value;
                  this.calcQBTotal();
                }}
              />
              <TwoInputItem
                title={"2014/newer iMac"}
                value={logistic.Top_newer_iMac}
                quantity={logistic.QB_2}
                valueChanged={value => {
                  logistic.QB_2 = value;
                  this.calcQBTotal();
                }}
              />
              <TwoInputItem
                title={"2014/newer Laptop i5,i7"}
                value={logistic.Top_newer_Laptop_i3_i5_i7}
                quantity={logistic.QB_3}
                valueChanged={value => {
                  logistic.QB_3 = value;
                  this.calcQBTotal();
                }}
              />
              <TwoInputItem
                title={"2014/newer Desktop i5,i7"}
                value={logistic.Top_newer_Desktop_i3_i5_i7}
                quantity={logistic.QB_4}
                valueChanged={value => {
                  logistic.QB_4 = value;
                  this.calcQBTotal();
                }}
              />
              <TwoInputItem
                title={"2014/newer Cisco Enterprise Networking Equipment"}
                value={logistic.Top_newer_Cisco_Enterprise_Networking_Equipment}
                quantity={logistic.QB_5}
                valueChanged={value => {
                  logistic.QB_5 = value;
                  this.calcQBTotal();
                }}
              />

              {/* Other Electronic Items\n Working or Non-Working */}
              <Text style={detailStyle.section}>
                {"Other Electronic Items\n Working or Non-Working"}
              </Text>
              <TwoInputItem
                title={"2013 or older Laptop"}
                value={logistic.or_older_Laptop}
                quantity={logistic.QC_1}
                valueChanged={value => {
                  logistic.QC_1 = value;
                  this.calcQCTotal();
                }}
              />
              <TwoInputItem
                title={"2013 or older Desktop"}
                value={logistic.or_older_Desktop}
                quantity={logistic.QC_2}
                valueChanged={value => {
                  logistic.QC_2 = value;
                  this.calcQCTotal();
                }}
              />
              <TwoInputItem
                title={"Computer Server"}
                value={logistic.Computer_Server}
                quantity={logistic.QC_3}
                valueChanged={value => {
                  logistic.QC_3 = value;
                  this.calcQCTotal();
                }}
              />
              <TwoInputItem
                title={"All Other Enterprise Networking Equipment"}
                value={logistic.Enterprise_Networking_Equipment}
                quantity={logistic.QC_4}
                valueChanged={value => {
                  logistic.QC_4 = value;
                  this.calcQCTotal();
                }}
              />
              <TwoInputItem
                title={"Flat Screen Monitor/TV"}
                value={logistic.Flat_Screen_Monitor_TV}
                quantity={logistic.QC_5}
                valueChanged={value => {
                  logistic.QC_5 = value;
                  this.calcQCTotal();
                }}
              />
              <TwoInputItem
                title={"Older CRT Monitor and TV"}
                value={logistic.Older_CRT_Monitor_and_TV}
                quantity={logistic.QC_6}
                valueChanged={value => {
                  logistic.QC_6 = value;
                  this.calcQCTotal();
                }}
              />

              {/* Office Equipment and Appliances */}
              <Text style={detailStyle.section}>
                {"Office Equipment and Appliances"}
              </Text>
              <TwoInputItem
                title={"Banker Box of Small Electronics"}
                value={logistic.Banker_Box_of_Small_Electronics}
                quantity={logistic.NQ_1}
                valueChanged={value => {
                  logistic.NQ_1 = value;
                  this.calcNQTotal();
                }}
              />
              <TwoInputItem
                title={"UPS Batteries (Less than 100 lbs.each)"}
                value={logistic.UPS_Batteries_Less_than_100_lb_each}
                quantity={logistic.NQ_2}
                valueChanged={value => {
                  logistic.NQ_2 = value;
                  this.calcNQTotal();
                }}
              />
              <TwoInputItem
                title={"Printer/Fax/Scanner (Less than 100 lbs. each)"}
                value={logistic.Printer_Fax_Scanner}
                quantity={logistic.NQ_3}
                valueChanged={value => {
                  logistic.NQ_3 = value;
                  this.calcNQTotal();
                }}
              />
              <TwoInputItem
                title={"Misc Items not listed above"}
                value={logistic.Misc_Items_not_listed_above}
                quantity={logistic.NQ_4}
                valueChanged={value => {
                  logistic.NQ_4 = value;
                  this.calcNQTotal();
                }}
              />
              <OneTextAreaItem
                title="Please Describe Items Here"
                value={logistic.Please_Describe_Items_Here}
                valueChanged={value => {
                  logistic.Please_Describe_Items_Here = value;
                }}
              />

              {/* Confidental Destruction Services */}
              <Text style={detailStyle.section}>
                {"Confidental Destruction Services"}
              </Text>
              <TwoInputItem
                title={"Certified Data Destruction (in unit $20/drive)"}
                value={logistic.Physical_Destruction_in_unit_20_drive}
                quantity={logistic.CD_1}
                valueChanged={value => {
                  logistic.CD_1 = value;
                  this.calcCDTotal();
                }}
              />
              <TwoInputItem
                title={"Certified Data Destruction (in unit $15/drive)"}
                value={logistic.Physical_Destruction_Solo_Drive_15_unit}
                quantity={logistic.CD_2}
                valueChanged={value => {
                  logistic.CD_2 = value;
                  this.calcCDTotal();
                }}
              />
              <TwoInputItem
                title={"Data Destruction (No Certificate) $8 W/removal"}
                value={logistic.Physical_Destruction_No_Certificate_8_W_removal}
                quantity={logistic.CD_3}
                valueChanged={value => {
                  logistic.CD_3 = value;
                  this.calcCDTotal();
                }}
              />
              <TwoInputItem
                title={"Data Destruction (No Certificate) $5/Solo Drive"}
                value={
                  logistic.Physical_Destruction_No_Certificate_5_Solo_Drive
                }
                quantity={logistic.CD_4}
                valueChanged={value => {
                  logistic.CD_4 = value;
                  this.calcCDTotal();
                }}
              />
              <TwoInputItem
                title={"Certified Tap Destruction ($3/Tape)"}
                value={logistic.Certified_Tape_Destruction_3_Tape}
                quantity={logistic.CD_5}
                valueChanged={value => {
                  logistic.CD_5 = value;
                  this.calcCDTotal();
                }}
              />

              {/* Product Destruction & ITAD */}
              <Text style={detailStyle.section}>
                {"Product Destruction & ITAD"}
              </Text>
              <TwoInputItem
                title={"Product/ITAD Qty"}
                value={logistic.Product_ITAD_Qty}
                quantity={logistic.IT_1}
                valueChanged={value => {
                  logistic.IT_1 = value;
                  this.calcITTotal();
                }}
              />
              <OneInputItem
                title="Product/ITAD Type"
                value={logistic.Product_ITAD_Type}
                isText={true}
              />
              <OneTextAreaItem
                title="Detail Description for Quote"
                value={logistic.Detail_Description_for_Quote}
                valueChanged={value => {
                  logistic.Detail_Description_for_Quote = value;
                }}
              />

              {/* Additional Fee Services */}
              <Text style={detailStyle.section}>
                {"Additional Fee Services"}
              </Text>
              <TwoInputItem
                title={"Microwave Oven"}
                value={logistic.Microwave_Oven_20_per_Unit}
                quantity={logistic.AF_1}
                valueChanged={value => {
                  logistic.AF_1 = value;
                  this.calcAFTotal();
                }}
                unit="$20/Unit"
              />
              <TwoInputItem
                title={"Used Toner Catridges"}
                value={logistic.Used_Toner_Cartridges_2_per_Toner}
                quantity={logistic.AF_2}
                valueChanged={value => {
                  logistic.AF_2 = value;
                  this.calcAFTotal();
                }}
                unit="$2/Toner"
              />
              <TwoInputItem
                title={"Styrofoam"}
                value={logistic.Styrofoam_50_gaylord}
                quantity={logistic.AF_3}
                valueChanged={value => {
                  logistic.AF_3 = value;
                  this.calcAFTotal();
                }}
                unit="$50/Gaylord"
              />
              <TwoInputItem
                title={"Large Tape Recycling(VHS, DLT, LTO)"}
                value={logistic.Large_Tape_Recycling_1_per_unit}
                quantity={logistic.AF_4}
                valueChanged={value => {
                  logistic.AF_4 = value;
                  this.calcAFTotal();
                }}
                unit="$1.00/Unit"
              />
              <TwoInputItem
                title={"Small Tape Recycling(Floopy, Cassette)"}
                value={logistic.Small_Tape_Recycling_05_per_unit}
                quantity={logistic.AF_5}
                valueChanged={value => {
                  logistic.AF_5 = value;
                  this.calcAFTotal();
                }}
                unit="$0.50/Piece"
              />
              <TwoInputItem
                title={"Oversized Items(Server Rack, Big TV, etc)"}
                value={logistic.Oversized_Items_100_per_unit}
                quantity={logistic.AF_6}
                valueChanged={value => {
                  logistic.AF_6 = value;
                  this.calcAFTotal();
                }}
                unit="$100/Unit"
              />
              <TwoInputItem
                title={"Items over 100 lbs"}
                value={logistic.Items_over_100_lbs_100_100_lbs_unit}
                quantity={logistic.AF_7}
                valueChanged={value => {
                  logistic.AF_7 = value;
                  this.calcAFTotal();
                }}
                unit="$100/100 lbs/Unit"
              />
              <TwoInputItem
                title={"Floor Standing Copier"}
                value={logistic.Floor_Standing_Copier_200_per_unit}
                quantity={logistic.AF_8}
                valueChanged={value => {
                  logistic.AF_8 = value;
                  this.calcAFTotal();
                }}
                unit="$200/Unit"
              />
              <OneTextAreaItem
                title="Please Describe fee Items here"
                value={logistic.Please_Describe_fee_Items_here}
                valueChanged={value => {
                  logistic.Please_Describe_fee_Items_here = value;
                }}
              />

              {/* Pickup Cost Estimate */}
              <Text style={detailStyle.section}>{"Pickup Cost Estimate"}</Text>
              <TwoInputItem
                title={"Qualified Items(2015 or newer)"}
                value={logistic.Subtotal_1_Qualified}
                quantity={logistic.QA_Total}
                isText={true}
              />
              <TwoInputItem
                title={"Qualified Items(2014 or newer)"}
                value={logistic.Subtotal_5_Qualified}
                quantity={logistic.QB_Total}
                isText={true}
              />
              <TwoInputItem
                title={"Additional Qualified Items"}
                value={logistic.Subtotal_10_Qualified}
                quantity={logistic.QC_Total}
                isText={true}
              />
              <TwoInputItem
                title={"Non Qualified Items"}
                value={logistic.Subtotal_Non_Qualified}
                quantity={logistic.NQ_Total}
                isText={true}
              />
              <TwoInputItem
                title={"Product Destruction & ITAD"}
                value={logistic.Product_Destruction_ITAD1}
                quantity={logistic.IT_Total}
                isText={true}
              />
              <TwoInputItem
                title={"Pickup Fee $"}
                value={logistic.Pickup_Fee1}
                quantity={logistic.Q_Pickup_Fee}
                isText={true}
              />
              <TwoInputItem
                title={"Confidential Destruction Services $"}
                value={logistic.Subtotal_HDD}
                quantity={logistic.CD_Total}
                isText={true}
              />
              <TwoInputItem
                title={"Additional Fee Services $"}
                value={logistic.Tenant_Pays}
                quantity={logistic.AF_Total}
                isText={true}
              />
              <TwoInputItem
                title={"Adjustment Fee"}
                value={logistic.Adjust_Fee}
                quantity={logistic.QA_Total}
                isOneField={true}
                isText={true}
              />
              <OneTextAreaItem
                title="Adjustment Note"
                value={logistic.Adjust_Note}
                isText={true}
              />
              <TwoInputItem
                title={"Grand Total $"}
                value={logistic.Grand_Total}
                quantity={logistic.Q_Grand_Total}
                isText={true}
              />

              {/* Customer Signature */}
              <Text style={detailStyle.section}>{"Customer Signature"}</Text>
              <SignatureItem
                title={"Signature"}
                signature={logistic.Signature}
                R_ID = {logistic.R_ID}

                signatureChanged={value => {
                  logistic.Signature = value;
                }}
              />
              {/* <SelectFileItem
                title={"Signature File Upload"}
                value={logistic.Signature}
                fileSelected={value => {
                  logistic.Signature = value;
                }}
              /> */}
              <OneInputItem
                title={"Last Name"}
                value={logistic.Last_Name}
                valueChanged={value => {
                  logistic.Last_Name = value;
                }}
              />
              <PaymentModeItem
                title="Mode of Payment"
                value={logistic.Payment_Details}
                mode={logistic.Mode_of_Payment}                
                valueChanged={value => {
                  logistic.Payment_Details = value;
                }}
                modeChanged={value => {
                  logistic.Mode_of_Payment = value;
                }}
              />
              <PaymentStateItem
                title="Payment State"
                state={logistic.Payment_State}
                stateChanged={value => {
                  logistic.Payment_State = value;
                }}
              />

              <TwoInputItem
                title={"Total_HDD"}
                value={logistic.Total_HDD}
                quantity={logistic.Q_Grand_Total}
                isText={true}
                isOneField={true}
              />
            </View>
          )}

          <TouchableOpacity
            style={detailStyle.btnUpdate}
            onPress={() => this.updateAction()}
          >
            <Text style={detailStyle.updateText}>UPDATE</Text>
          </TouchableOpacity>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => {
  return {
    currentIndex: state.Reducers.currentIndex,
    logistics: state.Reducers.logistics
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLogistics: logistics => {
      dispatch(setLogistics(logistics));
    },
    getLogistics: () => {
      dispatch(getLogistics());
    },
    setSyncUpActive: value => {
      dispatch(setSyncUpActive(value));
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailScreen);
