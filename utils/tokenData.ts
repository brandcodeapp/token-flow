const fs = require('fs');
import { writeJsonFileSync } from 'write-json-file';

const create = (tokenData) => {
  console.log('tokenData', tokenData);
	try {
		writeJsonFileSync('./input.json', tokenData);
		return true;
	} catch (error) {
		return error;
	}
};

export const tokenData = {
  create,
};