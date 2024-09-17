import React from "react";
import "../../styles/styles.css";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="home-page">
      {/* Section Header */}
      <header className="header-section">
        <div className="overlay">
          <h1>Gagnez du temps avec votre Appel d'Offre Transport</h1>
          <p>
            Générez et envoyez facilement vos appels d'offre en quelques
            minutes.
          </p>
          <Link to="/importerCSV">
            <button className="buttonAO">Commencez Maintenant</button>
          </Link>
        </div>
      </header>

      {/* Section Avantages */}
      <section className="features-section">
        <h2>Pourquoi Utiliser Notre Outil ?</h2>
        <div className="features-container">
          <div className="feature-item">
            <h3>Rapide et Efficace</h3>
            <p>
              Notre outil vous permet de créer un appel d'offre complet en
              seulement quelques minutes.
            </p>
          </div>
          <div className="feature-item">
            <h3>Automatisation</h3>
            <p>
              Automatisez les tâches répétitives pour vous concentrer sur
              l'essentiel.
            </p>
          </div>
          <div className="feature-item">
            <h3>Adaptabilité</h3>
            <p>
              Notre solution s’adapte à vos besoins spécifiques avec un format
              de fichier xlsx pratique.
            </p>
          </div>
        </div>
      </section>

      {/* Section Exemples */}
      <section className="examples-section">
        <h2>Quelques Cas d'Utilisation</h2>
        <div className="examples-container">
          <div className="example-item">
            <h3>Entreprise de Logistique</h3>
            <p>
              Gérez vos appels d'offre pour optimiser vos coûts de transport et
              améliorer votre chaîne d'approvisionnement.
            </p>
          </div>
          <div className="example-item">
            <h3>Transport Public</h3>
            <p>
              Améliorez l'efficacité de votre réseau de transport grâce à des
              offres précises et transparentes.
            </p>
          </div>
          <div className="example-item">
            <h3>Commerce International</h3>
            <p>
              Coordonnez les offres entre vos partenaires internationaux avec
              simplicité et rapidité.
            </p>
          </div>
        </div>
      </section>

      {/* Section Appel à l'Action */}
      <section className="cta-section">
        <h2>Prêt à Simplifier vos Appels d'Offre ?</h2>
        <p>
          Rejoignez des centaines d'entreprises qui utilisent déjà notre
          solution pour automatiser leurs appels d'offre transport.
        </p>
        <Link to="/importerCSV">
          <button className="buttonAO-large">Démarrer Mon AO Transport</button>
        </Link>
      </section>
    </div>
  );
}
