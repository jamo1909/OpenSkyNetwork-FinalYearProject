const fetch = require("node-fetch");


function getCurrentTimeInUnix() {
    const unixTime = {
        now: 0,
        hourBehind: 0,
        twoHoursBehind: 0
    };
    let myDate = new Date();
    unixTime.now = myDate.getTime() / 1000.0;
    myDate.setHours(myDate.getHours() - 1);
    unixTime.hourBehind = myDate.getTime() / 1000.0;
    myDate.setHours(myDate.getHours() - 2);
    unixTime.twoHoursBehind = myDate.getTime() / 1000.0;
    return unixTime;
}

function checkPlaneInformation(plane) {
    if (plane.icao == null || plane.lat == null || plane.long == null) {
        alert("There is a null " + plane);
    } else {
        console.log("Plane information is correct");
    }
}

module.exports = async function getPlane(indexPlane) {
    console.log("Searching for plane");
    const unixTime = getCurrentTimeInUnix();
    const url = "https://opensky-network.org/api/states/all?begin=" + unixTime.now + "&end=" + unixTime.twoHoursBehind;
    const response = await fetch(url);
    const data = await response.json();
    return data;
};


