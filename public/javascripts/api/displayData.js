const api_url = 'https://opensky-network.org/api/states/all?';
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

//This function send the live aircraft Json file to a html table