const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const  create = async (tokenData) => {
  try {
    const fileName = uuidv4();
    const file = path.join(process.cwd(), 'posts', `${fileName}.json`);
    const data = await fs.writeFileSync(file, tokenData);
    console.log('data', data);
    return data;
  } catch (error) {
    return error;
  }
};

export const tokenData = {
  create,
};