let selections = { page2: null, page3: null, page4: null, page5: null, page6: null, page8: null, page9: null, page10: null, page11: null, page12: null };

function navigateTo(pageNumber) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${pageNumber}`).classList.add('active');
    if(pageNumber === 7) displayResults();
    if(pageNumber === 13) displayResults2();
    if(pageNumber === 1) resetGame();
}

function goNext(from, to) {
    if (!selections[`page${from}`]) {
        document.querySelector(`#page-${from} .page-header p`).textContent = 'Please select one of s1–s5 before continuing.';
        return;
    }
    navigateTo(to);
}

function buildGrid(p, imgOffset) {
    const container = document.getElementById(`grid-p${p}`);
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 2; col++) {
            const i = row * 2 + col + 1;
            const imgNum = imgOffset + i;
            const btn = document.createElement('button');
            btn.style.backgroundImage = `url('img/${String(imgNum).padStart(3, '0')}.png')`;
            btn.onclick = () => new Audio(`audio/${String(imgNum).padStart(3, '0')}.mp3`).play();
            container.appendChild(btn);
        }
        const sBtn = document.createElement('button');
        sBtn.innerText = `s${row + 1}`;
        sBtn.classList.add('selection-btn');
        sBtn.onclick = () => {
            container.querySelectorAll('.selection-btn').forEach(b => b.classList.remove('selected'));
            sBtn.classList.add('selected');
            selections[`page${p}`] = `s${row + 1}`;
        };
        container.appendChild(sBtn);
    }
}

function createGrids() {
    for (let p = 2; p <= 6; p++) buildGrid(p, (p - 2) * 10);
    for (let p = 8; p <= 12; p++) buildGrid(p, (p - 8) * 10 + 100);
}

function displayResults() {
    const display = document.getElementById('result-display');
    display.innerHTML = `
        <p>Round 1: <strong>${selections.page2 || 'None'}</strong></p>
        <p>Round 2: <strong>${selections.page3 || 'None'}</strong></p>
        <p>Round 3: <strong>${selections.page4 || 'None'}</strong></p>
        <p>Round 4: <strong>${selections.page5 || 'None'}</strong></p>
        <p>Round 5: <strong>${selections.page6 || 'None'}</strong></p>
    `;
}

function displayResults2() {
    const display = document.getElementById('result-display-2');
    display.innerHTML = `
        <p>Round 1: <strong>${selections.page8 || 'None'}</strong></p>
        <p>Round 2: <strong>${selections.page9 || 'None'}</strong></p>
        <p>Round 3: <strong>${selections.page10 || 'None'}</strong></p>
        <p>Round 4: <strong>${selections.page11 || 'None'}</strong></p>
        <p>Round 5: <strong>${selections.page12 || 'None'}</strong></p>
    `;
}

function resetGame() {
    selections = { page2: null, page3: null, page4: null, page5: null, page6: null, page8: null, page9: null, page10: null, page11: null, page12: null };
    document.querySelectorAll('.selected').forEach(b => b.classList.remove('selected'));
}

// Initialize
createGrids();
