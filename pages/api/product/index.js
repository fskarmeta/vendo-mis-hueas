import { ValidateProps } from '@/api-lib/constants';
import { insertProduct } from '@/api-lib/db';
import { auths, database, validateBody } from '@/api-lib/middlewares';
import { v2 as cloudinary } from 'cloudinary';
import { ncOpts } from '@/api-lib/nc';
import nc from 'next-connect';

const handler = nc(ncOpts);

if (process.env.CLOUDINARY_URL) {
  const {
    hostname: cloud_name,
    username: api_key,
    password: api_secret,
  } = new URL(process.env.CLOUDINARY_URL);

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  });
}

handler.use(database, ...auths);

handler.post(
  ...auths,
  validateBody({
    type: 'object',
    properties: {
      title: ValidateProps.product.title,
      description: ValidateProps.product.description,
      detail: ValidateProps.product.detail,
    },
    additionalProperties: true,
  }),
  async (req, res) => {
    console.log(req.body);
    if (!req.user) {
      return res.status(401).end();
    }

    const product = await insertProduct(req.db, {
      title: req.body.title,
      description: req.body.description,
      detail: req.body.detail,
      creatorId: req.user._id,
    });

    return res.json({ product });
  }
);

export default handler;
