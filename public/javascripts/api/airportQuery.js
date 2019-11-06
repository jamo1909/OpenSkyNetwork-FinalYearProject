var arrivalAirport;
var destinationAirport;
var planeIcao = '3c675a';
const test_url = 'https://opensky-network.org/api/flights/aircraft?icao24=3c675a&begin=1517184000&end=1517270400';

async function getAirports(planeIcao) {
    const airport_url = 'https://opensky-network.org/api/flights/aircraft?icao24=' + planeIcao + '&begin=1517184000&end=1517270400';
    const response = await fetch(airport_url);
    const data = await response.json();
    console.log(data[0]);
    console.log(data[0].estArrivalAirport);
    arrivalAirport = data[0].estArrivalAirport;
    console.log(data[0].estDepartureAirport);
    destinationAirport = data[0].estDepartureAirport;
}

getAirports(planeIcao);

async function getPLane() {
    const airport_url = 'https://opensky-network.org/api/flights/aircraft?icao24=' + planeIcao + '&begin=1517184000&end=1517270400';
    const response = await fetch(airport_url);
    const data = await response.json();
    console.log(data[0]);
    console.log(data[0].estArrivalAirport);
    arrivalAirport = data[0].estArrivalAirport;
    console.log(data[0].estDepartureAirport);
    destinationAirport = data[0].estDepartureAirport;
}