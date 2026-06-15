function saveSpellingProgress() {
    gameProgress.spelling = {
        queue: activeRepetitionQueue,
        completedCount: activeCompletedCount
    };
    saveProgressToDrive();
}

function renderSpelling() {
    if (currentMode !== 'spelling') return;
    if (!activeRepetitionQueue || activeRepetitionQueue.length === 0) {
        renderCompletedScreen('spelling', 'Spelling voltooid!');
        return;
    }

    const pct = Math.round((activeCompletedCount / setTerms.length) * 100);
    updateProgressBar(pct);

    const activeItem = activeRepetitionQueue[0];
    const activeWord = setTerms[activeItem.index];
    learnRetypeMode = false;

    const answerWith = document.getElementById('answerWithSelect').value;
    let speakTextVal, clueText, correctWord, promptLabel;

    if (answerWith === 'term') {
        speakTextVal = activeWord.term;
        clueText = activeWord.definition;
        correctWord = activeWord.term.trim().toLowerCase();
        if (setFile.isLanguageLearning) {
            const leftName = getLanguageName(setFile.langLeft, 'Taal 1');
            promptLabel = `Typ het woord in het <em>${escapeHTML(leftName)}</em> dat je hoort (clue: <em>${escapeHTML(clueText)}</em>)`;
        } else {
            promptLabel = `Typ het woord dat je hoort (clue: <em>${escapeHTML(clueText)}</em>)`;
        }
    } else {
        speakTextVal = activeWord.definition;
        clueText = activeWord.term;
        correctWord = activeWord.definition.trim().toLowerCase();
        if (setFile.isLanguageLearning) {
            const rightName = getLanguageName(setFile.langRight, 'Taal 2');
            promptLabel = `Typ de vertaling in het <em>${escapeHTML(rightName)}</em> die je hoort (clue: <em>${escapeHTML(clueText)}</em>)`;
        } else {
            promptLabel = `Typ de definitie die je hoort (clue: <em>${escapeHTML(clueText)}</em>)`;
        }
    }

    const countText = activeItem.weight > 1 ? ` (Herhalen: nog ${activeItem.weight}x goed)` : '';

    const activeImage = (answerWith === 'term') ? activeWord.defImage : activeWord.image;
    const realIndex = currentSetData.items.indexOf(activeWord);
    modeContent.innerHTML = `
        <button class="quick-star-btn" onclick="toggleQuickStar(${realIndex})" style="position: absolute; top: 15px; right: 15px; background: none; border: none; font-size: 1.6rem; color: ${activeWord.starred ? '#eab308' : '#cbd5e1'}; cursor: pointer; transition: color 0.2s; padding: 5px; z-index: 10;" title="Moeilijk woord markeren">
            <i class="${activeWord.starred ? 'fa-solid' : 'fa-regular'} fa-star"></i>
        </button>
        <div style="text-align: center; color: #64748b; font-size: 0.9rem; margin-bottom: 15px;">
            Voltooid: ${activeCompletedCount} / ${setTerms.length} woorden ${countText}
        </div>
        <div class="prompt-text">${promptLabel}</div>
        ${activeImage ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${activeImage}" style="max-width: 150px; max-height: 150px; border-radius: 8px; border: 1px solid var(--border-color); object-fit: contain;"></div>` : ''}
        <div style="text-align: center; margin-bottom: 25px;">
            <button class="btn btn-secondary" id="speakWordBtn" style="font-size:1.1rem; padding:15px 30px;"><i class="fa-solid fa-volume-high"></i> Luister</button>
        </div>
        <div class="answer-form">
            <input type="text" id="spellingInput" placeholder="Spelling..." autofocus autocomplete="off">
            <button class="btn" id="spellingSubmitBtn">Controleren</button>
        </div>
        <div id="spellingFeedback"></div>
    `;

    const input = document.getElementById('spellingInput');
    const submitBtn = document.getElementById('spellingSubmitBtn');
    const speakBtn = document.getElementById('speakWordBtn');

    input.focus();

    const speakLang = (answerWith === 'term') ? (setFile.langLeft || 'nl-NL') : (setFile.langRight || 'en-US');
    
    const savedAutoPlay = localStorage.getItem('quizy_auto_play_audio') === 'true';
    if (savedAutoPlay) {
        speakText(speakTextVal, speakLang);
    }

    speakBtn.addEventListener('click', () => speakText(speakTextVal, speakLang));

    const checkAnswer = () => {
        if (submitBtn.textContent === 'Doorgaan') {
            renderSpelling();
            return;
        }

        const answer = input.value.trim().toLowerCase();

        if (learnRetypeMode) {
            if (answer === correctWord) {
                renderSpelling();
            } else {
                document.getElementById('spellingFeedback').innerHTML = `
                    <div class="status-box incorrect">Typ exact over: <br><strong>${escapeHTML(speakTextVal)}</strong></div>
                `;
                input.value = '';
                input.focus();
            }
            return;
        }

        const activeItemProcessed = activeRepetitionQueue.shift();

        if (answer === correctWord) {
            document.getElementById('spellingFeedback').innerHTML = `
                <div class="status-box correct">Super, exact goed gespeld! <i class="fa-solid fa-star" style="color: #eab308;"></i></div>
            `;
            input.disabled = true;
            submitBtn.disabled = true;

            activeItemProcessed.weight--;
            if (activeItemProcessed.weight > 0) {
                rescheduleItem(activeRepetitionQueue, activeItemProcessed);
            } else {
                activeCompletedCount++;
            }

            saveSpellingProgress();

            setTimeout(() => {
                renderSpelling();
            }, 1000);
        } else {
            const retypeEnabled = localStorage.getItem('quizy_retype_on_incorrect') !== 'false';

            activeItemProcessed.weight = Math.min(3, activeItemProcessed.weight + 1);
            rescheduleItem(activeRepetitionQueue, activeItemProcessed);

            saveSpellingProgress();

            if (retypeEnabled) {
                learnRetypeMode = true;
                document.getElementById('spellingFeedback').innerHTML = `
                    <div class="status-box incorrect">Niet helemaal juist. Het juiste antwoord is:<br><strong style="font-size:1.2rem; color:#d97706;">${escapeHTML(speakTextVal)}</strong><br><br>Typ het antwoord hierboven exact correct over om door te gaan.</div>
                `;
                input.value = '';
                input.focus();
            } else {
                document.getElementById('spellingFeedback').innerHTML = `
                    <div class="status-box incorrect">Niet helemaal juist. Het juiste antwoord is:<br><strong style="font-size:1.2rem; color:#d97706;">${escapeHTML(speakTextVal)}</strong></div>
                `;
                input.disabled = true;
                submitBtn.textContent = 'Doorgaan';
                submitBtn.focus();
            }
        }
    };

    submitBtn.addEventListener('click', checkAnswer);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });
}

