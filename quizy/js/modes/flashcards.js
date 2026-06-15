// js/modes/flashcards.js

function renderFlashcards() {
    if (currentMode !== 'flashcards') return;
    if (!flashcardQueue || flashcardQueue.length === 0) {
        flashcardQueue = setTerms.map((_, i) => i);
    }

    if (currentIdx >= flashcardQueue.length) {
        if (flashcardStates.unknown.length > 0) {
            const numUnknown = flashcardStates.unknown.length;
            modeContent.innerHTML = `
                <div class="completed-screen">
                    <div class="completed-icon"><i class="fa-solid fa-arrows-rotate"></i></div>
                    <h2>Ronde voltooid!</h2>
                    <p style="color:#64748b; margin-bottom: 30px;">Je hebt alle kaarten gehad. Laten we de ${numUnknown} ${numUnknown === 1 ? 'kaart' : 'kaarten'} die je nog niet wist opnieuw proberen!</p>
                    <button class="btn" id="startNextRoundBtn">Volgende ronde starten</button>
                </div>
            `;
            document.getElementById('startNextRoundBtn').addEventListener('click', () => {
                flashcardQueue = [...flashcardStates.unknown];
                flashcardStates.unknown = [];
                currentIdx = 0;

                saveFlashcardProgress();
                renderFlashcards();
            });
            return;
        } else {
            renderCompletedScreen('flashcards', 'Flashcards voltooid!');
            return;
        }
    }

    const pct = Math.round((currentIdx / flashcardQueue.length) * 100);
    updateProgressBar(pct);

    const termRealIdx = flashcardQueue[currentIdx];
    const activeWord = setTerms[termRealIdx];

    const answerWith = document.getElementById('answerWithSelect').value;
    let frontText, backText, frontLang, backLang;
    if (answerWith === 'term') {
        frontText = activeWord.definition;
        backText = activeWord.term;
    } else {
        frontText = activeWord.term;
        backText = activeWord.definition;
    }

    frontLang = (answerWith === 'term') ? (setFile.langRight || 'en-US') : (setFile.langLeft || 'nl-NL');
    backLang = (answerWith === 'term') ? (setFile.langLeft || 'nl-NL') : (setFile.langRight || 'en-US');

    let frontImageHTML = '', backImageHTML = '';
    const termImg = activeWord.image;
    const defImg = activeWord.defImage;
    if (answerWith === 'term') {
        if (defImg) {
            frontImageHTML = `<div style="margin-top: 15px; text-align: center;"><img src="${defImg}" style="max-width: 140px; max-height: 140px; border-radius: 8px; border: 1px solid var(--border-color); object-fit: contain;"></div>`;
        }
        if (termImg) {
            backImageHTML = `<div style="margin-top: 15px; text-align: center;"><img src="${termImg}" style="max-width: 140px; max-height: 140px; border-radius: 8px; border: 1px solid var(--border-color); object-fit: contain;"></div>`;
        }
    } else {
        if (termImg) {
            frontImageHTML = `<div style="margin-top: 15px; text-align: center;"><img src="${termImg}" style="max-width: 140px; max-height: 140px; border-radius: 8px; border: 1px solid var(--border-color); object-fit: contain;"></div>`;
        }
        if (defImg) {
            backImageHTML = `<div style="margin-top: 15px; text-align: center;"><img src="${defImg}" style="max-width: 140px; max-height: 140px; border-radius: 8px; border: 1px solid var(--border-color); object-fit: contain;"></div>`;
        }
    }

    const realIndex = currentSetData.items.indexOf(activeWord);
    modeContent.innerHTML = `
        <div style="text-align: center; color: #64748b; font-size: 0.9rem; margin-bottom: 15px;">
            Kaart ${currentIdx + 1} / ${flashcardQueue.length} (Ronde) | Weet ik: ${flashcardStates.known.length}, Nog niet: ${flashcardStates.unknown.length}
        </div>

        <div class="flashcard-wrapper" style="position: relative;">
            <button class="quick-star-btn" onclick="event.stopPropagation(); toggleQuickStar(${realIndex})" style="position: absolute; top: 15px; right: 15px; z-index: 10; background: none; border: none; font-size: 1.6rem; color: ${activeWord.starred ? '#eab308' : '#cbd5e1'}; cursor: pointer; transition: color 0.2s; padding: 5px; line-height: 1;" title="Moeilijk woord markeren">
                <i class="${activeWord.starred ? 'fa-solid' : 'fa-regular'} fa-star"></i>
            </button>
            <div class="flashcard" id="activeFlashcard" data-front-lang="${frontLang}" data-back-lang="${backLang}" onclick="toggleFlip()">
                <div class="card-face card-front" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div>${escapeHTML(frontText)}</div>
                    ${frontImageHTML}
                </div>
                <div class="card-face card-back" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
                    <div>${escapeHTML(backText)}</div>
                    ${backImageHTML}
                </div>
            </div>
        </div>

        <div class="flashcard-actions">
            <button class="btn btn-danger" id="dontKnowBtn"><i class="fa-solid fa-xmark"></i> Weet ik niet</button>
            <button class="btn" id="knowBtn"><i class="fa-solid fa-check"></i> Weet ik</button>
        </div>
    `;

    const savedAutoPlay = localStorage.getItem('quizy_auto_play_audio') === 'true';
    if (savedAutoPlay) {
        setTimeout(() => {
            speakText(frontText, frontLang);
        }, 100);
    }

    document.getElementById('knowBtn').addEventListener('click', () => recordFlashcardResult(true));
    document.getElementById('dontKnowBtn').addEventListener('click', () => recordFlashcardResult(false));
}

function toggleFlip() {
    const card = document.getElementById('activeFlashcard');
    if (card) {
        card.classList.toggle('flipped');

        const savedAutoPlay = localStorage.getItem('quizy_auto_play_audio') === 'true';
        if (savedAutoPlay) {
            if (card.classList.contains('flipped')) {
                const backText = card.querySelector('.card-back div').textContent;
                const backLang = card.dataset.backLang || 'nl-NL';
                speakText(backText, backLang);
            } else {
                const frontText = card.querySelector('.card-front div').textContent;
                const frontLang = card.dataset.frontLang || 'nl-NL';
                speakText(frontText, frontLang);
            }
        }
    }
}

function saveFlashcardProgress() {
    gameProgress.flashcards = {
        queue: flashcardQueue,
        known: flashcardStates.known,
        unknown: flashcardStates.unknown,
        currentIndex: currentIdx
    };
    saveProgressToDrive();
}

function recordFlashcardResult(known) {
    const termRealIdx = flashcardQueue[currentIdx];
    if (known) {
        if (!flashcardStates.known.includes(termRealIdx)) {
            flashcardStates.known.push(termRealIdx);
        }
        const unknownIdx = flashcardStates.unknown.indexOf(termRealIdx);
        if (unknownIdx !== -1) {
            flashcardStates.unknown.splice(unknownIdx, 1);
        }
    } else {
        if (!flashcardStates.unknown.includes(termRealIdx)) {
            flashcardStates.unknown.push(termRealIdx);
        }
        const knownIdx = flashcardStates.known.indexOf(termRealIdx);
        if (knownIdx !== -1) {
            flashcardStates.known.splice(knownIdx, 1);
        }
        
        // Count how many times this card is already in the remaining queue
        const remainingQueue = flashcardQueue.slice(currentIdx + 1);
        const countInQueue = remainingQueue.filter(idx => idx === termRealIdx).length;
        const copiesToAdd = Math.min(2, 3 - countInQueue);

        if (copiesToAdd >= 1) {
            const offset1 = Math.floor(Math.random() * (5 - 3 + 1)) + 3; // 3 to 5 steps away
            const targetIdx1 = Math.min(flashcardQueue.length, currentIdx + 1 + offset1);
            flashcardQueue.splice(targetIdx1, 0, termRealIdx);
        }
        if (copiesToAdd >= 2) {
            const offset2 = Math.floor(Math.random() * (10 - 7 + 1)) + 7; // 7 to 10 steps away
            const targetIdx2 = Math.min(flashcardQueue.length, currentIdx + 1 + offset2);
            flashcardQueue.splice(targetIdx2, 0, termRealIdx);
        }
    }

    currentIdx++;

    saveFlashcardProgress();
    renderFlashcards();
}
