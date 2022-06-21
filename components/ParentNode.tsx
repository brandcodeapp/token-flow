import React, { memo, FC, CSSProperties } from "react";

import {
  Handle,
  Position,
  NodeProps,
  Connection,
  Edge,
} from "react-flow-renderer";

const onConnect = (params: Connection | Edge) =>
  console.log("handle onConnect", params);

const ParentNode: FC<NodeProps> = ({ data, isConnectable }) => {
  const onChange = (color: string) => {
    console.log("handle onChange", color);
  };

  return (
    <div
      style={{
        padding: "8px",
        backgroundColor: "black",
        color: "white",
        borderRadius: "6px",
        fontFamily: "monospace",
        fontWeight: "bold",
      }}
    >
      <div>
        {data.label}
      </div>
    </div>
  );
};

export default memo(ParentNode);
