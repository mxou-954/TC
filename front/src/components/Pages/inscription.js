import React, { useState } from "react";
import "../../styles/inscription.css";
import { Link } from "react-router-dom";

export default function Inscription() {
  // États pour chaque champ de formulaire
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async () => {
    // Logique de validation et d'envoi des données
    if (password !== confirmPassword) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    const tosend = {
      name,
      email,
      password,
      confirmPassword,
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
          <span>Rejoignez nous !</span>
          <p>Inscrivez-vous pour devenir membre.</p>
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Enter Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Choose A Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Re-Enter Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <input onClick={handleSubmit} type="submit" value="Signup" />
          <span>
            Déjà membre ?{" "}
            <Link to="/Connexion">
              <a href="#">Connexion</a>
            </Link>
          </span>
        </form>
      </div>
    </div>
  );
}
