
/**
 * Normalise une chaîne en slug compatible avec les URLs
 * Supprime les accents, caractères spéciaux et espaces
 */
export function normalizeSlug(text: string): string {
  return text
    .toLowerCase()
    // Remplacer les caractères accentués
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remplacer les espaces et caractères spéciaux par des tirets
    .replace(/[^a-z0-9]+/g, '-')
    // Supprimer les tirets en début et fin
    .replace(/^-+|-+$/g, '');
}

/**
 * Génère un slug de catégorie normalisé
 */
export function getCategorySlug(categoryName: string): string {
  return normalizeSlug(categoryName);
}

/**
 * Génère une URL d'article avec catégorie et slug normalisés
 */
export function getArticleUrl(categoryName: string, articleSlug: string): string {
  const categorySlug = getCategorySlug(categoryName);
  return `/${categorySlug}/${articleSlug}`;
}

/**
 * Génère une URL de catégorie normalisée
 */
export function getCategoryUrl(categoryName: string): string {
  const categorySlug = getCategorySlug(categoryName);
  return `/${categorySlug}`;
}

/**
 * Génère une URL de tag normalisée
 */
export function getTagUrl(tagName: string): string {
  const tagSlug = normalizeSlug(tagName);
  return `/tag/${tagSlug}`;
}
