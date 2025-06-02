
export interface Author {
  firstName: string;
  lastName: string;
  fullName: string;
  bio: string;
  avatar: string;
  role: string;
  company: string;
  social: {
    twitter?: string;
    linkedin?: string;
    github?: string;
    dribbble?: string;
  };
}

export type AuthorId = string;
export type AuthorsData = Record<AuthorId, Author>;
