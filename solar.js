var assert = require('assert');
var swe = require('swisseph');
var queue = require("queue-async");

console.log("hi");
test();





//object containing all the functions
var solar = {

    PLUTO: "PLUTO",

    //lets start with heliocentric first
    heliocen: {
        getPluto: function() {
            return getPlanet(this.PLUTO);
        },
        getPlanet: function(p) {
            //figure out what to do here
        },
        //returns the position of a planet at a certain time
        getPos: function(planet, date, callback) {
            //some swe stuff here

        },
        //returns the positions of all the planets in the solar system at a given time
        getAllPos: function(date, callback) {

        }
    },

    //do this once heliocetric is done
    geocen: {},
    getHelioCen: function() {
        return this.heliocen;
    },
    getGeoCen: function() {
        return this.geocen;
    }

}
//TODO get utc time from local time
// var query = {};
// var planets = [swe.SE_MOON, swe.SE_MERCURY, swe.SE_VENUS, swe.SE_MARS, swe.SE_JUPITER, swe.SE_URANUS, swe.SE_NEPTUNE, swe.SE_SUN];
// var pnames = new Array();
// pnames[swe.SE_MOON] = "Moon";
// pnames[swe.SE_MERCURY] = "Mercury";
// pnames[swe.SE_VENUS] = "Venus";
// pnames[swe.SE_JUPITER] = "Jupiter";
// pnames[swe.SE_URANUS] = "Uranus";
// pnames[swe.SE_NEPTUNE] = "Neptune";
// pnames[swe.SE_SUN] = "Sun";
// pnames[swe.SE_MARS] = "Mars";


var flag = swe.SEFLG_SPEED | swe.SEFLG_MOSEPH;



var chaks = function(year, month, day, time, city, callback) {
    //TODO error handling
    console.log("chaks");
    query.city = city;
    query.year = year;
    query.month = month;
    query.day = day;
    query.time = time;

    queue(1).defer(getCoords, query.city).defer(getInfo, query).awaitAll(function(error, results) {

        console.log("here we go");
        console.log("error: " + error);
        console.log("results: ", results);

        var chartInfo = results[1];

        callback(error, chartInfo);

    });
}

    function getInfo(query, callback) {
        swe.swe_set_topo(query.lon, query.lat, 0);
        console.log("getInfo", "query", query);

        swe.swe_julday(query.year, query.month, query.day, query.time, swe.SE_GREG_CAL, function(julday_ut) {
            console.log("julday_ut: " + julday_ut);

            var q = queue();
            planets.forEach(function(p) {
                q.defer(calcPlanet, julday_ut, p);
            });
            q.awaitAll(function(error, results) {
                console.log("second queue awaitAll");
                if (error) {
                    console.log("error in second queue: " + error);
                    callback(error);
                } else {
                    callback(null, results);
                }
            });
        });

    }

    function calcPlanet(julday, planet, callback) {
        swe.swe_calc_ut(julday, planet, flag, function(body) {
            console.log('calcPlanet: ' + planet);
            //degree_ut = result[0];
            var degree_ut = body.longitude;
            console.log('degree_ut:' + degree_ut);

            var found = false;
            for (var i = 0; i < 12; i++) {
                var deg_low = i * 30;
                deg_high = (i + 1) * 30;
                if (degree_ut >= deg_low && degree_ut <= deg_high) {
                    found = true;
                    var cibody = {
                        "planet": pnames[planet],
                        "sign": snames[i]
                    };
                    console.log("cibody: ", cibody);

                    callback(null, cibody);
                }
            }
            if (!found) {
                callback("planet not found");
            }
        });
    }

    function getCoords(place, callback) {

        console.log("place: " + place);

        // Geocoding
        geocoder.geocode(place, function(err, data) {

            if (err) {
                console.log("Error: " + err);
                callback(err);
            }
            // sys.puts( "geocoder results: " + sys.inspect(data.results[0].geometry.location));
            query.lat = data.results[0].geometry.location.lat;
            query.lon = data.results[0].geometry.location.lng;
            callback(null, data.results[0].geometry.location);
        });


    }

    function test() {



        var date = {
            year: 2012,
            month: 1,
            day: 1,
            hour: 0
        };
        console.log('Test date:', date);
        var testflag = swe.SEFLG_SWIEPH | swe.SEFLG_HELCTR;
        // Julian day
        swe.swe_julday(date.year, date.month, date.day, date.hour, swe.SE_GREG_CAL, function(julday_ut) {
            assert.equal(julday_ut, 2455927.5);
            console.log('Julian UT day for date:', julday_ut);

            // Sun position
            swe.swe_calc_ut(julday_ut, swe.SE_SUN, testflag, function(body) {
                assert(!body.error, body.error);
                console.log('Sun position:', body);
            });

            // Moon position
            swe.swe_calc_ut(julday_ut, swe.SE_MOON, testflag, function(body) {
                assert(!body.error, body.error);
                console.log('Moon position:', body);
            });

            // Eearth position
            swe.swe_calc_ut(julday_ut, swe.SE_EARTH, testflag, function(body) {
                assert(!body.error, body.error);
                console.log('Earth position:', body);
            });

            // MArs position
            swe.swe_calc_ut(julday_ut, swe.SE_MARS, testflag, function(body) {
                assert(!body.error, body.error);
                console.log('Mars position:', body);
            });
        });

    }

    //module.exports.getSolar = solar;



    //TODO

    /* Request timezone with location coordinates */
    /*    timezoner.getTimeZone(
        39.6034810, // Latitude coordinate
        -119.6822510, // Longitude coordinate
        function (err, data) {
            if (err) {
                console.log(err);
            } else {
                console.log(data);
            }
        }
    );*/