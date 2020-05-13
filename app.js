mapboxgl.accessToken = 'pk.eyJ1IjoiaGFuc21hbmRlciIsImEiOiJja2E1aWpqNnQwMGdmM2Zwb2wycHNnbWN0In0.25P6RlgqILLSEirCdvIwoA';

function success(pos) {
  const crd = pos.coords;

  console.log('Your current position is:');
  console.log(`Latitude : ${crd.latitude}`);
  console.log(`Longitude: ${crd.longitude}`);
  console.log(`More or less ${crd.accuracy} meters.`);

  createMap(crd.longitude, crd.latitude);
}

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
}

navigator.geolocation.getCurrentPosition(success, error);

function createMap(lng, lat) {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [lng, lat],
    zoom: 13
  });

  const marker = new mapboxgl.Marker()
    .setLngLat([lng, lat])
    .addTo(map)
    .setPopup(new mapboxgl.Popup({closeButton: false , closeOnClick: false}).setHTML("You Are Here"))

  marker.togglePopup();
}

