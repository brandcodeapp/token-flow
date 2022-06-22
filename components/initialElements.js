import { checkIfAlias, getAlias, getAliasValue } from "../utils/alias";
import { convertToTokenArray } from "../utils/convertTokens";
const position = { x: 0, y: 0 };
const edgeType = "smoothstep";
import tokens from "../input.json";
const converted = convertToTokenArray( {tokens} );
// write a function that takes in a token array and returns unique parent ids depending on nested level
function getParentIds(tokenArray) {
  const parentIds = [];
  tokenArray.forEach((token) => {
    const parent = token.name.split(".").slice(0, -1).join(".");
    if (parent && !parentIds.includes(parent)) {
      parentIds.push(parent);
    }
  });
  return parentIds;
}
const parents = getParentIds(converted);

let grouped = {};
parents.forEach((parent) => {
  const parentId = parent;
  converted.find((token) => {
    const parent = token.name.split(".").slice(0, -1).join(".");
    if (parent === parentId) {
      grouped[parentId] = grouped[parentId] || [];
      grouped[parentId].push(token);
    }
  });
});
let root = {};

Object.entries(grouped).forEach(([key, values]) => {
  const parentId = key.split(".").slice(0, 1)[0];
  root[parentId] = root[parentId] || {};
  root[parentId][key] = values;
});

let transformed = [];

const columnWidth = 360;
const nodeHeight = 40;
const rowGap = 32;
const padding = 0;
const headerHeight = 40;
const margin = 16;

Object.entries(root).forEach(([parentId, children], rootIndex) => {
  transformed.push({
    id: parentId,
    connectable: true,
    type: "parent",
    position: {
      x:
        rootIndex > 0
          ? margin + rootIndex * columnWidth*5 + rowGap * rootIndex
          : margin,
      y: margin,
    },
    data: { label: parentId },
  });
  let totalHeight = 0;

  Object.entries(children).forEach(([parentId, tokens], groupIndex) => {
    const groupHeight = tokens.length * nodeHeight + padding + headerHeight; // 2 * 50 + 32

    transformed.push({
      id: parentId,
      parentNode: parentId.split(".").slice(0, 1)[0],
      data: { label: parentId },
      type: "group",
      position: { x: 0, y: totalHeight + headerHeight },
      style: {
        padding: '8px',
        backgroundColor: "white",
        borderRadius: "6px",
        fontFamily: "monospace",
        fontWeight: "bold",
        textAlign: "left",
        width: columnWidth,
        height: groupHeight + padding * 2,
        boxShadow: "0px 2px 3px -1px rgba(0, 0, 0, 0.25)",
      },
    });
    tokens.forEach((token, index) => {
      transformed.push({
        id: token.name,
        data: {
          ...token,
          rawValue: token.value,
          value: checkIfAlias(token.value)
            ? getAliasValue(token.value, converted)
            : token.value,
        },
        position: {
          x: padding,
          y: index * nodeHeight + padding + headerHeight,
        },
        type: "selectorNode",
        parentNode: parentId,
      });
    });
    totalHeight = totalHeight + groupHeight + rowGap;
  });
});

const nodes = transformed;

const edges = converted.reduce((acc, token) => {
  if (checkIfAlias(token.value)) {
    let alias = getAlias(token.value);
    if (alias.length > 0) {
      alias.forEach((alias) => {
        converted.forEach(t => {
          if(t.name.includes(alias))
            alias = alias.replace(alias, t.name);
        })
        acc.push({
          source: alias,
          target: token.name,
          id: `${token.name}-${alias}`,
        });
      });
    }
  }
  return acc;
}, []);

const combined = [nodes, edges];

export default combined;
