import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-gray-950 border-t-[10px] border-t-blue-950 text-white overflow-hidden">
      {/* Accent visuel en fond */}
      <div className="absolute inset-0 pointer-events-none opacity-5 bg-[url('/assets/img/pattern.svg')] bg-cover bg-center" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        
        {/* Bloc branding + description */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center mb-6">
            <img src="/assets/img/logo-white.png" alt="Logo La Commu'" className="h-8 w-auto mr-3" />
          </div>
          <p className="text-sm text-gray-400 max-w-xl mx-auto">
            Un média indépendant dédié à la tech, aux outils numériques et aux usages modernes. 
            Articles sélectionnés, regard transversal, contenus utiles.
          </p>
        </div>

        {/* Tags / Catégories actives */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-500 uppercase tracking-wide mb-8">
          <Link to="/category/tech" className="hover:text-white transition">Technologie</Link>
          <Link to="/category/apps" className="hover:text-white transition">Applications</Link>
          <Link to="/category/outils" className="hover:text-white transition">Outils</Link>
          <Link to="/category/services" className="hover:text-white transition">Services</Link>
          <Link to="/category/internet" className="hover:text-white transition">Culture web</Link>
        </div>

        {/* Mini description SEO-friendly */}
        <p className="text-xs text-gray-600 text-center max-w-2xl mx-auto mb-12">
          Comparatifs, sélections et recommandations sur les outils numériques, logiciels, applications, services en ligne et tendances digitales.
        </p>

        {/* Ligne graphique */}
        <div className="h-px bg-gradient-to-r from-blue-600 via-blue-400 to-transparent mb-6" />

        {/* Bas du footer */}
        <div className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} La Commu’. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
