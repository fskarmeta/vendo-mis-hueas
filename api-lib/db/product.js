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
