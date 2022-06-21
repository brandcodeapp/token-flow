import { ShadowTokenSingleValue, SingleTokenObject, TypographyObject } from "./types";

export const aliasRegex = /(\$[^\s,]+\w)|({([^}]*)})/g;

export function getAlias(token: string) {
    const match = token.match(aliasRegex);
    return match?.map(ref => ref.startsWith('{') ? ref.slice(1, ref.length - 1) : ref.substring(1));
}

export function getAliasValue(token: string, tokens: SingleTokenObject[]): string | number | null {
    const references = getAlias(token);
    if (!references) return token;
    const aliasValue = references.map(ref => {
        const token = tokens.find(t => t.name === ref);
        if (!token) return null;
        if (checkIfAlias(token)) {
            // todo: handle other tokens
            return getAliasValue(token.value as string, tokens);
        } else {
            return token.value;
        }
    });
    const result = aliasValue.filter(v => v !== null)[0]?.toString();
    if (result) return result;
    return null;
}

// Checks if token is an alias token and if it has a valid reference
export function checkIfAlias(token: SingleTokenObject | string, allTokens = []): boolean {
    try {
        if (typeof token === 'string') {
            return Boolean(token.toString().match(aliasRegex));
        } else if (token.type === 'typography') {
            return Object.values(token.value).some((typographyToken) => {
                return Boolean(typographyToken?.toString().match(aliasRegex));
            });
        } else {
            return checkIfAlias(token.value.toString(), allTokens);
        }


    } catch (e) {
        console.log(`Error checking alias of token ${typeof token === 'object' && 'name' in token ? token.name : token}`, token, allTokens, e);
    }
    return false;
}
