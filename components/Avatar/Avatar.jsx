import styles from './Avatar.module.css';

const Avatar = ({ size, username, url, isProduct }) => {
  return (
    <img
      className={isProduct ? styles.product: styles.avatar}
      src={url || '/images/default_user.jpg'}
      alt={username}
      width={size}
      height={size}
    />
  );
};

export default Avatar;
