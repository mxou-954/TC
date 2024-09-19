import React, { useState } from 'react';
import "../../styles/profile.css";
import ImageProfile from "../../styles/OIP.jpg";

export default function Profile() {
    const [transporteurTarif, setTransporteurTarif] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault(); // Empêche la soumission par défaut du formulaire

        const formData = new FormData(); // Utilisation de FormData pour gérer le fichier
        formData.append('transporteurTarif', transporteurTarif);

        try {
            const response = await fetch('http://localhost:5000/api/transporteurTarif', {
                method: 'POST',
                body: formData // Envoi du FormData contenant le fichier
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                console.log("Une erreur s'est produite lors de la réception");
            }
        } catch (err) {
            console.log("Une erreur s'est produite lors de l'envoi");
        }
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <img src={ImageProfile} alt="Avatar" className="profile-avatar" />
                <div className="profile-info">
                    <h1 className="profile-name">Email</h1>
                    <p className="profile-bio">
                        Profil du client avec ses informations pour négociation d'AO. Veuillez soumettre vos nouveaux tarifs ci-dessous.
                    </p>
                </div>
            </div>

            <div className="rate-upload-section">
                <h2>Tarifs envoyés par le client</h2>
                <a href="tarifs_client.xlsx" download="tarifs_client.xlsx" className="download-link">
                    Télécharger les tarifs du client
                </a>
            </div>

            <div className="rate-negotiation-section">
                <h2>Soumettre vos nouveaux tarifs</h2>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <label htmlFor="tarifs">Choisir un fichier Excel :</label>
                    <input
                        type="file"
                        id="tarifs"
                        name="tarifs"
                        accept=".xlsx, .xls"
                        onChange={(e) => setTransporteurTarif(e.target.files[0])} // Récupère le fichier
                    />
                    <input type="submit" value="Soumettre" />
                </form>
            </div>
        </div>
    );
}
