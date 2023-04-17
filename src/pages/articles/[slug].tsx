import fs from 'fs';
import matter from 'gray-matter';
import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import rehypeStringify from 'rehype-stringify';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified } from 'unified';

import Layout from '@/components/Layout';
import { NextPageWithLayout } from '@/pages/_app';
import { ArticleDetail } from '@/types/Article';
import { getPreviewArticle, getPreviewDate } from '@/utils/preview';
import {
  imageCaptionHandler,
  remarkDescription,
  remarkImageCaption,
} from '@/utils/unifiedPlugins';

const IS_DEV = process.env.NODE_ENV === 'development';

type ArticlePageProps = {
  article: ArticleDetail;
};

type ArticlePageParams = {
  slug: string;
};

const ArticlePage: NextPageWithLayout<ArticlePageProps> = ({ article }) => {
  const router = useRouter();
  if (router.isFallback) {
    return (
      <>
        <p>Preview Loading...</p>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>{`${article.title} | taqun.me`}</title>
        <meta name="description" content={article.description} />
      </Head>
      <article>
        <header>
          <h1>{article.title}</h1>
          <time>{article.date}</time>
        </header>
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </article>
    </>
  );
};

ArticlePage.getLayout = (page) => {
  return <Layout>{page}</Layout>;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: { params: { slug: string } }[] = [];

  try {
    const dirents = await fs.promises.readdir('./articles/', {
      withFileTypes: true,
    });

    dirents.forEach((dirent) => {
      const slug = dirent.name.replace('.md', '');
      paths.push({ params: { slug } });
    });
  } catch (error) {
    console.log(error);
  }

  return {
    paths,
    fallback: IS_DEV ? true : false,
  };
};

export const getStaticProps: GetStaticProps<
  ArticlePageProps,
  ArticlePageParams
> = async ({ params }) => {
  const slug = params?.slug;
  if (slug == null) return { notFound: true };

  const date = slug?.match(/^\d{4}-\d{2}-\d{2}/)?.[0];
  let fileContents = null;

  if (IS_DEV) {
    // development
    if (date != null) {
      // from markdown file
      fileContents = fs.readFileSync(`./articles/${slug}.md`);
    } else {
      // from notion
      const article = await getPreviewArticle(slug);
      if (article) {
        fileContents = article.contents;
      }
    }
  } else {
    // production
    if (date == null) {
      return {
        notFound: true,
      };
    }

    fileContents = fs.readFileSync(`./articles/${slug}.md`);
  }

  if (fileContents == null) {
    return {
      notFound: true,
    };
  }

  const articleData = matter(fileContents);

  const content = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkDescription)
    .use(remarkImageCaption)
    .use(remarkRehype, {
      allowDangerousHtml: true,
      handlers: {
        'image-with-caption': imageCaptionHandler,
      },
    })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(articleData.content);

  const article = {
    slug,
    date: date || getPreviewDate(),
    title: articleData.data.title,
    description: content.data.description as string,
    content: content.toString(),
  };

  return {
    props: {
      article,
    },
  };
};

export default ArticlePage;
