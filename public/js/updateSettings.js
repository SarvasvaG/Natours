import { showAlert } from './alerts';

// type is 'password' or 'data'
export const updateSettings = async (data, type) => {
  try {
    const res = await axios({
      method: 'PATCH',
      url: `/api/v1/users/${type === 'password' ? 'updatePassword' : 'updateMe'}`,
      data,
    });
    if (res.data.status === 'success') {
      showAlert('success', 'Data updated successfully!');
      setTimeout(() => {
        location.reload(true);
      }, 1000);
    }
  } catch (err) {
    showAlert('error', err.response.data.message);
  }
};
