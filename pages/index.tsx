import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { useRouter } from 'next/router'
import store from "../store";
import Home from "../components/Home";
import { convertToTokenArray } from "../utils/convertTokens";

function App() {
  let tokens;
  const fileInfo = useRouter().query;
  const [fileName, setFileName] = useState(fileInfo.id);
  if(typeof fileName !== 'undefined') tokens = require(`../tokenData/${fileName}.json`);  
  else tokens = require('../input.json');
  const converted = convertToTokenArray( {tokens} );

  useEffect(() => {
    setFileName(fileInfo.id);
  }, [fileInfo]);
  return (
    <>
    {typeof fileName !== 'undefined' &&
      <Provider store={store}>
        <Home tokenArray={converted}/>
      </Provider>
    }
    </>
  )
};
export default App;