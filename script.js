const setList = document.getElementById('setList');
const exportButton = document.getElementById('exportButton');
const importButton = document.getElementById('importButton');

const setNames = [
    "Parcours d’une Star", "Cowboy Magnay", "Contes de la Cabane", "Temps des Jukebox",
    "Détective M", "Chroniques d’Oiseaux", "Saut dans le temps", "Pays des Rêves",
    "Jeux Macabres", "Étoile Montante", "Légendes des Océan", "Histoires de Fantômes",
    "Ascension de Wall Street", "Amour Canin", "Contes Steampunk", "Nom de Code M",
    "Odysée dans la Jungle", "Esprit Synthé"
];

const allCards = [
    ["Rêveuse", "Objectifs de gloire", "As de l’audition", "Le grand tournant", "Premier rôle", "La clé du succès", "Pouvoir de star", "La récompense", "Avis élogieux"],
    ["Ville de province", "L’étranger", "As du stylo", "Avis de recherche", "En mission", "La sieste de midi", "Objet trouvé", "Au crépuscule", "Ballade western"],
    ["La cabane", "Équipe curieuse", "Voleuse !", "Course sur la lune", "Chasse infernale", "Prise au piège !", "Quête terminée", "Rires sans fin", "Petits Magnats"],
    ["Ambiance univ", "Virée joyeuse", "Arrêt soda", "Bebop Ben", "Méga milk-shake", "Miss Twist", "Danse Rock’n’roll", "Rêves de drive-in", "Sourires éternels"],
    ["Studios Monopoly", "Étude du scénario", "Silence, ça tourne !", "Meilleur profil", "Costume de limier", "Version finale", "Première", "Mystère en cours", "Meurtres à l’écran"],
    ["Installation", "Ornithologie", "Formation", "Oeufs du nid", "Pose timide", "Visionnage", "Jolie surprise", "Alerte, oiseaux !", "Vol à plumes"],
    ["C’est l’heure", "Continuum", "Préhistoire", "Roi préhistorique", "En panne", "Courbe de maîtrise", "Vroum !", "Travail bien fait", "Collision du temps"],
    ["Miroir magique", "Chute fantastique", "Lyre lyrique", "Pas sommeil", "Dragon dés", "Château volant", "Capturé", "Sauvetage", "Oser rêver"],
    ["Spectre effrayant", "Cabane confo", "Placard étrange", "Le préféré", "Allez-y… au pas", "Invité spécial", "Menaçant", "Partie terrifiante", "Bois étranges"],
    ["Jouer ou perdre", "Potentiel", "Viser les étoiles", "Chaussures de danse", "Sur les planches", "Sous les projos", "M comme miracle", "Standing Ovation", "Vers le succès"],
    ["Miss Captain", "Perchoir endormi", "Mers déchaînées", "Naufragés", "Terre en vue", "Repères humides", "La porte du crâne", "Paie des pirates", "Petits aventuriers"],
    ["Il y quelqu’un ?", "Hanté !", "Je t’ai eu !", "Véritable terreur", "Téléporté !", "Invité d’honneur", "Gala fantomatique", "Bonne apparition", "Manoir macabre"],
    ["Vers le sommet", "Marché affolé", "Trader", "Pause café", "Jeu de pouvoir", "En affaires", "Geste de patron", "Mentors financiers", "Inspiré par"],
    ["Coup de foudre", "Adorable rencard", "Milk-Date", "Jeux d’eau", "Pour la vie", "Tendres pattes", "Coeurs séparés", "Colline du chagrin", "Histoires de chiens"],
    ["Autoroute du ciel", "Virée stylée", "Arrivée", "Tellement rétro", "Machine rutilante", "Levier", "Brillant", "Phare", "Steam City"],
    ["QG du Magnat", "Glace et Combi", "Tenue ignifuge", "Duc volant", "Scottie surveille", "Alerte rouge", "L’équipe M", "On s’envole", "Mini agent"],
    ["Temple perdu", "Atterrissage", "Camp de base", "Mystère minier", "Ami toucan", "Pont périlleux", "La porte vers l’or", "Route au trésor", "Amour sauvage"],
    ["Nexus numérique", "Esprit synchro", "Numérisée", "Nouveau look", "Rouge au bleu", "Les doubles", "Accès autorisé", "Protocole de câlin", "Tintception"]
];

// Afficher tous les sets
function displayAllSets() {
    setNames.forEach((setName, setIndex) => {
        const set = document.createElement('div');
        set.className = 'set';
        set.innerHTML = `<h2>${setName}</h2>`;
        const cardNames = allCards[setIndex];
        cardNames.forEach(cardName => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <input type="checkbox" id="${cardName}">
                <label for="${cardName}">${cardName}</label>
                <input type="number" value="0">
            `;
            set.appendChild(card);
        });
        setList.appendChild(set);
    });
}

// Afficher tous les sets au chargement
displayAllSets();

// Exporter les données au format JSON
exportButton.addEventListener('click', () => {
    const data = {};
    setNames.forEach((setName, setIndex) => {
        const cards = [];
        const cardElements = setList.querySelectorAll(`.set:nth-child(${setIndex + 1}) .card`);
        cardElements.forEach(cardElement => {
            const checkbox = cardElement.querySelector('input[type="checkbox"]');
            const numberInput = cardElement.querySelector('input[type="number"]');
            cards.push({
                name: checkbox.id,
                checked: checkbox.checked,
                count: numberInput.value
            });
        });
        data[setName] = cards;
    });
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'monopoly_go.json';
    a.click();
});

// Importer les données à partir d'un fichier JSON
importButton.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.addEventListener('change', event => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = event => {
            const data = JSON.parse(event.target.result);
            setNames.forEach((setName, setIndex) => {
                if (data[setName]) {
                    const cards = data[setName];
                    const cardElements = setList.querySelectorAll(`.set:nth-child(${setIndex + 1}) .card`);
                    cardElements.forEach((cardElement, index) => {
                        const checkbox = cardElement.querySelector('input[type="checkbox"]');
                        const numberInput = cardElement.querySelector('input[type="number"]');
                        checkbox.checked = cards[index].checked;
                        numberInput.value = cards[index].count;
                    });
                }
            });
        };
        reader.readAsText(file);
    });
    input.click();
});