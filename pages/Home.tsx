import React, { useState, useEffect, MouseEvent, useCallback } from "react";
import { Provider, useSelector } from 'react-redux';
import ReactFlow, {
  isEdge,
  addEdge,
  Controls,
  Node,
  FlowElement,
  OnLoadParams,
  Elements,
  SnapGrid,
  Connection,
  Background,
  Edge,
  isNode,
  ReactFlowProvider,
  updateEdge,
  getIncomers,
  getConnectedEdges,
  getOutgoers,
  applyNodeChanges,
  applyEdgeChanges,
} from "react-flow-renderer";

import ColorSelectorNode from "../components/ColorSelectorNode";
import ParentNode from "../components/ParentNode";
import GroupNode from "../components/GroupNode";
import initialElements from "../components/initialElements";
import Theme from "./Theme";
import store, { RootState } from "../store";

const [initialNodes, initialEdges] = initialElements;

const onLoad = (reactFlowInstance: OnLoadParams) =>
  console.log("flow loaded:", reactFlowInstance);
const onNodeDragStop = (_: MouseEvent, node: Node) =>
  console.log("drag stop", node);
const onElementClick = (_: MouseEvent, element: FlowElement) =>
  console.log("click", element);

const initBgColor = "#F6F8FA";

const connectionLineStyle = { stroke: "#fff" };
const snapGrid: SnapGrid = [16, 16];
const nodeTypes = {
  selectorNode: ColorSelectorNode,
  parent: ParentNode,
  group: GroupNode,
};

export default function Home() {
  const tokenTypeChecked = useSelector((state: RootState) => (state.tokenType));
  let newNodes = [];
  Object.entries(tokenTypeChecked).forEach((tokenType) => {
    if(tokenType[1] === true){
      const result = initialNodes.filter(node => ((node.type === 'parent')) || (node.data.name?.includes(tokenType[0])));
      if(result)
        newNodes.push(result);
    }
  });
  const mergedNodes = newNodes.flat(1);
  console.log('mergedNodes', mergedNodes);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [bgColor, setBgColor] = useState<string>(initBgColor);
  const [tokens, setTokens] = useState<
    { id: string; data: { label: string; value: string } }[]
  >(nodes.map((e) => ({ id: e.id, data: e.data })));

  const onNodesChange = useCallback((changes) => setNodes((ns) => applyNodeChanges(changes, ns)), []);
  const onEdgesChange = useCallback((changes) => setEdges((es) => applyEdgeChanges(changes, es)), []);    

  const onConnect = (params: Connection | Edge) => {
    const node = nodes.find((e) => e.id === params.target);
    const connectedEdges = getConnectedEdges([node], edges).filter(e => e.target === node.id);
    let newNodes = nodes
    let newEdges = edges
    if (connectedEdges.length > 0) {
      newEdges = applyEdgeChanges(connectedEdges.map(edge => ({id: edge.id, type: 'remove'})), newEdges);
    }
    newEdges = addEdge({ ...params }, newEdges);
    
    const newSource = nodes.find((e) => e.id === params.source);
    const outgoers = getOutgoers(node, nodes, edges);
    
    newNodes = newNodes.map(el => {return el.id === node.id ? {...el, data: {...el.data, value: newSource.data.value}} : el} )
    
    if (outgoers.length > 0) {
      outgoers.forEach(out => {
        const outgoerIndex = newNodes.findIndex(el => el.id === out.id); 
        newNodes[outgoerIndex] = {...newNodes[outgoerIndex], data: {...newNodes[outgoerIndex].data, value: newSource.data.value}}
      })
    }
    
    setNodes(() => {      
      return newNodes;
    });
    setEdges(() => {      
      return newEdges;
    });

    const newTokens = [...tokens];
    const tokenIndex = newTokens.findIndex((t) => t.id === params.target);
    const token = {
      ...newTokens[tokenIndex],
      data: { ...newTokens[tokenIndex].data, value: `{${params.source}}` },
    };

    newTokens[tokenIndex] = token;
    setTokens(newTokens);
  };

  // const onLayout = useCallback(
  //   (direction) => {
  //     const layoutedElements = getLayoutedElements(nodes, direction);
  //     setNodes(layoutedElements);
  //   },
  //   [nodes]
  // );  
  return (
    <>
    <div style={{ display: 'flex'}}>
      <Provider store={store}>
        <Theme />
      </Provider>      
      <div style={{ height: '100vh' }} className="layoutflow">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes} 
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeDragStop={onNodeDragStop}
            style={{ background: bgColor }}
            onLoad={onLoad}
            nodeTypes={nodeTypes}
            connectionLineStyle={connectionLineStyle}
            snapToGrid={true}
            snapGrid={snapGrid}
            defaultZoom={1}
            panOnScroll={true}
          >
            <Controls />
            <Background gap={16} size={0.5} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
    </>
  );
}
