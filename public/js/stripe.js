const { showAlert } = require('./alerts');

exports.bookTour = async (tourId) => {
  try {
    console.log(tourId);
    const result = await axios({
      method: 'GET',
      url: `/api/v1/bookings/checkout-session/${tourId}`,
    });
    console.log(result);
    window.location.href = result.data.session.url;
  } catch (err) {
    showAlert('error', 'Error booking the tour! Please try again!');
  }
};
