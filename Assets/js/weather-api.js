//api variables
const apikey = "fa4a15873725d3e5be6c755a8f395ec9";
const apiURL = "https://api.openweathermap.org/data/2.5/forecast"

//html variables
const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("search");

//query variables
let city = "";
let query = apiURL + "?q=" + city + "&appid=" + apikey;

//api data variables
let days = [[], [], [], [], []];

searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    query = setQuery();
    getWeather();
});

function setQuery() {
    city = cityInput.value.trim();
    return apiURL + "?q=" + city + "&appid=" + apikey + "&units=imperial";
}

function getWeather() {
    console.log(query);
    fetch(query)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            // keeps track of what day we are on
            let dayCount = 0;

            // loop through all the data returned from the api
            for (let i = 0; i < data.list.length; i++) {
                // stores the current segment of the day we are on (3 hour segment)
                let segmentOfDay = data.list[i];
                // stores an object which holds the date and the time of the date we are on
                let date = createDateObject(segmentOfDay.dt_txt);
                // pushes the segment of the day into the array based on what day it is
                days[dayCount].push(segmentOfDay);
                // checks if its the last segment of the day
                if (date.time == "21:00:00") {
                    // if it is the last segment of the day, increment the day count
                    dayCount++;
                }
            }
            console.log(days);
        });
}

// seperates a date and time string into a variable that holds the day and the time
function createDateObject(dateString) {
    // splits the date and time string into an array
    let date = dateString.split(" ");
    // stores the day and time into variables
    let day = date[0];
    let time = date[1];
    // returns an object with the day and time
    return {
        day : day,
        time : time
    };
}