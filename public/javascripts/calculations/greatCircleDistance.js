
//Default to Dublin Airport
const originAirport = {
    lat: 53.4264481,
    long: -6.2499098
};
//Default to London Airport
const destAirport = {
    lat: 51.470020,
    long: -0.454295
};

//Call function
// distance(originAirport.lat, originAirport.long, destAirport.lat, destAirport.long);

//Haversine function to calculate distance on the earth(GreaterCircleDistance)
function distance(latOne, longOne, latTwo, longTwo) {
    console.log("Point One: " + latOne + "," + longOne);
    console.log("Point Two: " + latTwo + "," + longTwo);
    const earthRadius = 6371; //Earths Radius in km
    let latOneRad = toRadians(latOne);
    let latitude = toRadians(latTwo - latOne);
    let latTwoRad = toRadians(latTwo);
    let longitude = toRadians(longTwo - longOne);
    let a = Math.sin(latitude / 2) * Math.sin(latitude / 2) +
        Math.cos(latOneRad) * Math.cos(latTwoRad) *
        Math.sin(longitude / 2) * Math.sin(longitude / 2);
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let distance = Math.round(earthRadius * c);
    console.log("Distance in " + distance + " KM");
    console.log("Distance in " + distance * 0.62137 + " Miles");
    return icaoDistanceCorrectionFactor(distance);
}

//Version 2 - GreaterCircleDistance
// function distanceTwo(latOne, longOne, latTwo, longTwo) {
//     var x1 = toRadians(latOne);
//     var y1 = toRadians(longOne);
//     var x2 = toRadians(latTwo);
//     var y2 = toRadians(longTwo);
//     var angle1 = Math.acos(Math.sin(x1) * Math.sin(x2) + Math.cos(x1) * Math.cos(x2) * Math.cos(y1 - y2));
//     angle1 = angle1 * (180 / Math.PI);
//     var distance = 60 * angle1;
//     var distanceKm = distance * 1.852;
//     console.log("New Distance: " + distanceKm);
// }

//Converting degree's to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

//ICAO recommended distance correction factor
function icaoDistanceCorrectionFactor(distance) {
    if (distance == null) {
        console.log("Error: Empty Distance");
    } else if (distance < 550) {
        distance += 50;
    } else if (distance >= 550 || distance <= 5500) {
        distance += 100;
    } else if (distance > 5500) {
        distance += 125;
    } else {
        console.log("Error on distance");
    }
    console.log("Correction factor: " + distance + " KM");
    return distance;
}

//Connecting DB
async function getCurrentPLanes() {
    var icao = document.getElementById("icaoNumber").value;
    var time = getCurrentTimeInUnix();
    //console.log(icao);
    var api_url = 'https://opensky-network.org/api/states/all?';
    const response = await fetch(api_url);
    const data = await response.json();
    console.log(data);
    console.log(data.states[0][0]);
    var plane = data.states[0][0];
    document.getElementById("planes").innerHTML = plane;
}
