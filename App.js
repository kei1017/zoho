import React, { Component } from "react";
import ReactRouter from "./src/routes/ReactRouter";
import { Provider } from "react-redux";
import store from "./src/redux/store";

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <ReactRouter />
      </Provider>
    );
  }
}
