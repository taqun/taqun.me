import Link from 'next/link';
import { FC } from 'react';

import styles from './Header.module.scss';

type HeaderProps = {
  isTopPage?: boolean;
};

export const Header: FC<HeaderProps> = ({ isTopPage = false }) => {
  return (
    <header className={styles.header}>
      <div className="container">
        {isTopPage ? (
          <h1>
            <Link href="/">taqun.me</Link>
          </h1>
        ) : (
          <p>
            <Link href="/">taqun.me</Link>
          </p>
        )}
      </div>
    </header>
  );
};
