import React from "react";
import { TokenTypes } from "../constants/TokenTypes";
import TreeItem from "./TreeItem";
export default function Theme(){
  return (
    <>
    <div>
      {Object.values(TokenTypes)?.map((_tokenType) => (
        <TreeItem key={_tokenType} tokenType={_tokenType}/>
      ))}
    </div>
    </>
  )
}