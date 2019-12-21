//Get json of planes in an area
const api_url = 'https://opensky-network.org/api/states/all?';
// const api_url = 'https://opensky-network.org/api/states/all?lamin=45.8389&lomin=5.9962&lamax=47.8229&lomax=10.5226';
$(document).ready(() => {
    $.get(api_url, ({states}, status) => {
        const $data = $("#data");

        // use forEach and destructure the columns data
        states.forEach(([col1, , col2, , , col3, col4, col5, , col6]) => {
            const cols = [col1, col2, col3, col4, col5, col6]; // combine to a single array

            $data.append(
                `<tr>${cols.map(c => `<td>${c}</td>`).join('')}</tr>` // iterate the cols and create the cells
            );
        });
    })
});

//Other Example;
// const api_url = 'https://opensky-network.org/api/states/all?lamin=45.8389&lomin=5.9962&lamax=47.8229&lomax=10.5226';
// $(document).ready(function() {
//     $.get(api_url, function(data, status) {
//         var states = (data.states);
//         $.each(states, function(index, state) {
//             $("#data").append('<tr><td>' + state[0] + '</td><td>' + state[2] + '</td><td>' + state[5] + '</td><td>' + state[6] + '</td><td>' + state[7] + '</td><td>' + state[9] + '</td></tr>')
//         })
//     })
// })