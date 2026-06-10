/**
 * quizy-utils.js
 * Gedeelde hulpfuncties voor de Quizy-app.
 */

// ── Thema ──────────────────────────────────────────────────────────────────

/**
 * Pas het lichte of donkere thema toe op de pagina en update de toggle-knop.
 * @param {'light'|'dark'} theme
 */
function applyTheme(theme) {
    const themeToggleBtn = document.getElementById('themeToggle');
    if (theme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
        if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        document.documentElement.classList.remove('dark-mode');
        document.body.classList.remove('dark-mode');
        if (themeToggleBtn) themeToggleBtn.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
}

/**
 * Initialiseer de thema-toggle-knop.
 */
function initThemeToggle() {
    let currentTheme = localStorage.getItem('theme');
    if (!currentTheme) {
        currentTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        localStorage.setItem('theme', currentTheme);
    }
    applyTheme(currentTheme);
    const themeToggleBtn = document.getElementById('themeToggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const current = localStorage.getItem('theme') || 'light';
            const next = current === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', next);
            applyTheme(next);
        });
    }
}

// ── Uitloggen ──────────────────────────────────────────────────────────────

function logout() {
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_token_expiry');
    window.location.href = '/quizy/index.html';
}

// ── XSS-beveiliging ────────────────────────────────────────────────────────

function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function escapeJS(str) {
    return String(str)
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/'/g, "\\'");
}

// ── Aangepaste Dialogen ────────────────────────────────────────────────────

function showAlert(message, title = 'Melding') {
    return new Promise((resolve) => {
        const modal   = document.getElementById('customAlertModal');
        const titleEl = document.getElementById('customAlertTitle');
        const msgEl   = document.getElementById('customAlertMessage');
        const okBtn   = document.getElementById('customAlertOkBtn');
        const iconEl  = document.getElementById('customAlertIcon');

        if (titleEl) titleEl.textContent = title;
        if (msgEl)   msgEl.textContent   = message;

        if (iconEl) {
            const lower = message.toLowerCase();
            if (lower.includes('succes') || lower.includes('gelukt') || lower.includes('opgeslagen')) {
                iconEl.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
                iconEl.style.color = 'var(--brand-color)';
            } else if (
                lower.includes('fout') || lower.includes('mislukt') || lower.includes('mis') ||
                lower.includes('vul')  || lower.includes('voeg')    || lower.includes('plak') ||
                lower.includes('selecteer')
            ) {
                iconEl.innerHTML = '<i class="fa-solid fa-circle-xmark"></i>';
                iconEl.style.color = '#ef4444';
            } else {
                iconEl.innerHTML = '<i class="fa-solid fa-circle-info"></i>';
                iconEl.style.color = '#3b82f6';
            }
        }

        if (modal) modal.classList.remove('hidden');

        function onOk() {
            if (modal) modal.classList.add('hidden');
            if (okBtn) okBtn.removeEventListener('click', onOk);
            resolve();
        }
        if (okBtn) okBtn.addEventListener('click', onOk);
    });
}

function customConfirm(message, title = 'Set verwijderen') {
    return new Promise((resolve) => {
        const modal     = document.getElementById('confirmModal');
        const titleEl   = document.getElementById('confirmModalTitle');
        const msgEl     = document.getElementById('confirmModalMessage');
        const cancelBtn = document.getElementById('confirmCancelBtn');
        const confirmBtn = document.getElementById('confirmDeleteBtn');

        if (titleEl) titleEl.textContent = title;
        if (msgEl)   msgEl.textContent   = message;

        if (modal) modal.classList.remove('hidden');

        function cleanup() {
            if (modal) modal.classList.add('hidden');
            cancelBtn.removeEventListener('click', onCancel);
            confirmBtn.removeEventListener('click', onConfirm);
        }
        function onCancel()  { cleanup(); resolve(false); }
        function onConfirm() { cleanup(); resolve(true);  }

        cancelBtn.addEventListener('click', onCancel);
        confirmBtn.addEventListener('click', onConfirm);
    });
}

function overrideNativeAlert() {
    window.alert = (message) => showAlert(message);
}

// ── Kaart-Editor Hulpmiddelen ──────────────────────────────────────────────

function populateLanguageSelects() {
    const LANG_OPTIONS = [
        { value: 'nl-NL', label: 'Nederlands' },
        { value: 'en-US', label: 'Engels'      },
        { value: 'fr-FR', label: 'Frans'       },
        { value: 'de-DE', label: 'Duits'       },
    ];

    const ids = ['langSingleSelect', 'langLeftSelect', 'langRightSelect'];
    const defaults = { langSingleSelect: 'nl-NL', langLeftSelect: 'nl-NL', langRightSelect: 'en-US' };

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.innerHTML = LANG_OPTIONS.map(o =>
            `<option value="${o.value}"${o.value === defaults[id] ? ' selected' : ''}>${o.label}</option>`
        ).join('');
    });
}

function createCardRowManager(cardRowsContainer) {

    function addCardRow(term = '', definition = '', starred = false) {
        const row = document.createElement('div');
        row.className = 'card-row';
        row.dataset.starred = starred ? 'true' : 'false';
        row.innerHTML = `
            <button class="star-row-btn" title="Markeer als moeilijk" style="background: none; border: none; cursor: pointer; color: ${starred ? '#eab308' : '#94a3b8'}; font-size: 1.2rem; padding: 4px; display: flex; align-items: center; justify-content: center; transition: color 0.2s;"><i class="${starred ? 'fa-solid' : 'fa-regular'} fa-star"></i></button>
            <input type="text" class="term-input" placeholder="Term" value="${escapeHTML(term)}">
            <input type="text" class="def-input" placeholder="Definitie" value="${escapeHTML(definition)}">
            <button class="remove-row-btn" title="Rij verwijderen">&times;</button>
        `;

        row.querySelector('.star-row-btn').addEventListener('click', () => {
            const isStarred = row.dataset.starred === 'true';
            row.dataset.starred = isStarred ? 'false' : 'true';
            const starBtn  = row.querySelector('.star-row-btn');
            const starIcon = starBtn.querySelector('i');
            starBtn.style.color = isStarred ? '#94a3b8' : '#eab308';
            starIcon.className  = isStarred ? 'fa-regular fa-star' : 'fa-solid fa-star';
        });

        row.querySelector('.remove-row-btn').addEventListener('click', () => {
            row.remove();
            manageEmptyRows();
        });

        row.querySelectorAll('input').forEach(input =>
            input.addEventListener('input', manageEmptyRows)
        );

        cardRowsContainer.appendChild(row);
        updatePlaceholderTexts();
    }

    function manageEmptyRows() {
        const rows = Array.from(cardRowsContainer.getElementsByClassName('card-row'));
        if (rows.length === 0) { addCardRow(); return; }

        const lastRow    = rows[rows.length - 1];
        const lastInputs = lastRow.querySelectorAll('input');
        const lastHasText = lastInputs[0].value.trim() !== '' || lastInputs[1].value.trim() !== '';

        if (lastHasText) { addCardRow(); return; }

        if (rows.length > 1) {
            const secondLast = rows[rows.length - 2];
            const slInputs   = secondLast.querySelectorAll('input');
            const slHasText  = slInputs[0].value.trim() !== '' || slInputs[1].value.trim() !== '';
            if (!slHasText) {
                lastRow.remove();
                manageEmptyRows();
            }
        }
    }

    function updatePlaceholderTexts() {
        const isLang      = document.getElementById('langLearningToggle')?.checked;
        const leftSelect  = document.getElementById('langLeftSelect');
        const rightSelect = document.getElementById('langRightSelect');
        const leftName    = leftSelect?.options[leftSelect.selectedIndex]?.text  || 'Term';
        const rightName   = rightSelect?.options[rightSelect.selectedIndex]?.text || 'Definitie';

        Array.from(cardRowsContainer.getElementsByClassName('card-row')).forEach(row => {
            const ti = row.querySelector('.term-input');
            const di = row.querySelector('.def-input');
            if (!ti || !di) return;
            if (isLang) {
                ti.placeholder = `Woord in ${leftName}`;
                di.placeholder = `Vertaling in ${rightName}`;
            } else {
                ti.placeholder = 'Term (bijv. Hola)';
                di.placeholder = 'Definitie (bijv. Hallo)';
            }
        });
    }

    function cleanEmptyRows() {
        Array.from(cardRowsContainer.getElementsByClassName('card-row')).forEach(row => {
            const term = row.querySelector('.term-input').value.trim();
            const def  = row.querySelector('.def-input').value.trim();
            if (!term && !def) row.remove();
        });
        if (cardRowsContainer.children.length === 0) addCardRow();
    }

    function processImport(importTextarea, importPanel) {
        const text = importTextarea.value.trim();
        if (!text) { alert('Plak eerst wat tekst om te kunnen importeren.'); return; }

        let count = 0;
        text.split(';').forEach(pair => {
            const clean = pair.trim();
            if (!clean) return;
            const commaIdx = clean.indexOf(',');
            if (commaIdx !== -1) {
                const term = clean.substring(0, commaIdx).trim();
                const def  = clean.substring(commaIdx + 1).trim();
                if (term || def) { addCardRow(term, def); count++; }
            } else {
                addCardRow(clean, '');
                count++;
            }
        });

        if (count > 0) {
            importTextarea.value = '';
            importPanel.classList.add('hidden');
            cleanEmptyRows();
            manageEmptyRows();
        }
    }

    function resetForNew() {
        cardRowsContainer.innerHTML = '';
        const toggle = document.getElementById('langLearningToggle');
        if (toggle) toggle.checked = false;

        populateLanguageSelects();

        document.getElementById('langSelectorContainer')?.classList.add('hidden');
        document.getElementById('singleLangContainer')?.classList.remove('hidden');

        addCardRow();
        updatePlaceholderTexts();
    }

    function loadSetIntoEditor(setData) {
        cardRowsContainer.innerHTML = '';

        const isLang = !!setData.isLanguageLearning;
        const toggle = document.getElementById('langLearningToggle');
        if (toggle) toggle.checked = isLang;

        const leftSel   = document.getElementById('langLeftSelect');
        const rightSel  = document.getElementById('langRightSelect');
        const singleSel = document.getElementById('langSingleSelect');
        if (leftSel)   leftSel.value   = setData.langLeft  || 'nl-NL';
        if (rightSel)  rightSel.value  = setData.langRight || 'en-US';
        if (singleSel) singleSel.value = setData.langLeft  || 'nl-NL';

        const selectorContainer   = document.getElementById('langSelectorContainer');
        const singleLangContainer = document.getElementById('singleLangContainer');
        if (isLang) {
            selectorContainer?.classList.remove('hidden');
            singleLangContainer?.classList.add('hidden');
        } else {
            selectorContainer?.classList.add('hidden');
            singleLangContainer?.classList.remove('hidden');
        }

        if (setData.items?.length) {
            setData.items.forEach(item => addCardRow(item.term, item.definition, !!item.starred));
        }

        manageEmptyRows();
        updatePlaceholderTexts();
    }

    function collectItems() {
        const items = [];
        for (const row of cardRowsContainer.getElementsByClassName('card-row')) {
            const term       = row.querySelector('.term-input').value.trim();
            const definition = row.querySelector('.def-input').value.trim();
            const starred    = row.dataset.starred === 'true';
            if (term && !definition || !term && definition) {
                throw new Error('Elke kaart moet zowel een term als een definitie hebben.');
            }
            if (term && definition) items.push({ term, definition, starred });
        }
        return items;
    }

    return {
        addCardRow,
        manageEmptyRows,
        updatePlaceholderTexts,
        cleanEmptyRows,
        processImport,
        resetForNew,
        loadSetIntoEditor,
        collectItems,
    };
}

// ── Google Drive Helpers ───────────────────────────────────────────────────

const DRIVE_BASE    = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD  = 'https://www.googleapis.com/upload/drive/v3';
const APP_DATA_FOLDER = 'appDataFolder';
const SET_PREFIX    = 'quizy_set_';

function driveRequest(url, options = {}) {
    const token = localStorage.getItem('google_access_token');
    options.headers = { 'Authorization': `Bearer ${token}`, ...(options.headers || {}) };
    return fetch(url, options);
}

async function driveGetJSON(fileId) {
    const res = await driveRequest(`${DRIVE_BASE}/files/${fileId}?alt=media`);
    if (!res.ok) throw new Error(`Kan bestand ${fileId} niet ophalen (${res.status})`);
    return res.json();
}

function drivePatchJSON(fileId, data) {
    return driveRequest(`${DRIVE_UPLOAD}/files/${fileId}?uploadType=media`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

function driveCreateFile(fileName, data) {
    const metadata = {
        name: fileName,
        mimeType: 'application/json',
        parents: [APP_DATA_FOLDER],
    };
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file',     new Blob([JSON.stringify(data)],     { type: 'application/json' }));
    return driveRequest(`${DRIVE_UPLOAD}/files?uploadType=multipart`, { method: 'POST', body: form });
}

// ── Common Layout Injection ────────────────────────────────────────────────

function injectCommonLayout() {
    // 1. Inject header
    let headerEl = document.querySelector('header');
    if (!headerEl) {
        headerEl = document.createElement('header');
        document.body.insertBefore(headerEl, document.body.firstChild);
    }
    
    const isHome = window.location.pathname.endsWith('home.html') || window.location.pathname.endsWith('home') || window.location.pathname === '/quizy/';
    
    headerEl.innerHTML = `
        <a href="${isHome ? 'index.html' : 'home.html'}" id="logo">TC_tam <strong style="color: #52873e;">Quizy</strong></a>
        <div style="display: flex; align-items: center; gap: 10px;">
            <button id="themeToggle" class="theme-toggle-btn" title="Donkere/Lichte modus"><i class="fa-solid fa-moon"></i></button>
            <div class="header-actions">
                ${isHome ? '' : '<a href="home.html" class="btn btn-secondary btn-sm" style="margin-right: 10px;"><i class="fa-solid fa-house"></i> Dashboard</a>'}
                <button id="logoutBtn" class="btn btn-secondary btn-sm"><i class="fa-solid fa-right-from-bracket"></i> Uitloggen</button>
            </div>
        </div>
    `;

    // 2. Inject footer
    let footerEl = document.querySelector('footer');
    if (!footerEl) {
        footerEl = document.createElement('footer');
        const mainEl = document.querySelector('main');
        if (mainEl && mainEl.nextSibling) {
            document.body.insertBefore(footerEl, mainEl.nextSibling);
        } else {
            document.body.appendChild(footerEl);
        }
    }
    footerEl.innerHTML = `
        <div class="footer-content">
            <div class="footer-links">
                <a href="/privacy">Privacybeleid</a>
                <a href="/terms">Voorwaarden</a>
            </div>
            <p class="footer-copy">&copy; 2026 TC_tam Quizy. Alle rechten voorbehouden.</p>
        </div>
    `;

    // 3. Inject bottom navigation
    let bottomNavEl = document.querySelector('.bottom-nav');
    if (!bottomNavEl) {
        bottomNavEl = document.createElement('div');
        bottomNavEl.className = 'bottom-nav';
        document.body.appendChild(bottomNavEl);
    }
    bottomNavEl.innerHTML = `
        <a href="home.html" class="bottom-nav-item active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <span>Home</span>
        </a>
        <a href="https://gemini.google.com/gem/1m6sLmNZl6DWp9laUTM7lbZ9MYi_FOBk6?usp=sharing" target="_blank"
            class="bottom-nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="9" y1="9" x2="15" y2="15"></line>
                <line x1="15" y1="9" x2="9" y2="15"></line>
            </svg>
            <span>AI Tool</span>
        </a>
        <a href="#" id="mobileLogoutBtn" class="bottom-nav-item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Uitloggen</span>
        </a>
    `;

    // 4. Inject Modals
    const modalContainerHTML = `
    <!-- Modal voor Set Maken & Bewerken -->
    <div id="setModal" class="modal hidden">
        <div class="modal-content">
            <div class="modal-header">
                <h3 id="modalTitle">Nieuwe set maken</h3>
                <button id="closeModalBtn" class="close-btn">&times;</button>
            </div>

            <div class="form-group">
                <label for="setTitleInput">Titel van de set</label>
                <input type="text" id="setTitleInput" placeholder="Bijv. Spaans Hoofdstuk 1">
            </div>

            <div class="toggle-group">
                <div style="display: flex; flex-direction: column; gap: 4px; text-align: left;">
                    <span style="font-weight: 700; font-size: 1rem; color: var(--text-primary);">Talen leren</span>
                    <span style="font-size: 0.85rem; color: var(--text-secondary);">Spraaksynthese en kolomkeuze activeren voor vreemde talen</span>
                </div>
                <label class="switch">
                    <input type="checkbox" id="langLearningToggle">
                    <span class="slider"></span>
                </label>
            </div>

            <div id="singleLangContainer" style="margin-bottom: 24px; display: flex; flex-direction: column; gap: 6px;">
                <label for="langSingleSelect" style="font-size: 0.9rem; font-weight: 600;">Taal van de set:</label>
                <div class="custom-select-wrapper" style="max-width: 300px;">
                    <select id="langSingleSelect" class="custom-select"></select>
                </div>
            </div>

            <div id="langSelectorContainer" class="hidden"
                style="display: flex; gap: 15px; margin-bottom: 24px; flex-wrap: wrap;">
                <div style="flex: 1; min-width: 150px; display: flex; flex-direction: column; gap: 6px;">
                    <label for="langLeftSelect" style="font-size: 0.9rem; font-weight: 600;">Taal links (kolom 1):</label>
                    <div class="custom-select-wrapper">
                        <select id="langLeftSelect" class="custom-select"></select>
                    </div>
                </div>
                <div style="flex: 1; min-width: 150px; display: flex; flex-direction: column; gap: 6px;">
                    <label for="langRightSelect" style="font-size: 0.9rem; font-weight: 600;">Taal rechts (kolom 2):</label>
                    <div class="custom-select-wrapper">
                        <select id="langRightSelect" class="custom-select"></select>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <label
                    style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                    <span>Kaarten (Termen & Definities)</span>
                    <div style="display: flex; gap: 8px;">
                        <button id="toggleImportBtn" class="btn btn-secondary btn-sm">Snel importeren</button>
                    </div>
                </label>

                <div id="importPanel" class="hidden"
                    style="margin-bottom: 15px; padding: 15px; background: var(--bg-primary); border: 1px solid var(--border-color); border-radius: 8px; text-align: left;">
                    
                    <!-- Gemini AI Tool Integration -->
                    <div id="geminiAiToolIntegration"
                        style="margin-bottom: 16px; padding: 12px 16px; background: var(--ai-bg, rgba(30, 58, 138, 0.08)); border: 1px solid var(--ai-border, rgba(30, 58, 138, 0.15)); border-radius: 8px; display: flex; flex-direction: column; gap: 8px;">
                        <div
                            style="display: flex; align-items: center; gap: 8px; font-weight: 700; color: var(--text-primary);">
                            <span style="font-size: 1.2rem; color: #3b82f6;"><i class="fa-solid fa-robot"></i></span>
                            <span>TC_tam Quizy Set Maker (Gemini AI)</span>
                        </div>
                        <p style="margin: 0; font-size: 0.875rem; color: var(--text-secondary); line-height: 1.45;">
                            Importeer heel gemakkelijk woordenlijsten van andere platforms (zoals Quizlet of StudyGo)!
                            Kopieer de pagina met de woordjes, plak deze in onze speciale Gemini AI-tool en kopieer
                            de gegenereerde tekst om hieronder te plakken.
                        </p>
                        <div style="margin-top: 4px;">
                            <a href="https://gemini.google.com/gem/1m6sLmNZl6DWp9laUTM7lbZ9MYi_FOBk6?usp=sharing"
                                target="_blank" class="btn btn-sm"
                                style="font-size: 0.8rem; padding: 6px 12px; gap: 6px;">
                                Naar Gemini AI Tool <i class="fa-solid fa-arrow-up-right-from-square"
                                    style="font-size: 0.75rem;"></i>
                            </a>
                        </div>
                    </div>

                    <p style="margin: 0 0 8px 0; font-size: 0.85rem; color: var(--text-secondary); font-weight: 600;">
                        Plak je lijst in
                        het formaat: <code>woord, definitie; woord, definitie;</code></p>
                    <textarea id="importTextarea" placeholder="hola, hallo; adiós, doei; gracias, bedankt;" rows="4"
                        style="width: 100%; padding: 10px; border: 1px solid var(--input-border); background-color: var(--input-bg); color: var(--text-primary); border-radius: 6px; box-sizing: border-box; font-family: monospace; font-size: 0.9rem; resize: vertical; margin-bottom: 10px;"></textarea>
                    <div style="display: flex; gap: 8px; justify-content: flex-end;">
                        <button id="cancelImportBtn" class="btn btn-secondary btn-sm">Annuleren</button>
                        <button id="processImportBtn" class="btn btn-sm">Voeg toe</button>
                    </div>
                </div>

                <div id="cardRowsContainer">
                    <!-- Dynamische rijen komen hier -->
                </div>
            </div>

            <div class="modal-actions">
                <button id="cancelSetBtn" class="btn btn-secondary">Annuleren</button>
                <button id="saveSetBtn" class="btn">Set opslaan</button>
            </div>
        </div>
    </div>

    <!-- Custom Confirm Modal -->
    <div id="confirmModal" class="modal hidden">
        <div class="modal-content" style="max-width: 400px; text-align: center;">
            <div style="font-size: 3rem; margin-bottom: 15px; color: #ef4444;"><i class="fa-solid fa-trash-can"></i>
            </div>
            <h3 style="margin-top: 0; color: var(--text-primary);" id="confirmModalTitle">Set verwijderen</h3>
            <p id="confirmModalMessage"
                style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; margin-bottom: 24px;">Weet je
                zeker dat je deze set wilt verwijderen?</p>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="confirmCancelBtn" class="btn btn-secondary">Annuleren</button>
                <button id="confirmDeleteBtn" class="btn btn-danger">Verwijderen</button>
            </div>
        </div>
    </div>

    <!-- Custom Alert Modal -->
    <div id="customAlertModal" class="modal hidden">
        <div class="modal-content" style="max-width: 400px; text-align: center;">
            <div id="customAlertIcon" style="font-size: 3rem; margin-bottom: 15px; color: var(--brand-color);">
                <i class="fa-solid fa-circle-info"></i>
            </div>
            <h3 style="margin-top: 0; color: var(--text-primary);" id="customAlertTitle">Melding</h3>
            <p id="customAlertMessage" style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.5; margin-bottom: 24px;"></p>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button id="customAlertOkBtn" class="btn">Ok</button>
            </div>
        </div>
    </div>
    `;

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalContainerHTML;
    while (tempDiv.firstChild) {
        document.body.appendChild(tempDiv.firstChild);
    }

    // Initialize layout-wide event handlers
    initThemeToggle();
    initLogoutButtons();
}

function initLogoutButtons(desktopId = 'logoutBtn', mobileId = 'mobileLogoutBtn') {
    const desktopBtn = document.getElementById(desktopId);
    if (desktopBtn) desktopBtn.addEventListener('click', logout);

    const mobileBtn = document.getElementById(mobileId);
    if (mobileBtn) {
        mobileBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
}
