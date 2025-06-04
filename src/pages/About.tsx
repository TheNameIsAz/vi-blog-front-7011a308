
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Code, Users, Lightbulb, Target } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-purple-700 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            À propos de ViBlog
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Notre mission est de démocratiser l'accès aux connaissances en développement web 
            et d'inspirer la prochaine génération de développeurs.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Mission</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Nous croyons que le développement web devrait être accessible à tous. 
            C'est pourquoi nous créons du contenu de qualité, gratuit et en français 
            pour aider les développeurs à tous les niveaux de leur carrière.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Code className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Expertise Technique</h3>
            <p className="text-gray-600">
              Contenu créé par des experts avec une expérience pratique du développement web.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Communauté</h3>
            <p className="text-gray-600">
              Une communauté bienveillante qui partage ses connaissances et s'entraide.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Lightbulb className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
            <p className="text-gray-600">
              Toujours à l'affût des dernières tendances et technologies du web.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Objectifs Clairs</h3>
            <p className="text-gray-600">
              Des tutoriels pratiques avec des objectifs d'apprentissage bien définis.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Équipe</h2>
            <p className="text-lg text-gray-600">
              Des passionnés de technologie qui partagent leurs connaissances
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                name: 'Marie Dubois',
                role: 'Développeuse Frontend',
                speciality: 'React, TypeScript, Performance'
              },
              {
                name: 'Thomas Martin',
                role: 'Expert UX/UI',
                speciality: 'Accessibilité, Design System'
              },
              {
                name: 'Sophie Laurent',
                role: 'DevOps Engineer',
                speciality: 'CI/CD, Performance, Outils'
              },
              {
                name: 'Alexandre Petit',
                role: 'Designer',
                speciality: 'UI/UX, Design System'
              },
              {
                name: 'Julie Moreau',
                role: 'Experte Sécurité',
                speciality: 'Sécurité Web, Authentification'
              },
              {
                name: 'Pierre Durand',
                role: 'Architecte Backend',
                speciality: 'API, Architecture, Scalabilité'
              }
            ].map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {member.name.split(' ').map(n => n.charAt(0)).join('')}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-sm text-gray-600">{member.speciality}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos Valeurs</h2>
          <p className="text-lg text-gray-600">
            Les principes qui guident notre travail au quotidien
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Qualité avant tout</h3>
            <p className="text-gray-600">
              Nous privilégions la qualité à la quantité. Chaque article est soigneusement 
              rédigé, relu et testé avant publication.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Accessibilité</h3>
            <p className="text-gray-600">
              Le savoir doit être accessible à tous, quel que soit le niveau. 
              Nous expliquons les concepts complexes de manière simple et claire.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Pratique</h3>
            <p className="text-gray-600">
              Nos tutoriels se basent sur des exemples concrets et des projets réels 
              que vous pouvez reproduire et adapter.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Évolution</h3>
            <p className="text-gray-600">
              Le web évolue rapidement, et nous aussi. Nous mettons à jour notre contenu 
              et explorons constamment de nouvelles technologies.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
