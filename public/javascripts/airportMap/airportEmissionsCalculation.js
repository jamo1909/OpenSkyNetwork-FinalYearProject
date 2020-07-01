var token = "aa3ebd6aab71743de4b90ba32e545cee0865be78"; //Token for air quality API
var API_KEY = '15296087-cbd41a05f8c372ea3ac846dcc';//API key for flickr API

function openNav(airportName) {//The airport name is inserted into the function
    if($(window).width() <  600){
        document.getElementById("mySidenav").style.width = "100%"; //Open the size nav
        document.getElementById("mapDiv").style.width = "0%";//Make map smaller
    }else{
        document.getElementById("mySidenav").style.width = "30%"; //Open the size nav
        document.getElementById("mapDiv").style.width = "70%";//Make map smaller
    }

    map._onResize();
    var val = airportName;
    var index = airportsData.findIndex(function (item, i) {
        return item.name === val
    });//Is the airport name in the DB
    console.log("index: " + index);//Print to console
    var paragraph = document.getElementById("planeTitle");
    paragraph.textContent = airportsData[index].name; //Print name to page
    var table = document.getElementById("myTable");
    var cell2 = table.rows[0].cells[1];
    cell2.innerHTML = airportsData[index].name; //Print name to sideNav
    var cell2 = table.rows[1].cells[1];
    cell2.innerHTML = airportsData[index].city; //Print city to sideNav
    var cell2 = table.rows[2].cells[1];
    cell2.innerHTML = airportsData[index].country;//Print country to sideNav
    var cell2 = table.rows[3].cells[1];
    cell2.innerHTML = airportsData[index].latitude + "˚";//Print latitude to sideNav
    var cell2 = table.rows[4].cells[1];
    cell2.innerHTML = airportsData[index].longitude + "˚";//Print longitude to sideNav
    var cell2 = table.rows[5].cells[1];
    cell2.innerHTML = airportsData[index].altitude;//Print altitude to table
    airQualityFetch(airportsData[index].latitude, airportsData[index].longitude);//Send airport latitude and longitude to air quality API

    //Image API
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
    lat = Math.round(lat * 10) / 10; //Round latitude
    long = Math.round(long * 10) / 10;//Round longitude
    const url = "https://api.waqi.info/feed/geo:" + lat + ";" + long + "/?token=" + token + ""; //API url
    console.log(url);//print to console
    const response = await fetch(url);
    const quality = await response.json();
    var table = document.getElementById("myTable");
    var cell2 = table.rows[6].cells[1]; //Print longitude to sideNav
    cell2.innerHTML = quality.data.aqi + " AQI"; //Print air quality to sideNav
    getAirQualityColour(quality.data.aqi);
    var cell2 = table.rows[8].cells[1];
    cell2.innerHTML = quality.data.iaqi.no2.v;//Print nitrogen dioxide to sideNav
    var cell2 = table.rows[9].cells[1];
    cell2.innerHTML = quality.data.iaqi.o3.v; //Print ozone gas to sideNav
    var cell2 = table.rows[10].cells[1];
    cell2.innerHTML = quality.data.iaqi.pm10.v; //Print pm10 to sideNav
    var cell2 = table.rows[11].cells[1];
    cell2.innerHTML = quality.data.iaqi.pm25.v; //Print pm2.5 to sideNav
    var cell2 = table.rows[12].cells[1];
    cell2.innerHTML = quality.data.iaqi.so2.v; //Print sulfur dioxide to sideNav
    var a = document.getElementById('airQualityLink'); //or grab it by tagname etc
    a.href = quality.data.city.url;//Print air quality link to sideNav
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
}//This function will display a color to the cell of the table depending on the air quality

function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("mapDiv").style.width = "100%";
    document.getElementById("Map").style.width = "100%";
    map._onResize();
}//This function closes the sidenav and resize's the leafletJs map