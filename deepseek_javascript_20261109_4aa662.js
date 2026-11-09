const container = document.getElementById('games-container');
const regionSelect = document.getElementById('region-select');

// Функция для получения данных с публичного поиска Steam (парсинг HTML)
// Примечание: Steam не дает официального JSON API для списка скидок, 
// поэтому мы используем публичную страницу поиска и фильтруем её.
// Для надежности лучше использовать CORS-прокси, если сайт откроют локально.
async function fetchSteamSpecials(region = 'ru') {
    // URL страницы поиска Steam с фильтром "Скидки" и сортировкой по убыванию скидки
    const url = `https://store.steampowered.com/search/?specials=1&sort_by=PercentOff&cc=${region}`;
    
    try {
        // Используем публичный CORS прокси для демонстрации (в продакшене лучше свой бэкенд или GitHub Action)
        const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
        const data = await response.json();
        const html = data.contents;
        
        // Создаем DOM парсер для извлечения данных из HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const rows = doc.querySelectorAll('.search_result_row');
        
        const games = [];
        rows.forEach(row => {
            const title = row.querySelector('.title')?.innerText;
            const discount = row.querySelector('.discount_pct')?.innerText;
            const originalPrice = row.querySelector('.discount_original_price')?.innerText;
            const finalPrice = row.querySelector('.discount_final_price')?.innerText;
            const img = row.querySelector('.search_capsule img')?.src;
            const link = row.getAttribute('href');
            
            if (title && discount) {
                games.push({ title, discount, originalPrice, finalPrice, img, link });
            }
        });
        
        return games;
    } catch (e) {
        console.error("Ошибка загрузки:", e);
        return [];
    }
}

async function loadDeals() {
    container.innerHTML = 'Загрузка...';
    const region = regionSelect.value;
    const games = await fetchSteamSpecials(region);
    
    if (games.length === 0) {
        container.innerHTML = 'Не удалось загрузить данные. Попробуйте позже.';
        return;
    }
    
    // Очищаем и рендерим
    container.innerHTML = '';
    games.slice(0, 30).forEach(game => { // Показываем топ-30
        const card = document.createElement('div');
        card.className = 'game-card';
        card.innerHTML = `
            <img src="${game.img}" alt="${game.title}" loading="lazy">
            <div class="game-info">
                <div class="game-title" title="${game.title}">${game.title}</div>
                <div class="discount-badge">${game.discount}</div>
                <div class="price-row">
                    <span class="old-price">${game.originalPrice || ''}</span>
                    <span class="new-price">${game.finalPrice || 'Бесплатно'}</span>
                </div>
            </div>
        `;
        card.onclick = () => window.open(game.link, '_blank');
        container.appendChild(card);
    });
}

// Первая загрузка
loadDeals();

// Слушатель смены региона
regionSelect.addEventListener('change', loadDeals);