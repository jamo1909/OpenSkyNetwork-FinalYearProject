// const {Client} = require('pg');
// const model = new Client({
//     user: "postgres",
//     password: "jamo1818",
//     host: "localhost",
//     port: 5433,
//     database: "aircraftModel"
// });
// model.connect();
//
// fetchAirports();
// function fetchAirports() {
//     model.query("SELECT * from Public.\"airportDatabase\" ")
//         .then((res) => {
//             return res.rows.filter((rows) => {
//                 return (rows.name) && (rows.long) && (rows.lat);
//             });
//         })
//         .catch((err) => {
//             if (err) throw err
//         })
// }
//
// function plotAirports(map, markers) {
//     fetchData().then(function (rows) {
//         rows.forEach((state) => {
//             const name = rows.name,
//                 lat = rows.lat,
//                 long = rows.long;
//             if (markers[name]) {
//                 markers[name].setLatLng([lat, long]);
//             } else {
//                 markers[name] = L.marker([lat, long]);
//                 markers[name].addTo(map);
//             }
//         });
//         setTimeout(() => plotStates(map, markers), 3000);
//     });
// }
//
// const icon = L.icon;
// var map = L.map(document.getElementById('Map')).setView([48.8583736, 2.2922926], 4);
//
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
// }).addTo(map);
//
// L.marker([48.8583736, 2.2922926]).addTo(map);
//
// const markers = {};
// plotAirports(map, markers);