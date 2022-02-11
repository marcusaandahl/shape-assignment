const express = require('express');
const axios = require('axios').default;
const router = express.Router();
const siUtils = require('../utils/si'); //METRIC/IMPERIAL CONVERSION
const weatherApiValidation = require('../utils/validations/weatherApiValidation'); //VALIDATIONS
const apiUsage = require('../utils/analytics/apiUsage');

const OPENWEATHER_API_KEY = '9710517471879ab8156c44587d0a9b60'; //API KEY TO BE SAFELY STORED

// SUMMARY RETURN TOMORROWS TEMPERATURES
router.get('/summary', (req, res) => {
  try {
    weatherApiValidation.validateSummaryParams(req.query) //Validates parameters
    getTomorrowWeatherOfLocations(req) //Gets data from API
    .then(data => {
      res.json(data); //Returns data in JSON format
    })
    .catch(err => {
      res.status(500).send(err.message);//Send error if validation fails + description
    })
  } catch (err) {
    res.status(500).send(err.message); //Send error if validation fails + description
  }
});

// RETURN WEATHER FOR NEXT 5 DAYS
router.get('/location/:latlong', (req, res) => {
  try {
    weatherApiValidation.validateLocationParams(req.params) //Validates parameters
    getLongTermWeatherOfLocations(req) //Gets data from API
    .then(data => {
      res.json(data); //Returns data in JSON format
    })
    .catch(err => {
      res.status(500).send(err.message); //Send error if validation fails + description
    })
  } catch (err) {
    res.status(500).send(err.message); //Send error if validation fails + description
  }
});


// FETCH FUNCTIONS
// Tomorrows Temperatures
async function getTomorrowWeatherOfLocations(req) {
  var locs = req.query.locations.split(',').map(loc => { //Formats location query
    return [`${loc[0]}${loc[1]}`, `${loc[2]}${loc[3]}`]
  })
  const totalData = [];
  for await (const loc of locs) { // Fetches data for each location
    const locData = [];
    apiUsage.useRequest();
    const data = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${parseInt(loc[0])}&lon=${parseInt(loc[1])}&exclude=alerts,hourly,current,minutely&appid=${OPENWEATHER_API_KEY}`);
    if (req.query.unit === 'celsius') { //returns in celsius
      if (siUtils.kelvinToC(parseInt(data.data.daily[1].temp.min)) >= (parseInt(req.query.temperature))) {
        locData.push({
          utcDate: data.data.daily[1].dt,
          unit: 'celsius',
          latlong: parseInt(`${loc[0]}${loc[1]}`),
          minTemp: siUtils.kelvinToC(data.data.daily[1].temp.min),
          maxTemp: siUtils.kelvinToC(data.data.daily[1].temp.max),
        });
      }
    } else if (req.query.unit === 'fahrenheit') { //returns in fahrenheit
      if (siUtils.kelvinToF(parseInt(data.data.daily[1].temp.min)) >= (parseInt(req.query.temperature))) {
        locData.push({
          utcDate: data.data.daily[1].dt,
          unit: 'fahrenheit',
          latlong: parseInt(`${loc[0]}${loc[1]}`),
          minTemp: siUtils.kelvinToF(data.data.daily[1].temp.min),
          maxTemp: siUtils.kelvinToF(data.data.daily[1].temp.max),
        })
      }
    }
    locData.length > 0 ? totalData.push(locData[0]) : totalData.push(`Location ${locs.indexOf(loc)} at ${loc[0]}${loc[1]} too cold`); //Return too cold, if temperature under the given param
  }
  return totalData;
}

//Temperatures for the next 5 days
async function getLongTermWeatherOfLocations(req) {
  var location = [`${req.params.latlong[0]}${req.params.latlong[1]}`, `${req.params.latlong[2]}${req.params.latlong[3]}`]; //Formats coordinates
  const totalData = {
    latlong: `${location[0]}${location[1]}`,
    weather: []
  };
  apiUsage.useRequest();
  const data = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${parseInt(location[0])}&lon=${parseInt(location[1])}&exclude=alerts,hourly,current,minutely&appid=${OPENWEATHER_API_KEY}`);
  data.data.daily.forEach((dailyData, index) => { //Formats in an array
    if (index < 6 ) { //Only gets next 5 days + today
      totalData.weather.push({
        utcDate: dailyData.dt,
        celsius: {
          minTemp: siUtils.kelvinToC(parseInt(dailyData.temp.min)),
          maxTemp: siUtils.kelvinToC(parseInt(dailyData.temp.max)),
        },
        fahrenheit: {
          minTemp: siUtils.kelvinToF(parseInt(dailyData.temp.min)),
          maxTemp: siUtils.kelvinToF(parseInt(dailyData.temp.max)),
        }
      });
    }
  })
  return totalData;
}

module.exports = router;
