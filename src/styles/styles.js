import { StyleSheet, Dimensions, Platform } from "react-native";
const { width, height } = Dimensions.get("window");

export const colors = {
  greenColor: "rgb(160, 207, 103)",
  grayColor: '#333',  
};

export const fonts = {
  defualtSize: 13,
};

export default (styles = StyleSheet.create({
  pageBackground: {
    backgroundColor: "white",
    width: "100%",
    height: "100%"
  },

  mainContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column"
  },

  topbar: {
    width: "100%",
    height: 70,
    backgroundColor: 'green',
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end"
  },
  topbarButton: {
    fontSize: fonts.defualtSize,
    color: "white",
    padding: 10
  },
  topbarCenterTitle: {
    color: "white",
    position: "absolute",
    width: "100%",
    textAlign: "center",
    textAlignVertical: "bottom",
    fontSize: fonts.defualtSize,
    fontWeight: "bold",
    color: "white",
    paddingBottom: 10
  },

  contentContainer: {
    width: "100%",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: 20
  },

  scroll_container: {
    flexGrow: 1,
    justifyContent: "center"
  },
  scroll_content_wrapper: {
    width: "100%",
    justifyContent: "center",
    padding: 20
  },

  headerTitle: {
    alignSelf: "center",       
    color: "black",    
  },
  menu_close: {
    width: 40,
    height: 40,    
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end"
  },

  selection_item: {
    borderRadius: 4,
    display: "flex",
    flexDirection: "column",
    height: 35,
    margin: 10,
    marginTop: 5,
    marginBottom: 5,
    backgroundColor: colors.greenColor
  },
  selection_item_content: {
    flex: 1,
    display: "flex",
    flexDirection: "row",
    alignItems: "center"    
  },
  selection_item_title: {
    color: "black",
    flex: 1,
    fontSize: fonts.defualtSize,
    textAlign: 'center',
  },

}));
