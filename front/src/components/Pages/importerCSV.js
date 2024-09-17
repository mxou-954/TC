import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ImporterCSV() {
  const [step, setStep] = useState(1);

  const [name, setName] = useState("");
  const [secondName, setSecondName] = useState("");

  const [mail, setMail] = useState("");
  const [tel, setTel] = useState("");

  const [poste, setPoste] = useState("");
  const [entreprise, setEntreprise] = useState("");

  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(""); // Stocke l'URL du fichier généré

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    const formData = new FormData();

    formData.append("name", name);
    formData.append("secondName", secondName);
    formData.append("mail", mail);
    formData.append("tel", tel);
    formData.append("poste", poste);
    formData.append("entreprise", entreprise);

    if (file) {
      formData.append("file", file);
    }

    console.log([...formData.entries()]); // Loguer ce qui est envoyé au serveur

    try {
      const response = await fetch("http://localhost:5000/api/receptionPOST", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setStep(step + 1);
        // Stocke l'URL du fichier dans le state pour l'utiliser dans le lien <a>
        setFileUrl(`http://localhost:5000${data.file_url}`);
      } else {
        console.log("Une erreur a été observée lors de l'envoi des données");
      }
    } catch (err) {
      console.log("Une erreur a été observée : " + err);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleClick = () => {
    if (step < 4) {
      handleNext();
    } else {
      handleSubmit(); // Soumettre les données uniquement à la dernière étape
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="pageImporterCSV">
      {step === 1 && (
        <div className="informations">
          <h2>Étape 1 : Informations personnelles</h2>
          <div className="name">
            <label>Entrez votre nom :</label>
            <input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="secondName">
            <label>Entrez votre prénom :</label>
            <input
              value={secondName}
              onChange={(e) => setSecondName(e.target.value)}
            />
          </div>
          <button className="button_suite" onClick={handleNext}>
            <span>Suivant</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
              <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
            </svg>
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="informations">
          <h2>Étape 2 : Coordonnées</h2>
          <div className="email">
            <label>Entrez votre email :</label>
            <input value={mail} onChange={(e) => setMail(e.target.value)} />
          </div>
          <div className="phone">
            <label>Entrez votre numéro de téléphone :</label>
            <input value={tel} onChange={(e) => setTel(e.target.value)} />
          </div>
          <div className="buttons">
            <button className="button_back" onClick={handleBack}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
              </svg>{" "}
              <span>Retour</span>
            </button>
            <button className="button_suite" onClick={handleNext}>
              <span>Suivant</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="informations">
          <h2>Étape 3 : Informations professionnelles</h2>
          <div className="poste">
            <label>Entrez votre poste :</label>
            <input value={poste} onChange={(e) => setPoste(e.target.value)} />
          </div>
          <div className="entreprise">
            <label>Entrez votre entreprise :</label>
            <input
              value={entreprise}
              onChange={(e) => setEntreprise(e.target.value)}
            />
          </div>
          <div className="buttons">
            <button className="button_back" onClick={handleBack}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
              </svg>{" "}
              <span>Retour</span>
            </button>
            <button className="button_suite" onClick={handleNext}>
              <span>Suivant</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="informations">
          <h2>
            Étape 4 : Glissez votre facture transport (⚠️ Document excel
            seulement)
          </h2>
          <label htmlFor="file" className="labelFile">
            <span>
              <svg
                viewBox="0 0 184.69 184.69"
                xmlns="http://www.w3.org/2000/svg"
                width="60px"
                height="60px"
              >
                <g>
                  <g>
                    <g>
                      <path
                        d="M149.968,50.186c-8.017-14.308-23.796-22.515-40.717-19.813
                      C102.609,16.43,88.713,7.576,73.087,7.576c-22.117,0-40.112,17.994-40.112,40.115c0,0.913,0.036,1.854,0.118,2.834
                      C14.004,54.875,0,72.11,0,91.959c0,23.456,19.082,42.535,42.538,42.535h33.623v-7.025H42.538
                      c-19.583,0-35.509-15.929-35.509-35.509c0-17.526,13.084-32.621,30.442-35.105c0.931-0.132,1.768-0.633,2.326-1.392
                      c0.555-0.755,0.795-1.704,0.644-2.63c-0.297-1.904-0.447-3.582-0.447-5.139c0-18.249,14.852-33.094,33.094-33.094
                      c13.703,0,25.789,8.26,30.803,21.04c0.63,1.621,2.351,2.534,4.058,2.14c15.425-3.568,29.919,3.883,36.604,17.168
                      c0.508,1.027,1.503,1.736,2.641,1.897c17.368,2.473,30.481,17.569,30.481,35.112c0,19.58-15.937,35.509-35.52,35.509H97.391
                      v7.025h44.761c23.459,0,42.538-19.079,42.538-42.535C184.69,71.545,169.884,53.901,149.968,50.186z"
                        style={{ fill: "#010002" }}
                      />
                    </g>
                    <g>
                      <path
                        d="M108.586,90.201c1.406-1.403,1.406-3.672,0-5.075L88.541,65.078
                      c-0.701-0.698-1.614-1.045-2.534-1.045l-0.064,0.011c-0.018,0-0.036-0.011-0.054-0.011c-0.931,0-1.85,0.361-2.534,1.045
                      L63.31,85.127c-1.403,1.403-1.403,3.672,0,5.075c1.403,1.406,3.672,1.406,5.075,0L82.296,76.29v97.227
                      c0,1.99,1.603,3.597,3.593,3.597c1.979,0,3.59-1.607,3.59-3.597V76.165l14.033,14.036
                      C104.91,91.608,107.183,91.608,108.586,90.201z"
                        style={{ fill: "#010002" }}
                      />
                    </g>
                  </g>
                </g>
              </svg>
            </span>
            <p>Drag and drop your file here or click to select a file!</p>
          </label>
          <input
            className="input"
            name="file"
            id="file"
            type="file"
            accept=".xls,.xlsx" // Restriction aux fichiers Excel
            onChange={handleFileChange} // Fonction de gestion de fichier
          />

          {/* Afficher le nom du fichier sélectionné */}
          {file && <p>Fichier sélectionné : {file.name}</p>}
          <div className="buttons">
            <button className="button_back" onClick={handleBack}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l160 160c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.2 288 416 288c17.7 0 32-14.3 32-32s-14.3-32-32-32l-306.7 0L214.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-160 160z" />
              </svg>{" "}
              <span>Retour</span>
            </button>
            <button className="button_suite" onClick={handleClick}>
              <span>Suivant</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z" />
              </svg>
            </button>
          </div>
        </div>
      )}
      {step === 5 && (
        <div className="informations-end">
          <div id="wifi-loader">
            <svg class="circle-outer" viewBox="0 0 86 86">
              <circle class="back" cx="43" cy="43" r="40"></circle>
              <circle class="front" cx="43" cy="43" r="40"></circle>
              <circle class="new" cx="43" cy="43" r="40"></circle>
            </svg>
            <svg class="circle-middle" viewBox="0 0 60 60">
              <circle class="back" cx="30" cy="30" r="27"></circle>
              <circle class="front" cx="30" cy="30" r="27"></circle>
            </svg>
            <svg class="circle-inner" viewBox="0 0 34 34">
              <circle class="back" cx="17" cy="17" r="14"></circle>
              <circle class="front" cx="17" cy="17" r="14"></circle>
            </svg>
            <div class="text" data-text="Searching"></div>
          </div>
          <p className="texte_reussite">
            Merci pour votre confiance, nous travaillons sur votre AO et
            contactons les transporteurs. Vous pouvez quitter cette page, vous
            serez contacté par mail dès qu'un transporteur vous aura proposé un
            prix
          </p>

          <Link to={"/messagerie"}>
            {" "}
            <a>Voir ma messagerie</a>{" "}
          </Link>
        </div>
      )}
    </div>
  );
}
