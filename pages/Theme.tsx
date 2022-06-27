import React from "react";
import { TokenTypes } from "../constants/TokenTypes";
import TreeItem from "../components/TreeItem";
export default function Theme(){
  return (
    <>
    <div>
      {Object.values(TokenTypes).map((_tokenType) => (
        <TreeItem tokenType={_tokenType}/>
      ))}
    </div>
    </>
  )
}