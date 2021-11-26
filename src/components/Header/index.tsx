import Image from 'next/image';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.logo}>
      <Image src="/imgs/logo.svg" alt="logo" width="239" height="27" />
    </header>
  );
}
