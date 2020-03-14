const fetch = require("node-fetch");
let indexPlane = 0;

function getCurrentTimeInUnix() {
    const unixTime = {
        now: 0,
        hourBehind: 0,
        twoHoursBehind: 0
    };
    let myDate = new Date();
    myDate.setDate(myDate.getDate() - 1);
    unixTime.now = myDate.getTime() / 1000.0;
    console.log(unixTime.now);
    myDate.setHours(myDate.getHours() - 1);
    unixTime.hourBehind = myDate.getTime() / 1000.0;
    console.log(unixTime.hourBehind);
    myDate.setHours(myDate.getHours() - 2);
    unixTime.twoHoursBehind = myDate.getTime() / 1000.0;
    console.log(unixTime.twoHoursBehind);

    return unixTime;
}

//
// function checkPlaneInformation(plane) {
//     if (plane.icao == null || plane.lat == null || plane.long == null) {
//         console.log("There is a null " + plane);
//     } else {
//         console.log("Plane information is correct");
//     }
// }

module.exports = async function getPlane() {
    const unixTime = getCurrentTimeInUnix();
    const url = "https://opensky-network.org/api/states/all?begin=" + unixTime.twoHoursBehind + "&end=" + unixTime.now;
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    var planes = data.states;
    // console.log(planes[0]);
    // for (x in planes) {
    //     console.log(planes[x]);
    // }
    // plane.icao = data.states[indexPlane][0];
    // console.log(plane.icao);
    // plane.long = data.states[indexPlane][5];
    // plane.lat = data.states[indexPlane][6];
    // checkPlaneInformation(plane);
    return planes;
};


