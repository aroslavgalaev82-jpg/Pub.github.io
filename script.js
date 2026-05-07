document.addEventListener('DOMContentLoaded', () => {
    // --- ЭЛЕМЕНТЫ ---
    const modal = document.getElementById('diagnosticModal');
    const closeModalBtn = document.getElementById('closeModal');
    const modalTitle = document.getElementById('modalTitle');
    const scanStatus = document.getElementById('scanStatus');
    const percentageText = document.getElementById('percentageText');
    const resultBox = document.getElementById('resultBox');
    const systemHealthText = document.getElementById('systemHealthText');
    const systemDetails = document.getElementById('systemDetails');
    const circle = document.querySelector('.progress-ring__circle');
    
    // Длина окружности (должна совпадать с CSS stroke-dasharray)
    const circumference = 503;

    // Функция обновления круга
    function setProgress(percent) {
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDashoffset = offset;
    }

    // Тексты статусов
    const statusMessages = [
        "Инициализация ядра...",
        "Чтение таблиц ACPI...",
        "Проверка целостности реестра...",
        "Сканирование поверхности HDD...",
        "Анализ вольтажа VRM...",
        "Стресс-тест кэша L2/L3...",
        "Проверка драйверов GPU...",
        "Синтез отчета..."
    ];

    // --- ЗАПУСК ДИАГНОСТИКИ ---
    const launchButtons = document.querySelectorAll('.btn-download');
    launchButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const toolName = btn.getAttribute('data-tool');
            openDiagnosticModal(toolName);
        });
    });

    function openDiagnosticModal(toolName) {
        modal.classList.add('active');
        modalTitle.innerText = `DIAGNOSTIC: ${toolName.toUpperCase()}`;
        
        // Сброс состояния
        setProgress(0);
        circle.style.stroke = '#3b82f6';
        circle.style.filter = 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.5))';
        percentageText.innerText = '0%';
        percentageText.style.color = 'white';
        resultBox.style.display = 'none';
        scanStatus.innerText = "INITIALIZING...";
        scanStatus.style.color = 'var(--accent)';

        let progress = 0;
        let msgIndex = 0;

        const interval = setInterval(() => {
            progress += Math.random() * 1.5;
            if (progress > 100) progress = 100;

            setProgress(progress);
            percentageText.innerText = `${Math.floor(progress)}%`;

            if (progress > (msgIndex + 1) * (100 / statusMessages.length)) {
                if (msgIndex < statusMessages.length) {
                    scanStatus.innerText = statusMessages[msgIndex];
                    msgIndex++;
                }
            }

            if (progress > 80) percentageText.style.color = '#60a5fa';

            if (progress >= 100) {
                clearInterval(interval);
                finishDiagnostic();
            }
        }, 30);
    }

    function finishDiagnostic() {
        circle.style.stroke = '#10b981';
        circle.style.filter = 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.6))';
        percentageText.innerText = '100%';
        percentageText.style.color = '#10b981';
        scanStatus.innerText = "COMPLETE";
        scanStatus.style.color = '#10b981';

        const health = Math.floor(Math.random() * (100 - 94 + 1) + 94);
        const issues = ["", "Требуется очистка от пыли.", "Обновите драйверы чипсета.", "Высокая температура CPU."];
        const randomIssue = issues[Math.floor(Math.random() * issues.length)];

        setTimeout(() => {
            resultBox.style.display = 'flex';
            systemHealthText.innerText = `СТАТУС: ${health}%`;
            systemDetails.innerText = randomIssue ? `Внимание: ${randomIssue}` : "Критических ошибок не найдено. Система стабильна.";
            systemDetails.style.color = randomIssue ? '#fbbf24' : '#94a3b8';
        }, 400);
    }

    // --- ЗАКРЫТИЕ ОКНА ---
    function closeModal() {
        modal.classList.remove('active');
        setProgress(0);
        circle.style.stroke = '#3b82f6';
        circle.style.filter = 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.5))';
    }
    closeModalBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

    // --- ФИЛЬТРАЦИЯ КАРТОЧЕК ---
    const cards = document.querySelectorAll('.card');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');

    function filterCards() {
        const searchText = searchInput.value.toLowerCase();
        let activeCategory = 'all';
        filterBtns.forEach(btn => { if (btn.classList.contains('active')) activeCategory = btn.getAttribute('data-filter'); });

        cards.forEach(card => {
            const title = card.querySelector('.card-title').textContent.toLowerCase();
            const desc = card.querySelector('.card-desc').textContent.toLowerCase();
            const category = card.getAttribute('data-category');
            const match = (title.includes(searchText) || desc.includes(searchText)) && 
                          (activeCategory === 'all' || category.includes(activeCategory));
            card.style.display = match ? 'flex' : 'none';
        });
    }

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            filterCards();
        });
    });
    searchInput.addEventListener('input', filterCards);
});