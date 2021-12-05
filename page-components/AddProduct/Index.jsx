import { Button } from '@/components/Button';
import { Input, Textarea } from '@/components/Input';
import { Spacer } from '@/components/Layout';
import Wrapper from '@/components/Layout/Wrapper';
import { fetcher } from '@/lib/fetch';
import { useCallback, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import styles from './AddProduct.module.css';

export const AddProduct = () => {
  const title = useRef();
  const description = useRef();
  const detail = useRef();

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const body = {
        title: title.current.value,
        description: description.current.value,
        detail: detail.current.value,
      };
      console.log(body);
      await fetcher('/api/product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      toast.success('Has agregado el producto exitosamente');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <Wrapper className={styles.wrapper}>
      <section className={styles.card}>
        <h4 className={styles.sectionTitle}>Agrega un producto</h4>
        <form onSubmit={onSubmit}>
          <Input ref={title} label="Título" />
          <Spacer size={0.5} axis="vertical" />
          <Input ref={description} label="Descripción" />
          <Spacer size={0.5} axis="vertical" />
          <Textarea ref={detail} label="Detalle" />
          <Spacer size={0.5} axis="vertical" />
          <Spacer size={0.5} axis="vertical" />
          <Button
            htmlType="submit"
            className={styles.submit}
            type="success"
            loading={isLoading}
          >
            Publicar
          </Button>
        </form>
      </section>
    </Wrapper>
  );
};
