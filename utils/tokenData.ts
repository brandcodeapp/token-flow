const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const  create = async (tokenData) => {
  try {
    const fileName = uuidv4();
    await fs.writeFileSync(`./tokenData/${fileName}.json`, tokenData);
    return fileName;
  } catch (error) {
    return error;
  }
};

export const tokenData = {
  create,
};