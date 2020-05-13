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

  fetchPOI(lng, lat);
}

function fetchPOI(lng, lat) {
  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/sushi.json?proximity=${lng},${lat}&access_token=${mapboxgl.accessToken}`)
  .then(data => data.json())
  .then(json => {
    let places = [];

    json.features.forEach(feature => {
      lng2 = feature.geometry.coordinates[0];
      lat2 = feature.geometry.coordinates[1];

      let dist = distance(lat, lng, lat2, lng2);

      places.push({
        d: dist,
        place: feature,
      })

      console.log(dist, feature)
    });

    console.log(places)
  })
}

function distance(lat1, lon1, lat2, lon2, unit) {
  let radlat1 = Math.PI * lat1/180
  let radlat2 = Math.PI * lat2/180
  let theta = lon1-lon2
  let radtheta = Math.PI * theta/180
  let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

  dist = Math.acos(dist)
  dist = dist * 180/Math.PI
  dist = dist * 60 * 1.1515
  if (unit=="K") { dist = dist * 1.609344 }
  if (unit=="N") { dist = dist * 0.8684 }
  return dist
}