
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  datePicker: document.querySelector('#datetime-picker'),
  timer: document.querySelector('.timer'),
  days: document.querySelector('span[data-days]'),
  hours: document.querySelector('span[data-hours]'),
  mins: document.querySelector('span[data-minutes]'),
  secs: document.querySelector('span[data-seconds]'),
  startBtn: document.querySelector('button[data-start]'),
};

refs.startBtn.addEventListener('click', updateInterface);

let timeLeft;
let timerStatus = false;

const flatpickrOptions = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    timeLeftCalc(selectedDates);
  },
};

flatpickr('#datetime-picker', flatpickrOptions);

function timeLeftCalc([finalTime]) {
  // Cacl how much time left for timer
  timeLeft = finalTime - Date.now();
  if (timeLeft <= 0) {
    Notify.failure('Please choose a date in the future'/* , notifyOptions */);
    return;
  }
  refs.startBtn.removeAttribute('disabled');
}

function updateInterface() {
  // Update  timer interface
  if (timerStatus) {
    return;
  }
  refs.datePicker.setAttribute('disabled', '');
  const timerId = setInterval(() => {
    const { days, hours, minutes, seconds } = convertMs(timeLeft);

    refs.days.textContent = days;
    refs.hours.textContent = hours;
    refs.mins.textContent = minutes;
    refs.secs.textContent = seconds;

    timeLeft -= 1000;
    if (timeLeft <= 0) {
      clearInterval(timerId);
      timerStatus = false;
      refs.startBtn.setAttribute('disabled', '');
      refs.datePicker.removeAttribute('disabled');
    }
  }, 1000);

  timerStatus = true;
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(ms / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((ms % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((ms % day) % hour) / minute));
  // Remaining seconds
  const seconds = addLeadingZero(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  // Adds 0 if the string is less than two characters
  return String(value).padStart(2, '0');
}
