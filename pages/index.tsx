import React from "react";
import { Provider } from "react-redux";
import { useRouter } from 'next/router'
import store from "../store";
import Home from "./Home";
import { convertToTokenArray } from "../utils/convertTokens";

function App() {
  let tokens;
  const fileName = useRouter().query;
  console.log('fileName', fileName.id);
  if(!!fileName.id) tokens = require(`../tokenData/${fileName.id}.json`);
  tokens = require('../input.json');
  const converted = convertToTokenArray( {tokens} );
  return (
    <>
      <Provider store={store}>
        <Home tokenArray={converted}/>
      </Provider>
    </>
  )
};
export default App;