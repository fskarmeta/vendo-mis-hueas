import { Spacer } from '@/components/Layout';
import styles from './Feed.module.css';
import ProductList from './ProductList';

export const ProductsFeed = () => {
  return (
    <div className={styles.root}>
      <Spacer size={1} axis="vertical" />
      <ProductList />
    </div>
  );
};
