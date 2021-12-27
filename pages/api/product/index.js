import { ValidateProps } from '@/api-lib/constants';
import { insertProduct, updateProductById, findProducts } from '@/api-lib/db';
import { auths, database, validateBody } from '@/api-lib/middlewares';
import { v2 as cloudinary } from 'cloudinary';
import { ncOpts } from '@/api-lib/nc';
import multer from 'multer';
import nc from 'next-connect';

const upload = multer({ dest: '/tmp' });

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

handler.get(async (req, res) => {
  console.log('HOLIWIS');
  const product = await findProducts(
    req.db,
    req.query.before ? new Date(req.query.before) : undefined,
    req.query.by,
    req.query.limit ? parseInt(req.query.limit, 10) : undefined
  );

  res.json({ product });
});

handler.post(
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'productImages', maxCount: 5 },
  ]),
  validateBody({
    type: 'object',
    properties: {
      title: ValidateProps.product.title,
      description: ValidateProps.product.description,
      detail: ValidateProps.product.detail,
    },
    // additionalProperties: true,
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).end();
    }
    const product = await insertProduct(req.db, {
      title: req.body.title,
      description: req.body.description,
      detail: req.body.detail,
      creatorId: req.user._id,
      authorized: false,
      sold: false,
    });

    const productId = product._id;

    let thumbnailImage;
    let productImages = [];

    if (req.files) {
      if (req.files['thumbnail'][0]) {
        const image = await cloudinary.uploader.upload(
          req.files['thumbnail'][0].path,
          {
            width: 512,
            height: 512,
            crop: 'fill',
            folder: `vendo-mis-hueas/products/${req.user._id.toString()}/${productId.toString()}/thumbnail`,
          }
        );
        thumbnailImage = image.secure_url;
      }
      if (req.files['productImages']) {
        for (const img of req.files['productImages']) {
          const image = await cloudinary.uploader.upload(img.path, {
            width: 512,
            height: 512,
            crop: 'fill',
            folder: `vendo-mis-hueas/products/${req.user._id.toString()}/${productId.toString()}/productImages`,
          });
          productImages.push(image.secure_url);
        }
      }
    }

    const updatedProduct = await updateProductById(req.db, productId, {
      ...(thumbnailImage && { thumbnailImage }),
      ...(productImages.length && { productImages }),
    });
    return res.json({ updatedProduct });
  }
);

export const config = {
  api: {
    bodyParser: false,
  },
};

export default handler;
