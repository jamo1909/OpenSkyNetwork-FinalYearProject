const functions = require('./../public/javascripts/calculations/greatCircleDistance');


test('Testing Null values - correction factor 50KM', () => {
    expect(functions.distance(1, 1, 1, 1)).toBe(50);
});

test('Average factor flight Dublin to Frankfurt', () => {
    expect(functions.distance(53.4264, 6.2499, 50.0379, 8.5622)).toBe(459);
});

test('Dublin Airport - London Heathrow Airport', () => {
    expect(functions.distance(53.4264, 6.2499, 51.4700, 0.4543)).toBe(499);
});

test('Radian Check 45', () => {
    expect(functions.toRadians(45)).toBe(0.7853981633974483);
});


test('Radian Check 90', () => {
    expect(functions.toRadians(90)).toBe(1.5707963267948966);
});

test('Radian Check 180', () => {
    expect(functions.toRadians(180)).toBe(3.141592653589793);
});

test('Radian Check 360', () => {
    expect(functions.toRadians(360)).toBe(6.283185307179586);
});

//Correction factor
test('Correction Factor - null', () => {
    expect(functions.icaoDistanceCorrectionFactor(null)).toBe(null);
});

test('Correction Factor - 0', () => {
    expect(functions.icaoDistanceCorrectionFactor(0)).toBe(50);
});

test('Correction Factor - 549', () => {
    expect(functions.icaoDistanceCorrectionFactor(549)).toBe(599);
});

test('Correction Factor - 550', () => {
    expect(functions.icaoDistanceCorrectionFactor(550)).toBe(650);
});

test('Correction Factor - 5500', () => {
    expect(functions.icaoDistanceCorrectionFactor(5500)).toBe(5600);
});

test('Correction Factor - 5501', () => {
    expect(functions.icaoDistanceCorrectionFactor(5600)).toBe(5725);
});


