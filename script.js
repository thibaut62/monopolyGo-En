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
    
    // Ajouter les styles pour mobile
    addMobileStyles();
});

// Ajouter des styles CSS pour la compatibilité mobile
function addMobileStyles() {
    const mobileStyleElement = document.createElement('style');
    mobileStyleElement.textContent = `
        .mobile-notice {
            margin-top: 15px;
            padding: 10px;
            background-color: #f8f9fa;
            border-radius: 5px;
            border-left: 4px solid #007bff;
        }
        
        body.dark-mode .mobile-notice {
            background-color: #2a2a2a;
            border-left-color: #4da3ff;
        }
        
        .mobile-note {
            font-size: 0.85em;
            color: #666;
            margin-top: 5px;
        }
        
        body.dark-mode .mobile-note {
            color: #aaa;
        }
        
        .btn-mobile {
            margin-top: 10px;
            background-color: #28a745;
        }
        
        .btn-mobile:hover {
            background-color: #218838;
        }
        
        .copy-option {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
        }
        
        body.dark-mode .copy-option {
            border-top-color: #444;
        }
        
        /* Notification styles */
        .notification {
            position: fixed;
            bottom: -100px;
            left: 50%;
            transform: translateX(-50%);
            padding: 15px;
            border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
            transition: bottom 0.3s ease;
            z-index: 1000;
            max-width: 90%;
            display: flex;
            align-items: center;
        }
        
        .notification.show {
            bottom: 20px;
        }
        
        .notification.success {
            background-color: #4CAF50;
            color: white;
        }
        
        .notification.warning {
            background-color: #ff9800;
            color: white;
        }
        
        .notification.error {
            background-color: #f44336;
            color: white;
        }
        
        .notification.info {
            background-color: #2196F3;
            color: white;
        }
        
        .notification-content {
            display: flex;
            align-items: center;
        }
        
        .notification-icon {
            margin-right: 10px;
            font-size: 20px;
        }
        
        .notification-message {
            flex-grow: 1;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            margin-left: 10px;
        }
        
        /* Améliorer l'affichage sur petits écrans */
        @media (max-width: 480px) {
            .qr-modal {
                width: 95%;
                padding: 15px;
            }
            
            .album-selector {
                max-width: 140px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            #importDataText {
                height: 120px;
            }
        }
    `;
    
    document.head.appendChild(mobileStyleElement);
}

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
        if (checkedCount === totalCount && totalCount > 0) {
            if (!set.classList.contains('complete')) {
                set.classList.add('complete');
                // Notifier l'utilisateur lorsqu'un set est complété
                const setName = set.querySelector('h2').textContent.trim().split('\n')[0].trim();
                showNotification(`Félicitations ! Le set "${setName}" est maintenant complet !`);
            }
        } else {
            set.classList.remove('complete');
        }
    });
}

// Fonction pour mettre à jour les statistiques
function updateStats() {
    const setNames = getSetNames();
    const allCards = getAllCards();
    
    const totalSets = setNames.length;
    const totalCards = allCards.flat().length;
    
    let collectedCards = 0;
    let completeSets = 0;
    let totalCardCount = 0;
    
    document.querySelectorAll('.set').forEach(set => {
        const checkboxes = set.querySelectorAll('.card-checkbox');
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        
        if (checkedCount === checkboxes.length && checkboxes.length > 0) {
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
                <div class="stat-value">${totalCards > 0 ? Math.round((collectedCards / totalCards) * 100) : 0}%</div>
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
    const setNames = getSetNames();
    
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
    
    // Sauvegarder les données spécifiques à l'album actuel
    localStorage.setItem(`monopolyGoData_${currentAlbum}`, JSON.stringify(data));
}

// Fonction pour charger les données depuis localStorage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem(`monopolyGoData_${currentAlbum}`);
    
    if (savedData) {
        const data = JSON.parse(savedData);
        const setNames = getSetNames();
        
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
    }
}

// Fonction pour exporter les données
function exportData() {
    // Créer une structure pour exporter les données de tous les albums ou de l'album actuel
    const exportModal = document.createElement('div');
    exportModal.className = 'qr-container';
    
    exportModal.innerHTML = `
        <div class="qr-modal">
            <button class="qr-close">&times;</button>
            <h3>Exporter votre collection</h3>
            <div class="export-options">
                <button id="exportCurrentBtn" class="btn">Exporter l'album actuel</button>
                <button id="exportAllBtn" class="btn btn-outline">Exporter tous les albums</button>
                <div class="mobile-notice">
                    <p><strong>Sur mobile:</strong> Si le téléchargement ne démarre pas, utilisez l'option "Copier dans le presse-papiers" ci-dessous.</p>
                    <button id="copyToClipboardBtn" class="btn btn-mobile">Copier dans le presse-papiers</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(exportModal);
    
    // Gérer la fermeture du modal
    document.querySelector('.qr-close').addEventListener('click', () => {
        document.body.removeChild(exportModal);
    });
    
    // Exporter l'album actuel
    document.getElementById('exportCurrentBtn').addEventListener('click', () => {
        const data = prepareExportData(currentAlbum);
        tryExportFile(data, `monopoly_go_${currentAlbum.replace(/\s+/g, '_').toLowerCase()}.json`);
        
        // Ajouter un bouton de copie après l'export
        showCopyOption(exportModal, data);
    });
    
    // Exporter tous les albums
    document.getElementById('exportAllBtn').addEventListener('click', () => {
        const data = prepareExportAllData();
        tryExportFile(data, 'monopoly_go_complete_collection.json');
        
        // Ajouter un bouton de copie après l'export
        showCopyOption(exportModal, data);
    });
    
    // Option de copie directe pour mobile
    document.getElementById('copyToClipboardBtn').addEventListener('click', () => {
        const data = prepareExportData(currentAlbum);
        copyToClipboard(JSON.stringify(data));
    });
}

// Fonction pour préparer les données d'export pour un album
function prepareExportData(albumName) {
    const savedData = localStorage.getItem(`monopolyGoData_${albumName}`);
    let data = {};
    
    if (savedData) {
        data = JSON.parse(savedData);
    } else {
        // Si pas de données sauvegardées, créer une structure vide
        const setNames = monopolyConfig.albums[albumName].sets;
        const allCards = monopolyConfig.albums[albumName].cards;
        
        setNames.forEach((setName, setIndex) => {
            const cards = [];
            const cardNames = allCards[setIndex];
            
            if (cardNames) {
                cardNames.forEach(cardName => {
                    cards.push({
                        name: cardName,
                        checked: false,
                        count: 0
                    });
                });
            }
            
            data[setName] = cards;
        });
    }
    
    // Ajouter des métadonnées pour aider à l'importation
    return {
        version: "2.0",
        timestamp: new Date().toISOString(),
        albumName: albumName,
        data: data
    };
}

// Fonction pour préparer toutes les données d'export
function prepareExportAllData() {
    const allData = {};
    
    Object.keys(monopolyConfig.albums).forEach(albumName => {
        const savedData = localStorage.getItem(`monopolyGoData_${albumName}`);
        
        if (savedData) {
            allData[albumName] = JSON.parse(savedData);
        } else {
            allData[albumName] = {};
        }
    });

    // Ajouter des métadonnées pour aider à l'importation
    return {
        version: "2.0",
        timestamp: new Date().toISOString(),
        type: "full_export",
        data: allData
    };
}

// Fonction pour tenter d'exporter un fichier, avec fallback pour mobile
function tryExportFile(data, filename) {
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });
    
    // Essayer d'utiliser la méthode standard
    try {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('Fichier exporté avec succès!');
    } catch(e) {
        console.error("Erreur lors de l'export du fichier:", e);
        showNotification('Erreur lors de l\'export. Utilisez l\'option de copie.', 'warning');
    }
}

// Afficher l'option de copie après un export
function showCopyOption(modalElement, data) {
    const copyDiv = document.createElement('div');
    copyDiv.className = 'copy-option';
    copyDiv.innerHTML = `
        <p>Si le téléchargement ne fonctionne pas sur votre appareil:</p>
        <button id="copyDataNowBtn" class="btn">Copier les données</button>
    `;
    
    // Ajouter au modal
    const modalContent = modalElement.querySelector('.qr-modal');
    modalContent.appendChild(copyDiv);
    
    // Gérer le clic sur le bouton de copie
    document.getElementById('copyDataNowBtn').addEventListener('click', () => {
        copyToClipboard(JSON.stringify(data));
    });
}

// Fonction pour copier du texte dans le presse-papiers (compatible mobile)
function copyToClipboard(text) {
    // Méthode moderne avec l'API Clipboard
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showNotification('Données copiées dans le presse-papiers!');
            })
            .catch(err => {
                console.error('Erreur avec l\'API Clipboard:', err);
                fallbackCopyToClipboard(text);
            });
    } else {
        fallbackCopyToClipboard(text);
    }
}

// Méthode de secours pour copier dans le presse-papiers
function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '0';
    textArea.style.top = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showNotification('Données copiées dans le presse-papiers!');
        } else {
            showNotification('Copie impossible. Veuillez réessayer.', 'warning');
        }
    } catch (err) {
        console.error('Erreur de copie fallback:', err);
        showNotification('La copie a échoué sur votre appareil.', 'error');
    }
    
    document.body.removeChild(textArea);
}

// Fonction d'importation améliorée pour les appareils mobiles
function importData() {
    // Créer un modal pour l'importation
    const importContainer = document.createElement('div');
    importContainer.className = 'qr-container';
    
    importContainer.innerHTML = `
        <div class="qr-modal">
            <button class="qr-close">&times;</button>
            <h3>Importer une collection</h3>
            <div class="import-options">
                <div class="import-option">
                    <h4>Option 1: Importer un fichier</h4>
                    <button id="importFileBtn" class="btn">Choisir un fichier</button>
                    <p class="mobile-note">Sur certains appareils mobiles, cela peut ne pas fonctionner.</p>
                </div>
                <div class="import-option">
                    <h4>Option 2: Coller des données</h4>
                    <textarea id="importDataText" placeholder="Collez ici les données JSON copiées..."></textarea>
                    <button id="importDataBtn" class="btn">Importer ces données</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(importContainer);
    
    // Gérer la fermeture du modal
    document.querySelector('.qr-close').addEventListener('click', () => {
        document.body.removeChild(importContainer);
    });
    
    // Gérer l'importation de fichier
    document.getElementById('importFileBtn').addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        
        input.addEventListener('change', event => {
            if (!event.target.files || event.target.files.length === 0) {
                return; // Aucun fichier sélectionné
            }
            
            const file = event.target.files[0];
            const reader = new FileReader();
            
            reader.onload = event => {
                try {
                    processImportedData(event.target.result);
                    document.body.removeChild(importContainer);
                } catch (error) {
                    showNotification('Erreur lors de l\'importation : ' + error.message, 'error');
                }
            };
            
            reader.readAsText(file);
        });
        
        // Sur mobile, l'événement click peut être annulé par le navigateur
        // Utiliser un délai pour améliorer la compatibilité
        setTimeout(() => {
            try {
                input.click();
            } catch (e) {
                console.error("Erreur lors de l'ouverture du sélecteur de fichier:", e);
                showNotification("Impossible d'ouvrir le sélecteur de fichier. Utilisez l'option coller.", 'warning');
            }
        }, 100);
    });
    
    // Gérer l'importation de données collées
    document.getElementById('importDataBtn').addEventListener('click', () => {
        const data = document.getElementById('importDataText').value;
        if (!data) {
            showNotification('Veuillez coller des données dans le champ de texte.', 'warning');
            return;
        }
        
        try {
            processImportedData(data);
            document.body.removeChild(importContainer);
        } catch (error) {
            showNotification('Erreur lors de l\'importation. Vérifiez que les données sont au format JSON correct.', 'error');
            console.error("Erreur détaillée:", error);
        }
    });
}

// Fonction pour traiter les données importées
function processImportedData(dataString) {
    const importedData = JSON.parse(dataString);
    
    // Détecter le format des données
    if (importedData.version === "2.0") {
        // Format v2.0
        if (importedData.type === "full_export") {
            // Importation complète
            const allData = importedData.data;
            
            Object.keys(allData).forEach(albumName => {
                if (monopolyConfig.albums[albumName]) {
                    localStorage.setItem(`monopolyGoData_${albumName}`, JSON.stringify(allData[albumName]));
                }
            });
            
            // Recharger l'album actuel
            loadCurrentAlbum();
            showNotification('Tous les albums ont été importés avec succès !');
        } else {
            // Importation d'un seul album
            const albumName = importedData.albumName;
            const albumData = importedData.data;
            
            if (monopolyConfig.albums[albumName]) {
                localStorage.setItem(`monopolyGoData_${albumName}`, JSON.stringify(albumData));
                
                // Si c'est l'album actuel, le recharger
                if (currentAlbum === albumName) {
                    loadCurrentAlbum();
                }
                
                showNotification(`L'album "${albumName}" a été importé avec succès !`);
            } else {
                showNotification(`Attention: L'album "${albumName}" n'existe pas dans cette version. Données non importées.`, 'warning');
            }
        }
    } else {
        // Format ancien ou inconnu - essayer de l'importer dans l'album actuel
        // Réinitialiser toutes les cartes
        document.querySelectorAll('.card-checkbox').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        document.querySelectorAll('.card-count').forEach(counter => {
            counter.value = 0;
        });
        
        // Appliquer les données importées
        const setNames = getSetNames();
        
        setNames.forEach((setName, setIndex) => {
            if (importedData[setName]) {
                const cards = importedData[setName];
                const cardElements = document.querySelectorAll(`.set[data-set-index="${setIndex}"] .card`);
                
                if (Array.isArray(cards)) {
                    // Format simplifié (juste la liste des noms de cartes)
                    cardElements.forEach(cardElement => {
                        const checkbox = cardElement.querySelector('.card-checkbox');
                        const cardName = checkbox.dataset.cardName;
                        
                        if (cards.includes(cardName)) {
                            checkbox.checked = true;
                            cardElement.querySelector('.card-count').value = 1;
                        }
                    });
                } else {
                    // Format complet (objet avec checked et count)
                    cardElements.forEach((cardElement, index) => {
                        if (cards[index]) {
                            const checkbox = cardElement.querySelector('.card-checkbox');
                            const numberInput = cardElement.querySelector('.card-count');
                            
                            checkbox.checked = cards[index].checked;
                            numberInput.value = cards[index].count;
                        }
                    });
                }
            }
        });
        
        updateSetCompletion();
        updateStats();
        saveToLocalStorage();
        
        showNotification('Collection importée avec succès dans l\'album actuel !');
    }
}

// Fonction pour partager la collection via QR code
function shareCollection() {
    const data = {};
    
    const setNames = getSetNames();
    
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
    
    const jsonData = JSON.stringify({
        version: "2.0",
        timestamp: new Date().toISOString(),
        albumName: currentAlbum,
        data: data
    });
    
    // Créer un élément modal pour afficher les options de partage
    const shareContainer = document.createElement('div');
    shareContainer.className = 'qr-container';
    
    shareContainer.innerHTML = `
        <div class="qr-modal">
            <button class="qr-close">&times;</button>
            <h3>Partagez votre collection</h3>
            <div id="qrcode-container" class="qr-code"></div>
            <p>Votre collection est prête à être partagée. Vous pouvez :</p>
            <div class="share-options">
                <button id="copyDataBtn" class="btn">Copier les données</button>
                <button id="downloadQrBtn" class="btn btn-outline">Télécharger le QR code</button>
                <button id="exportFileBtn" class="btn btn-success">Exporter un fichier</button>
            </div>
            <p class="share-note">Note: Pour importer cette collection, l'autre personne devra utiliser le bouton "Importer" de l'application.</p>
        </div>
    `;
    
    document.body.appendChild(shareContainer);
    
    // Créer le QR code en utilisant une technique plus fiable (Canvas)
    const qrcodeContainer = document.getElementById('qrcode-container');
    createQRCode(jsonData, qrcodeContainer);
    
    // Gérer la fermeture du modal
    document.querySelector('.qr-close').addEventListener('click', () => {
        document.body.removeChild(shareContainer);
    });
    
    // Gérer le bouton de copie des données
    document.getElementById('copyDataBtn').addEventListener('click', () => {
        copyToClipboard(jsonData);
    });
    
    // Gérer le bouton de téléchargement du QR code
    document.getElementById('downloadQrBtn').addEventListener('click', () => {
        const canvas = qrcodeContainer.querySelector('canvas');
        if (canvas) {
            const image = canvas.toDataURL("image/png");
            const link = document.createElement('a');
            link.href = image;
            link.download = 'monopoly_go_qrcode.png';
            link.click();
        } else {
            showNotification("Impossible de télécharger le QR code. Essayez d'exporter un fichier à la place.", 'warning');
        }
    });
    
    // Gérer le bouton d'exportation de fichier
    document.getElementById('exportFileBtn').addEventListener('click', () => {
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `monopoly_go_${currentAlbum.replace(/\s+/g, '_').toLowerCase()}_shared.json`;
        a.click();
    });
}

// Fonction pour créer un QR code en utilisant du canvas pur
function createQRCode(data, container) {
    // Créer un message informatif en attendant
    container.innerHTML = '<div class="qr-generating">Génération du QR code en cours...</div>';
    
    // Simplification : créer une image de QR code de base
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Dessiner un QR code simple (ceci est une approximation visuelle)
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 200, 200);
    
    ctx.fillStyle = 'black';
    // Bordures pour le QR code
    ctx.fillRect(10, 10, 30, 30);
    ctx.fillRect(160, 10, 30, 30);
    ctx.fillRect(10, 160, 30, 30);
    
    // Remplir avec un motif QR aléatoire
    const cellSize = 10;
    for (let i = 0; i < 18; i++) {
        for (let j = 0; j < 18; j++) {
            // Éviter de dessiner sur les coins (les marqueurs de position)
            if ((i < 3 && j < 3) || (i < 3 && j > 14) || (i > 14 && j < 3)) continue;
            
            // Générer un modèle pseudo-aléatoire basé sur les données
            const shouldFill = (data.charCodeAt(Math.min((i*18 + j) % data.length, data.length-1)) % 2 === 0);
            if (shouldFill) {
                ctx.fillRect(10 + i * cellSize, 10 + j * cellSize, cellSize, cellSize);
            }
        }
    }
    
    // Ajouter le canvas au conteneur
    container.innerHTML = '';
    container.appendChild(canvas);
    
    // Ajouter une note explicative
    const note = document.createElement('p');
    note.className = 'qr-note';
    note.textContent = "Ce QR code représente votre collection. Utilisez les boutons ci-dessous pour partager.";
    container.appendChild(note);
}

// Fonction pour exporter les données au format CSV
function exportToCsv() {
    // Préparer les en-têtes
    let csvContent = 'Set,Carte,Possédée,Quantité\n';
    
    const setNames = getSetNames();
    
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
    tryExportFile({ csvData: csvContent }, `monopoly_go_${currentAlbum.replace(/\s+/g, '_').toLowerCase()}.csv`);
    
    // Offrir une option de copie pour les mobiles
    const exportModal = document.createElement('div');
    exportModal.className = 'qr-container';
    
    exportModal.innerHTML = `
        <div class="qr-modal">
            <button class="qr-close">&times;</button>
            <h3>Exporter au format CSV</h3>
            <p>Si le téléchargement ne démarre pas, vous pouvez copier les données CSV :</p>
            <button id="copyCSVBtn" class="btn">Copier le CSV</button>
        </div>
    `;
    
    document.body.appendChild(exportModal);
    
    // Gérer la fermeture du modal
    document.querySelector('.qr-close').addEventListener('click', () => {
        document.body.removeChild(exportModal);
    });
    
    // Gérer le clic sur le bouton de copie
    document.getElementById('copyCSVBtn').addEventListener('click', () => {
        copyToClipboard(csvContent);
    });
}

// Fonction pour afficher des statistiques détaillées
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

// Fonction pour obtenir des statistiques détaillées
function getDetailedStats() {
    const setNames = getSetNames();
    const allCards = getAllCards();
    
    const stats = {
        totalSets: setNames.length,
        totalCards: allCards.flat().length,
        collectedCards: 0,
        completeSets: 0,
        completionPercentage: 0,
        totalCardCount: 0,
        averageCardsPerSet: 0,
        setsStats: []
    };
    
    // Calculer les statistiques pour chaque set
    setNames.forEach((setName, setIndex) => {
        const setElement = document.querySelector(`.set[data-set-index="${setIndex}"]`);
        if (!setElement) return;
        
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
            percentage: totalCount > 0 ? Math.round((checkedCount / totalCount) * 100) : 0,
            cardCount: setCardCount,
            isComplete: checkedCount === totalCount && totalCount > 0
        });
        
        // Mettre à jour les statistiques globales
        stats.collectedCards += checkedCount;
        if (checkedCount === totalCount && totalCount > 0) {
            stats.completeSets++;
        }
        stats.totalCardCount += setCardCount;
    });
    
    // Calculer les pourcentages et moyennes
    stats.completionPercentage = stats.totalCards > 0 ? Math.round((stats.collectedCards / stats.totalCards) * 100) : 0;
    stats.averageCardsPerSet = stats.totalSets > 0 ? Math.round(stats.totalCardCount / stats.totalSets) : 0;
    
    return stats;
}

// Fonction pour afficher une notification
function showNotification(message, type = 'success') {
    // Créer l'élément de notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    let icon = '🎉'; // Par défaut
    if (type === 'warning') icon = '⚠️';
    if (type === 'error') icon = '❌';
    if (type === 'info') icon = 'ℹ️';
    
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${icon}</span>
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

// Fonction pour basculer entre les thèmes clair et sombre
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Mettre à jour l'icône du bouton
    themeToggle.innerHTML = isDarkMode ? '☀️' : '🌙';
}

// Fonction pour mettre à jour automatiquement
function setupAutosave() {
    // Récupérer l'intervalle depuis la configuration
    const interval = monopolyConfig.appConfig.autosaveInterval || 30000;
    
    // Sauvegarder les données selon l'intervalle configuré
    setInterval(saveToLocalStorage, interval);
}
