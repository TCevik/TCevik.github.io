/**
 * quizy-utils.js
 * Gedeelde hulpfuncties voor de Quizy-app.
 * Bevat logica die eerder gedupliceerd was in home.html en set.html.
 */

// ── Thema ──────────────────────────────────────────────────────────────────

/**
 * Vul de taal dropdowns.
 */
function populateLanguageSelects() {
    const languages = [
        { code: 'nl-NL', name: 'Nederlands' },
        { code: 'en-US', name: 'Engels' },
        { code: 'fr-FR', name: 'Frans' },
        { code: 'de-DE', name: 'Duits' },
        { code: 'es-ES', name: 'Spaans' },
        { code: 'it-IT', name: 'Italiaans' },
        { code: 'tr-TR', name: 'Turks' }
    ];

    const selects = [
        document.getElementById('langSingleSelect'),
        document.getElementById('langLeftSelect'),
        document.getElementById('langRightSelect')
    ];

    selects.forEach(select => {
        if (!select) return;
        select.innerHTML = '';
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            select.appendChild(option);
        });
    });

    const leftSelect = document.getElementById('langLeftSelect');
    const rightSelect = document.getElementById('langRightSelect');
    if (leftSelect) leftSelect.value = 'nl-NL';
    if (rightSelect) rightSelect.value = 'en-US';
}

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
 * Leest het opgeslagen thema en koppelt de click-event-listener.
 */
function initThemeToggle() {
    applyTheme(localStorage.getItem('theme') || 'light');
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

/**
 * Log de gebruiker uit door het token te verwijderen en terug te sturen naar index.
 */
function logout() {
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('google_token_expiry');
    window.location.href = '/quizy/index.html';
}

/**
 * Koppel uitlog-listeners aan de bureau- en mobiele knop.
 * @param {string} [desktopId='logoutBtn']
 * @param {string} [mobileId='mobileLogoutBtn']
 */
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

// ── XSS-beveiliging ────────────────────────────────────────────────────────

/**
 * Escape een string voor veilig gebruik in innerHTML.
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

/**
 * Escape een string voor veilig gebruik in inline onclick-attributen.
 * @param {string} str
 * @returns {string}
 */
function escapeJS(str) {
    return String(str)
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/'/g, "\\'");
}

// ── Aangepaste Dialogen ────────────────────────────────────────────────────

/**
 * Toon een aangepast meldingenvenster (vervangt window.alert).
 * Vereist de HTML-elementen: customAlertModal, customAlertTitle,
 * customAlertMessage, customAlertOkBtn, customAlertIcon.
 * @param {string} message
 * @param {string} [title='Melding']
 * @returns {Promise<void>}
 */
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

/**
 * Toon een aangepast bevestigingsvenster (vervangt window.confirm).
 * Vereist de HTML-elementen: confirmModal, confirmModalTitle,
 * confirmModalMessage, confirmCancelBtn, confirmDeleteBtn.
 * @param {string} message
 * @param {string} [title='Set verwijderen']
 * @returns {Promise<boolean>}
 */
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

/**
 * Overschrijf window.alert zodat alle native alerts de aangepaste modal gebruiken.
 */
function overrideNativeAlert() {
    window.alert = (message) => showAlert(message);
}

// ── Kaart-Editor Hulpmiddelen ──────────────────────────────────────────────

/**
 * Vul de drie taal-dropdowns in de set-editor met de standaard taalopties.
 * Roep dit aan nadat de DOM geladen is.
 */
function populateLanguageSelects() {
    const LANG_OPTIONS = [
        { value: 'nl-NL', label: 'Nederlands' },
        { value: 'en-US', label: 'Engels'      },
        { value: 'fr-FR', label: 'Frans'       },
        { value: 'de-DE', label: 'Duits'       },
        { value: 'es-ES', label: 'Spaans'      },
        { value: 'it-IT', label: 'Italiaans'   },
        { value: 'tr-TR', label: 'Turks'       },
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

/**
 * De karteervelden voor de kaarteditor bijhouden.
 * @param {HTMLElement} cardRowsContainer – container element voor de kaartrijen
 */
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

    /**
     * Reset de modal-editor naar de toestand voor een nieuwe set.
     */
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

    /**
     * Vul de modal-editor met de gegevens van een bestaande set.
     * @param {{ isLanguageLearning: boolean, langLeft: string, langRight: string, items: Array }} setData
     */
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

    /**
     * Lees alle ingevulde kaarten uit de editor.
     * Gooit een Error als de validatie mislukt.
     * @returns {{ term: string, definition: string, starred: boolean }[]}
     */
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

/**
 * Maak een geautoriseerde fetch-aanvraag naar de Google Drive API.
 * @param {string} url
 * @param {RequestInit} [options]
 * @returns {Promise<Response>}
 */
function driveRequest(url, options = {}) {
    const token = localStorage.getItem('google_access_token');
    options.headers = { 'Authorization': `Bearer ${token}`, ...(options.headers || {}) };
    return fetch(url, options);
}

/**
 * Haal de JSON-inhoud op van een Drive-bestand.
 * @param {string} fileId
 * @returns {Promise<object>}
 */
async function driveGetJSON(fileId) {
    const res = await driveRequest(`${DRIVE_BASE}/files/${fileId}?alt=media`);
    if (!res.ok) throw new Error(`Kan bestand ${fileId} niet ophalen (${res.status})`);
    return res.json();
}

/**
 * Sla JSON-inhoud op in een bestaand Drive-bestand (PATCH).
 * @param {string} fileId
 * @param {object} data
 * @returns {Promise<Response>}
 */
function drivePatchJSON(fileId, data) {
    return driveRequest(`${DRIVE_UPLOAD}/files/${fileId}?uploadType=media`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    });
}

/**
 * Maak een nieuw Drive-bestand aan via multipart upload.
 * @param {string} fileName
 * @param {object} data
 * @returns {Promise<Response>}
 */
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
