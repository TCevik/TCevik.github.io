// js/modes/match.js

let firstSelectedCard = null;
let isProcessingMatch = false;

function renderMatch() {
    if (currentMode !== 'match') return;
    barContainer.classList.add('hidden');

    if (matchTimerInterval) {
        clearInterval(matchTimerInterval);
        matchTimerInterval = null;
    }

    const shuffled = shuffleArray(setTerms);
    const sample = shuffled.slice(0, Math.min(6, setTerms.length));

    const cards = [];
    sample.forEach((item, index) => {
        cards.push({ text: item.term, type: 'term', index: index });
        cards.push({ text: item.definition, type: 'definition', index: index });
    });

    const shuffledCards = shuffleArray(cards);

    let gridHTML = '';
    shuffledCards.forEach(card => {
        gridHTML += `
            <div class="match-card" data-index="${card.index}" data-type="${card.type}" onclick="selectMatchCard(this)">
                ${escapeHTML(card.text)}
            </div>
        `;
    });

    modeContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; flex-wrap: wrap; gap: 10px;">
            <h3 style="margin: 0; font-size: 1.25rem;">Tijd: <strong id="matchTimer" style="color: var(--brand-color);">0.0s</strong></h3>
            <button class="btn btn-secondary btn-sm" onclick="renderMatch()"><i class="fa-solid fa-rotate-right"></i> Reset</button>
        </div>
        <div class="match-grid">
            ${gridHTML}
        </div>
    `;

    matchStartTime = Date.now();
    matchTimerInterval = setInterval(() => {
        const elapsed = ((Date.now() - matchStartTime) / 1000).toFixed(1);
        const timerEl = document.getElementById('matchTimer');
        if (timerEl) {
            timerEl.textContent = `${elapsed}s`;
        }
    }, 100);
}

function selectMatchCard(cardEl) {
    if (isProcessingMatch) return;
    if (cardEl.classList.contains('matched') || cardEl.classList.contains('selected')) return;

    cardEl.classList.add('selected');

    if (!firstSelectedCard) {
        firstSelectedCard = cardEl;
        return;
    }

    const idx1 = firstSelectedCard.dataset.index;
    const type1 = firstSelectedCard.dataset.type;
    const idx2 = cardEl.dataset.index;
    const type2 = cardEl.dataset.type;

    if (idx1 === idx2 && type1 !== type2) {
        firstSelectedCard.classList.remove('selected');
        cardEl.classList.remove('selected');

        firstSelectedCard.classList.add('matched');
        cardEl.classList.add('matched');

        firstSelectedCard = null;

        const totalCards = document.querySelectorAll('.match-card');
        const matchedCards = document.querySelectorAll('.match-card.matched');
        if (totalCards.length === matchedCards.length) {
            clearInterval(matchTimerInterval);
            const elapsed = parseFloat(((Date.now() - matchStartTime) / 1000).toFixed(1));

            saveProgressToDrive(true);
            updateStudyStreak(elapsed);

            setTimeout(() => {
                modeContent.innerHTML = `
                    <div class="completed-screen">
                        <div class="completed-icon" style="color: #22c55e; font-size: 3.5rem; margin-bottom: 20px;"><i class="fa-solid fa-trophy"></i></div>
                        <h2>Spel voltooid!</h2>
                        <p style="color:#64748b; margin-bottom: 10px; font-size: 1.15rem;">Je hebt alle kaarten verbonden in <strong style="color: var(--brand-color);">${elapsed} seconden</strong>!</p>
                        <div style="display:flex; justify-content:center; gap:15px;">
                            <button class="btn btn-secondary" onclick="renderMatch()">Nog een keer</button>
                            <button class="btn" id="backToSetBtnCompleted">Terug naar de set</button>
                        </div>
                    </div>
                `;
                document.getElementById('backToSetBtnCompleted').addEventListener('click', () => {
                    document.getElementById('backToSetBtn').click();
                });
            }, 500);
        }
    } else {
        isProcessingMatch = true;
        firstSelectedCard.classList.add('incorrect');
        cardEl.classList.add('incorrect');

        setTimeout(() => {
            firstSelectedCard.classList.remove('selected', 'incorrect');
            cardEl.classList.remove('selected', 'incorrect');
            firstSelectedCard = null;
            isProcessingMatch = false;
        }, 500);
    }
}
