import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

// 1. HTML elementlerini seç
const dateInput = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');

const timerElements = {
  days: document.querySelector('[data-days]'),
  hours: document.querySelector('[data-hours]'),
  minutes: document.querySelector('[data-minutes]'),
  seconds: document.querySelector('[data-seconds]'),
};

// 2. Değişkenleri tanımla
let selectedDate = null;
let countdownInterval = null;

startButton.disabled = true;

// 3. Flatpickr ayarları
const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    // DİKKAT: const kullanmıyoruz.
    // Dışarıdaki selectedDate değişkenine değer atıyoruz.
    selectedDate = selectedDates[0];

    if (!selectedDate || selectedDate <= new Date()) {
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future.',
      });

      startButton.disabled = true;
      return;
    }

    startButton.disabled = false;
  },
};

// 4. Takvimi input alanına bağla
flatpickr(dateInput, options);

// 5. Sayıları iki basamaklı göster
function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

// 6. Milisaniyeyi gün, saat, dakika ve saniyeye dönüştür
function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor((ms % hour) / minute);
  const seconds = Math.floor((ms % minute) / second);

  return { days, hours, minutes, seconds };
}

// 7. Sayaç ekranını güncelle
function updateTimer() {
  const remainingTime = selectedDate.getTime() - Date.now();

  if (remainingTime <= 0) {
    clearInterval(countdownInterval);
    countdownInterval = null;

    Object.values(timerElements).forEach(element => {
      element.textContent = '00';
    });

    dateInput.disabled = false;
    startButton.disabled = true;

    return;
  }

  const { days, hours, minutes, seconds } = convertMs(remainingTime);

  timerElements.days.textContent = addLeadingZero(days);
  timerElements.hours.textContent = addLeadingZero(hours);
  timerElements.minutes.textContent = addLeadingZero(minutes);
  timerElements.seconds.textContent = addLeadingZero(seconds);
}

// 8. Start butonuna tıklanınca geri sayımı başlat
startButton.addEventListener('click', () => {
  if (!selectedDate || selectedDate <= new Date()) {
    iziToast.error({
      title: 'Error',
      message: 'Please choose a date in the future.',
    });

    return;
  }

  if (countdownInterval !== null) {
    return;
  }

  startButton.disabled = true;
  dateInput.disabled = true;

  updateTimer();

  if (selectedDate > new Date()) {
    countdownInterval = setInterval(updateTimer, 1000);
  }
});
