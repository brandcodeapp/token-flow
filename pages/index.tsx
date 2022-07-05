import React, { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { useRouter } from 'next/router'
import store from "../store";
import Home from "../components/Home";
import useSWR from "swr";
import { convertToTokenArray } from "../utils/convertTokens";

const url = 'api/data';

const fetcher = (url) => fetch(url).then((res) => res.json());

function App() {
  let tokens, converted;  
  const { data, error } = useSWR(
    url,
    fetcher
  );
  if(typeof data !== undefined){
    tokens = JSON.parse(data);
    converted = convertToTokenArray( {tokens} );
  }

  return (
    <>
    {typeof data !== 'undefined' &&
      <Provider store={store}>
        <Home tokenArray={converted}/>
      </Provider>
    }
    </>
  )
};
export default App;