const fs = require('fs');

const create = (tokenData) => {
  try {
    fs.writeFileSync('./input.json', tokenData);
    return true;
  } catch (error) {
    return error;
  }
};

export const tokenData = {
  create,
};