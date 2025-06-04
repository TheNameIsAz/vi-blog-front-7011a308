
import { Author, AuthorsData } from '../types/author';

let authorsCache: AuthorsData = {};
let cacheInitialized = false;

async function loadAuthors(): Promise<AuthorsData> {
  try {
    const response = await fetch('/authors/authors.json');
    if (!response.ok) {
      throw new Error('Failed to load authors data');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur lors du chargement des auteurs:', error);
    return {};
  }
}

async function initializeAuthorsCache(): Promise<void> {
  if (cacheInitialized) return;
  
  authorsCache = await loadAuthors();
  cacheInitialized = true;
}

export async function getAuthorById(authorId: string): Promise<Author | undefined> {
  await initializeAuthorsCache();
  return authorsCache[authorId];
}

export async function getAllAuthors(): Promise<AuthorsData> {
  await initializeAuthorsCache();
  return { ...authorsCache };
}
