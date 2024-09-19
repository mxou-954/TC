import logging
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import pandas as pd
from openpyxl import load_workbook


app = Flask(__name__)
CORS(app)  # Permet les requêtes cross-origin

# Configuration de base pour les logs
logging.basicConfig(level=logging.DEBUG)  # Affiche les logs de niveau DEBUG et supérieur



























UPLOAD_FOLDER = './uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

tarif_sans_signature = [5.51, 6.20, 6.93, 7.52, 8.43, 9.25, 10.08, 10.89, 11.40, 12.20, 13.00, 13.82, 14.62, 15.13, 15.91, 16.69, 17.50, 18.29, 19.07, 19.85, 20.64, 21.45, 22.22, 22.79, 23.57, 24.36, 25.14, 25.91, 26.70, 27.47, 28.26, 29.06, 29.81]
tarif_avec_signature = [6.39, 7.08, 7.81, 8.40, 9.31, 10.13, 10.96, 11.77, 12.28, 13.08, 13.88, 14.70, 15.50, 16.01, 16.79, 17.57, 18.38, 19.17, 19.95, 20.73, 21.52, 22.33, 23.10, 23.67, 24.45, 25.24, 26.02, 26.79, 27.58, 28.35, 29.14, 29.94, 30.69]
tarif_boite_lettre_pickup = [5.51, 6.20, 6.93, 7.52, 8.43, 9.25, 10.08, 10.89, 11.40, 12.20, 13.00, 13.82, 14.62, 15.13, 15.91, 16.69, 17.50, 18.29, 19.07, 19.85, 20.64, 21.45, 22.22, 22.79, 23.57, 24.36, 25.14, 25.91, 26.70, 27.47, 28.26, 29.06, 29.81]
tarif_la_poste_pickup = [4.76, 5.54, 6.37, 7.04, 8.08, 9.01, 9.96, 10.88, 11.46, 12.36, 13.27, 14.20, 15.11, 15.69, 16.58, 17.47, 18.39, 19.28, 20.17, 21.06, 21.96, 22.87, 23.75, 24.40, 25.28, 26.18, 27.07, 27.94, 28.84, 29.72, 30.61, 31.52, 32.38]

@app.route('/api/receptionPOST', methods=['POST'])
def reception_post():
    logging.debug("Réception de la requête POST")

    file = request.files.get('file')
    if not file:
        logging.error("Aucun fichier reçu")
        return jsonify({"message": "Aucun fichier reçu"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    logging.debug(f"Sauvegarde du fichier à : {file_path}")
    file.save(file_path)

    file_name = 'grouped_' + file.filename  # Ajoute un préfixe au nom de fichier original
    output_file_path = os.path.join(UPLOAD_FOLDER, file_name)  # Crée le chemin complet




    try:
        logging.debug("Lecture du fichier Excel")
        df = pd.read_excel(file_path)

        required_columns = ['N objet', 'Poids taxé']
        df = df[required_columns]

        logging.debug(f"Colonnes disponibles dans le fichier : {df.columns.tolist()}")
        if not all(col in df.columns for col in required_columns):
            missing_cols = [col for col in required_columns if col not in df.columns]
            logging.error(f"Colonnes manquantes : {missing_cols}")
            return jsonify({"message": f"Colonnes manquantes : {', '.join(missing_cols)}"}), 400

        # Nettoyage de la colonne "Poids taxé"
        logging.debug("Nettoyage de la colonne 'Poids taxé'")
        df['Poids taxé'] = df['Poids taxé'].astype(str).str.replace(r'[^0-9.,]', '', regex=True)
        df['Poids taxé'] = df['Poids taxé'].str.replace(',', '.')
        df['Poids taxé'] = pd.to_numeric(df['Poids taxé'], errors='coerce')

        logging.debug(f"Nombre de valeurs NaN dans 'Poids taxé' : {df['Poids taxé'].isna().sum()}")
        df_filtered = df.dropna(subset=['Poids taxé'])
        logging.debug(f"Nombre de lignes après suppression des NaN : {len(df_filtered)}")




        services_mapping = {
            "5W", "5X", "5Y", "6A", "6C", "6G", "6H", "6M", "6Q", "6R", "6W",
            "7Q", "7R", "8G", "8K", "8L", "8N", "8P", "8Q", "8R", "8U", "8V",
            "9L", "9V", "9W"
        }

        # Liste des poids de référence
       # Liste des poids de référence
        reference_weights = [0.25, 0.50, 0.75, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]

        # Fonction pour arrondir le poids au supérieur en fonction des poids de référence
        def round_up_to_reference_weight(taxed_weight):
            for ref_weight in reference_weights:
                if taxed_weight <= ref_weight:
                    return ref_weight
            return reference_weights[-1]  # Retourne le poids max si aucun n'est trouvé

        # Appliquer la fonction directement au DataFrame principal df
        if 'Poids taxé' in df.columns:
            df['Poids de référence'] = df['Poids taxé'].apply(round_up_to_reference_weight)
            print(df[['Poids taxé', 'Poids de référence']].head())
        else:
            print("La colonne 'Poids taxé' n'existe pas dans le DataFrame.")

        # Filtrage et regroupement des lignes par code de service
        dfs_by_service = {service: pd.DataFrame() for service in services_mapping}

        for service_code in services_mapping:
            # Filtrer les lignes dont les deux premiers caractères de 'N objet' correspondent au code de service
            filtered_df = df[df['N objet'].str.startswith(service_code, na=False)].copy()

            # Sauvegarder le DataFrame filtré dans le dictionnaire seulement si non vide
            if not filtered_df.empty:
                dfs_by_service[service_code] = filtered_df

        # Associer chaque service avec ses tarifs dans tarifs_mapping
        tarifs_mapping = {
            "6A": tarif_sans_signature,
            "6C": tarif_avec_signature,
            "6M": tarif_boite_lettre_pickup,
            "6H": tarif_la_poste_pickup,
            "8R": tarif_boite_lettre_pickup
        }

        # Écriture des DataFrames filtrés dans des feuilles séparées du fichier Excel
        with pd.ExcelWriter(output_file_path, engine='xlsxwriter') as writer:
            for service_code, filtered_df in dfs_by_service.items():
                if not filtered_df.empty:
                    # Troncature du nom de la feuille si nécessaire
                    sheet_name = service_code[:31]  # Excel limite les noms de feuille à 31 caractères
                    
                    # Calculer le récapitulatif uniquement pour le service en cours
                    poids_summary = filtered_df.groupby('Poids de référence').size().reset_index(name='Compteur')

                    # Récupérer les tarifs associés pour ce service
                    if service_code in tarifs_mapping:
                        tarifs_service = tarifs_mapping[service_code]
                    else:
                        tarifs_service = [0] * len(reference_weights)  # Valeurs par défaut si le service n'a pas de tarif
                    
                    # Remplir le DataFrame fd_total avec les coûts unitaires spécifiques à ce service
                    data2 = {
                        "Tranche de poids (kg)": poids_summary['Poids de référence'].tolist(),
                        "Qté d'envois": poids_summary['Compteur'].tolist(),
                        "Coût unitaire": [tarifs_service[reference_weights.index(p)] for p in poids_summary['Poids de référence']],  # Associe les tarifs aux poids
                        "Total": [tarif * qte for tarif, qte in zip(
                            [tarifs_service[reference_weights.index(p)] for p in poids_summary['Poids de référence']],
                            poids_summary['Compteur']
                        )]
                    }
                    new_row_1 = {
                        "Tranche de poids (kg)": "",  # Valeur pour la première colonne
                        "Qté d'envois": "",  # Valeur pour la deuxième colonne
                        "Coût unitaire": "",  # Valeur pour la troisième colonne
                        "Total": ""  # Valeur pour la quatrième colonne
                    }

                    somme_totale = sum(data2["Total"])
                    qtt_envoies = sum(data2["Qté d'envois"])

                    new_row_2 = {
                        "Tranche de poids (kg)": "Total :",  # Valeur pour la première colonne
                        "Qté d'envois": qtt_envoies,  # Valeur pour la deuxième colonne
                        "Coût unitaire": "none",  # Valeur pour la troisième colonne
                        "Total": somme_totale  # Valeur pour la quatrième colonne
                    }

                    for key, value in new_row_1.items():
                        data2[key].append(value)

                    # Ajout de la deuxième nouvelle ligne à chaque colonne du dictionnaire
                    for key, value in new_row_2.items():
                        data2[key].append(value)

                    fd_total = pd.DataFrame(data2)
                    
                    # Écrire les DataFrames dans des feuilles Excel
                    filtered_df.to_excel(writer, sheet_name=sheet_name, index=False)
                    fd_total.to_excel(writer, sheet_name=f"{sheet_name}_AO", index=False)

        print(f"Fichier Excel sauvegardé à {output_file_path}")

        logging.info("Fichier traité et sauvegardé avec succès")
        return jsonify({"message": "Fichier traité et sauvegardé", "path": output_file_path}), 200

    except Exception as e: 
        logging.error(f"Erreur lors du traitement du fichier : {e}")
        return jsonify({"message": "Erreur lors du traitement du fichier"}), 500
    

@app.route('/download/<file_name>', methods=['GET'])
def download_file(file_name):
    return send_from_directory(app.config['./uploads'], file_name, as_attachment=True)


@app.route('/api/transporteurTarif', methods=['POST'])
def fusionExecl():
    logging.debug("Réception de la requête POST")

    file = request.files.get('transporteurTarif')
    if not file:
        logging.error("Aucun fichier reçu")
        return jsonify({"message": "Aucun fichier reçu"}), 400

    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    logging.debug(f"Sauvegarde du fichier à : {file_path}")
    file.save(file_path)

    file_name = 'grouped_' + file.filename  # Ajoute un préfixe au nom de fichier original
    output_file_path = os.path.join(UPLOAD_FOLDER, file_name)  # Crée le chemin complet


    try:
        logging.debug("Lecture du fichier Excel en sautant les lignes inutiles")

        # Lire le fichier Excel, en sautant les 7 premières lignes pour que la lecture commence à la ligne 8
        df = pd.read_excel(file_path, skiprows=7)

        # Afficher les colonnes actuelles pour vérifier la structure
        logging.debug(f"Colonnes avant nettoyage : {df.columns.tolist()}")

        # Extraction des colonnes B, E, G, I, K avec les lignes spécifiques
        extracted_data = pd.DataFrame()

        # Extraire les colonnes une à une
        extracted_data['Poids jusqu\'à'] = df.iloc[2:35, 1]
        extracted_data['sans signature'] = df.iloc[2:35, 4]
        extracted_data['avec signature'] = df.iloc[2:35, 6]
        extracted_data['en boîte aux lettres'] = df.iloc[2:35, 8]
        extracted_data['à La Poste en consigne'] = df.iloc[2:35, 10]

        # Supprimer les lignes vides
        extracted_data.dropna(how='all', inplace=True)

        logging.debug(f"Les données extraites sont : {extracted_data}")


        extracted_data.rename(columns={
        'Poids jusqu\'à': 'Tranche de poids 2 (kg)',
        'sans signature': '6A',
        'avec signature': '6C',
        'en boîte aux lettres': '6M',
        'à La Poste en consigne': '6H'
        }, inplace=True)

        logging.debug(f"Colonnes après renommage : {extracted_data.columns.tolist()}")

        # Définir le chemin du fichier de sortie
        temp_output_file_path = os.path.join(UPLOAD_FOLDER, 'extracted_tarifs.xlsx')

        # Écrire les données extraites dans une feuille Excel temporaire
        with pd.ExcelWriter(temp_output_file_path, engine='xlsxwriter') as writer:
            extracted_data.to_excel(writer, sheet_name='Tarifs_Extraits', index=False)

        logging.debug(f"Les colonnes spécifiées ont été extraites et sauvegardées dans {temp_output_file_path}")

        # Maintenant, ouvrir le fichier existant "grouped_BACARDI CPTE 986737.xlsx"
        grouped_file_path = os.path.join(UPLOAD_FOLDER, 'grouped_BACARDI CPTE 986737.xlsx')

            # Lire le fichier existant
        with pd.ExcelWriter(grouped_file_path, engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
            # Charger les données de la feuille temporaire dans le fichier existant
            extracted_data.to_excel(writer, sheet_name='Tarifs_Extraits', index=False)

        logging.debug(f"Les données ont été ajoutées à {grouped_file_path} dans une nouvelle feuille 'Tarifs_Extraits'")

        # Ouvrir le fichier Excel pour la répartition des colonnes
        extracted_file_path = os.path.join(UPLOAD_FOLDER, 'grouped_BACARDI CPTE 986737.xlsx')
        df = pd.read_excel(extracted_file_path, sheet_name='Tarifs_Extraits')

        df['Tranche de poids 2 (kg)'] = df['Tranche de poids 2 (kg)'].astype(str).str.replace(' kg', '', regex=False)
        df['Tranche de poids 2 (kg)'] = df['Tranche de poids 2 (kg)'].str.replace(r'[^0-9.,]', '', regex=True)
        df['Tranche de poids 2 (kg)'] = df['Tranche de poids 2 (kg)'].str.replace(',', '.')
        df['Tranche de poids 2 (kg)'] = pd.to_numeric(df['Tranche de poids 2 (kg)'], errors='coerce')

        # Extraire la colonne "Tranche de poids (kg)"
        colonne_poid_ref = df[['Tranche de poids 2 (kg)']]

        # Charger le fichier Excel avec openpyxl pour modifier les feuilles existantes
        book = load_workbook(extracted_file_path)

        # Utiliser pd.ExcelWriter avec l'option 'openpyxl' pour conserver les feuilles existantes
        with pd.ExcelWriter(extracted_file_path, engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
            services_mapping = [
                "5W", "5X", "5Y", "6A", "6C", "6G", "6H", "6M", "6Q", "6R", "6W",
                "7Q", "7R", "8G", "8K", "8L", "8N", "8P", "8Q", "8R", "8U", "8V",
                "9L", "9V", "9W"
            ]

            for number in services_mapping: 
                sheet_name = f'{number}_AO'
                try:
                    # Lire la feuille existante
                    df_destination = pd.read_excel(extracted_file_path, sheet_name=sheet_name)
                    
                    # Ajouter la colonne "Tranche de poids (kg)" à la feuille
                    df_combined = pd.concat([df_destination, colonne_poid_ref], axis=1)
                    
                    # Vérifier si une colonne portant le nom du numéro de service (par exemple, '6A') existe dans la feuille 'Tarifs_Extraits'
                    if number in df.columns:
                        colonne_service = df[[number]]
                        df_combined = pd.concat([df_combined, colonne_service], axis=1)



                        extracted_data.rename(columns={
                        'Tranche de poids (kg)': 'Tranche de poids (kg)',
                        "Qté d'envois": "Qté d'envois",
                        'Coût unitaire': 'Coût unitaire',
                        'Total': 'Total',
                        'Tranche de poids 2 (kg)': 'Tranche de poids 2 (kg)',
                        '6C': 'Nouveau prix'
                        }, inplace=True)

                    
                    # Sauvegarder la feuille modifiée dans le fichier
                    df_combined.to_excel(writer, sheet_name=sheet_name, index=False)

                except ValueError:
                    # Si la feuille n'existe pas, on le signale et on continue
                    print(f"La feuille {sheet_name} n'existe pas dans le fichier.")
                except Exception as e:
                    print(f"Erreur inattendue lors du traitement de la feuille {sheet_name} : {e}")


        logging.debug(f"Colonnes réparties et ajoutées aux feuilles spécifiques dans {extracted_file_path}")

        return jsonify({"message": "Extraction réussie et ajoutée au fichier existant", "file_path": grouped_file_path}), 200

    except Exception as e:
        logging.error(f"Erreur lors du traitement du fichier : {e}")
        return jsonify({"message": "Erreur lors du traitement du fichier"}), 500


if __name__ == '__main__':
    app.run(debug=True)