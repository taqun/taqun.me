import { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

import NotionClient from '@/api/notion';
import { Article } from '@/model/Article';

export const getPreviewArticle = async (slug: string) => {
  const notionToken = process.env.NOTION_TOKEN;
  const notionDatabaseId = process.env.NOTION_DATABASE_ID;

  if (notionToken == null || notionDatabaseId == null) {
    throw new Error('environment variables are not seat.');
  }

  const notionClient = new NotionClient(notionToken);

  const response = await notionClient.getArticle(notionDatabaseId, slug);
  if (response.results.length === 0) return null;

  const page = response.results[0];
  const blocks = await notionClient.getBlocks(page.id);

  const article = new Article();
  await article.parse(
    {
      page: page as PageObjectResponse,
      blocks: blocks,
    },
    './public/'
  );

  return article;
};

export const getPreviewDate = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month =
    d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
  const date = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();

  return `${year}-${month}-${date}`;
};
