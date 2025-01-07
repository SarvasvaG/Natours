import { login, logout } from './login';
import { displayMap } from './mapbox';
import { updateSettings, updateUserData } from './updateSettings';
import { bookTour } from './stripe';

// import 'core-js/stable';
// import 'regenerator-runtime/runtime';

// DOM ELEMENTS
const locationsData = document.getElementById('serverData');
const loginForm = document.querySelector('.form--login');
const logoutBtn = document.querySelector('.nav__el--logout');
const updateUserDataForm = document.querySelector('.form-user-data');
const updateUserPasswordForm = document.querySelector('.form-user-settings');
const bookTourBtn = document.querySelector('#book-tour');

if (locationsData) {
  const locations = JSON.parse(locationsData.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password);
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', logout);
}

if (updateUserDataForm) {
  updateUserDataForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = new FormData();
    console.log(document.getElementById('photo')[0]);
    form.append('email', document.getElementById('email').value);
    form.append('name', document.getElementById('name').value);
    form.append('photo', document.getElementById('photo').files[0]);
    for (const [key, value] of form.entries()) {
      console.log(key, value);
    }
    updateSettings(form, 'data');
  });
}

if (updateUserPasswordForm) {
  updateUserPasswordForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = document.getElementById('password-current').value;
    const newPassword = document.getElementById('password').value;
    const newPasswordConfirm =
      document.getElementById('password-confirm').value;
    updateSettings({ password, newPassword, newPasswordConfirm }, 'password');
  });
}

if (bookTourBtn) {
  bookTourBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await bookTour(e.target.dataset.tourId);
  });
}
