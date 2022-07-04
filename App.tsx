import React from "react";
import { Provider } from "react-redux";
import store from "./store";
import Home from "./pages";

function App() {
  <>
  <Provider store={store}>
    <Home/>
  </Provider>
  </>
}