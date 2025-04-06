/**
 * Configuration des albums Monopoly GO
 * Ce fichier contient les définitions des albums et des cartes.
 * Pour ajouter un nouvel album, ajoutez simplement un nouvel objet dans le tableau albums.
 */

const monopolyConfig = {
    // Album actuel par défaut (sera remplacé par celui stocké dans localStorage si disponible)
    defaultAlbum: "Soirée ciné",
    
    // Configuration des albums
    albums: {
        "Soirée ciné": {
            // Noms des sets
            sets: [
                "Parcours d'une Star", "Cowboy Magnay", "Contes de la Cabane", "Temps des Jukebox",
                "Détective M", "Chroniques d'Oiseaux", "Saut dans le temps", "Pays des Rêves",
                "Jeux Macabres", "Étoile Montante", "Légendes des Océan", "Histoires de Fantômes",
                "Ascension de Wall Street", "Amour Canin", "Contes Steampunk", "Nom de Code M",
                "Odysée dans la Jungle", "Esprit Synthé"
            ],
            
            // Cartes de chaque set (dans le même ordre que les sets)
            cards: [
                ["Rêveuse", "Objectifs de gloire", "As de l'audition", "Le grand tournant", "Premier rôle", "La clé du succès", "Pouvoir de star", "La récompense", "Avis élogieux"],
                ["Ville de province", "L'étranger", "As du stylo", "Avis de recherche", "En mission", "La sieste de midi", "Objet trouvé", "Au crépuscule", "Ballade western"],
                ["La cabane", "Équipe curieuse", "Voleuse !", "Course sur la lune", "Chasse infernale", "Prise au piège !", "Quête terminée", "Rires sans fin", "Petits Magnats"],
                ["Ambiance univ", "Virée joyeuse", "Arrêt soda", "Bebop Ben", "Méga milk-shake", "Miss Twist", "Danse Rock'n'roll", "Rêves de drive-in", "Sourires éternels"],
                ["Studios Monopoly", "Étude du scénario", "Silence, ça tourne !", "Meilleur profil", "Costume de limier", "Version finale", "Première", "Mystère en cours", "Meurtres à l'écran"],
                ["Installation", "Ornithologie", "Formation", "Oeufs du nid", "Pose timide", "Visionnage", "Jolie surprise", "Alerte, oiseaux !", "Vol à plumes"],
                ["C'est l'heure", "Continuum", "Préhistoire", "Roi préhistorique", "En panne", "Courbe de maîtrise", "Vroum !", "Travail bien fait", "Collision du temps"],
                ["Miroir magique", "Chute fantastique", "Lyre lyrique", "Pas sommeil", "Dragon dés", "Château volant", "Capturé", "Sauvetage", "Oser rêver"],
                ["Spectre effrayant", "Cabane confo", "Placard étrange", "Le préféré", "Allez-y… au pas", "Invité spécial", "Menaçant", "Partie terrifiante", "Bois étranges"],
                ["Jouer ou perdre", "Potentiel", "Viser les étoiles", "Chaussures de danse", "Sur les planches", "Sous les projos", "M comme miracle", "Standing Ovation", "Vers le succès"],
                ["Miss Captain", "Perchoir endormi", "Mers déchaînées", "Naufragés", "Terre en vue", "Repères humides", "La porte du crâne", "Paie des pirates", "Petits aventuriers"],
                ["Il y quelqu'un ?", "Hanté !", "Je t'ai eu !", "Véritable terreur", "Téléporté !", "Invité d'honneur", "Gala fantomatique", "Bonne apparition", "Manoir macabre"],
                ["Vers le sommet", "Marché affolé", "Trader", "Pause café", "Jeu de pouvoir", "En affaires", "Geste de patron", "Mentors financiers", "Inspiré par"],
                ["Coup de foudre", "Adorable rencard", "Milk-Date", "Jeux d'eau", "Pour la vie", "Tendres pattes", "Coeurs séparés", "Colline du chagrin", "Histoires de chiens"],
                ["Autoroute du ciel", "Virée stylée", "Arrivée", "Tellement rétro", "Machine rutilante", "Levier", "Brillant", "Phare", "Steam City"],
                ["QG du Magnat", "Glace et Combi", "Tenue ignifuge", "Duc volant", "Scottie surveille", "Alerte rouge", "L'équipe M", "On s'envole", "Mini agent"],
                ["Temple perdu", "Atterrissage", "Camp de base", "Mystère minier", "Ami toucan", "Pont périlleux", "La porte vers l'or", "Route au trésor", "Amour sauvage"],
                ["Nexus numérique", "Esprit synchro", "Numérisée", "Nouveau look", "Rouge au bleu", "Les doubles", "Accès autorisé", "Protocole de câlin", "Tintception"]
            ]
        },
        
        // Exemple pour le prochain album (à compléter lorsqu'il sera disponible)
        "Album 2026": {
            sets: ["Nouvel Set 1", "Nouvel Set 2", "Nouvel Set 3"],
            cards: [
                ["Carte A1", "Carte A2", "Carte A3"],
                ["Carte B1", "Carte B2", "Carte B3"],
                ["Carte C1", "Carte C2", "Carte C3"]
            ]
        }
    },
    
    // Configuration de l'application
    appConfig: {
        version: "2.0",
        autosaveInterval: 30000, // Sauvegarde automatique toutes les 30 secondes
        maxDisplayedSets: 10,    // Nombre maximum de sets à afficher par page
    }
};
