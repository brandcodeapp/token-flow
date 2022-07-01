const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const create = (tokenData) => {
  try {
    const fileName = uuidv4();
    fs.writeFileSync(`./tokenData/${fileName}.json`, tokenData);
    return fileName;
  } catch (error) {
    return error;
  }
};

export const tokenData = {
  create,
};