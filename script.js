// Éléments DOM
const setList = document.getElementById('setList');
const searchInput = document.getElementById('searchInput');
const exportButton = document.getElementById('exportButton');
const importButton = document.getElementById('importButton');
const shareButton = document.getElementById('shareButton');
const themeToggle = document.getElementById('themeToggle');
const allFilterBtn = document.getElementById('filterAll');
const missingFilterBtn = document.getElementById('filterMissing');
const completeFilterBtn = document.getElementById('filterComplete');
const statsContainer = document.getElementById('statsContainer');

// Données des sets et cartes
const setNames = [
    "Parcours d'une Star", "Cowboy Magnay", "Contes de la Cabane", "Temps des Jukebox",
    "Détective M", "Chroniques d'Oiseaux", "Saut dans le temps", "Pays des Rêves",
    "Jeux Macabres", "Étoile Montante", "Légendes des Océan", "Histoires de Fantômes",
    "Ascension de Wall Street", "Amour Canin", "Contes Steampunk", "Nom de Code M",
    "Odysée dans la Jungle", "Esprit Synthé"
];

const allCards = [
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
];

// Fonction pour afficher tous les sets
function displayAllSets() {
    setList.innerHTML = ''; // Vider la liste
    
    setNames.forEach((setName, setIndex) => {
        const set = document.createElement('div');
        set.className = 'set';
        set.dataset.setIndex = setIndex;
        
        const cardNames = allCards[setIndex];
        const cardsHtml = [];
        
        cardNames.forEach(cardName => {
            cardsHtml.push(`
                <div class="card" data-card-name="${cardName.toLowerCase()}">
                    <label>
                        <input type="checkbox" class="card-checkbox" id="${cardName}" data-card-name="${cardName}">
                        <span>${cardName}</span>
                    </label>
                    <input type="number" value="0" min="0" class="card-count">
                </div>
            `);
        });
        
        set.innerHTML = `
            <h2>
                ${setName}
                <span class="completion-badge">0/9</span>
            </h2>
            <div class="set-progress">
                <div class="progress-bar" style="width: 0%"></div>
            </div>
            ${cardsHtml.join('')}
        `;
        
        setList.appendChild(set);
    });
    
    // Ajouter des événements aux cases à cocher et compteurs
    document.querySelectorAll('.card-checkbox, .card-count').forEach(input => {
        input.addEventListener('change', () => {
            updateSetCompletion();
            updateStats();
            saveToLocalStorage();
        });
    });
}

// Fonction pour mettre à jour l'état de complétion des sets
function updateSetCompletion() {
    document.querySelectorAll('.set').forEach(set => {
        const checkboxes = set.querySelectorAll('.card-checkbox');
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        const totalCount = checkboxes.length;
        const completionBadge = set.querySelector('.completion-badge');
        const progressBar = set.querySelector('.progress-bar');
        
        // Mettre à jour le badge et la barre de progression
        completionBadge.textContent = `${checkedCount}/${totalCount}`;
        progressBar.style.width = `${(checkedCount / totalCount) * 100}%`;
        
        // Appliquer la classe "complete" si toutes les cartes sont cochées
        if (checkedCount === totalCount) {
            set.classList.add('complete');
        } else {
            set.classList.remove('complete');
        }
    });
}

// Fonction pour mettre à jour les statistiques
function updateStats() {
    const totalSets = setNames.length;
    const totalCards = allCards.flat().length;
    
    let collectedCards = 0;
    let completeSets = 0;
    let totalCardCount = 0;
    
    document.querySelectorAll('.set').forEach(set => {
        const checkboxes = set.querySelectorAll('.card-checkbox');
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        
        if (checkedCount === checkboxes.length) {
            completeSets++;
        }
        
        collectedCards += checkedCount;
        
        // Compter le nombre total de cartes (en tenant compte des quantités)
        set.querySelectorAll('.card-count').forEach(countInput => {
            totalCardCount += parseInt(countInput.value) || 0;
        });
    });
    
    // Mettre à jour le conteneur de statistiques
    statsContainer.innerHTML = `
        <div class="stats-container">
            <div class="stat-item">
                <div class="stat-value">${collectedCards}/${totalCards}</div>
                <div class="stat-label">Cartes collectées</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${completeSets}/${totalSets}</div>
                <div class="stat-label">Sets complets</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${Math.round((collectedCards / totalCards) * 100)}%</div>
                <div class="stat-label">Complétion</div>
            </div>
            <div class="stat-item">
                <div class="stat-value">${totalCardCount}</div>
                <div class="stat-label">Total de cartes</div>
            </div>
        </div>
    `;
}

// Fonction de recherche de cartes
function searchCards() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        // Afficher tous les sets et cartes si le champ de recherche est vide
        document.querySelectorAll('.set, .card').forEach(element => {
            element.style.display = '';
        });
        return;
    }
    
    document.querySelectorAll('.set').forEach(set => {
        const setName = set.querySelector('h2').textContent.toLowerCase();
        const cards = set.querySelectorAll('.card');
        let hasVisibleCard = false;
        
        cards.forEach(card => {
            const cardName = card.dataset.cardName;
            if (cardName.includes(searchTerm)) {
                card.style.display = '';
                hasVisibleCard = true;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Afficher le set uniquement s'il contient des cartes correspondantes ou si son nom correspond
        if (hasVisibleCard || setName.includes(searchTerm)) {
            set.style.display = '';
        } else {
            set.style.display = 'none';
        }
    });
}

// Fonction pour filtrer les sets
function filterSets(filterType) {
    // Mettre à jour les boutons de filtre
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    let filterBtn;
    switch (filterType) {
        case 'missing':
            filterBtn = missingFilterBtn;
            break;
        case 'complete':
            filterBtn = completeFilterBtn;
            break;
        default:
            filterBtn = allFilterBtn;
            break;
    }
    
    filterBtn.classList.add('active');
    
    // Appliquer le filtre
    document.querySelectorAll('.set').forEach(set => {
        const isComplete = set.classList.contains('complete');
        
        switch (filterType) {
            case 'missing':
                set.style.display = isComplete ? 'none' : '';
                break;
            case 'complete':
                set.style.display = isComplete ? '' : 'none';
                break;
            default:
                set.style.display = '';
                break;
        }
    });
}

// Fonction pour sauvegarder les données dans localStorage
function saveToLocalStorage() {
    const data = {};
    
    setNames.forEach((setName, setIndex) => {
        const cards = [];
        const cardElements = document.querySelectorAll(`.set[data-set-index="${setIndex}"] .card`);
        
        cardElements.forEach(cardElement => {
            const checkbox = cardElement.querySelector('.card-checkbox');
            const numberInput = cardElement.querySelector('.card-count');
            
            cards.push({
                name: checkbox.dataset.cardName,
                checked: checkbox.checked,
                count: numberInput.value
            });
        });
        
        data[setName] = cards;
    });
    
    localStorage.setItem('monopolyGoData', JSON.stringify(data));
}

// Fonction pour charger les données depuis localStorage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('monopolyGoData');
    
    if (savedData) {
        const data = JSON.parse(savedData);
        
        setNames.forEach((setName, setIndex) => {
            if (data[setName]) {
                const cards = data[setName];
                const cardElements = document.querySelectorAll(`.set[data-set-index="${setIndex}"] .card`);
                
                cardElements.forEach((cardElement, index) => {
                    if (cards[index]) {
                        const checkbox = cardElement.querySelector('.card-checkbox');
                        const numberInput = cardElement.querySelector('.card-count');
                        
                        checkbox.checked = cards[index].checked;
                        numberInput.value = cards[index].count;
                    }
                });
            }
        });
        
        updateSetCompletion();
        updateStats();
    }
}

// Fonction pour exporter les données
function exportData() {
    const data = {};
    
    setNames.forEach((setName, setIndex) => {
        const cards = [];
        const cardElements = document.querySelectorAll(`.set[data-set-index="${setIndex}"] .card`);
        
        cardElements.forEach(cardElement => {
            const checkbox = cardElement.querySelector('.card-checkbox');
            const numberInput = cardElement.querySelector('.card-count');
            
            cards.push({
                name: checkbox.dataset.cardName,
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
    a.download = 'monopoly_go_collection.json';
    a.click();
}

// Fonction pour importer les données
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    
    input.addEventListener('change', event => {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = event => {
            try {
                const data = JSON.parse(event.target.result);
                
                setNames.forEach((setName, setIndex) => {
                    if (data[setName]) {
                        const cards = data[setName];
                        const cardElements = document.querySelectorAll(`.set[data-set-index="${setIndex}"] .card`);
                        
                        cardElements.forEach((cardElement, index) => {
                            if (cards[index]) {
                                const checkbox = cardElement.querySelector('.card-checkbox');
                                const numberInput = cardElement.querySelector('.card-count');
                                
                                checkbox.checked = cards[index].checked;
                                numberInput.value = cards[index].count;
                            }
                        });
                    }
                });
                
                updateSetCompletion();
                updateStats();
                saveToLocalStorage();
                
                alert('Importation réussie !');
            } catch (error) {
                alert('Erreur lors de l\'importation : ' + error.message);
            }
        };
        
        reader.readAsText(file);
    });
    
    input.click();
}

// Fonction pour basculer entre les thèmes clair et sombre
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Mettre à jour l'icône du bouton
    themeToggle.innerHTML = isDarkMode ? '☀️' : '🌙';
}

// Fonction pour générer un QR code pour le partage
function shareCollection() {
    const data = {};
    
    setNames.forEach((setName, setIndex) => {
        const cards = [];
        const cardElements = document.querySelectorAll(`.set[data-set-index="${setIndex}"] .card`);
        
        cardElements.forEach(cardElement => {
            const checkbox = cardElement.querySelector('.card-checkbox');
            
            if (checkbox.checked) {
                cards.push(checkbox.dataset.cardName);
            }
        });
        
        if (cards.length > 0) {
            data[setName] = cards;
        }
    });
    
    const jsonData = JSON.stringify(data);
    const encodedData = encodeURIComponent(jsonData);
    const shareUrl = `https://monopolygo.collectcard.app/share?data=${encodedData}`;
    
    // Créer un élément modal pour afficher le QR code
    const qrContainer = document.createElement('div');
    qrContainer.className = 'qr-container';
    
    qrContainer.innerHTML = `
        <div class="qr-modal">
            <button class="qr-close">&times;</button>
            <h3>Partagez votre collection</h3>
            <div class="qr-code" id="qrcode"></div>
            <p>Scannez ce QR code ou copiez le lien ci-dessous :</p>
            <div class="qr-link">
                <input type="text" value="${shareUrl}" readonly onclick="this.select();">
                <button class="btn btn-outline" id="copyLinkBtn">Copier</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(qrContainer);
    
    // Créer le QR code (utilisation d'une fonction simulée car les bibliothèques QR ne sont pas incluses)
    document.getElementById('qrcode').innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareUrl)}" alt="QR Code">`;
    
    // Gérer la fermeture du modal
    document.querySelector('.qr-close').addEventListener('click', () => {
        document.body.removeChild(qrContainer);
    });
    
    // Gérer le bouton de copie du lien
    document.getElementById('copyLinkBtn').addEventListener('click', () => {
        const linkInput = qrContainer.querySelector('input');
        linkInput.select();
        document.execCommand('copy');
        document.getElementById('copyLinkBtn').textContent = 'Copié !';
        setTimeout(() => {
            document.getElementById('copyLinkBtn').textContent = 'Copier';
        }, 2000);
    });
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    // Afficher tous les sets
    displayAllSets();
    
    // Charger les données depuis localStorage
    loadFromLocalStorage();
    
    // Initialiser les statistiques
    updateStats();
    
// Vérifier si le mode sombre est activé
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '☀️';
    } else {
        themeToggle.innerHTML = '🌙';
    }
    
    // Ajouter des écouteurs d'événements
    searchInput.addEventListener('input', searchCards);
    exportButton.addEventListener('click', exportData);
    importButton.addEventListener('click', importData);
    shareButton.addEventListener('click', shareCollection);
    themeToggle.addEventListener('click', toggleTheme);
    
    // Écouteurs pour les boutons de filtre
    allFilterBtn.addEventListener('click', () => filterSets('all'));
    missingFilterBtn.addEventListener('click', () => filterSets('missing'));
    completeFilterBtn.addEventListener('click', () => filterSets('complete'));
    
    // Notification pour les sets complétés
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                // Vérifier si le set vient d'être complété
                if (target.classList.contains('complete') && !target.dataset.wasComplete) {
                    target.dataset.wasComplete = true;
                    const setName = target.querySelector('h2').textContent.trim().split('\n')[0].trim();
                    showNotification(`Félicitations ! Le set "${setName}" est maintenant complet !`);
                } else if (!target.classList.contains('complete')) {
                    target.dataset.wasComplete = false;
                }
            }
        });
    });
    
    // Observer tous les sets pour détecter quand ils sont complétés
    document.querySelectorAll('.set').forEach(set => {
        observer.observe(set, { attributes: true });
    });
});

// Fonction pour afficher une notification
function showNotification(message) {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">🎉</span>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Ajouter la notification au document
    document.body.appendChild(notification);
    
    // Ajouter une classe pour l'animation d'entrée
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Fermer la notification au clic
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    });
    
    // Auto-fermeture après 5 secondes
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

// Fonction pour créer un QR code (version simplifiée)
function generateQRCode(data, elementId) {
    // Cette fonction est simplement un placeholder
    // Dans une véritable implémentation, vous utiliseriez une bibliothèque comme qrcode.js
    const element = document.getElementById(elementId);
    element.innerHTML = `<img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}" alt="QR Code">`;
}

// Fonction pour obtenir des statistiques détaillées
function getDetailedStats() {
    const stats = {
        totalSets: setNames.length,
        totalCards: allCards.flat().length,
        collectedCards: 0,
        completeSets: 0,
        completionPercentage: 0,
        totalCardCount: 0,
        rareCardsCollected: 0,
        averageCardsPerSet: 0,
        setsStats: []
    };
    
    // Calculer les statistiques pour chaque set
    setNames.forEach((setName, setIndex) => {
        const setElement = document.querySelector(`.set[data-set-index="${setIndex}"]`);
        const checkboxes = setElement.querySelectorAll('.card-checkbox');
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        const totalCount = checkboxes.length;
        let setCardCount = 0;
        
        // Compter le nombre total de cartes dans le set
        setElement.querySelectorAll('.card-count').forEach(countInput => {
            setCardCount += parseInt(countInput.value) || 0;
        });
        
        // Ajouter les statistiques du set
        stats.setsStats.push({
            name: setName,
            total: totalCount,
            collected: checkedCount,
            percentage: Math.round((checkedCount / totalCount) * 100),
            cardCount: setCardCount,
            isComplete: checkedCount === totalCount
        });
        
        // Mettre à jour les statistiques globales
        stats.collectedCards += checkedCount;
        if (checkedCount === totalCount) {
            stats.completeSets++;
        }
        stats.totalCardCount += setCardCount;
    });
    
    // Calculer les pourcentages et moyennes
    stats.completionPercentage = Math.round((stats.collectedCards / stats.totalCards) * 100);
    stats.averageCardsPerSet = Math.round(stats.totalCardCount / stats.totalSets);
    
    return stats;
}

// Fonction pour afficher les statistiques détaillées
function showDetailedStats() {
    const stats = getDetailedStats();
    
    // Créer le modal des statistiques
    const statsModal = document.createElement('div');
    statsModal.className = 'qr-container';
    
    // Créer le contenu HTML pour les statistiques
    let statsHtml = `
        <div class="qr-modal stats-modal">
            <button class="qr-close">&times;</button>
            <h3>Statistiques détaillées</h3>
            <div class="detailed-stats">
                <div class="stats-row">
                    <div class="stat-box">
                        <h4>Progression globale</h4>
                        <div class="stat-value">${stats.collectedCards}/${stats.totalCards}</div>
                        <div class="stat-progress">
                            <div class="stat-progress-bar" style="width: ${stats.completionPercentage}%;"></div>
                        </div>
                        <div class="stat-label">${stats.completionPercentage}% des cartes collectées</div>
                    </div>
                    <div class="stat-box">
                        <h4>Sets complets</h4>
                        <div class="stat-value">${stats.completeSets}/${stats.totalSets}</div>
                        <div class="stat-progress">
                            <div class="stat-progress-bar" style="width: ${Math.round((stats.completeSets / stats.totalSets) * 100)}%;"></div>
                        </div>
                        <div class="stat-label">${Math.round((stats.completeSets / stats.totalSets) * 100)}% des sets complétés</div>
                    </div>
                </div>
                <div class="stats-row">
                    <div class="stat-box">
                        <h4>Total de cartes</h4>
                        <div class="stat-value">${stats.totalCardCount}</div>
                        <div class="stat-label">Cartes en collection</div>
                    </div>
                    <div class="stat-box">
                        <h4>Moyenne par set</h4>
                        <div class="stat-value">${stats.averageCardsPerSet}</div>
                        <div class="stat-label">Cartes par set</div>
                    </div>
                </div>
                <h4>Progression par set</h4>
                <div class="sets-progress">
    `;
    
    // Ajouter les statistiques pour chaque set
    stats.setsStats.forEach(setStats => {
        statsHtml += `
            <div class="set-stat">
                <div class="set-stat-header">
                    <span class="set-stat-name">${setStats.name}</span>
                    <span class="set-stat-count">${setStats.collected}/${setStats.total}</span>
                </div>
                <div class="set-stat-progress">
                    <div class="set-stat-progress-bar ${setStats.isComplete ? 'complete' : ''}" style="width: ${setStats.percentage}%;"></div>
                </div>
            </div>
        `;
    });
    
    statsHtml += `
                </div>
            </div>
        </div>
    `;
    
    statsModal.innerHTML = statsHtml;
    
    // Ajouter le modal au document
    document.body.appendChild(statsModal);
    
    // Gérer la fermeture du modal
    statsModal.querySelector('.qr-close').addEventListener('click', () => {
        document.body.removeChild(statsModal);
    });
}

// Fonction pour exporter les données au format CSV
function exportToCsv() {
    // Préparer les en-têtes
    let csvContent = 'Set,Carte,Possédée,Quantité\n';
    
    // Ajouter les données pour chaque set et carte
    setNames.forEach((setName, setIndex) => {
        const cardElements = document.querySelectorAll(`.set[data-set-index="${setIndex}"] .card`);
        
        cardElements.forEach(cardElement => {
            const checkbox = cardElement.querySelector('.card-checkbox');
            const numberInput = cardElement.querySelector('.card-count');
            
            const cardName = checkbox.dataset.cardName;
            const isChecked = checkbox.checked ? 'Oui' : 'Non';
            const count = numberInput.value;
            
            csvContent += `"${setName}","${cardName}",${isChecked},${count}\n`;
        });
    });
    
    // Créer un blob et télécharger le fichier
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'monopoly_go_collection.csv';
    a.click();
}

// Fonction pour mettre à jour automatiquement
function setupAutosave() {
    // Sauvegarder les données toutes les 30 secondes
    setInterval(saveToLocalStorage, 30000);
}

// Appeler la fonction d'autosave lors du chargement
document.addEventListener('DOMContentLoaded', setupAutosave);
