/**
 * quizy-utils.js
 * Gedeelde hulpfuncties voor de Quizy-app.
 */

const LOCALES_MAP = {
    'nl-NL': 'Nederlands',
    'en-US': 'Engels',
    'fr-FR': 'Frans',
    'de-DE': 'Duits'
};

function getLanguageName(locale, defaultName = 'Taal') {
    return LOCALES_MAP[locale] || defaultName;
}


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

function speakText(text, lang) {
    if ('speechSynthesis' in window) {
        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang || 'nl-NL';
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn("Spraaksynthese mislukt:", e);
        }
    }
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

function customConfirm(message, title = 'Bevestigen', confirmText = 'Ja', isDanger = false) {
    return new Promise((resolve) => {
        const modal     = document.getElementById('confirmModal');
        const titleEl   = document.getElementById('confirmModalTitle');
        const msgEl     = document.getElementById('confirmModalMessage');
        const cancelBtn = document.getElementById('confirmCancelBtn');
        const confirmBtn = document.getElementById('confirmDeleteBtn');
        const iconEl    = document.getElementById('confirmModalIcon');

        if (titleEl) titleEl.textContent = title;
        if (msgEl)   msgEl.textContent   = message;

        if (confirmBtn) {
            confirmBtn.textContent = confirmText;
            if (isDanger) {
                confirmBtn.className = 'btn btn-danger';
            } else {
                confirmBtn.className = 'btn';
            }
        }

        if (iconEl) {
            if (isDanger) {
                iconEl.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
                iconEl.style.color = '#ef4444';
            } else {
                iconEl.innerHTML = '<i class="fa-solid fa-circle-question"></i>';
                iconEl.style.color = '#3b82f6';
            }
        }

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

async function compressData(dataStr) {
    const stream = new Blob([dataStr]).stream();
    const compressedStream = stream.pipeThrough(new CompressionStream('gzip'));
    const chunks = [];
    const reader = compressedStream.getReader();
    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
    }
    const blob = new Blob(chunks);
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
}

async function decompressData(base64Str) {
    const binary = atob(base64Str);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    const stream = new Blob([bytes]).stream();
    const decompressedStream = stream.pipeThrough(new DecompressionStream('gzip'));
    const response = new Response(decompressedStream);
    const blob = await response.blob();
    return await blob.text();
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

function getScrollParent(el) {
    let parent = el.parentNode;
    while (parent && parent !== document.body && parent !== document.documentElement) {
        const style = window.getComputedStyle(parent);
        const overflowY = style.overflowY;
        if (overflowY === 'auto' || overflowY === 'scroll' || parent.scrollHeight > parent.clientHeight) {
            return parent;
        }
        parent = parent.parentNode;
    }
    return window;
}

function runWithScrollAnchoring(paginationEl, scrollAnchorEl, pageAction) {
    const isVisible = paginationEl && !paginationEl.classList.contains('hidden') && paginationEl.style.display !== 'none';
    let yBefore = 0;
    if (isVisible) {
        yBefore = paginationEl.getBoundingClientRect().top;
    }
    
    pageAction();
    
    if (isVisible) {
        const yAfter = paginationEl.getBoundingClientRect().top;
        const scrollContainer = scrollAnchorEl ? getScrollParent(scrollAnchorEl) : window;
        if (scrollContainer === window) {
            window.scrollBy(0, yAfter - yBefore);
        } else {
            scrollContainer.scrollTop += (yAfter - yBefore);
        }
    }
}

function createCardRowManager(cardRowsContainer) {
    let allEditorItems = [];
    let currentEditorPage = 1;
    const editorPageSize = 50;

    let paginationDiv = document.getElementById('modalPagination');

    function renderEditorPageWithAnchoring(pageAction) {
        const anchorEl = (paginationDiv && !paginationDiv.classList.contains('hidden')) ? paginationDiv : addBtn;
        runWithScrollAnchoring(anchorEl, cardRowsContainer, pageAction);
    }

    let addBtn = document.getElementById('addCardRowBtn');
    let addBtnMsg = document.getElementById('addCardRowMsg');
    if (!addBtn && cardRowsContainer) {
        addBtn = document.createElement('button');
        addBtn.id = 'addCardRowBtn';
        addBtn.className = 'btn';
        addBtn.style.cssText = 'background-color: #52873e; margin: 15px auto; display: flex; align-items: center; justify-content: center; height: 38px; padding: 0 16px; font-weight: 600; color: #fff; border: none; border-radius: 8px; cursor: pointer; transition: background-color 0.2s; box-sizing: border-box;';
        addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Nieuwe kaart';
        cardRowsContainer.parentNode.insertBefore(addBtn, cardRowsContainer.nextSibling);

        addBtnMsg = document.createElement('div');
        addBtnMsg.id = 'addCardRowMsg';
        addBtnMsg.style.cssText = 'text-align: center; margin: 15px auto; color: var(--text-secondary); font-weight: 600; font-size: 0.95rem; display: none; height: 38px; align-items: center; justify-content: center; box-sizing: border-box;';
        addBtnMsg.textContent = 'Ga naar de laatste pagina om kaarten toe te voegen';
        cardRowsContainer.parentNode.insertBefore(addBtnMsg, addBtn.nextSibling);

        addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            saveInputsToMemory();
            
            const newEmptyItem = { term: '', definition: '', starred: false, image: '', defImage: '' };
            allEditorItems.push(newEmptyItem);
            
            currentEditorPage = Math.ceil(allEditorItems.length / editorPageSize);
            renderEditorPageWithAnchoring(() => {
                renderEditorPage();
            });
            
            setTimeout(() => {
                const rows = cardRowsContainer.getElementsByClassName('card-row');
                if (rows.length > 0) {
                    const lastRow = rows[rows.length - 1];
                    const input = lastRow.querySelector('.term-input');
                    if (input) input.focus();
                }
            }, 50);
        });
    }

    if (!paginationDiv && cardRowsContainer) {
        paginationDiv = document.createElement('div');
        paginationDiv.id = 'modalPagination';
        paginationDiv.className = 'pagination-controls hidden';
        paginationDiv.style.cssText = 'display:flex; justify-content:center; align-items:center; gap:15px; margin-top:15px; padding:10px; border-top: 1px solid var(--border-color);';
        paginationDiv.innerHTML = `
            <button id="modalSkipPrevBtn" class="btn btn-secondary btn-sm" style="padding: 6px 12px;"><i class="fa-solid fa-angles-left"></i> 10</button>
            <button id="modalPrevPageBtn" class="btn btn-secondary btn-sm" style="padding: 6px 12px;"><i class="fa-solid fa-chevron-left"></i> Vorige</button>
            <span id="modalPageInfo" style="font-weight:600; color:var(--text-primary);">Pagina 1 van 1</span>
            <button id="modalNextPageBtn" class="btn btn-secondary btn-sm" style="padding: 6px 12px;">Volgende <i class="fa-solid fa-chevron-right"></i></button>
            <button id="modalSkipNextBtn" class="btn btn-secondary btn-sm" style="padding: 6px 12px;">10 <i class="fa-solid fa-angles-right"></i></button>
        `;
        cardRowsContainer.parentNode.insertBefore(paginationDiv, addBtnMsg.nextSibling);

        paginationDiv.querySelector('#modalSkipPrevBtn').addEventListener('click', (e) => {
            e.preventDefault();
            if (currentEditorPage > 1) {
                renderEditorPageWithAnchoring(() => {
                    saveInputsToMemory();
                    currentEditorPage = Math.max(1, currentEditorPage - 10);
                    renderEditorPage();
                });
            }
        });

        paginationDiv.querySelector('#modalPrevPageBtn').addEventListener('click', (e) => {
            e.preventDefault();
            if (currentEditorPage > 1) {
                renderEditorPageWithAnchoring(() => {
                    saveInputsToMemory();
                    currentEditorPage--;
                    renderEditorPage();
                });
            }
        });

        paginationDiv.querySelector('#modalNextPageBtn').addEventListener('click', (e) => {
            e.preventDefault();
            const totalPages = Math.ceil(allEditorItems.length / editorPageSize);
            if (currentEditorPage < totalPages) {
                renderEditorPageWithAnchoring(() => {
                    saveInputsToMemory();
                    currentEditorPage++;
                    renderEditorPage();
                });
            }
        });

        paginationDiv.querySelector('#modalSkipNextBtn').addEventListener('click', (e) => {
            e.preventDefault();
            const totalPages = Math.ceil(allEditorItems.length / editorPageSize);
            if (currentEditorPage < totalPages) {
                renderEditorPageWithAnchoring(() => {
                    saveInputsToMemory();
                    currentEditorPage = Math.min(totalPages, currentEditorPage + 10);
                    renderEditorPage();
                });
            }
        });
    }

    function saveInputsToMemory() {
        const rows = Array.from(cardRowsContainer.getElementsByClassName('card-row'));
        rows.forEach(row => {
            const idx = parseInt(row.dataset.index);
            if (!isNaN(idx) && allEditorItems[idx]) {
                allEditorItems[idx].term = row.querySelector('.term-input').value;
                allEditorItems[idx].definition = row.querySelector('.def-input').value;
                allEditorItems[idx].starred = row.dataset.starred === 'true';
            }
        });
    }

    function renderRowDOM(item, index) {
        const row = document.createElement('div');
        row.className = 'card-row';
        row.dataset.index = index;
        row.dataset.starred = item.starred ? 'true' : 'false';
        row.innerHTML = `
            <button class="star-row-btn" title="Markeer als moeilijk" style="background: none; border: none; cursor: pointer; color: ${item.starred ? '#eab308' : '#94a3b8'}; font-size: 1.2rem; padding: 4px; display: flex; align-items: center; justify-content: center; transition: color 0.2s;"><i class="${item.starred ? 'fa-solid' : 'fa-regular'} fa-star"></i></button>
            <input type="text" class="term-input" placeholder="Term" value="${escapeHTML(item.term)}" autocomplete="off">
            <div class="row-image-container term-image-container" style="display: flex; align-items: center; justify-content: center; position: relative; width: 38px; height: 38px; flex-shrink: 0; margin-right: 8px;">
                <input type="file" class="term-image-input" accept="image/*" style="display: none;">
                ${item.image ? `
                    <div class="term-image-preview" style="position: relative; width: 38px; height: 38px; border-radius: 6px; border: 1px solid var(--border-color); overflow: hidden; cursor: pointer;">
                        <img src="${item.image}" style="width: 100%; height: 100%; object-fit: cover;">
                        <button class="remove-term-image-btn" title="Afbeelding verwijderen" style="position: absolute; top: 0; right: 0; background: rgba(239, 68, 68, 0.85); color: #fff; border: none; border-radius: 0 0 0 4px; width: 14px; height: 14px; padding: 0; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1;">&times;</button>
                    </div>
                ` : `
                    <button class="add-term-image-btn" title="Afbeelding toevoegen" style="background: none; border: 1px dashed var(--border-color); border-radius: 6px; color: var(--text-secondary); cursor: pointer; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; transition: all 0.2s;"><i class="fa-regular fa-image"></i></button>
                `}
            </div>
            <input type="text" class="def-input" placeholder="Definitie" value="${escapeHTML(item.definition)}" autocomplete="off">
            <div class="row-image-container def-image-container" style="display: flex; align-items: center; justify-content: center; position: relative; width: 38px; height: 38px; flex-shrink: 0; margin-left: 8px;">
                <input type="file" class="def-image-input" accept="image/*" style="display: none;">
                ${item.defImage ? `
                    <div class="def-image-preview" style="position: relative; width: 38px; height: 38px; border-radius: 6px; border: 1px solid var(--border-color); overflow: hidden; cursor: pointer;">
                        <img src="${item.defImage}" style="width: 100%; height: 100%; object-fit: cover;">
                        <button class="remove-def-image-btn" title="Afbeelding verwijderen" style="position: absolute; top: 0; right: 0; background: rgba(239, 68, 68, 0.85); color: #fff; border: none; border-radius: 0 0 0 4px; width: 14px; height: 14px; padding: 0; font-size: 0.75rem; cursor: pointer; display: flex; align-items: center; justify-content: center; line-height: 1;">&times;</button>
                    </div>
                ` : `
                    <button class="add-def-image-btn" title="Afbeelding toevoegen" style="background: none; border: 1px dashed var(--border-color); border-radius: 6px; color: var(--text-secondary); cursor: pointer; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; transition: all 0.2s;"><i class="fa-regular fa-image"></i></button>
                `}
            </div>
            <button class="remove-row-btn" title="Rij verwijderen">&times;</button>
        `;

        const setupImageField = (containerSelector, fileInputClass, addBtnClass, removeBtnClass, previewClass, keyName) => {
            const container = row.querySelector(containerSelector);
            if (!container) return;
            const fileInput = container.querySelector('.' + fileInputClass);
            const addImgBtn = container.querySelector('.' + addBtnClass);
            const removeImgBtn = container.querySelector('.' + removeBtnClass);
            const imgPreview = container.querySelector('.' + previewClass);

            if (addImgBtn) {
                addImgBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    fileInput.click();
                });
            }

            if (imgPreview) {
                imgPreview.addEventListener('click', (e) => {
                    if (!removeImgBtn || (e.target !== removeImgBtn && !removeImgBtn.contains(e.target))) {
                        e.preventDefault();
                        fileInput.click();
                    }
                });
            }

            if (removeImgBtn) {
                removeImgBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const idx = parseInt(row.dataset.index);
                    if (!isNaN(idx) && allEditorItems[idx]) {
                        allEditorItems[idx][keyName] = '';
                        renderEditorPage();
                    }
                });
            }

            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const img = new Image();
                        img.onload = () => {
                            let width = img.width;
                            let height = img.height;
                            const maxSide = 400;
                            if (width > maxSide || height > maxSide) {
                                if (width > height) {
                                    height *= maxSide / width;
                                    width = maxSide;
                                } else {
                                    width *= maxSide / height;
                                    height = maxSide;
                                }
                            }
                            const canvas = document.createElement('canvas');
                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0, width, height);
                            
                            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                            const idx = parseInt(row.dataset.index);
                            if (!isNaN(idx) && allEditorItems[idx]) {
                                allEditorItems[idx][keyName] = dataUrl;
                                renderEditorPage();
                            }
                        };
                        img.src = event.target.result;
                    };
                    reader.readAsDataURL(file);
                }
            });
        };

        setupImageField('.term-image-container', 'term-image-input', 'add-term-image-btn', 'remove-term-image-btn', 'term-image-preview', 'image');
        setupImageField('.def-image-container', 'def-image-input', 'add-def-image-btn', 'remove-def-image-btn', 'def-image-preview', 'defImage');

        row.querySelector('.star-row-btn').addEventListener('click', (e) => {
            e.preventDefault();
            const isStarred = row.dataset.starred === 'true';
            row.dataset.starred = isStarred ? 'false' : 'true';
            const starBtn  = row.querySelector('.star-row-btn');
            const starIcon = starBtn.querySelector('i');
            starBtn.style.color = isStarred ? '#94a3b8' : '#eab308';
            starIcon.className  = isStarred ? 'fa-regular fa-star' : 'fa-solid fa-star';
            
            const idx = parseInt(row.dataset.index);
            if (!isNaN(idx) && allEditorItems[idx]) {
                allEditorItems[idx].starred = !isStarred;
            }
        });

        row.querySelector('.remove-row-btn').addEventListener('click', (e) => {
            e.preventDefault();
            const idx = parseInt(row.dataset.index);
            if (!isNaN(idx)) {
                saveInputsToMemory();
                allEditorItems.splice(idx, 1);
                const totalPages = Math.ceil(allEditorItems.length / editorPageSize);
                if (currentEditorPage > totalPages) {
                    currentEditorPage = Math.max(1, totalPages);
                }
                renderEditorPage();
            }
        });

        row.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                const idx = parseInt(row.dataset.index);
                if (!isNaN(idx) && allEditorItems[idx]) {
                    allEditorItems[idx].term = row.querySelector('.term-input').value;
                    allEditorItems[idx].definition = row.querySelector('.def-input').value;
                }
                manageEmptyRows();
            });
        });

        cardRowsContainer.appendChild(row);
    }

    function updateAddBtnText() {
        if (!addBtn) return;
        const totalPages = Math.ceil(allEditorItems.length / editorPageSize);
        const isOnLastPage = currentEditorPage === totalPages;
        const msgEl = document.getElementById('addCardRowMsg');
        
        if (isOnLastPage) {
            addBtn.style.display = 'flex';
            if (msgEl) msgEl.style.display = 'none';
            const isPageFull = allEditorItems.length > 0 && allEditorItems.length % editorPageSize === 0;
            if (isPageFull) {
                addBtn.innerHTML = '<i class="fa-solid fa-file-circle-plus"></i> Nieuwe pagina';
                addBtn.style.backgroundColor = '#3b82f6';
            } else {
                addBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Nieuwe kaart';
                addBtn.style.backgroundColor = '#52873e';
            }
        } else {
            addBtn.style.display = 'none';
            if (msgEl) msgEl.style.display = 'flex';
        }
    }

    function renderEditorPage() {
        cardRowsContainer.innerHTML = '';
        const shouldPaginate = allEditorItems.length > editorPageSize;
        
        if (shouldPaginate) {
            paginationDiv?.classList.remove('hidden');
        } else {
            cardRowsContainer.style.minHeight = '';
            paginationDiv?.classList.add('hidden');
        }
        
        const totalPages = Math.ceil(allEditorItems.length / editorPageSize);
        if (currentEditorPage > totalPages) {
            currentEditorPage = Math.max(1, totalPages);
        }
        
        const start = shouldPaginate ? (currentEditorPage - 1) * editorPageSize : 0;
        const end = shouldPaginate ? Math.min(allEditorItems.length, currentEditorPage * editorPageSize) : allEditorItems.length;
        
        if (shouldPaginate && paginationDiv) {
            paginationDiv.querySelector('#modalPageInfo').textContent = `Pagina ${currentEditorPage} van ${totalPages}`;
            paginationDiv.querySelector('#modalSkipPrevBtn').disabled = currentEditorPage === 1;
            paginationDiv.querySelector('#modalPrevPageBtn').disabled = currentEditorPage === 1;
            paginationDiv.querySelector('#modalNextPageBtn').disabled = currentEditorPage === totalPages;
            paginationDiv.querySelector('#modalSkipNextBtn').disabled = currentEditorPage === totalPages;
        }
        
        for (let i = start; i < end; i++) {
            const item = allEditorItems[i];
            renderRowDOM(item, i);
        }
        
        updatePlaceholderTexts();
        updateAddBtnText();
    }

    function addCardRow(term = '', definition = '', starred = false, image = '', defImage = '') {
        allEditorItems.push({ term, definition, starred, image, defImage });
    }

    function manageEmptyRows() {
        updateAddBtnText();
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
        allEditorItems = allEditorItems.filter(item => item.term.trim() !== '' || item.definition.trim() !== '');
        if (allEditorItems.length === 0) {
            allEditorItems.push({ term: '', definition: '', starred: false, image: '', defImage: '' });
        }
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
                if (term || def) { allEditorItems.push({ term, definition: def, starred: false, image: '', defImage: '' }); count++; }
            } else {
                allEditorItems.push({ term: clean, definition: '', starred: false, image: '', defImage: '' });
                count++;
            }
        });

        if (count > 0) {
            importTextarea.value = '';
            importPanel.classList.add('hidden');
            cleanEmptyRows();
            if (allEditorItems.length >= 200) {
                currentEditorPage = Math.ceil(allEditorItems.length / editorPageSize);
            } else {
                currentEditorPage = 1;
            }
            renderEditorPage();
        }
    }

    function resetForNew() {
        allEditorItems = [{ term: '', definition: '', starred: false, image: '', defImage: '' }];
        currentEditorPage = 1;
        const toggle = document.getElementById('langLearningToggle');
        if (toggle) toggle.checked = false;

        populateLanguageSelects();

        document.getElementById('langSelectorContainer')?.classList.add('hidden');
        document.getElementById('singleLangContainer')?.classList.remove('hidden');

        renderEditorPage();
    }

    function loadSetIntoEditor(setData) {
        allEditorItems = [];
        currentEditorPage = 1;
        
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
            setData.items.forEach(item => addCardRow(item.term, item.definition, !!item.starred, item.image || '', item.defImage || ''));
        }

        if (allEditorItems.length === 0) {
            allEditorItems.push({ term: '', definition: '', starred: false, image: '', defImage: '' });
        }

        renderEditorPage();
    }

    function collectItems() {
        saveInputsToMemory();
        for (let i = 0; i < allEditorItems.length; i++) {
            const item = allEditorItems[i];
            const term = item.term.trim();
            const def  = item.definition.trim();
            if ((term && !def) || (!term && def)) {
                throw new Error('Elke kaart moet zowel een term als een definitie hebben.');
            }
        }
        allEditorItems = allEditorItems.filter(item => item.term.trim() !== '' || item.definition.trim() !== '');
        if (allEditorItems.length === 0) {
            allEditorItems.push({ term: '', definition: '', starred: false, image: '', defImage: '' });
        }
        renderEditorPage();
        const items = [];
        for (let i = 0; i < allEditorItems.length; i++) {
            const item = allEditorItems[i];
            const term = item.term.trim();
            const def  = item.definition.trim();
            if (term && def) items.push({ term, definition: def, starred: item.starred, image: item.image || '', defImage: item.defImage || '' });
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
            <div id="saveIndicator" class="save-indicator" title="Opslagstatus">
                <span class="save-icon"><i class="fa-solid fa-cloud-arrow-up"></i></span>
                <span class="save-text">Opgeslagen</span>
            </div>
            <button id="themeToggle" class="theme-toggle-btn" title="Donkere/Lichte modus"><i class="fa-solid fa-moon"></i></button>
            <div class="header-actions">
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSenU2OuAafpBvayn0mgszuJmPA7dDdeHLP5ou0xpljfj0yRcg/viewform?usp=publish-editor" target="_blank" class="btn btn-secondary btn-sm" style="background-color: #dc2626; color: white; margin-right: 10px;" title="Glitch of Bug melden"><i class="fa-solid fa-triangle-exclamation"></i> Bug melden</a>
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
                <a href="https://docs.google.com/forms/d/e/1FAIpQLSenU2OuAafpBvayn0mgszuJmPA7dDdeHLP5ou0xpljfj0yRcg/viewform?usp=publish-editor" target="_blank" style="color: #ef4444; font-weight: 600;"><i class="fa-solid fa-bug"></i> Glitch/Bug melden</a>
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
                <input type="text" id="setTitleInput" placeholder="Bijv. Spaans Hoofdstuk 1" autocomplete="off">
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
            <div id="confirmModalIcon" style="font-size: 3rem; margin-bottom: 15px; color: #ef4444;"><i class="fa-solid fa-trash-can"></i>
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

window.activeSaves = new Set();

window.addEventListener('beforeunload', (e) => {
    const setModal = document.getElementById('setModal');
    const isEditing = setModal && !setModal.classList.contains('hidden');
    if (isEditing || (window.activeSaves && window.activeSaves.size > 0)) {
        e.preventDefault();
        e.returnValue = 'Changes you made may not be saved.';
        return e.returnValue;
    }
});

window.startSaveOperation = function(id) {
    window.activeSaves.add(id);
    window.updateSaveStatus('saving');
};

window.endSaveOperation = function(id, success = true) {
    window.activeSaves.delete(id);
    if (window.activeSaves.size === 0) {
        window.updateSaveStatus(success ? 'saved' : 'error');
    } else {
        window.updateSaveStatus('saving');
    }
};

window.updateSaveStatus = function(status) {
    const indicator = document.getElementById('saveIndicator');
    if (!indicator) return;

    if (window.saveStatusTimeout) {
        clearTimeout(window.saveStatusTimeout);
        window.saveStatusTimeout = null;
    }

    // Return early if we are already in saving state to prevent resetting the spinner rotation animation
    if (status === 'saving' && indicator.classList.contains('saving')) {
        return;
    }

    // Reset classes
    indicator.className = 'save-indicator visible';

    const iconEl = indicator.querySelector('.save-icon');
    const textEl = indicator.querySelector('.save-text');

    if (status === 'saving') {
        indicator.classList.add('saving');
        if (iconEl) iconEl.innerHTML = '<i class="fa-solid fa-rotate save-icon-spinner"></i>';
        if (textEl) textEl.textContent = 'Opslaan...';
    } else if (status === 'saved') {
        indicator.classList.add('saved');
        if (iconEl) iconEl.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i>';
        if (textEl) textEl.textContent = 'Opgeslagen';

        // Auto hide after 2 seconds
        window.saveStatusTimeout = setTimeout(() => {
            indicator.classList.remove('visible');
        }, 2000);
    } else if (status === 'error') {
        indicator.classList.add('error');
        if (iconEl) iconEl.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i>';
        if (textEl) textEl.textContent = 'Fout bij opslaan';
    } else {
        indicator.classList.remove('visible');
    }
};

// Zorg dat bij ELKE input in heel quizy suggesties van oude dingen niet worden getoond
(function() {
    function disableAutocompleteGlobally() {
        document.querySelectorAll('input').forEach(input => {
            if (!input.hasAttribute('autocomplete')) {
                input.setAttribute('autocomplete', 'off');
            }
        });
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'INPUT') {
                            node.setAttribute('autocomplete', 'off');
                        }
                        node.querySelectorAll('input').forEach(input => {
                            input.setAttribute('autocomplete', 'off');
                        });
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', disableAutocompleteGlobally);
    } else {
        disableAutocompleteGlobally();
    }
})();

// PWA setup specific to Quizy
(function() {
    // 1. Inject manifest
    const manifestLink = document.createElement('link');
    manifestLink.rel = 'manifest';
    manifestLink.href = '/quizy/app.webmanifest';
    document.head.appendChild(manifestLink);

    // 2. Register Service Worker
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/quizy/sw.js')
                .then(reg => console.log('Quizy Service Worker registered', reg))
                .catch(err => console.error('Quizy Service Worker registration failed', err));
        });
    }

    // 3. PWA Installation Flow
    window.deferredPrompt = null;

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        window.deferredPrompt = e;
        setupPwaButtons();
        updatePwaButtonsVisibility();
    });

    window.addEventListener('appinstalled', (e) => {
        console.log('Quizy PWA was installed');
        window.deferredPrompt = null;
        updatePwaButtonsVisibility();
    });

    function triggerPwaInstall() {
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
            window.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the Quizy install prompt');
                } else {
                    console.log('User dismissed the Quizy install prompt');
                }
                window.deferredPrompt = null;
                updatePwaButtonsVisibility();
            });
        }
    }

    function setupPwaButtons() {
        // Mobile PWA Install button (links naast themeToggle)
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle && !document.getElementById('pwa-install-mobile')) {
            const mobileBtn = document.createElement('button');
            mobileBtn.id = 'pwa-install-mobile';
            mobileBtn.className = 'pwa-download-btn-mobile';
            mobileBtn.title = 'App downloaden';
            mobileBtn.innerHTML = '<i class="fa-solid fa-circle-down"></i>';
            mobileBtn.style.display = 'none';
            themeToggle.parentNode.insertBefore(mobileBtn, themeToggle);
            mobileBtn.addEventListener('click', triggerPwaInstall);
        }

        // Desktop PWA Install button (rechts in dashboard-intro)
        const dashboardIntro = document.querySelector('.dashboard-intro');
        if (dashboardIntro && !document.getElementById('pwa-install-desktop')) {
            const desktopBtn = document.createElement('button');
            desktopBtn.id = 'pwa-install-desktop';
            desktopBtn.className = 'pwa-download-btn-desktop';
            desktopBtn.innerHTML = '<i class="fa-solid fa-download"></i> App downloaden';
            desktopBtn.style.display = 'none';
            dashboardIntro.appendChild(desktopBtn);
            desktopBtn.addEventListener('click', triggerPwaInstall);
        }
    }

    function updatePwaButtonsVisibility() {
        const show = !!window.deferredPrompt && !window.matchMedia('(display-mode: standalone)').matches;
        const mBtn = document.getElementById('pwa-install-mobile');
        const dBtn = document.getElementById('pwa-install-desktop');
        if (mBtn) mBtn.style.display = show ? 'flex' : 'none';
        if (dBtn) dBtn.style.display = show ? 'inline-flex' : 'none';
    }

    // Keep checking for the elements in the DOM
    document.addEventListener('DOMContentLoaded', () => {
        setupPwaButtons();
        updatePwaButtonsVisibility();
        
        const pwaInterval = setInterval(() => {
            setupPwaButtons();
            updatePwaButtonsVisibility();
        }, 1000);
        
        setTimeout(() => clearInterval(pwaInterval), 10000);
    });
})();



