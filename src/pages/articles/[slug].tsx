import { ArticleDetail } from '@/types/Article';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import fs from 'fs';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import { Header } from '@/components/Header';

type ArticlePageProps = {
  article: ArticleDetail;
};

type ArticlePageParams = {
  slug: string;
};

const ArticlePage: NextPage<ArticlePageProps> = ({ article }) => {
  return (
    <>
      <Header />
      <div className="container">
        <article>
          <h1>{article.title}</h1>
          <time>{article.date}</time>
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </article>
      </div>
    </>
  );
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
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  ArticlePageProps,
  ArticlePageParams
> = async ({ params }) => {
  const slug = params?.slug;
  const date = slug?.match(/^\d{4}-\d{2}-\d{2}/)?.[0];

  if (slug == null || date == null) {
    return {
      notFound: true,
    };
  }

  const fileContents = fs.readFileSync(`./articles/${slug}.md`);
  const articleData = matter(fileContents);

  const content = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(articleData.content);

  const article = {
    slug,
    date,
    title: articleData.data.title,
    content: content.toString(),
  };

  return {
    props: {
      article,
    },
  };
};

export default ArticlePage;
