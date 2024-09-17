import React, { useState } from "react";
import "../../styles/inscription.css";
import { Link } from "react-router-dom";

export default function Connexion() {
  // États pour les champs de formulaire
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async () => {
    const tosend = {
      email,
      password,
    };

    try {
      const response = await fetch("http://localhost:5000/api/inscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tosend),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.log("Erreur lors de la récéption du formulaire");
      }
    } catch (err) {
      console.log("Erreur lors de l'envoie du formulaire");
    }
  };

  return (
    <div className="page">
      <div className="login">
        <div className="header">
          <span>Connectez-vous !</span>
          <p>Connectez-vous à votre compte membre.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input type="submit" value="Connexion" />
          <span>
            Pas encore de compte ? <Link to={"/Inscription"}>Inscription</Link>
          </span>
        </form>
      </div>
    </div>
  );
}
