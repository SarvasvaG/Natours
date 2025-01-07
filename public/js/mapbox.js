export const displayMap = (locations) => {
  const map = L.map('map', {
    scrollWheelZoom: false,
    doubleClickZoom: false,
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  var greenIcon = L.icon({
    iconUrl: '/img/pin.png',
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -45],
  });

  const points = [];
  locations.forEach((loc) => {
    points.push([loc.coordinates[1], loc.coordinates[0]]);
    const marker = L.marker([loc.coordinates[1], loc.coordinates[0]], {
      icon: greenIcon,
    }).addTo(map);

    marker
      .bindPopup(`<p>Day ${loc.day}: ${loc.description}</p>`, {
        autoClose: false,
        closeOnClick: false,
      })
      .openPopup();
  });

  const bounds = L.latLngBounds(points).pad(0.5);
  map.fitBounds(bounds);
};
