document.addEventListener('DOMContentLoaded', () => {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return; // Zabezpieczenie, jeśli na jakiejś stronie zapomnisz przycisku
    
    const icon = themeBtn.querySelector('.icon');
    
    // 1. Sprawdzamy zapisany wybór przy ładowaniu strony
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        icon.textContent = '🌙';
    } else {
        icon.textContent = '☀️';
    }

    // 2. Nasłuchujemy kliknięcia
    themeBtn.addEventListener('click', () => {
        // Dodajemy klasę uruchamiającą animację obrotu
        themeBtn.classList.add('rotate-anim');
        
        // Zdejmujemy klasę po 500ms, aby animacja mogła zadziałać ponownie przy kolejnym kliknięciu
        setTimeout(() => themeBtn.classList.remove('rotate-anim'), 500);

        // Przełączamy motyw
        document.body.classList.toggle('dark-theme');

        // Zmieniamy ikonkę i zapisujemy decyzję
        if (document.body.classList.contains('dark-theme')) {
            icon.textContent = '🌙';
            localStorage.setItem('theme', 'dark');
        } else {
            icon.textContent = '☀️';
            localStorage.setItem('theme', 'light');
        }
    });
});