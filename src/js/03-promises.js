import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  form: document.querySelector('.form'),
};

refs.form.addEventListener('submit', onBtnClick);

function onBtnClick(event) {
  event.preventDefault();
  const formInfo = {
    position: 1,
  };
  const formData = new FormData(event.currentTarget);
  formData.forEach((value, name) => {
    formInfo[name] = parseInt(value);
  });

  createNewPromises(formInfo);
}

function createNewPromises({ delay, step, amount }) {
  for (let position = 1; position <= amount; position++) {
    createPromise({ position, delay }).then(onSuccess).catch(onError);
    delay += step;
  }
}

function createPromise({ position, delay }) {
  const shouldResolve = Math.random() > 0.3;
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve({ position: position, delay: delay });
      } else {
        reject({ position: position, delay: delay });
      }
    }, delay);
  });
}

function onSuccess({ position, delay }) {
  Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
}

function onError({ position, delay }) {
  Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
}