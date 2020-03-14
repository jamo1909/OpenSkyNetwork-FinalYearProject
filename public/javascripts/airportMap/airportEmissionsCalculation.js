var token = "aa3ebd6aab71743de4b90ba32e545cee0865be78";
var API_KEY = '15296087-cbd41a05f8c372ea3ac846dcc';

function openNav(airportName) {
    document.getElementById("mySidenav").style.width = "30%";
    document.getElementById("mapDiv").style.width = "70%";
    map._onResize();
    var val = airportName;
    var index = airportsData.findIndex(function (item, i) {
        return item.name === val
    });
    console.log("index: " + index);
    var paragraph = document.getElementById("planeTitle");
    paragraph.textContent = airportsData[index].name;
    var table = document.getElementById("myTable");
    var cell2 = table.rows[0].cells[1];
    cell2.innerHTML = airportsData[index].name;
    var cell2 = table.rows[1].cells[1];
    cell2.innerHTML = airportsData[index].city;
    var cell2 = table.rows[2].cells[1];
    cell2.innerHTML = airportsData[index].country;
    var cell2 = table.rows[3].cells[1];
    cell2.innerHTML = airportsData[index].latitude;
    var cell2 = table.rows[4].cells[1];
    cell2.innerHTML = airportsData[index].longitude;
    var cell2 = table.rows[5].cells[1];
    cell2.innerHTML = airportsData[index].altitude;
    airQualityFetch(airportsData[index].latitude, airportsData[index].longitude);

    var URL = "https://pixabay.com/api/?key=" + API_KEY + "&q=" + encodeURIComponent(airportsData[index].city) + "&image_type=photo&pretty=true";
    $.getJSON(URL, function (data) {
        if (parseInt(data.totalHits) > 0) {
            $.each(data.hits, function (i, hit) {
                console.log("image_src");
                $('.planePicture').css('background-image', "url('" + hit.largeImageURL + "')");
                $('.planePicture').css('background-repeat', "no-repeat");
                $('.planePicture').css('background-size', "100% 100%");
            });
        } else {
            console.log(airportsData[index].city);
            var URL = "https://pixabay.com/api/?key=" + API_KEY + "&q=" + encodeURIComponent(airportsData[index].country) + "&image_type=photo&pretty=true";
            $.getJSON(URL, function (data) {
                if (parseInt(data.totalHits) > 0) {
                    $.each(data.hits, function (i, hit) {
                        console.log(hit.largeImageURL);
                        console.log("image_src");
                        $('.planePicture').css('background-image', "url('" + hit.largeImageURL + "')");
                        $('.planePicture').css('background-repeat', "no-repeat");
                        $('.planePicture').css('background-size', "100% 100%");
                    });
                }
            });
        }
    });

}

async function airQualityFetch(lat, long) {
    lat = Math.round(lat * 10) / 10;
    long = Math.round(long * 10) / 10;
    const url = "https://api.waqi.info/feed/geo:" + lat + ";" + long + "/?token=" + token + "";
    console.log(url);
    const response = await fetch(url);
    const quality = await response.json();
    var table = document.getElementById("myTable");
    var cell2 = table.rows[6].cells[1];
    cell2.innerHTML = quality.data.aqi + " AQI";
    getAirQualityColour(quality.data.aqi);
    var cell2 = table.rows[8].cells[1];
    cell2.innerHTML = quality.data.iaqi.no2.v;
    var cell2 = table.rows[9].cells[1];
    cell2.innerHTML = quality.data.iaqi.o3.v;
    var cell2 = table.rows[10].cells[1];
    cell2.innerHTML = quality.data.iaqi.pm10.v;
    var cell2 = table.rows[11].cells[1];
    cell2.innerHTML = quality.data.iaqi.pm25.v;
    var cell2 = table.rows[12].cells[1];
    cell2.innerHTML = quality.data.iaqi.so2.v;
    var a = document.getElementById('airQualityLink'); //or grab it by tagname etc
    a.href = quality.data.city.url;
}

function getAirQualityColour(airQuality) {
    if (airQuality >= 0 && airQuality < 50) {
        document.getElementById("aqiColour").innerHTML = "Good";
        document.getElementById("aqiColour").style.backgroundColor = '#2E8B57'
    } else if (airQuality >= 50 && airQuality <= 100) {
        document.getElementById("aqiColour").innerHTML = "Moderate";
        document.getElementById("aqiColour").style.backgroundColor = '#FFD700'
    } else if (airQuality > 100 && airQuality <= 150) {
        document.getElementById("aqiColour").innerHTML = "Unhealthy for Sensitive Group";
        document.getElementById("aqiColour").style.backgroundColor = '#FF8C00'
    } else if (airQuality > 150 && airQuality <= 200) {
        document.getElementById("aqiColour").innerHTML = "Unhealthy";
        document.getElementById("aqiColour").style.backgroundColor = '#FF0000'
    } else if (airQuality > 200 && airQuality <= 300) {
        document.getElementById("aqiColour").innerHTML = "Very Unhealthy";
        document.getElementById("aqiColour").style.backgroundColor = '#8A2BE2'
    } else if (airQuality > 300) {
        document.getElementById("aqiColour").innerHTML = "Hazardous";
        document.getElementById("aqiColour").style.backgroundColor = '#8B0000'
    }
}

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("mapDiv").style.width = "100%";
    document.getElementById("Map").style.width = "100%";
    map._onResize();
}