
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: string;
  category: string;
  tags: string[];
  image?: string;
}

export const articles: Article[] = [
  {
    id: '1',
    title: 'Les tendances du développement web en 2024',
    excerpt: 'Découvrez les technologies et frameworks qui façonnent l\'avenir du développement web cette année.',
    content: `
      <h2>L'évolution constante du développement web</h2>
      <p>Le monde du développement web ne cesse d'évoluer, et 2024 ne fait pas exception. Cette année marque un tournant important avec l'émergence de nouvelles technologies et l'évolution des pratiques existantes.</p>
      
      <h3>React et l'écosystème moderne</h3>
      <p>React continue de dominer le paysage du développement frontend, avec des améliorations constantes et un écosystème toujours plus riche. Les Server Components et la nouvelle architecture concurrent mode changent la donne.</p>
      
      <h3>L'essor de TypeScript</h3>
      <p>TypeScript s'impose comme un standard incontournable, offrant une meilleure expérience de développement et une maintenance facilitée des applications complexes.</p>
      
      <h3>Performance et optimisation</h3>
      <p>Les Core Web Vitals deviennent cruciaux pour le SEO et l'expérience utilisateur. Les développeurs se concentrent de plus en plus sur l'optimisation des performances.</p>
      
      <p>En conclusion, 2024 s'annonce comme une année passionnante pour le développement web, avec des technologies toujours plus performantes et accessibles.</p>
    `,
    author: 'Marie Dubois',
    publishDate: '15 Mai 2024',
    readTime: '5 min',
    category: 'Développement',
    tags: ['React', 'TypeScript', 'Performance', 'Tendances']
  },
  {
    id: '2',
    title: 'Guide complet de l\'accessibilité web',
    excerpt: 'L\'importance de créer des sites web accessibles à tous et les meilleures pratiques à adopter.',
    content: `
      <h2>Pourquoi l'accessibilité web est essentielle</h2>
      <p>L'accessibilité web n'est pas seulement une obligation légale, c'est une responsabilité morale qui permet à tous les utilisateurs d'accéder à l'information et aux services en ligne.</p>
      
      <h3>Les principes fondamentaux</h3>
      <p>L'accessibilité web repose sur quatre principes : perceptible, utilisable, compréhensible et robuste. Ces principes guident toutes les décisions de conception et de développement.</p>
      
      <h3>Outils et techniques</h3>
      <p>De nombreux outils existent pour tester et améliorer l'accessibilité de vos sites web. Des lecteurs d'écran aux validateurs automatiques, chaque outil a son rôle.</p>
      
      <h3>Impact sur l'expérience utilisateur</h3>
      <p>Un site accessible est généralement plus facile à utiliser pour tous, pas seulement pour les personnes en situation de handicap.</p>
    `,
    author: 'Thomas Martin',
    publishDate: '12 Mai 2024',
    readTime: '8 min',
    category: 'UX/UI',
    tags: ['Accessibilité', 'UX', 'Standards', 'Inclusion']
  },
  {
    id: '3',
    title: 'Optimisation des performances avec Vite',
    excerpt: 'Comment Vite révolutionne le build des applications web et améliore l\'expérience de développement.',
    content: `
      <h2>La révolution Vite</h2>
      <p>Vite a transformé la façon dont nous développons des applications web en offrant des temps de build ultra-rapides et une expérience de développement fluide.</p>
      
      <h3>Hot Module Replacement</h3>
      <p>Le HMR de Vite est instantané, permettant de voir les changements en temps réel sans perdre l'état de l'application.</p>
      
      <h3>Optimisations de production</h3>
      <p>En production, Vite utilise Rollup pour créer des bundles optimisés avec du tree-shaking et de la minification avancée.</p>
      
      <h3>Écosystème et plugins</h3>
      <p>L'écosystème de plugins Vite est riche et permet d'étendre facilement les fonctionnalités selon vos besoins.</p>
    `,
    author: 'Sophie Laurent',
    publishDate: '10 Mai 2024',
    readTime: '6 min',
    category: 'Outils',
    tags: ['Vite', 'Performance', 'Build', 'Développement']
  },
  {
    id: '4',
    title: 'Design System : créer une cohérence visuelle',
    excerpt: 'Les étapes clés pour mettre en place un design system efficace dans votre organisation.',
    content: `
      <h2>L'importance d'un Design System</h2>
      <p>Un design system bien conçu assure la cohérence visuelle et améliore l'efficacité des équipes de développement et de design.</p>
      
      <h3>Composants réutilisables</h3>
      <p>La création de composants réutilisables permet de maintenir la cohérence tout en accélérant le développement.</p>
      
      <h3>Documentation et gouvernance</h3>
      <p>Une documentation claire et des processus de gouvernance sont essentiels pour l'adoption et la maintenance du design system.</p>
      
      <h3>Évolution et maintenance</h3>
      <p>Un design system vivant évolue avec les besoins de l'organisation et les retours des utilisateurs.</p>
    `,
    author: 'Alexandre Petit',
    publishDate: '8 Mai 2024',
    readTime: '7 min',
    category: 'Design',
    tags: ['Design System', 'UI', 'Composants', 'Organisation']
  },
  {
    id: '5',
    title: 'Sécurité web : protéger vos applications',
    excerpt: 'Les vulnérabilités les plus courantes et les meilleures pratiques pour sécuriser vos applications web.',
    content: `
      <h2>Les enjeux de la sécurité web</h2>
      <p>La sécurité web est un aspect crucial du développement moderne, avec des menaces qui évoluent constamment.</p>
      
      <h3>Vulnérabilités communes</h3>
      <p>XSS, CSRF, injection SQL... Connaître les vulnérabilités les plus communes est le premier pas vers une application sécurisée.</p>
      
      <h3>Authentification et autorisation</h3>
      <p>Mettre en place des systèmes d'authentification robustes et une gestion fine des autorisations.</p>
      
      <h3>Bonnes pratiques</h3>
      <p>De la validation des données à la mise en place de HTTPS, découvrez les pratiques essentielles pour sécuriser vos applications.</p>
    `,
    author: 'Julie Moreau',
    publishDate: '5 Mai 2024',
    readTime: '9 min',
    category: 'Sécurité',
    tags: ['Sécurité', 'Authentification', 'Vulnérabilités', 'Protection']
  },
  {
    id: '6',
    title: 'API REST vs GraphQL : quel choix faire ?',
    excerpt: 'Comparaison détaillée entre REST et GraphQL pour vous aider à choisir la meilleure approche.',
    content: `
      <h2>REST vs GraphQL : le débat continue</h2>
      <p>Le choix entre REST et GraphQL dépend de nombreux facteurs spécifiques à votre projet et à votre équipe.</p>
      
      <h3>Les avantages de REST</h3>
      <p>REST reste un choix solide avec sa simplicité, sa maturité et son excellent support par les outils existants.</p>
      
      <h3>Les points forts de GraphQL</h3>
      <p>GraphQL offre une flexibilité inégalée pour les requêtes et une meilleure expérience développeur pour les applications complexes.</p>
      
      <h3>Critères de choix</h3>
      <p>Analysez vos besoins spécifiques : complexité des données, performance, équipe, écosystème existant...</p>
    `,
    author: 'Pierre Durand',
    publishDate: '3 Mai 2024',
    readTime: '6 min',
    category: 'API',
    tags: ['REST', 'GraphQL', 'API', 'Architecture']
  }
];

export const getArticleById = (id: string): Article | undefined => {
  return articles.find(article => article.id === id);
};

export const getArticlesByCategory = (category: string): Article[] => {
  return articles.filter(article => article.category === category);
};

export const getArticlesByTag = (tag: string): Article[] => {
  return articles.filter(article => article.tags.includes(tag));
};
