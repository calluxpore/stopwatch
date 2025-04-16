const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const millisecondsEl = document.getElementById('milliseconds');
const startStopBtn = document.getElementById('start-stop');
const lapResetBtn = document.getElementById('lap-reset');
const lapsTableBody = document.getElementById('laps-table-body');
const timerDisplay = document.querySelector('.timer-display');
const decreaseFontBtn = document.getElementById('decrease-font');
const increaseFontBtn = document.getElementById('increase-font');
const fullscreenBtn = document.getElementById('toggle-fullscreen');
const darkModeBtn = document.getElementById('toggle-darkmode');
const bodyEl = document.body;
const fullscreenLapsContainer = document.getElementById('fullscreen-laps');
const exportCsvBtn = document.getElementById('export-csv');
const reloadPageBtn = document.getElementById('reload-page');
const websiteLinkBtn = document.getElementById('website-link');
const showInfoBtn = document.getElementById('show-info');
const shortcutsModal = document.getElementById('shortcuts-modal');
const closeModalBtn = document.getElementById('close-modal');

// Get the icon spans within the buttons
const startStopIcon = startStopBtn.querySelector('.material-icons');
const lapResetIcon = lapResetBtn.querySelector('.material-icons');
const fullscreenIcon = fullscreenBtn.querySelector('.material-icons');
const darkModeIcon = darkModeBtn.querySelector('.material-icons');

let startTime = 0;
let elapsedTime = 0;
let timerInterval;
let running = false;
let lapCounter = 1;
let lastLapTime = 0;
let currentFontSize = 7;

function formatTime(time) {
    const date = new Date(time);
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
    const milliseconds = String(Math.floor(date.getUTCMilliseconds() / 10)).padStart(2, '0');
    return { minutes, seconds, milliseconds };
}

function updateDisplay() {
    elapsedTime = Date.now() - startTime;
    const { minutes, seconds, milliseconds } = formatTime(elapsedTime);
    minutesEl.textContent = minutes;
    secondsEl.textContent = seconds;
    millisecondsEl.textContent = milliseconds;
}

function startTimer() {
    if (elapsedTime === 0) {
        lastLapTime = 0;
        lapCounter = 1;
        lapsTableBody.innerHTML = '';
    }
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(updateDisplay, 10);
    running = true;
    startStopIcon.textContent = 'stop';
    startStopBtn.classList.add('running');
    lapResetIcon.textContent = 'timer';
    lapResetBtn.classList.remove('reset');
}

function stopTimer() {
    clearInterval(timerInterval);
    running = false;
    startStopIcon.textContent = 'play_arrow';
    startStopBtn.classList.remove('running');
    lapResetIcon.textContent = 'restart_alt';
    lapResetBtn.classList.add('reset');
}

function resetTimer() {
    clearInterval(timerInterval);
    running = false;
    elapsedTime = 0;
    startTime = 0;
    lapCounter = 1;
    lastLapTime = 0;
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    millisecondsEl.textContent = '00';
    startStopIcon.textContent = 'play_arrow';
    startStopBtn.classList.remove('running');
    lapResetIcon.textContent = 'timer';
    lapResetBtn.classList.remove('reset');
    lapsTableBody.innerHTML = '';
    fullscreenLapsContainer.innerHTML = '';
}

function recordLap() {
    if (!running) return;

    const currentTotalTime = elapsedTime;
    const lapDuration = currentTotalTime - lastLapTime;
    const currentLapNumber = lapCounter;
    lastLapTime = currentTotalTime;

    const totalTimeFormatted = formatTime(currentTotalTime);
    const lapDurationFormatted = formatTime(lapDuration);

    const tr = document.createElement('tr');

    const tdLap = document.createElement('td');
    tdLap.textContent = lapCounter++;

    const tdTime = document.createElement('td');
    tdTime.textContent = `${lapDurationFormatted.minutes}:${lapDurationFormatted.seconds}.${lapDurationFormatted.milliseconds}`;

    const tdTotalTime = document.createElement('td');
    tdTotalTime.textContent = `${totalTimeFormatted.minutes}:${totalTimeFormatted.seconds}.${totalTimeFormatted.milliseconds}`;

    tr.appendChild(tdLap);
    tr.appendChild(tdTime);
    tr.appendChild(tdTotalTime);

    if (lapsTableBody.firstChild) {
        lapsTableBody.insertBefore(tr, lapsTableBody.firstChild);
    } else {
        lapsTableBody.appendChild(tr);
    }

    const fsLapDiv = document.createElement('div');
    fsLapDiv.textContent = `Lap ${currentLapNumber}   ${lapDurationFormatted.minutes}:${lapDurationFormatted.seconds}.${lapDurationFormatted.milliseconds}`;

    // Add to the top
    if (fullscreenLapsContainer.firstChild) {
        fullscreenLapsContainer.insertBefore(fsLapDiv, fullscreenLapsContainer.firstChild);
    } else {
        fullscreenLapsContainer.appendChild(fsLapDiv);
    }

    // Keep only the last 3 laps
    while (fullscreenLapsContainer.children.length > 3) {
        fullscreenLapsContainer.removeChild(fullscreenLapsContainer.lastChild);
    }
}

startStopBtn.addEventListener('click', () => {
    if (running) {
        stopTimer();
    } else {
        startTimer();
    }
});

lapResetBtn.addEventListener('click', () => {
    if (running) {
        recordLap();
    } else {
        if (elapsedTime > 0 || lapsTableBody.children.length > 0) {
            resetTimer();
        }
    }
});

decreaseFontBtn.addEventListener('click', () => {
    if (currentFontSize > 1) {
        currentFontSize -= 0.5;
        applyFontSize();
    }
});

increaseFontBtn.addEventListener('click', () => {
    if (currentFontSize < 15) {
        currentFontSize += 0.5;
        applyFontSize();
    }
});

fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
            .then(() => { fullscreenIcon.textContent = 'fullscreen_exit'; })
            .catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
    } else {
        document.exitFullscreen()
            .then(() => { fullscreenIcon.textContent = 'fullscreen'; })
            .catch(err => {
                console.error(`Error attempting to disable full-screen mode: ${err.message} (${err.name})`);
            });
    }
});

darkModeBtn.addEventListener('click', () => {
    toggleDarkMode();
});

reloadPageBtn.addEventListener('click', () => {
    location.reload();
});

document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) {
        fullscreenIcon.textContent = 'fullscreen';
    }
});

function applyFontSize() {
    timerDisplay.style.fontSize = `${currentFontSize}em`;
}

function toggleDarkMode(forceDark) {
    const isDark = bodyEl.classList.toggle('dark-mode', forceDark);
    darkModeIcon.textContent = isDark ? 'brightness_7' : 'brightness_4';
    localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
}

applyFontSize();

const savedDarkMode = localStorage.getItem('darkMode');
if (savedDarkMode === 'enabled') {
    toggleDarkMode(true);
}

// Export lap data to CSV
exportCsvBtn.addEventListener('click', () => {
    exportLapsToCSV();
});

// Function to export lap data to CSV
function exportLapsToCSV() {
    // Get all rows from the laps table
    const rows = Array.from(lapsTableBody.querySelectorAll('tr'));
    
    if (rows.length === 0) {
        alert('No lap data to export');
        return;
    }
    
    // Create CSV header
    let csvContent = 'Lap,Lap Time,Total Time\n';
    
    // Process rows in reverse to get chronological order
    for (let i = rows.length - 1; i >= 0; i--) {
        const row = rows[i];
        const cells = row.querySelectorAll('td');
        
        // Get data from each cell
        const lap = cells[0].textContent.trim();
        const lapTime = cells[1].textContent.trim();
        const totalTime = cells[2].textContent.trim();
        
        // Add to CSV
        csvContent += `${lap},${lapTime},${totalTime}\n`;
    }
    
    // Create a Blob with the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    // Create a link element to trigger download
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    // Set up the download
    const date = new Date();
    const timestamp = `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}_${date.getHours().toString().padStart(2, '0')}-${date.getMinutes().toString().padStart(2, '0')}`;
    
    link.setAttribute('href', url);
    link.setAttribute('download', `stopwatch_laps_${timestamp}.csv`);
    link.style.display = 'none';
    
    // Add to document, trigger click and remove
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 100);
}

// Website link button click handler
websiteLinkBtn.addEventListener('click', () => {
    window.open('https://www.samreddy.work', '_blank');
});

// NEW Unified DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
    // --- Modal Logic (Copied from original listener) ---
    const showInfoBtn = document.getElementById('show-info');
    const shortcutsModal = document.getElementById('shortcuts-modal');
    const closeModalBtn = document.getElementById('close-modal');

    if (showInfoBtn && shortcutsModal && closeModalBtn) {
        showInfoBtn.addEventListener('click', () => {
            shortcutsModal.classList.add('show');
        });

        closeModalBtn.addEventListener('click', () => {
            shortcutsModal.classList.remove('show');
        });

        shortcutsModal.addEventListener('click', (e) => {
            if (e.target === shortcutsModal) {
                shortcutsModal.classList.remove('show');
            }
        });

        // Note: Moved Escape key listener here from the separate keyboard listener below
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && shortcutsModal.classList.contains('show')) {
                shortcutsModal.classList.remove('show');
            }
        });
    } else {
        if (!showInfoBtn) console.error('Element with ID "show-info" not found.');
        if (!shortcutsModal) console.error('Element with ID "shortcuts-modal" not found.');
        if (!closeModalBtn) console.error('Element with ID "close-modal" not found.');
    }

    // --- Keyboard Shortcuts (Copied and adapted from original listener) ---
    // Note: The Escape key is handled above now.
    document.addEventListener('keydown', (e) => {
        // Ensure buttons exist before trying to click them
        const lapResetBtn = document.getElementById('lap-reset'); // Get buttons inside listener scope
        const startStopBtn = document.getElementById('start-stop');
        const fullscreenBtn = document.getElementById('toggle-fullscreen');
        const darkModeBtn = document.getElementById('toggle-darkmode');

        if (e.key === ' ' && lapResetBtn) {
            e.preventDefault();
            lapResetBtn.click();
        }

        if (e.key === 'Enter' && startStopBtn) {
            e.preventDefault();
            startStopBtn.click();
        }

        if ((e.key === 'f' || e.key === 'F') && fullscreenBtn) {
            e.preventDefault();
            fullscreenBtn.click();
        }

        if ((e.key === 'd' || e.key === 'D') && darkModeBtn) {
            e.preventDefault();
            darkModeBtn.click();
        }
    });

    // --- Mobile Warning Logic (Copied from original listener) ---
    const mobileWarning = document.getElementById('mobile-warning');

    function checkMobileWarning() { // Wrap in function for clarity and reuse
        if (mobileWarning) {
            if (window.innerWidth < 768) {
                mobileWarning.style.display = 'block';
            } else {
                mobileWarning.style.display = 'none'; // Explicitly hide if not mobile
            }
        }
    }

    checkMobileWarning(); // Initial check on load

    // Resize listener (Copied from original listener)
    window.addEventListener('resize', checkMobileWarning); // Use the checking function

}); 