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

    let numPairs = 6;
    let numCols = 4;
    if (matchDifficulty === 'medium') {
        numPairs = 10;
        numCols = 5;
    } else if (matchDifficulty === 'hard') {
        numPairs = 15;
        numCols = 6;
    }

    numPairs = Math.min(numPairs, setTerms.length);

    const shuffled = shuffleArray(setTerms);
    const sample = shuffled.slice(0, numPairs);

    const cards = [];
    sample.forEach((item, index) => {
        cards.push({ text: item.term, type: 'term', index: index, image: item.image || '' });
        cards.push({ text: item.definition, type: 'definition', index: index, image: item.defImage || '' });
    });

    const shuffledCards = shuffleArray(cards);

    let gridHTML = '';
    shuffledCards.forEach(card => {
        gridHTML += `
            <div class="match-card" data-index="${card.index}" data-type="${card.type}" onclick="selectMatchCard(this)">
                ${card.image ? `
                    <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 6px; width: 100%; height: 100%; text-align: center;">
                        <img src="${card.image}" style="max-height: 45px; max-width: 90%; border-radius: 4px; object-fit: contain;">
                        <span>${escapeHTML(card.text)}</span>
                    </div>
                ` : escapeHTML(card.text)}
            </div>
        `;
    });

    modeContent.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid var(--border-color); padding-bottom: 12px; flex-wrap: wrap; gap: 10px;">
            <div style="display: flex; gap: 8px;">
                <button class="btn btn-secondary btn-sm ${matchDifficulty === 'easy' ? 'active' : ''}" style="${matchDifficulty === 'easy' ? 'background-color: var(--brand-color);' : ''}" onclick="setMatchDifficulty('easy')">Makkelijk (4x3)</button>
                <button class="btn btn-secondary btn-sm ${matchDifficulty === 'medium' ? 'active' : ''}" style="${matchDifficulty === 'medium' ? 'background-color: var(--brand-color);' : ''} ${setTerms.length < 8 ? 'opacity: 0.4; cursor: not-allowed;' : ''}" onclick="setMatchDifficulty('medium')" ${setTerms.length < 8 ? 'disabled title="Minimaal 8 kaarten vereist"' : ''}>Gemiddeld (5x4)</button>
                <button class="btn btn-secondary btn-sm ${matchDifficulty === 'hard' ? 'active' : ''}" style="${matchDifficulty === 'hard' ? 'background-color: var(--brand-color);' : ''} ${setTerms.length < 12 ? 'opacity: 0.4; cursor: not-allowed;' : ''}" onclick="setMatchDifficulty('hard')" ${setTerms.length < 12 ? 'disabled title="Minimaal 12 kaarten vereist"' : ''}>Moeilijk (6x5)</button>
            </div>
            <h3 style="margin: 0; font-size: 1.25rem;">Tijd: <strong id="matchTimer" style="color: var(--brand-color);">0.0s</strong></h3>
            <button class="btn btn-secondary btn-sm" onclick="renderMatch()"><i class="fa-solid fa-rotate-right"></i> Reset</button>
        </div>
        <div class="match-grid" style="--cols: ${numCols};">
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

        const card1 = firstSelectedCard;
        const card2 = cardEl;
        setTimeout(() => {
            card1.style.visibility = 'hidden';
            card2.style.visibility = 'hidden';
        }, 400);

        firstSelectedCard = null;

        const totalCards = document.querySelectorAll('.match-card');
        const matchedCards = document.querySelectorAll('.match-card.matched');
        if (totalCards.length === matchedCards.length) {
            clearInterval(matchTimerInterval);
            const elapsed = parseFloat(((Date.now() - matchStartTime) / 1000).toFixed(1));

            saveProgressToDrive(true);

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
