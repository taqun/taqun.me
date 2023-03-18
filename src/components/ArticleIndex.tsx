import { Article } from '@/types/Article';
import { FC } from 'react';
import Link from 'next/link';

import styles from './ArticleIndex.module.scss';

type ArticleIndexProps = {
  articles: Article[];
};

export const ArticleIndex: FC<ArticleIndexProps> = ({ articles }) => {
  return (
    <ul className={styles.list}>
      {articles.map((article) => {
        return (
          <li key={article.slug}>
            <Link href={`/articles/${article.slug}`}>{article.title}</Link>
            <time dateTime={article.date}>{article.date}</time>
          </li>
        );
      })}
    </ul>
  );
};
