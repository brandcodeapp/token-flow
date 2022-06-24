import { TokenTypes } from "../constants/TokenTypes";
import { ShadowTokenSingleValue, SingleTokenObject, TypographyObject, TokenType } from "./types";
import { SingleToken } from './SingleToken';
import calcAstParser from 'postcss-calc-ast-parser';
import { Root } from 'postcss-calc-ast-parser/dist/types/ast';
import { Parser } from 'expr-eval';
import { findReferences } from './findReferences';
import { convertToRgb } from './color/convertToRgb';

export const aliasRegex = /(\$[^\s,]+\w)|({([^}]*)})/g;

export function getAlias(token: string) {
  const match = token.match(aliasRegex);
  return match?.map(ref => ref.startsWith('{') ? ref.slice(1, ref.length - 1) : ref.substring(1));
}

type SingleTokenValueObject = Pick<SingleToken, 'value'>;
type TokenNameNodeType = string | undefined;

const parser = new Parser();

function checkAndEvaluateMath(expr: string) {
  let calcParsed: Root;

  try {
    calcParsed = calcAstParser.parse(expr);
  } catch (ex) {
    return expr;
  }

  const calcReduced = calcAstParser.reduceExpression(calcParsed);
  let unitlessExpr = expr;
  let unit = '';

  if (calcReduced && calcReduced.type !== 'Number') {
    unitlessExpr = expr.replace(new RegExp(calcReduced.unit, 'ig'), '');
    unit = calcReduced.unit;
  }

  let evaluated: number;

  try {
    evaluated = parser.evaluate(unitlessExpr);
  } catch (ex) {
    return expr;
  }

  return unit ? `${evaluated}${unit}` : Number.parseFloat(evaluated.toFixed(3));
}

function isSingleTokenValueObject(token: SingleTokenValueObject | any): token is SingleTokenValueObject {
  return !!(
    token
    && typeof token === 'object'
    && 'value' in token
    && (
      typeof token.value !== 'undefined'
      && token.value !== null
    )
  );
}

function getReturnedValue(token: SingleToken | string | number) {
  if (typeof token === 'object' && typeof token.value === 'object' && (token?.type === TokenTypes.BOX_SHADOW || token?.type === TokenTypes.TYPOGRAPHY)) {
    return token.value;
  }
  if (isSingleTokenValueObject(token)) {
    return token.value.toString();
  }
  return token.toString();
}

function replaceAliasWithResolvedReference(token: string | TypographyObject | ShadowTokenSingleValue | ShadowTokenSingleValue[] | null, reference: string, resolvedReference: string | number | object | null) {
  if (typeof resolvedReference === 'object') {
    return resolvedReference;
  }
  if (token && (typeof token === 'string' || typeof token === 'number')) {
    const stringValue = String(resolvedReference);
    const resolved = checkAndEvaluateMath(stringValue);
    return token.replace(reference, String(resolved));
  }
  return token;
}

// @TODO This function logic needs to be explained to improve it. It is unclear at this time which cases it needs to handle and how
export function getAliasValue(token: SingleToken | string | number, tokens: SingleToken[] = []): string | number | TypographyObject | ShadowTokenSingleValue | Array<ShadowTokenSingleValue> | null {
  // @TODO not sure how this will handle typography and boxShadow values. I don't believe it works.
  // The logic was copied from the original function in aliases.tsx
      
  let returnedValue: ReturnType<typeof getReturnedValue> | null = getReturnedValue(token);

  try {
    const tokenReferences = typeof returnedValue === 'string' ? findReferences(returnedValue) : null;

    if (tokenReferences?.length) {
      const resolvedReferences = Array.from(tokenReferences).map((ref) => {
        if (ref.length > 1) {
          let nameToLookFor: string;
          if (ref.startsWith('{')) {
            if (ref.endsWith('}')) nameToLookFor = ref.slice(1, ref.length - 1);
            else nameToLookFor = ref.slice(1, ref.length);
          } else { nameToLookFor = ref.substring(1); }

          if (
            (typeof token === 'object' && nameToLookFor === token.name)
            || nameToLookFor === token
          ) {
            return isSingleTokenValueObject(token) ? token.value.toString() : token.toString();
          }

          const tokenAliasSplited = nameToLookFor.split('.');
          const tokenAliasSplitedLast: TokenNameNodeType = tokenAliasSplited.pop();
          const tokenAliasLastExcluded = tokenAliasSplited.join('.');
          const tokenAliasSplitedLastPrevious: number = Number(tokenAliasSplited.pop());
          const tokenAliasLastPreviousExcluded = tokenAliasSplited.join('.');
          const foundToken = tokens.find((t) => t.name === nameToLookFor || t.name === tokenAliasLastExcluded || t.name === tokenAliasLastPreviousExcluded);

          if (foundToken?.name === nameToLookFor) { return getAliasValue(foundToken, tokens); }

          if (
            !!tokenAliasSplitedLast
            && foundToken?.name === tokenAliasLastExcluded
            && foundToken.rawValue?.hasOwnProperty(tokenAliasSplitedLast)
          ) {
            const { rawValue } = foundToken;
            if (typeof rawValue === 'object' && !Array.isArray(rawValue)) {
              const value = rawValue[tokenAliasSplitedLast as keyof typeof rawValue] as string | number;
              return getAliasValue(value, tokens);
            }
          }

          if (
            tokenAliasSplitedLastPrevious !== undefined
            && !!tokenAliasSplitedLast
            && foundToken?.name === tokenAliasLastPreviousExcluded
            && Array.isArray(foundToken?.rawValue)
            && !!foundToken?.rawValue[tokenAliasSplitedLastPrevious]
            && foundToken?.rawValue[tokenAliasSplitedLastPrevious].hasOwnProperty(tokenAliasSplitedLast)
          ) {
            const rawValueEntry = foundToken?.rawValue[tokenAliasSplitedLastPrevious];
            return getAliasValue(rawValueEntry[tokenAliasSplitedLast as keyof typeof rawValueEntry] || tokenAliasSplitedLastPrevious, tokens);
          }
        }
        return ref;
      });

      tokenReferences.forEach((reference, index) => {
        const resolvedReference = resolvedReferences[index];
        returnedValue = replaceAliasWithResolvedReference(returnedValue, reference, resolvedReference);
      });

      if (returnedValue === 'null') {
        returnedValue = null;
      }
    }

    if (returnedValue && typeof returnedValue === 'string') {
      const remainingReferences = findReferences(returnedValue);
      if (!remainingReferences) {
        const couldBeNumberValue = checkAndEvaluateMath(returnedValue);
        if (typeof couldBeNumberValue === 'number') return couldBeNumberValue;
        return convertToRgb(couldBeNumberValue);
      }
    }
  } catch (err) {
    console.log(`Error getting alias value of ${JSON.stringify(token, null, 2)}`, tokens);
    return null;
  }

  if (returnedValue && typeof returnedValue === 'string') {
    return checkAndEvaluateMath(returnedValue);
  }
  return returnedValue;
}

// Checks if token is an alias token and if it has a valid reference
export function checkIfAlias(token: SingleToken | string, allTokens: SingleToken[] = []): boolean {
  try {
    let aliasToken = false;
    if (typeof token === 'string') {
      aliasToken = Boolean(token.match(aliasRegex));
    } else if (token.type === TokenTypes.TYPOGRAPHY || token.type === TokenTypes.BOX_SHADOW) {
      if (typeof token.value === 'string') { aliasToken = Boolean(String(token.value).match(aliasRegex)); } else {
        const arrayValue = Array.isArray(token.value) ? token.value : [token.value];
        aliasToken = arrayValue.some((value) => (
          Object.values(value).some((singleValue) => (
            Boolean(singleValue?.toString().match(aliasRegex))
          ))
        ));
      }
    } else if (token.type === TokenTypes.COMPOSITION) {
      return true;
    } else {
      aliasToken = Boolean(token.value.toString().match(aliasRegex));
    }

    // Check if alias is found
    if (aliasToken) {
      const aliasValue = getAliasValue(token, allTokens);
      return aliasValue != null;
    }
  } catch (e) {
    console.log(`Error checking alias of token ${typeof token === 'object' ? token.name : token}`, token, allTokens, e);
  }
  return false;
}

