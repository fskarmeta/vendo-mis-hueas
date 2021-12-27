import { ProductsFeed } from '@/page-components/ProductsFeed';
import Head from 'next/head';

const ProductFeedPage = () => {
  return (
    <>
      <Head>
        <title>Products Feed</title>
      </Head>
      <ProductsFeed />
    </>
  );
};

export default ProductFeedPage;
