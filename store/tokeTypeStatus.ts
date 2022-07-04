import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TokenTypeStatusState {
	other: Boolean,
	color: Boolean,
	borderRadius: Boolean,
	sizing: Boolean,  
	spacing: Boolean,
	text: Boolean,
	typography: Boolean,
	opacity: Boolean,
	borderWidth: Boolean,
	boxShadow: Boolean,
	fontFamilies: Boolean,
	fontWeights: Boolean,
	lineHeights: Boolean,
	fontSizes: Boolean,
	letterSpacing: Boolean,
	paragraphSpacing: Boolean,
	textDecoration: Boolean,
	textCase: Boolean,
	composition: Boolean,
}

const initialState: TokenTypeStatusState = {
	other: true,
	color: true,
	borderRadius: true,
	sizing: true,  
	spacing: true,
	text: true,
	typography: true,
	opacity: true,
	borderWidth: true,
	boxShadow: true,
	fontFamilies: true,
	fontWeights: true,
	lineHeights: true,
	fontSizes: true,
	letterSpacing: true,
	paragraphSpacing: true,
	textDecoration: true,
	textCase: true,
	composition: true,
}

const tokenTypeStatus = createSlice({
	name: 'TokeTypesStatus',
	initialState: initialState,
	reducers: {
		updateTokenTypeStatus(state, action: PayloadAction<{name: string}>) {
			state[action.payload.name] = !state[action.payload.name];
		}
	},
})

export const {
	updateTokenTypeStatus
} = tokenTypeStatus.actions;
export default tokenTypeStatus;