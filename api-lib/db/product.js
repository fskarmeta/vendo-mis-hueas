import { ObjectId } from 'mongodb';

export async function insertProduct(
  db,
  { title, description, detail, creatorId }
) {
  const product = {
    title,
    description,
    detail,
    creatorId,
    createdAt: new Date(),
  };

  const { insertedId } = await db.collection('products').insertOne(product);
  product._id = insertedId;
  return product;
}

export async function updateProductById(db, id, data) {
  return db
    .collection('products')
    .findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: data },
      { returnDocument: 'after' }
    )
    .then(({ value }) => value);
}

export async function findProducts(db, before, by, limit = 10) {
  return db
    .collection('products')
    .aggregate([
      {
        $match: {
          ...(by && { creatorId: new ObjectId(by) }),
          ...(before && { createdAt: { $lt: before } }),
        },
      },
      { $sort: { _id: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'creatorId',
          foreignField: '_id',
          as: 'creator',
        },
      },
      { $unwind: '$creator' },
    ])
    .toArray();
}
