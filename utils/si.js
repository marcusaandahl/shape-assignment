function kelvinToC(temp) {
    return Math.round(temp-(273.15));
}

function kelvinToF(temp) {
    return Math.round(((temp - 273.15) * (9/5)) + 32)
}

module.exports = {kelvinToC, kelvinToF};