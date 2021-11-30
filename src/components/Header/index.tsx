import Image from 'next/image';
import Link from 'next/link';
import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.header}>
      <Link href="/">
        <a>
          <Image
            src="/imgs/logo.svg"
            alt="logo"
            width="239"
            height="27"
            className={styles.logo}
          />
        </a>
      </Link>
    </header>
  );
}
