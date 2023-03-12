import { GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import fs from 'fs';
import matter from 'gray-matter';
import { Article } from '@/types/Article';
import Link from 'next/link';

type IndexPageProps = {
  articles: Article[];
};

const IndexPage: NextPage<IndexPageProps> = ({ articles }) => {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <ul>
          {articles.map((article) => {
            return (
              <li key={article.slug}>
                <time dateTime={article.date}>{article.date}</time>
                <Link href={`/articles/${article.slug}`}>{article.title}</Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps<IndexPageProps> = async () => {
  const articles: Article[] = [];

  try {
    const dirents = await fs.promises.readdir('./articles/', {
      withFileTypes: true,
    });

    dirents.forEach((dirent) => {
      const fileContents = fs.readFileSync(
        `./articles/${dirent.name}`,
        'utf-8'
      );
      const articleData = matter(fileContents);
      const date = dirent.name.match(/^\d{4}-\d{2}-\d{2}/)?.[0];

      if (date) {
        articles.push({
          slug: dirent.name.replace('.md', ''),
          date,
          title: articleData.data.title,
        });
      }
    });
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      articles,
    },
  };
};

export default IndexPage;
