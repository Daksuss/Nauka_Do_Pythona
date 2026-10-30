// --- LOGIKA NAWIGACJI (PRZEŁĄCZANIE WIDOKÓW) ---
function openTopic(topicId) {
    document.getElementById('menu-view').classList.add('hidden');
    document.getElementById(topicId).classList.remove('hidden');
}

function closeTopic() {
    const topics = document.querySelectorAll('.exercise-view');
    topics.forEach(topic => topic.classList.add('hidden'));
    document.getElementById('menu-view').classList.remove('hidden');
}

// --- ŁADOWANIE ZAPISANYCH DANYCH (Wykonuje się przy starcie strony) ---
document.addEventListener('DOMContentLoaded', function() {
    // Przeszukujemy tematy (zakładamy zapas do 10 tematów w przyszłości)
    for(let i = 1; i <= 10; i++) {
        const topicId = `topic-${i}`;
        // Próbujemy pobrać dane z pamięci przeglądarki
        const savedData = localStorage.getItem(`phyton_${topicId}`);
        
        if(savedData) {
            const topicData = JSON.parse(savedData); // Odkodowujemy dane
            const topicSection = document.getElementById(topicId);
            const badge = document.getElementById(`badge-${topicId}`);
            const feedback = document.getElementById(`feedback-${topicId}`);
            
            // 1. Przywracanie statusu (odznaki w menu)
            if (badge) {
                badge.textContent = topicData.statusText;
                badge.className = topicData.statusClass;
            }

            // 2. Przywracanie wpisanych słów i kolorowania luk
            if (topicSection) {
                const inputs = topicSection.querySelectorAll('.blank');
                inputs.forEach((input, index) => {
                    if (topicData.inputs[index] !== undefined) {
                        input.value = topicData.inputs[index]; // Wstawienie tekstu
                        
                        // Sprawdzamy stan dla odtworzenia koloru
                        const correctAnswer = input.getAttribute('data-answer').toLowerCase().trim();
                        const userAnswer = input.value.toLowerCase().trim();
                        
                        if (userAnswer !== "") {
                            if (userAnswer === correctAnswer) {
                                input.classList.add('correct'); // Zielony zablokowany
                            } else if (topicData.feedbackText !== "") { 
                                input.classList.add('incorrect'); // Czerwony
                            }
                        }
                    }
                });
            }
            
            // 3. Przywracanie komunikatu (np. "Gratulacje!") pod przyciskiem
            if (feedback) {
                feedback.textContent = topicData.feedbackText;
                feedback.style.color = topicData.feedbackColor;
            }
        }
    }
});

// --- ZAPISYWANIE DANYCH ---
function saveProgress(topicId) {
    const topicSection = document.getElementById(topicId);
    if (!topicSection) return;

    const inputs = topicSection.querySelectorAll('.blank');
    const badge = document.getElementById(`badge-${topicId}`);
    const feedback = document.getElementById(`feedback-${topicId}`);

    // Zbieramy wszystkie wpisane wartości do małej tablicy
    const inputValues = Array.from(inputs).map(input => input.value);

    // Tworzymy paczkę danych z pełnym stanem ćwiczenia
    const topicData = {
        statusText: badge.textContent,
        statusClass: badge.className,
        inputs: inputValues,
        feedbackText: feedback.textContent,
        feedbackColor: feedback.style.color
    };

    // Zapisujemy do Local Storage pod unikalną nazwą (np. phyton_topic-1)
    localStorage.setItem(`phyton_${topicId}`, JSON.stringify(topicData));
}

// --- LOGIKA ZMIANY STATUSU NA "W TRAKCIE" ---
document.addEventListener('input', function(e) {
    if(e.target.classList.contains('blank')) {
        const currentTopic = e.target.closest('.exercise-view').id;
        const badge = document.getElementById(`badge-${currentTopic}`);
        
        // Zmień status, jeśli jeszcze nie jest zakończone
        if (badge.textContent !== 'Zakończone') {
            badge.textContent = 'W trakcie';
            badge.className = 'status in-progress';
        }
        
        // Zapisz postęp po KROTKIM CZASIE od każdego wciśnięcia klawisza!
        saveProgress(currentTopic);
    }
});

// --- LOGIKA SPRAWDZANIA ODPOWIEDZI ---
function checkAnswers(topicId) {
    const topicSection = document.getElementById(topicId);
    const inputs = topicSection.querySelectorAll('.blank');
    const feedback = document.getElementById(`feedback-${topicId}`);
    const badge = document.getElementById(`badge-${topicId}`);
    
    let correctCount = 0;
    let totalCount = inputs.length;

    if(totalCount === 0) {
        alert("Tu jeszcze nie ma zadań!");
        return;
    }

    inputs.forEach(input => {
        const correctAnswer = input.getAttribute('data-answer').toLowerCase().trim();
        const userAnswer = input.value.toLowerCase().trim();

        if (userAnswer === correctAnswer) {
            input.classList.remove('incorrect');
            input.classList.add('correct');
            correctCount++;
        } else {
            input.classList.remove('correct');
            if (userAnswer !== "") {
                input.classList.add('incorrect');
            }
        }
    });

    if (correctCount === totalCount) {
        feedback.textContent = "Gratulacje! Wszystkie odpowiedzi są poprawne. 🎉";
        feedback.style.color = "#28a745";
        badge.textContent = 'Zakończone';
        badge.className = 'status completed';
    } else {
        feedback.textContent = `Masz ${correctCount} z ${totalCount} poprawnych odpowiedzi. Popraw błędy!`;
        feedback.style.color = "#dc3545";
    }
    
    // Zapisujemy cały stan ekranu (kolory, wynik i znaczki) po wciśnięciu "Sprawdź"
    saveProgress(topicId);
}