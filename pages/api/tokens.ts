// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import NextCors from 'nextjs-cors';
import { tokenData } from '../../utils/tokenData';

type Data = {
  result: string
}

export default async function handler( req: NextApiRequest, res: NextApiResponse<Data>) {
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200,
  });
  const result = tokenData.create(JSON.parse(req.body.data));
  res.status(200).json({ result: `${result}` });
}
