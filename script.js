let selections = { page2: null, page3: null };

function navigateTo(pageNumber) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${pageNumber}`).classList.add('active');
    if(pageNumber === 4) displayResults();
    if(pageNumber === 1) resetGame();
}

function goNext(from, to) {
    if (!selections[`page${from}`]) {
        document.querySelector(`#page-${from} .page-header p`).textContent = 'Please select one of s1–s5 before continuing.';
        return;
    }
    navigateTo(to);
}

function createGrids() {
    for (let p = 2; p <= 3; p++) {
        const container = document.getElementById(`grid-p${p}`);
        for (let row = 0; row < 5; row++) {
            // Two image buttons — play audio only
            for (let col = 0; col < 2; col++) {
                const i = row * 2 + col + 1;
                const imgNum = p === 2 ? i : i + 10;
                const btn = document.createElement('button');
                btn.style.backgroundImage = `url('img/${String(imgNum).padStart(3, '0')}.png')`;
                btn.onclick = () => new Audio(`audio/${String(imgNum).padStart(3, '0')}.mp4`).play();
                container.appendChild(btn);
            }
            // Selection button — no image
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
}

function displayResults() {
    const display = document.getElementById('result-display');
    display.innerHTML = `
        <p>Page 2 Selection: <strong>${selections.page2 || 'None'}</strong></p>
        <p>Page 3 Selection: <strong>${selections.page3 || 'None'}</strong></p>
    `;
}

function resetGame() {
    selections = { page2: null, page3: null };
    document.querySelectorAll('.selected').forEach(b => b.classList.remove('selected'));
}

// Initialize
createGrids();
