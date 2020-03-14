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

module.exports = async function getPlane() {
    const unixTime = getCurrentTimeInUnix();
    const url = "https://opensky-network.org/api/states/all?begin=" + unixTime.twoHoursBehind + "&end=" + unixTime.now;
    console.log(url);
    const response = await fetch(url);
    const data = await response.json();
    var planes = data.states;
    return planes;
};


