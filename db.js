const WEBAPP_URL = 'https://script.google.com/macros/s/AKfycbyqgShuo0Z1wcpfl_D419daAgnjRBux68r2ubtUwpHygbJXtx2849TUDjXtS6ArMhfU/exec';
const DB_KEY = 'game_results';

function dbFormatTimestamp(date) {
    if (!date) return '';
    const yy = String(date.getFullYear()).slice(-2);
    const mo = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    const ss = String(date.getSeconds()).padStart(2, '0');
    const ms = String(date.getMilliseconds()).padStart(3, '0');
    return `${yy}:${mo}:${dd}:${hh}:${mm}:${ss}.${ms}`;
}

function dbSave(username, gameType, startTime, answers, times) {
    const entry = [
        username,
        gameType,
        dbFormatTimestamp(startTime),
        answers[0], times[0],
        answers[1], times[1],
        answers[2], times[2],
        answers[3], times[3],
        answers[4], times[4],
    ];

    // Local backup
    const all = dbGetAll();
    all.push(entry);
    localStorage.setItem(DB_KEY, JSON.stringify(all));

    // Send to Google Sheets
    fetch(WEBAPP_URL, {
        method: 'POST',
        body: JSON.stringify({ entry }),
    }).catch(err => console.error('Sheet save failed:', err));
}

function dbGetAll() {
    try {
        return JSON.parse(localStorage.getItem(DB_KEY)) || [];
    } catch {
        return [];
    }
}
