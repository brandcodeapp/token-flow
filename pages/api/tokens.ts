// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';
import Cors from 'cors';
import { tokenData } from '../../utils/tokenData';

type Data = {
  result: string
}

const cors = Cors({
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  origin: '*',
})

// Helper method to wait for a middleware to execute before continuing
// And to throw an error when an error happens in a middleware
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result)
      }
      return resolve(result)
    })
  })
}

export default async function handler( req: NextApiRequest, res: NextApiResponse<Data>) {
  await runMiddleware(req, res, cors)
  
  const result = await tokenData.create(JSON.parse(req.body.data));
  res.status(200).json({ result: `${result}` });
}
