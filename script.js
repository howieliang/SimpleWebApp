// Cookie helpers
function setCookie(name, value) {
    document.cookie = `${name}=${encodeURIComponent(value)};path=/;max-age=31536000`;
}
function getCookie(name) {
    const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return match ? decodeURIComponent(match[1]) : '';
}
function saveUsername() {
    setCookie('username', document.getElementById('username-input').value);
}

// State
const GRID_PAGES = [2,3,4,5,6,8,9,10,11,12];
let selections  = {};
let elapsedTimes = {};
let pageStartTime = null;
let game1StartTime = null;
let game2StartTime = null;
GRID_PAGES.forEach(p => { selections[`page${p}`] = null; elapsedTimes[`page${p}`] = null; });

function formatElapsed(ms) {
    if (ms === null) return '—';
    return `${ms} ms`;
}

function formatTimestamp(date) {
    if (!date) return '—';
    const h = String(date.getHours()).padStart(2, '0');
    const m = String(date.getMinutes()).padStart(2, '0');
    const s = String(date.getSeconds()).padStart(2, '0');
    const ms = String(date.getMilliseconds()).padStart(3, '0');
    return `${h}:${m}:${s}.${ms}`;
}

function getUsername() {
    return document.getElementById('username-input').value || getCookie('username') || 'Unknown';
}

function navigateTo(pageNumber) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${pageNumber}`).classList.add('active');
    if (GRID_PAGES.includes(pageNumber)) pageStartTime = Date.now();
    if (pageNumber === 7) displayResults();
    if (pageNumber === 13) displayResults2();
    if (pageNumber === 1) resetGame();
}

function startGame(pageNumber) {
    saveUsername();
    if (pageNumber === 2) game1StartTime = new Date();
    if (pageNumber === 8) game2StartTime = new Date();
    navigateTo(pageNumber);
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
            elapsedTimes[`page${p}`] = pageStartTime ? Date.now() - pageStartTime : null;
        };
        container.appendChild(sBtn);
    }
}

function createGrids() {
    for (let p = 2; p <= 6; p++) buildGrid(p, (p - 2) * 10);
    for (let p = 8; p <= 12; p++) buildGrid(p, (p - 8) * 10 + 100);
}

function displayResults() {
    const name = getUsername();
    const pages = [2,3,4,5,6];
    const answers = pages.map(p => selections[`page${p}`] || 'None');
    const times   = pages.map(p => elapsedTimes[`page${p}`]);
    dbSave(name, 1, game1StartTime, answers, times);
    const display = document.getElementById('result-display');
    display.innerHTML =
        `<p><strong>Player:</strong> ${name}</p>` +
        `<p><strong>Started:</strong> ${formatTimestamp(game1StartTime)}</p>` +
        pages.map((p, i) =>
            `<p>Round ${i+1}: <strong>${answers[i]}</strong> &nbsp; ${formatElapsed(times[i])}</p>`
        ).join('');
}

function displayResults2() {
    const name = getUsername();
    const pages = [8,9,10,11,12];
    const answers = pages.map(p => selections[`page${p}`] || 'None');
    const times   = pages.map(p => elapsedTimes[`page${p}`]);
    dbSave(name, 2, game2StartTime, answers, times);
    const display = document.getElementById('result-display-2');
    display.innerHTML =
        `<p><strong>Player:</strong> ${name}</p>` +
        `<p><strong>Started:</strong> ${formatTimestamp(game2StartTime)}</p>` +
        pages.map((p, i) =>
            `<p>Round ${i+1}: <strong>${answers[i]}</strong> &nbsp; ${formatElapsed(times[i])}</p>`
        ).join('');
}

function resetGame() {
    GRID_PAGES.forEach(p => { selections[`page${p}`] = null; elapsedTimes[`page${p}`] = null; });
    game1StartTime = null;
    game2StartTime = null;
    document.querySelectorAll('.selected').forEach(b => b.classList.remove('selected'));
}

// Initialize
window.addEventListener('load', () => {
    const saved = getCookie('username');
    if (saved) document.getElementById('username-input').value = saved;
});
createGrids();
