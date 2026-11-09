const rollBtn = document.getElementById('rollBtn');
const resultDiv = document.getElementById('result');
const resultIcon = document.getElementById('resultIcon');
const resultText = document.getElementById('resultText');
const resultSub = document.getElementById('resultSub');
const yesInput = document.getElementById('yesImg');
const noInput = document.getElementById('noImg');
const resetBtn = document.getElementById('resetBtn');

// Картинки храним как dataURL в localStorage
let yesImage = localStorage.getItem('cs_yes_image') || null;
let noImage = localStorage.getItem('cs_no_image') || null;

// Загрузка картинок
function handleUpload(input, type) {
  input.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      if (type === 'yes') {
        yesImage = dataUrl;
        localStorage.setItem('cs_yes_image', dataUrl);
      } else {
        noImage = dataUrl;
        localStorage.setItem('cs_no_image', dataUrl);
      }
    };
    reader.readAsDataURL(file);
  });
}

handleUpload(yesInput, 'yes');
handleUpload(noInput, 'no');

resetBtn.addEventListener('click', () => {
  localStorage.removeItem('cs_yes_image');
  localStorage.removeItem('cs_no_image');
  yesImage = null;
  noImage = null;
  yesInput.value = '';
  noInput.value = '';
});

// Прокрутка "судьбы"
function roll() {
  rollBtn.disabled = true;
  resultDiv.classList.add('hidden');

  let ticks = 0;
  const maxTicks = 14;
  const spinInterval = setInterval(() => {
    // мелькаем случайно
    const fake = Math.random() < 0.7;
    showTempResult(fake);
    ticks++;
    if (ticks >= maxTicks) {
      clearInterval(spinInterval);
      finalResult();
      rollBtn.disabled = false;
    }
  }, 90);
}

function showTempResult(isYes) {
  resultDiv.classList.remove('hidden', 'yes', 'no');
  resultDiv.classList.add(isYes ? 'yes' : 'no');
  resultIcon.className = 'result-icon emoji';
  resultIcon.innerHTML = isYes ? '✅' : '❌';
  resultText.textContent = isYes ? 'ДА' : 'НЕТ';
  resultSub.textContent = '...';
}

function finalResult() {
  // 70% — НЕТ, 30% — ДА
  const isYes = Math.random() < 0.3;

  resultDiv.classList.remove('yes', 'no', 'hidden');
  resultDiv.classList.add(isYes ? 'yes' : 'no');

  const customImg = isYes ? yesImage : noImage;

  if (customImg) {
    resultIcon.className = 'result-icon';
    resultIcon.innerHTML = `<img src="${customImg}" alt="">`;
  } else {
    resultIcon.className = 'result-icon emoji';
    resultIcon.innerHTML = isYes ? '🏆' : '💀';
  }

  if (isYes) {
    resultText.textContent = 'ДА, УДАЧНЫЙ ДЕНЬ!';
    resultSub.textContent = 'Заходи в FACEIT, сегодня твой день! 🔥';
  } else {
    resultText.textContent = 'НЕТ, НЕ СЕГОДНЯ';
    resultSub.textContent = 'Лучше отдохни, сегодня не прёт 😅';
  }
}

rollBtn.addEventListener('click', roll);