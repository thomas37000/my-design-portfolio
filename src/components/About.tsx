const About = () => {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-8 text-center animate-fade-in">
            À propos de moi
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground animate-fade-in">
            <p>
              Bonjour ! Je suis un designer et développeur créatif avec une
              passion pour la création d'expériences digitales exceptionnelles.
              Mon approche combine esthétique moderne et fonctionnalité
              optimale.
            </p>
            <p>
              Avec plusieurs années d'expérience dans le domaine du design
              digital, j'ai eu l'opportunité de travailler sur des projets
              variés, allant de sites web élégants à des applications mobiles
              innovantes.
            </p>
            <p>
              Mon objectif est de transformer les idées en réalités visuelles
              qui captivent et engagent les utilisateurs tout en respectant les
              meilleures pratiques du design moderne.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
