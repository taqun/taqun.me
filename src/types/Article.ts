export type Article = {
  slug: string;
  date: string;
  title: string;
};

export type ArticleDetail = Article & {
  description: string;
  content: string;
};
