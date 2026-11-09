const RELEASES_URL = 'releases.json';
const DAYS_BACK = 7;

async function loadReleases() {
  const listEl = document.getElementById('releases-list');

  try {
    const response = await fetch(RELEASES_URL);
    if (!response.ok) throw new Error('Не удалось загрузить releases.json');

    const allReleases = await response.json();

    const now = new Date();
    // Начало сегодняшнего дня минус 7 дней
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - DAYS_BACK);

    const recent = allReleases
      .filter(item => {
        const releaseDate = new Date(item.date + 'T00:00:00');
        return releaseDate >= weekAgo;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (recent.length === 0) {
      listEl.innerHTML = '<p class="empty">За последнюю неделю релизов не найдено.</p>';
      return;
    }

    listEl.innerHTML = recent.map(item => `
      <article class="release-card">
        <a href="${item.link}" target="_blank" rel="noopener">
          <div class="artist">${escapeHtml(item.artist)}</div>
          <div class="title">${escapeHtml(item.title)}</div>
          <div class="meta">
            <span class="type">${escapeHtml(item.type)}</span>
            <span>${formatDate(item.date)}</span>
          </div>
        </a>
      </article>
    `).join('');
  } catch (err) {
    listEl.innerHTML = `<p class="empty">Ошибка: ${escapeHtml(err.message)}</p>`;
  }
}

function formatDate(isoDate) {
  const [y, m, d] = isoDate.split('-');
  return `${d}.${m}.${y}`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

loadReleases();