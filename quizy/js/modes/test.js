// js/modes/test.js

function renderTest() {
    if (currentMode !== 'test') return;
    barContainer.classList.add('hidden');

    if (!isTestActive) {
        // Render setup screen
        const maxQuestions = setTerms.length;
        let limitOptionsHTML = '';
        [5, 10, 20, 50, 100].forEach(val => {
            if (val <= maxQuestions) {
                limitOptionsHTML += `<option value="${val}">${val} woorden</option>`;
            }
        });
        limitOptionsHTML += `<option value="${maxQuestions}">Alle (${maxQuestions}) woorden</option>`;

        modeContent.innerHTML = `
            <div style="max-width: 500px; margin: 0 auto; text-align: left; padding: 20px;">
                <h2 style="margin-top: 0; font-size: 1.5rem; text-align: center; color: var(--text-primary); margin-bottom: 25px;"><i class="fa-solid fa-file-lines" style="color: #3b82f6;"></i> Oefentoets Instellingen</h2>
                
                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="font-weight: 600; color: var(--text-primary); margin-bottom: 8px; display: block;">Aantal woorden:</label>
                    <div class="custom-select-wrapper">
                        <select id="testLimitSelect" class="custom-select">
                            ${limitOptionsHTML}
                        </select>
                    </div>
                </div>

                <div style="margin-bottom: 25px;">
                    <label style="font-weight: 600; color: var(--text-primary); margin-bottom: 12px; display: block;">Vraagtypes inbegrepen:</label>
                    <div style="display: flex; flex-direction: column; gap: 10px;">
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; color: var(--text-primary);">
                            <input type="checkbox" id="typeChoice" checked style="width: 18px; height: 18px; cursor: pointer;">
                            <span>Meerkeuze</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; color: var(--text-primary);">
                            <input type="checkbox" id="typeTF" checked style="width: 18px; height: 18px; cursor: pointer;">
                            <span>Waar / Niet waar</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; color: var(--text-primary);">
                            <input type="checkbox" id="typeOpen" checked style="width: 18px; height: 18px; cursor: pointer;">
                            <span>Open vragen (Typen)</span>
                        </label>
                        <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; color: var(--text-primary);">
                            <input type="checkbox" id="typeMatch" checked style="width: 18px; height: 18px; cursor: pointer;">
                            <span>Verbinden (Matching)</span>
                        </label>
                    </div>
                </div>

                <button class="btn" id="startTestBtn" style="width: 100%;">Toets starten</button>
            </div>
        `;

        document.getElementById('startTestBtn').addEventListener('click', () => {
            const limit = parseInt(document.getElementById('testLimitSelect').value, 10);
            const types = [];
            if (document.getElementById('typeChoice').checked) types.push('choice');
            if (document.getElementById('typeTF').checked) types.push('tf');
            if (document.getElementById('typeOpen').checked) types.push('open');
            if (document.getElementById('typeMatch').checked) types.push('match');

            if (types.length === 0) {
                alert("Selecteer ten minste één vraagtype!");
                return;
            }

            testConfig = { limit, types };
            isTestActive = true;
            generateTestQuestions();
            gameProgress.test = {
                isTestActive: true,
                config: testConfig,
                questions: generatedQuestions
            };
            saveProgressToDrive();
            renderTest();
        });
        return;
    }

    // Render active test questions
    let questionsHTML = '';
    generatedQuestions.forEach((q, index) => {
        questionsHTML += `
            <div class="test-question" data-idx="${index}">
                <div class="test-question-title">${index + 1}. ${escapeHTML(q.prompt)}</div>
                ${q.image ? `<div style="margin: 10px 0;"><img src="${q.image}" style="max-width: 120px; max-height: 120px; border-radius: 6px; border: 1px solid var(--border-color); object-fit: contain;"></div>` : ''}
        `;

        if (q.type === 'choice') {
            questionsHTML += `<div class="test-choices">`;
            q.options.forEach((opt, optIdx) => {
                questionsHTML += `
                    <label class="test-radio-label">
                        <input type="radio" name="q-${index}" value="${escapeHTML(opt)}">
                        <span>${escapeHTML(opt)}</span>
                    </label>
                `;
            });
            questionsHTML += `</div>`;
        } else if (q.type === 'tf') {
            questionsHTML += `
                <div class="test-choices">
                    <label class="test-radio-label">
                        <input type="radio" name="q-${index}" value="True">
                        <span>Waar</span>
                    </label>
                    <label class="test-radio-label">
                        <input type="radio" name="q-${index}" value="False">
                        <span>Niet Waar</span>
                    </label>
                </div>
            `;
        } else if (q.type === 'open') {
            questionsHTML += `
                <div class="answer-form" style="max-width:100%">
                    <input type="text" class="test-open-input" name="q-${index}" placeholder="Jouw antwoord..." autocomplete="off">
                </div>
            `;
        } else if (q.type === 'match') {
            questionsHTML += `
                <div style="display: flex; gap: 20px; flex-wrap: wrap; margin-top: 10px;">
                    <!-- Terms with dropdowns -->
                    <div style="flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 12px;">
                        ${q.terms.map((t, tIdx) => `
                            <div style="display: flex; align-items: center; gap: 10px; background: var(--bg-primary); padding: 8px 12px; border-radius: 8px; border: 1px solid var(--border-color);">
                                <select class="custom-select" name="q-${index}-match-${tIdx}" style="width: auto; padding: 6px 24px 6px 10px;">
                                    <option value="">Kies...</option>
                                    ${q.definitions.map((_, dIdx) => `
                                        <option value="${String.fromCharCode(65 + dIdx)}">${String.fromCharCode(65 + dIdx)}</option>
                                    `).join('')}
                                </select>
                                <div style="display: flex; align-items: center; gap: 8px;">
                                    ${t.image ? `<img src="${t.image}" style="max-height: 25px; max-width: 40px; border-radius: 4px; object-fit: contain;">` : ''}
                                    <span style="font-weight: 600; color: var(--text-primary);">${escapeHTML(t.term)}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                    <!-- Definitions with letters -->
                    <div style="flex: 1; min-width: 250px; display: flex; flex-direction: column; gap: 8px;">
                        ${q.definitions.map((d, dIdx) => `
                            <div style="padding: 8px 12px; background: var(--card-bg); border-radius: 8px; border: 1px solid var(--border-color); font-size: 0.95rem; color: var(--text-primary);">
                                <strong style="color: var(--brand-color);">${String.fromCharCode(65 + dIdx)}.</strong> ${escapeHTML(d)}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        questionsHTML += `</div>`;
    });

    let totalTermsInTest = 0;
    generatedQuestions.forEach(q => {
        if (q.type === 'match') {
            totalTermsInTest += q.terms.length;
        } else {
            totalTermsInTest += 1;
        }
    });

    modeContent.innerHTML = `
        <div style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid var(--border-color); padding-bottom: 15px; flex-wrap: wrap; gap: 10px;">
            <div>
                <h2 style="margin:0; font-size:1.4rem;">Toets: ${escapeHTML(currentSetData.title)}</h2>
                <p style="color:#64748b; margin:5px 0 0 0;">Beantwoord de vragen en klik op Toets nakijken. (Totaal ${totalTermsInTest} van de ${setTerms.length} woorden worden getoetst in ${generatedQuestions.length} vragen)</p>
            </div>
            <button class="btn btn-secondary btn-sm" id="resetTestBtn"><i class="fa-solid fa-rotate-right"></i> Opnieuw instellen</button>
        </div>
        <div>
            ${questionsHTML}
        </div>
        <div style="text-align: center; margin-top:30px;">
            <button class="btn" id="submitTestBtn">Toets nakijken</button>
        </div>
        <div id="testResults"></div>
    `;

    document.getElementById('submitTestBtn').addEventListener('click', checkTestAnswers);
    document.getElementById('resetTestBtn').addEventListener('click', () => {
        isTestActive = false;
        generatedQuestions = [];
        gameProgress.test = { isTestActive: false };
        saveProgressToDrive(true);
        renderTest();
    });
}

function generateTestQuestions() {
    generatedQuestions = [];
    const shuffled = shuffleArray(setTerms);
    const sample = shuffled.slice(0, Math.min(testConfig.limit, setTerms.length));
    const selectedTypes = testConfig.types || ['choice', 'tf', 'open', 'match'];

    let i = 0;
    while (i < sample.length) {
        const currentType = selectedTypes[Math.floor(Math.random() * selectedTypes.length)];

        if (currentType === 'match' && (sample.length - i >= 2)) {
            const blockSize = Math.min(4, sample.length - i);
            const blockItems = sample.slice(i, i + blockSize);
            i += blockSize;

            const originalDefs = blockItems.map(item => item.definition);
            const shuffledDefs = shuffleArray(originalDefs);

            const correctAnswers = blockItems.map(item => {
                const correctIdx = shuffledDefs.indexOf(item.definition);
                return String.fromCharCode(65 + correctIdx);
            });

            generatedQuestions.push({
                type: 'match',
                prompt: `Verbind de juiste termen met hun definities:`,
                terms: blockItems,
                definitions: shuffledDefs,
                correctAnswers: correctAnswers
            });
        } else {
            const item = sample[i];
            i++;

            const nonMatchTypes = selectedTypes.filter(t => t !== 'match');
            const finalType = nonMatchTypes.length > 0 ? nonMatchTypes[Math.floor(Math.random() * nonMatchTypes.length)] : 'open';

            if (finalType === 'choice') {
                const otherDefs = setTerms.filter(t => t.definition !== item.definition).map(t => t.definition);
                generatedQuestions.push({
                    type: 'choice',
                    prompt: `Wat is de definitie van: '${item.term}'?`,
                    correctAnswer: item.definition,
                    options: generateMultipleChoiceOptions(item.definition, otherDefs),
                    image: item.image || ''
                });
            } else if (finalType === 'tf') {
                const randomIsCorrect = Math.random() > 0.5;
                let displayDef = item.definition;
                if (!randomIsCorrect && setTerms.length > 1) {
                    const others = setTerms.filter(t => t.definition !== item.definition);
                    if (others.length > 0) {
                        displayDef = others[Math.floor(Math.random() * others.length)].definition;
                    }
                }

                generatedQuestions.push({
                    type: 'tf',
                    prompt: `Betekent '${item.term}' inderdaad '${displayDef}'?`,
                    correctAnswer: randomIsCorrect ? 'True' : 'False',
                    displayDef: displayDef,
                    actualTerm: item.term,
                    actualDef: item.definition,
                    image: item.image || ''
                });
            } else {
                generatedQuestions.push({
                    type: 'open',
                    prompt: `Geef het woord/de definitie voor: '${item.term}'`,
                    correctAnswer: item.definition,
                    image: item.image || ''
                });
            }
        }
    }
}

function checkTestAnswers() {
    let totalPoints = 0;
    let scorePoints = 0;
    let questionBreakdown = {
        choice: { correct: 0, total: 0 },
        tf: { correct: 0, total: 0 },
        open: { correct: 0, total: 0 },
        match: { correct: 0, total: 0 }
    };

    const testResultsDiv = document.getElementById('testResults');
    let resultsHTML = '<h3 style="margin-top: 30px; font-size:1.3rem;">Foutenanalyse:</h3>';

    generatedQuestions.forEach((q, index) => {
        if (q.type === 'match') {
            let blockCorrect = 0;
            let blockHTML = '';
            
            q.terms.forEach((t, tIdx) => {
                const select = document.querySelector(`select[name="q-${index}-match-${tIdx}"]`);
                const userAnswer = select ? select.value : '';
                const correctAnswer = q.correctAnswers[tIdx];
                const isSubCorrect = userAnswer === correctAnswer;
                
                totalPoints++;
                questionBreakdown.match.total++;
                if (isSubCorrect) {
                    scorePoints++;
                    blockCorrect++;
                    questionBreakdown.match.correct++;
                }

                blockHTML += `
                    <div style="padding: 6px 12px; margin-top: 4px; border-radius: 6px; border: 1px solid ${isSubCorrect ? 'var(--correct-border)' : 'var(--incorrect-border)'}; background-color: ${isSubCorrect ? 'var(--correct-bg)' : 'var(--incorrect-bg)'}; font-size: 0.9rem;">
                        <strong>${escapeHTML(t.term)}:</strong> Jouw keuze: <span style="color:${isSubCorrect ? 'var(--correct-text)' : 'var(--incorrect-text)'}; font-weight: 600;">${userAnswer || '(geen)'}</span>
                        ${!isSubCorrect ? ` | Juiste letter: <strong style="color:var(--correct-text)">${correctAnswer} (${escapeHTML(t.definition)})</strong>` : ''}
                    </div>
                `;
            });

            const isAllCorrect = blockCorrect === q.terms.length;
            resultsHTML += `
                <div style="padding: 15px; border-radius: 8px; margin-bottom: 12px; border: 1px solid ${isAllCorrect ? 'var(--correct-border)' : 'var(--incorrect-border)'}; background-color: var(--card-bg); color: var(--text-primary);">
                    <strong>Vraag ${index + 1}: Verbinden (${blockCorrect}/${q.terms.length} goed)</strong><br>
                    ${blockHTML}
                </div>
            `;
        } else {
            let userAnswer = '';
            if (q.type === 'choice' || q.type === 'tf') {
                const checked = document.querySelector(`input[name="q-${index}"]:checked`);
                userAnswer = checked ? checked.value : '';
            } else {
                const input = document.querySelector(`input[name="q-${index}"]`);
                userAnswer = input ? input.value.trim() : '';
            }

            const isCorrect = userAnswer.toLowerCase() === q.correctAnswer.toLowerCase();
            
            totalPoints++;
            if (q.type === 'choice') {
                questionBreakdown.choice.total++;
                if (isCorrect) { questionBreakdown.choice.correct++; scorePoints++; }
            } else if (q.type === 'tf') {
                questionBreakdown.tf.total++;
                if (isCorrect) { questionBreakdown.tf.correct++; scorePoints++; }
            } else {
                questionBreakdown.open.total++;
                if (isCorrect) { questionBreakdown.open.correct++; scorePoints++; }
            }

            resultsHTML += `
                <div style="padding: 15px; border-radius: 8px; margin-bottom: 12px; border: 1px solid ${isCorrect ? 'var(--correct-border)' : 'var(--incorrect-border)'}; background-color: ${isCorrect ? 'var(--correct-bg)' : 'var(--incorrect-bg)'}; color: var(--text-primary);">
                    <strong>Vraag ${index + 1}: ${escapeHTML(q.prompt)}</strong><br>
                    <span>Jouw antwoord: <span style="color:${isCorrect ? 'var(--correct-text)' : 'var(--incorrect-text)'}; font-weight: 600;">${escapeHTML(userAnswer || '(geen antwoord)')}</span></span><br>
                    ${!isCorrect ? `<span>Juiste antwoord: <strong style="color:var(--correct-text)">${escapeHTML(q.correctAnswer === 'True' ? 'Waar' : q.correctAnswer === 'False' ? 'Niet Waar' : q.correctAnswer)}</strong></span>` : ''}
                </div>
            `;
        }
    });

    const percentage = Math.round((scorePoints / totalPoints) * 100);
    const scoreGrade = (scorePoints / totalPoints * 9 + 1).toFixed(1);

    let breakdownHTML = '<div style="margin-top: 15px; font-size: 0.95rem; text-align: left; display: inline-block; background: var(--bg-primary); padding: 12px 20px; border-radius: 8px; border: 1px solid var(--border-color);">';
    breakdownHTML += '<strong style="display:block; margin-bottom: 8px;">Resultaten per vraagtype:</strong>';
    if (questionBreakdown.choice.total > 0) {
        breakdownHTML += `<div>Meerkeuze: ${questionBreakdown.choice.correct} / ${questionBreakdown.choice.total} goed</div>`;
    }
    if (questionBreakdown.tf.total > 0) {
        breakdownHTML += `<div>Waar / Niet Waar: ${questionBreakdown.tf.correct} / ${questionBreakdown.tf.total} goed</div>`;
    }
    if (questionBreakdown.open.total > 0) {
        breakdownHTML += `<div>Open Vragen: ${questionBreakdown.open.correct} / ${questionBreakdown.open.total} goed</div>`;
    }
    if (questionBreakdown.match.total > 0) {
        breakdownHTML += `<div>Verbinden: ${questionBreakdown.match.correct} / ${questionBreakdown.match.total} verbindingen goed</div>`;
    }
    breakdownHTML += '</div>';

    resultsHTML = `
        <div style="text-align: center; background: var(--result-banner-bg); padding: 25px; border-radius: 12px; margin-top: 35px; border: 1px solid var(--result-banner-border); color: var(--text-primary);">
            <div style="font-size: 3rem;"><i class="fa-solid fa-graduation-cap"></i></div>
            <h2 style="margin: 10px 0;">Je behaalde cijfer: <strong style="color: var(--brand-color);">${scoreGrade}</strong></h2>
            <p style="font-size: 1.1rem; color: var(--result-banner-text); margin: 0;">Je had ${scorePoints} van de ${totalPoints} punten goed (${percentage}%).</p>
            ${breakdownHTML}
        </div>
        ${resultsHTML}
    `;

    testResultsDiv.innerHTML = resultsHTML;
    document.getElementById('submitTestBtn').style.display = 'none';

    isTestActive = false;
    gameProgress.test = { isTestActive: false };
    saveProgressToDrive(true);
}
