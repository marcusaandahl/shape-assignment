// POSSIBLE REGEX INCONSISTENCIES
const intRegex = /^\d+$/g; //Any amount of digits
const locRegex = /^(\d{4})(,\d{4})*$/g; //4 digits + infinite x 4 digits seperated by commas

function validateSummaryParams(query) {
    if (query.unit && query.temperature && query.locations) {
        if (query.unit === 'celsius' || query.unit === 'fahrenheit') {
            if(intRegex.test(query.temperature)) {
                if (! locRegex.test(query.locations)) {
                    throw new Error('Locations invalid');
                } 
            } else {
                throw new Error('Temperature needs to be an integer')
            }
        } else {
            throw new Error('Invalid unit')
        }
    } else {
        throw new Error('Parameters missing')
    }
}

function validateLocationParams(params) {
    if (params.latlong) {
        if (! locRegex.test(params.latlong)) {
            throw new Error('Locations invalid');
        }
    } else {
        throw new Error('Parameters missing')
    }
}

module.exports = {validateSummaryParams, validateLocationParams};