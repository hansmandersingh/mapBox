const form = document.querySelector('form');
const pointsOfInterest = document.querySelector('.points-of-interest');
let lng1;
let lat1;

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

  map.addControl(new mapboxgl.GeolocateControl({
    positionOptions: {
        enableHighAccuracy: true
    },
    trackUserLocation: true
}));

  lng1 = lng;
  lat1 = lat;

}

function fetchPOI(lng, lat, searchval) {
  let places = [];

  fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${searchval}.json?proximity=${lng},${lat}&types=poi&limit=10&access_token=${mapboxgl.accessToken}`)
  .then(data => data.json())
  .then(json => {
    

    json.features.forEach(feature => {
      lng2 = feature.geometry.coordinates[0];
      lat2 = feature.geometry.coordinates[1];

      let dist = distance(lat, lng, lat2, lng2);

      places.push({
        d: dist,
        place: feature,
      })
    });

    places.sort(function (a,b) {
      return a.d - b.d;
    })

    places.forEach(place => {
      insertHtml(place)
    })
  })
}

function distance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		let radlat1 = Math.PI * lat1/180;
		let radlat2 = Math.PI * lat2/180;
		let theta = lon1-lon2;
		let radtheta = Math.PI * theta/180;
		let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit=="K") { dist = dist * 1.609344 }
		if (unit=="N") { dist = dist * 0.8684 }
		return dist;
	}
}

form.addEventListener('keydown', function(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    pointsOfInterest.innerHTML = "";
    if (lng1 !== undefined && lat1 !== undefined) {
      fetchPOI(lng1, lat1, e.target.value);
    }

    e.target.value = "";
  }
})

function insertHtml(place) {
  pointsOfInterest.insertAdjacentHTML('beforeend', `
    <li class="poi" data-long="${place.place.geometry.coordinates[0]}" data-lat="${place.place.geometry.coordinates[1]}">
    <ul>
      <li class="name">${place.place.text}</li>
      <li class="street-address">${place.place.properties.address}</li>
      <li class="distance">${place.d.toFixed(2)} KM</li>
      </ul>
    </li>
  `)
}

pointsOfInterest.addEventListener('click' , function(e) {
  if (e.target.nodeName === 'LI') {
    if (e.target.className === 'poi') {
      console.log(e.target.getAttribute('data-long'));
      console.log(e.target.getAttribute('data-lat'));
      newLocation();
    } else {
      let ele = e.target.closest('.poi');

      console.log(ele.getAttribute('data-long'));
      console.log(ele.getAttribute('data-lat'));
    }
  }
})

function newLocation() {
  let marker = new mapboxgl.Marker()
    .addTo(map);

  marker.remove();
}