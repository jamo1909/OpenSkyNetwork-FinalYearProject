//Haversine function to calculate distance on the earth(GreaterCircleDistance)
module.exports = function distance(latOne, longOne, latTwo, longTwo) {
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
    let flightDistance = Math.round(earthRadius * c);
    console.log("Distance in " + flightDistance + " KM");
    console.log("Distance in " + flightDistance * 0.62137 + " Miles");
    console.log("Distance in " + flightDistance * 1.852 + " Nautical-Miles");
    return icaoDistanceCorrectionFactor(flightDistance);
};// function distance(lat1, lon1, lat2, lon2) {
//     var earthRadius = 6371; // km
//     var x1 = lat2 - lat1;
//     var dLat = x1.toRad();
//     var x2 = lon2 - lon1;
//     var dLon = x2.toRad();
//     var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) *
//         Math.sin(dLon / 2) * Math.sin(dLon / 2);
//     var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//     var flightDistance = earthRadius * c;
//     return icaoDistanceCorrectionFactor(Math.round(flightDistance));
// }
// Number.prototype.toRadians = function() {
//     return this * Math.PI / 180;
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


//TESTING
// const functions = {
//     distance: (latOne, longOne, latTwo, longTwo) => {
//         console.log("Point One: " + latOne + "," + longOne);
//         console.log("Point Two: " + latTwo + "," + longTwo);
//         const earthRadius = 6371; //Earths Radius in km
//         let latOneRad = functions.toRadians(latOne);
//         let latitude = functions.toRadians(latTwo - latOne);
//         let latTwoRad = functions.toRadians(latTwo);
//         let longitude = functions.toRadians(longTwo - longOne);
//         let a = Math.sin(latitude / 2) * Math.sin(latitude / 2) +
//             Math.cos(latOneRad) * Math.cos(latTwoRad) *
//             Math.sin(longitude / 2) * Math.sin(longitude / 2);
//         let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//         let flightDistance = Math.round(earthRadius * c);
//         console.log("Distance in " + flightDistance + " KM");
//         console.log("Distance in " + flightDistance * 0.62137 + " Miles");
//         console.log("Distance in " + flightDistance * 1.852 + " Nautical-Miles");
//         return functions.icaoDistanceCorrectionFactor(flightDistance);
//     },
//     toRadians: (degrees) => {
//         return degrees * (Math.PI / 180);
//     },
//     icaoDistanceCorrectionFactor: (distance) => {
//         if (distance == null) {
//             console.log("Error: Empty Distance");
//         } else if (distance < 550) {
//             distance += 50;
//         } else if (distance >= 550 && distance <= 5500) {
//             distance += 100;
//         } else if (distance > 5500) {
//             distance += 125;
//         } else {
//             console.log("Error on distance");
//         }
//         console.log("Correction factor: " + distance + " KM");
//         return distance;
//     }
// };
// module.exports = functions;