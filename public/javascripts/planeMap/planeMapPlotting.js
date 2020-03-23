var airplanes = L.layerGroup();
var demo = L.layerGroup();

var bool = false;
const unixTime = {
    now: 0,
    hourBehind: 0,
    twoHoursBehind: 0
};
var offSiteX = -0.00001532;
var offSiteY = 0.00005708;

function fetchData() {
    getCurrentTimeInUnix();
    return fetch("https://opensky-network.org/api/states/all?begin=" + unixTime.hourBehind + "&end=" + unixTime.twoHoursBehind)
        .then((res) => {
            return res.json();
        })
        .then((res) => {
            return res.states.filter((state) => {
                return (state[2])
                    && (state[5]) && (state[6]);
            });
        })
        .catch((err) => {
            if (err) throw err
        })
}

function plotStates(map, markers) {
    fetchData().then(function (states) {
        states.forEach((state) => {
                const lat = state[6],
                    lng = state[5],
                    icao24 = state[0],
                    velocity = state[9],
                    country = state[2];

                if (markers[icao24]) {
                    markers[icao24].setLatLng([lat, lng]);
                } else {
                    markers[icao24] = L.marker([lat, lng], {icon: airportIcon});
                    if (country == 'Ireland') {
                        markers[icao24].addTo(airplanes)
                            .bindPopup('<form action="/planeEmissions" method="post">' +
                                '<input class="centerText" type="text" id="name" name="icaocode" value="' + icao24 + '" readonly><br>' +
                                '<label>Latitude: </label><input type="text" id="name" name="lat" value="' + lat + '" readonly><br>' +
                                '<label>Longitude: </label><input type="text" id="name" name="long" value="' + lng + '" readonly><br>' +
                                '<label>velocity: </label>' + velocity + 'm/s <br>' +
                                '<label>Country: </label>' + country + ' <br> <br>' +
                                '<div class="wrapper"><button >Emissions</button></div></form>')
                    } else {
                        markers[icao24].addTo(demo)
                            .bindPopup('<form action="/planeEmissions" method="post"><style>label{font-weight: bold; font-variant: small-caps; text-decoration: underline;}</style>' +
                                '<label>ICAO Code:</label> <input class="centerText" type="text" id="name" name="icaocode" value="' + icao24 + '" readonly><br>' +
                                '<label>Lat: </label> <input type="text" id="name" name="lat" value="' + lat + '" readonly><br>' +
                                '<label>Long: </label><input type="text" id="name" name="long" value="' + lng + '" readonly><br>' +
                                '<label>velocity: </label>' + velocity + 'm/s <br>' +
                                ' <button >Emissions</button></form>')
                    }
                }

        });

        if (bool == false) {
            var baseLayers = {
                "Streets": streets,
                "Grayscale": grayscale,
                "Satellite": basemap,
            };

            var overlays = {
                "Airplanes": airplanes,
                "Demo All Planes": demo,
            };
            L.control.layers(baseLayers, overlays).addTo(map);
            bool = true;
            setTimeout(() => plotStates(map, markers), 3000);
        } else {
            setTimeout(() => plotStates(map, markers), 3000);
        }
    });

}

function getCurrentTimeInUnix() {
    let myDate = new Date();
    unixTime.now = myDate.getTime() / 1000.0;
    // console.log("UnixTime.now: " + unixTime.now);
    myDate.setHours(myDate.getHours() - 1);
    unixTime.hourBehind = myDate.getTime() / 1000.0;
    // console.log("UnixTime.hourBehind: " + unixTime.hourBehind);
    myDate.setHours(myDate.getHours() - 2);
    unixTime.twoHoursBehind = myDate.getTime() / 1000.0;
    // console.log("UnixTime.twoHoursBehind: " + unixTime.twoHoursBehind);
}

const airportIcon = L.icon({
    iconUrl: '/images/planeIcon.png',
    iconSize: [15, 15], // size of the icon
    iconAnchor: [0, 0], // point of the icon which will correspond to marker's location
    popupAnchor: [0, 0], // point from which the popup should open relative to the iconAnchor
    focus: false,
    iconRotation: 270
});
const icon = L.icon;
var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
    '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
    'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

var grayscale = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', attribution: mbAttr}),
    streets = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', attribution: mbAttr});

var additional_attrib = 'created by '
    + '<a href="http://www.cityplanner.it" target ="_blank">'
    + 'CityPlanner'
    + '</a><br>';

var basemap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicGpob29rZXIiLCJhIjoiUllwRXNldyJ9.-wSBKOCm_XUxGiM1yWLxPQ',
    {
        attribution: additional_attrib
            + 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, '
            + '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
            + '<br>Imagery © <a href="https://mapbox.com">Mapbox</a>',
        // USE YOUR MAPBOX TOKEN !!!
        id: 'pjhooker.lad5pfap'
    });

var leafletMap = L.map('Map', {
    center: [53, -6.2603],
    zoom: 6,
    layers: [streets, airplanes]
});
const planeMarkers = {};
plotStates(leafletMap, planeMarkers);