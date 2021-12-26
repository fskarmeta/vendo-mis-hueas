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
