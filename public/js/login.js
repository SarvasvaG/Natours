import { showAlert } from './alerts';

export const login = async (email, password) => {
  try {
    console.log(email, password);
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (res.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};

export const logout = async () => {
  try {
    const res = await axios({
      method: 'GET',
      url: '/api/v1/users/logout',
    });

    console.log(res.data);
    if(res.data.status === 'success') location.assign('/');
  } catch (err) {
    showAlert('error', 'Error logging out! Try again!');
  }
};
