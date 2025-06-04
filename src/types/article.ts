
export interface ArticleMeta {
  title: string;
  excerpt: string;
  author: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  image?: string;
}

export interface Article extends ArticleMeta {
  id: string;
  slug: string;
  content: string;
  filePath: string;
}

export interface CategoryInfo {
  name: string;
  slug: string;
  description: string;
  count: number;
}
