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

const GroupNode: FC<NodeProps> = ({ data, isConnectable }) => {
  const onChange = (color: string) => {
    console.log("handle onChange", color);
  };

  return (
    <div
      
    >
      <div>
        {data.label}
      </div>
    </div>
  );
};

export default memo(GroupNode);
