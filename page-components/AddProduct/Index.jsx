import { Button } from '@/components/Button';
import { Avatar } from '@/components/Avatar';
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
  const thumbnailPictureRef = useRef();
  const productImages = useRef(['', '', '', '', '']);
  const [thumbnailRef, setThumbnailRef] = useState('');
  const [productImagesRefs, setProductImagesRefs] = useState([
    '',
    '',
    '',
    '',
    '',
  ]);

  const onThumbnailChange = useCallback((e) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (l) => {
      setThumbnailRef(l.currentTarget.result);
    };
    reader.readAsDataURL(file);
  }, []);

  const onProductImageChange = (i) =>
    useCallback(
      (e) => {
        console.log(e, i);
        const file = e.currentTarget.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        const refsCopy = [...productImagesRefs];
        console.log('refsCopt', refsCopy);
        reader.onload = (l) => {
          refsCopy[i] = l.currentTarget.result;
          setProductImagesRefs(refsCopy);
        };
        reader.readAsDataURL(file);
        console.log('imgaesref', productImages);
      },
      [productImagesRefs]
    );

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
          <span className={styles.label}>Imágen miniatura del producto</span>
          <div className={styles.avatar}>
            <Avatar
              size={96}
              username="product-thumbnail"
              url={thumbnailRef}
              product
            />
            <input
              aria-label="Imágen miniatura del producto"
              type="file"
              accept="image/*"
              ref={thumbnailPictureRef}
              onChange={onThumbnailChange}
            />
          </div>
          <Spacer size={0.5} axis="vertical" />
          <span className={styles.label}>Imágenes del producto</span>
          <div className={styles.productImages}>
            {productImagesRefs.map((image, i) => {
              return (
                <div className={styles.avatar} key={i}>
                  <Avatar
                    size={96}
                    username="product-thumbnail"
                    url={image}
                    product
                  />
                  <input
                    aria-label="Imágen miniatura del producto"
                    type="file"
                    accept="image/*"
                    ref={(el) => (productImages.current[i] = el)}
                    onChange={onProductImageChange(i)}
                  />
                </div>
              );
            })}
          </div>
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
