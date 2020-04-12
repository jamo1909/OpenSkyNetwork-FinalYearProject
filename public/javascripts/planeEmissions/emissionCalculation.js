let co2EmissionPerGramOfFuel = 3.16;
let co2perKgFuel = co2EmissionPerGramOfFuel * 1000.00;
var totalFuelConsumption = document.getElementById("totalFuelConsumption").innerText;
let emission = 0.00;

emissionCalculation();

function emissionCalculation() {
    console.log(co2EmissionPerGramOfFuel);
    console.log(co2perKgFuel);
    console.log(totalFuelConsumption);
    console.log(co2EmissionPerGramOfFuel);
    emission = parseFloat(totalFuelConsumption) * co2perKgFuel;
    console.log(emission);
    // emissionSpan.textContent = totalFuelConsumption; //Print name to page
    document.getElementById('emissionSpan').innerHTML = emission + "kg";
}