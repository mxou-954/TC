import logging
import os
import pandas as pd
from openpyxl import load_workbook

# Chemin du fichier Excel
file_path = "test.xlsx"

try:
    # Charger le fichier Excel
    df = pd.read_excel(file_path)

    # Création d'une copie des colonnes 'Tranche de poids 2 (kg)' et '6A'
    tranchePoids2 = df['Tranche de poids 2 (kg)'].copy()
    number = df['6A'].copy()

    # Création d'un masque pour identifier les valeurs de 'Tranche de poids 2 (kg)' présentes dans 'Tranche de poids (kg)'
    mask = tranchePoids2.isin(df['Tranche de poids (kg)'])

    # Appliquer le masque aux colonnes 'Tranche de poids 2 (kg)' et '6A'
    tranchePoids2.loc[~mask] = pd.NA  # Remplacer par des valeurs manquantes là où il n'y a pas de correspondance
    number.loc[~mask] = pd.NA

    # Supprimer les lignes où 'Tranche de poids 2 (kg)' ou '6A' contiennent des NaN
    tranchePoids2.dropna(inplace=True)
    number.dropna(inplace=True)

    # Remettre les colonnes modifiées dans le DataFrame original
    df['Tranche de poids 2 (kg)'] = tranchePoids2
    df['6A'] = number

    # Afficher les lignes modifiées pour débogage
    result = df[['Tranche de poids (kg)', 'Tranche de poids 2 (kg)', '6A']]
    print(result)

    # Sauvegarder les modifications dans le fichier Excel existant
    with pd.ExcelWriter(file_path, engine='openpyxl', mode='a', if_sheet_exists='replace') as writer:
        df.to_excel(writer, sheet_name="Filtered_TranchePoids", index=False)

    print({"status": "success", "message": "Fichier Excel traité et sauvegardé avec succès."})

    # Étape 1 : Copier les colonnes parfaites vers un autre sheet
    df_perfect = df[['Tranche de poids (kg)', "Qté d'envois", 'Coût unitaire', 'Total']].copy()

    # Sauvegarder ces colonnes parfaites dans un autre sheet sans écraser les colonnes
    with pd.ExcelWriter(file_path, engine='openpyxl', mode='a', if_sheet_exists='overlay') as writer:
        df_perfect.to_excel(writer, sheet_name="Perfect_Columns", index=False)

    print({"status": "success", "message": "Colonnes parfaites copiées dans un autre sheet."})

    # Étape 2 : Renommer les colonnes 'Tranche de poids 2 (kg)' et '6A'
    df.rename(columns={'Tranche de poids 2 (kg)': 'TP new', '6A': 'new price'}, inplace=True)

    # Supprimer les NaN dans les colonnes renommées
    df_cleaned = df[['TP new', 'new price']].dropna()

    # Étape 3 : Copier les colonnes renommées sans NaN dans le même sheet où les autres colonnes ont été sauvegardées
    with pd.ExcelWriter(file_path, engine='openpyxl', mode='a', if_sheet_exists='overlay') as writer:
        df_cleaned.to_excel(writer, sheet_name="Perfect_Columns", startcol=len(df_perfect.columns), index=False)

    print({"status": "success", "message": "Colonnes renommées et sans NaN copiées avec succès."})

except Exception as e:
    logging.error(f"Erreur lors du traitement du fichier Excel : {e}")
    print({"status": "error", "message": f"Erreur lors du traitement : {str(e)}"})
