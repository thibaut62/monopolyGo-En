// Variables globales
let currentAlbum;
let setList;
let searchInput;
let exportButton;
let importButton;
let shareButton;
let themeToggle;
let allFilterBtn;
let missingFilterBtn;
let completeFilterBtn;
let statsContainer;
let albumSelector;

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier que la configuration est chargée
    if (typeof monopolyConfig === 'undefined') {
        alert("Erreur: Le fichier de configuration n'a pas été chargé correctement.");
        return;
    }

    // Récupérer les éléments DOM
    setList = document.getElementById('setList');
    searchInput = document.getElementById('searchInput');
    exportButton = document.getElementById('exportButton');
    importButton = document.getElementById('importButton');
    shareButton = document.getElementById('shareButton');
    themeToggle = document.getElementById('themeToggle');
    allFilterBtn = document.getElementById('filterAll');
    missingFilterBtn = document.getElementById('filterMissing');
    completeFilterBtn = document.getElementById('filterComplete');
    statsContainer = document.getElementById('statsContainer');
    albumSelector = document.getElementById('albumSelector');
    
    // Initialiser le sélecteur d'albums
    initAlbumSelector();
    
    // Charger l'album sélectionné
    loadCurrentAlbum();
    
    // Initialiser les écouteurs d'événements
    initEventListeners();
});

// Initialiser le sélecteur d'albums
function initAlbumSelector() {
    // Vider le sélecteur
    albumSelector.innerHTML = '';
    
    // Ajouter les options d'albums
    Object.keys(monopolyConfig.albums).forEach(albumName => {
        const option = document.createElement('option');
        option.value = albumName;
        option.textContent = albumName;
        albumSelector.appendChild(option);
    });
    
    // Charger l'album précédemment sélectionné ou utiliser celui par défaut
    const savedAlbum = localStorage.getItem('selectedAlbum');
    if (savedAlbum && monopolyConfig.albums[savedAlbum]) {
        currentAlbum = savedAlbum;
        albumSelector.value = savedAlbum;
    } else {
        currentAlbum = monopolyConfig.defaultAlbum;
        albumSelector.value = currentAlbum;
    }
    
    // Écouter les changements d'album
    albumSelector.addEventListener('change', () => {
        currentAlbum = albumSelector.value;
        localStorage.setItem('selectedAlbum', currentAlbum);
        loadCurrentAlbum();
    });
}

// Initialiser les écouteurs d'événements
function initEventListeners() {
    searchInput.addEventListener('input', searchCards);
    exportButton.addEventListener('click', exportData);
    importButton.addEventListener('click', importData);
    shareButton.addEventListener('click', shareCollection);
    themeToggle.addEventListener('click', toggleTheme);
    
    // Écouteurs pour les boutons de filtre
    allFilterBtn.addEventListener('click', () => filterSets('all'));
    missingFilterBtn.addEventListener('click', () => filterSets('missing'));
    completeFilterBtn.addEventListener('click', () => filterSets('complete'));
    
    // Vérifier si le mode sombre est activé
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '☀️';
    } else {
        themeToggle.innerHTML = '🌙';
    }
    
    // Configurer l'autosave
    setupAutosave();
}

// Charger l'album actuellement sélectionné
function loadCurrentAlbum() {
    if (monopolyConfig.albums[currentAlbum]) {
        displayAllSets();
        loadFromLocalStorage();
        updateSetCompletion();
        updateStats();
    } else {
        // Si l'album n'existe pas, utiliser celui par défaut
        currentAlbum = monopolyConfig.defaultAlbum;
        albumSelector.value = currentAlbum;
        loadCurrentAlbum();
    }
}

// Fonction pour obtenir les sets de l'album actuel
function getSetNames() {
    return monopolyConfig.albums[currentAlbum].sets;
}

// Fonction pour obtenir les cartes de l'album actuel
function getAllCards() {
    return monopolyConfig.albums[currentAlbum].cards;
}

// Fonction pour afficher tous les sets
function displayAllSets() {
    setList.innerHTML = ''; // Vider la liste
    
    const setNames = getSetNames();
    const allCards = getAllCards();
    
    setNames.forEach((setName, setIndex) => {
        const set = document.createElement('div');
        set.className = 'set';
        set.dataset.setIndex = setIndex;
        
        const cardNames = allCards[setIndex];
        const cardsHtml = [];
        
        if (cardNames) {
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
        }
        
        set.innerHTML = `
            <h2>
                ${setName}
                <span class="completion-badge">0/${cardNames ? cardNames.length : 0}</span>
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

// Le reste des fonctions reste identique, vous n'avez plus qu'à remplacer
// toutes les références directes aux tableaux setNames et allCards par
// les appels aux fonctions getSetNames() et getAllCards()

// Fonction pour basculer entre les thèmes clair et sombre
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Mettre à jour l'icône du bouton
    themeToggle.innerHTML = isDarkMode ? '☀️' : '🌙';
}

// Fonction pour configurer l'autosave
function setupAutosave() {
    // Récupérer l'intervalle depuis la configuration
    const interval = monopolyConfig.appConfig.autosaveInterval || 30000;
    
    // Sauvegarder les données selon l'intervalle configuré
    setInterval(saveToLocalStorage, interval);
}
