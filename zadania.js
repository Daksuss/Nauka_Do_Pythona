function openTopic(taskId) {
    document.getElementById('menu-view').classList.add('hidden');
    document.getElementById(taskId).classList.remove('hidden');
}

function closeTopic() {
    const tasks = document.querySelectorAll('.task-view');
    tasks.forEach(task => task.classList.add('hidden'));
    document.getElementById('menu-view').classList.remove('hidden');
}

// Uruchamiane po odświeżeniu strony - przywraca stan wszystkich zadań
document.addEventListener('DOMContentLoaded', function() {
    for(let i = 1; i <= 10; i++) {
        const taskId = `task-${i}`;
        updateModuleStatus(taskId);
    }
});

// Zaznacza konkretne zadanie w module
function markTaskAsDone(buttonElement, taskId, taskIndex) {
    // 1. Zapisujemy w pamięci, że to konkretne zadanie jest wykonane
    let data = JSON.parse(localStorage.getItem(`phyton_zadania_${taskId}`)) || { completed: [] };
    
    if (!data.completed.includes(taskIndex)) {
        data.completed.push(taskIndex);
        localStorage.setItem(`phyton_zadania_${taskId}`, JSON.stringify(data));
    }
    
    // 2. Aktualizujemy widok na stronie
    updateModuleStatus(taskId);
}

// Główny silnik przeliczający liczniki i statusy
function updateModuleStatus(taskId) {
    const section = document.getElementById(taskId);
    if (!section) return; // Zabezpieczenie dla pustych sekcji

    // Liczymy, ile jest w ogóle zadań w tym module na podstawie HTML-a
    const buttons = section.querySelectorAll('.task-done-btn');
    const totalTasks = buttons.length;
    if (totalTasks === 0) return;

    // Pobieramy wykonane zadania z pamięci
    let data = JSON.parse(localStorage.getItem(`phyton_zadania_${taskId}`)) || { completed: [] };
    const doneCount = data.completed.length;

    // Aktualizujemy przyciski przy zadaniach
    buttons.forEach((btn, index) => {
        const currentTaskIndex = index + 1; // Od 1 do n
        if (data.completed.includes(currentTaskIndex)) {
            btn.textContent = '✓ Zakończono';
            btn.classList.add('done');
            btn.disabled = true; // Blokujemy ponowne kliknięcie
        }
    });

    // Aktualizujemy odznakę (badge) w menu głównym
// Aktualizujemy odznakę (badge) w menu głównym
    const badge = document.getElementById(`badge-${taskId}`);
    if (badge) {
        if (doneCount === 0) {
            badge.textContent = `Ukończono 0/${totalTasks}`;
            badge.className = 'status pending';
        } else if (doneCount < totalTasks) {
            badge.textContent = `Ukończono ${doneCount}/${totalTasks}`;
            badge.className = 'status in-progress'; // Pomarańczowy w trakcie
        } else {
            badge.textContent = `✓ Zakończone`;
            badge.className = 'status completed'; // Zielony, zrobiono wszystkie
        }
    }
}