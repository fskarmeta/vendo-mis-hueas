import { Button } from '@/components/Button';
import { Container, Spacer } from '@/components/Layout';
import Wrapper from '@/components/Layout/Wrapper';
// import { Post } from '@/components/Post';
import { Text } from '@/components/Text';
import { useProductPages } from '@/lib/product';
import Link from 'next/link';
import styles from './PostList.module.css';

const ProductList = () => {
  const { data, size, setSize, isLoadingMore, isReachingEnd } =
    useProductPages();
  const products = data
    ? data.reduce((acc, val) => [...acc, ...val.product], [])
    : [];

  console.log('products', products);
  return (
    <div className={styles.root}>
      <Spacer axis="vertical" size={1} />
      <Wrapper>
        {products.map((product) => (
          <Link
            key={product._id}
            href={`/user/${product.creator.username}/product/${product._id}`}
            passHref
          >
            <div className={styles.wrap}>
              <p>{product.creator.username}</p>
              {/* <Post className={styles.post} post={post} /> */}
            </div>
          </Link>
        ))}
        <Container justifyContent="center">
          {isReachingEnd ? (
            <Text color="secondary">No more posts are found</Text>
          ) : (
            <Button
              variant="ghost"
              type="success"
              loading={isLoadingMore}
              onClick={() => setSize(size + 1)}
            >
              Load more
            </Button>
          )}
        </Container>
      </Wrapper>
    </div>
  );
};

export default ProductList;
