// js/modes/spelling.js

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
    let speakText, clueText, correctWord, promptLabel;

    if (setFile.isLanguageLearning) {
        const localesMap = {
            'nl-NL': 'Nederlands',
            'en-US': 'Engels',
            'fr-FR': 'Frans',
            'de-DE': 'Duits'
        };
        const leftName = localesMap[setFile.langLeft] || 'Taal 1';
        const rightName = localesMap[setFile.langRight] || 'Taal 2';

        if (answerWith === 'term') {
            speakText = activeWord.term;
            clueText = activeWord.definition;
            correctWord = activeWord.term.trim().toLowerCase();
            promptLabel = `Typ het woord in het <em>${escapeHTML(leftName)}</em> dat je hoort (clue: <em>${escapeHTML(clueText)}</em>)`;
        } else {
            speakText = activeWord.definition;
            clueText = activeWord.term;
            correctWord = activeWord.definition.trim().toLowerCase();
            promptLabel = `Typ de vertaling in het <em>${escapeHTML(rightName)}</em> die je hoort (clue: <em>${escapeHTML(clueText)}</em>)`;
        }
    } else {
        if (answerWith === 'term') {
            speakText = activeWord.term;
            clueText = activeWord.definition;
            correctWord = activeWord.term.trim().toLowerCase();
            promptLabel = `Typ het woord dat je hoort (clue: <em>${escapeHTML(clueText)}</em>)`;
        } else {
            speakText = activeWord.definition;
            clueText = activeWord.term;
            correctWord = activeWord.definition.trim().toLowerCase();
            promptLabel = `Typ de definitie die je hoort (clue: <em>${escapeHTML(clueText)}</em>)`;
        }
    }

    const countText = activeItem.weight > 1 ? ` (Herhalen: nog ${activeItem.weight}x goed)` : '';

    modeContent.innerHTML = `
        <div style="text-align: center; color: #64748b; font-size: 0.9rem; margin-bottom: 15px;">
            Voltooid: ${activeCompletedCount} / ${setTerms.length} woorden ${countText}
        </div>
        <div class="prompt-text">${promptLabel}</div>
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
        speakSpellingWord(speakText, speakLang);
    }

    speakBtn.addEventListener('click', () => speakSpellingWord(speakText, speakLang));

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
                    <div class="status-box incorrect">Typ exact over: <br><strong>${escapeHTML(speakText)}</strong></div>
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

            gameProgress.spelling = {
                queue: activeRepetitionQueue,
                completedCount: activeCompletedCount
            };
            saveProgressToDrive();

            setTimeout(() => {
                renderSpelling();
            }, 1000);
        } else {
            const retypeEnabled = localStorage.getItem('quizy_retype_on_incorrect') !== 'false';

            activeItemProcessed.weight = Math.min(3, activeItemProcessed.weight + 1);
            rescheduleItem(activeRepetitionQueue, activeItemProcessed);

            gameProgress.spelling = {
                queue: activeRepetitionQueue,
                completedCount: activeCompletedCount
            };
            saveProgressToDrive();

            if (retypeEnabled) {
                learnRetypeMode = true;
                document.getElementById('spellingFeedback').innerHTML = `
                    <div class="status-box incorrect">Niet helemaal juist. Het juiste antwoord is:<br><strong style="font-size:1.2rem; color:#d97706;">${escapeHTML(speakText)}</strong><br><br>Typ het antwoord hierboven exact correct over om door te gaan.</div>
                `;
                input.value = '';
                input.focus();
            } else {
                document.getElementById('spellingFeedback').innerHTML = `
                    <div class="status-box incorrect">Niet helemaal juist. Het juiste antwoord is:<br><strong style="font-size:1.2rem; color:#d97706;">${escapeHTML(speakText)}</strong></div>
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

function speakSpellingWord(word, lang) {
    if ('speechSynthesis' in window) {
        try {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.lang = lang || 'nl-NL';
            window.speechSynthesis.speak(utterance);
        } catch (e) {
            console.warn("Spraaksynthese mislukt:", e);
        }
    }
}
