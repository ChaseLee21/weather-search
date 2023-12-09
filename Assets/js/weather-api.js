//api variables
const apikey = "fa4a15873725d3e5be6c755a8f395ec9";
const apiURL = "https://api.openweathermap.org/data/2.5/forecast"

//html variables
const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("search");
const forecastDisplay = document.getElementById("forecastDisplay");

//query variables
let city = "";
let query = apiURL + "?q=" + city + "&appid=" + apikey;

//api data variables
let days = [[], [], [], [], []];

searchBtn.addEventListener("click", async function (event) {
    event.preventDefault();
    query = setQuery();
    await getWeather();
    displayForecast();
    document.getElementById("cityName").innerHTML = cityInput.value.trim();
    saveSearch(cityInput.value.trim());
    displayRecentSearches();
});

function setQuery() {
    city = cityInput.value.trim();
    return apiURL + "?q=" + city + "&appid=" + apikey + "&units=imperial";
}

async function getWeather() {
    console.log(query);
    await fetch(query)
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

function displayRecentSearches() {
    let recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
    let recentSearchesContainer = document.getElementById("recentSearches");
    recentSearchesContainer.innerHTML = "";
    if (recentSearches) {
        recentSearches.forEach(search => {
            let searchEl = document.createElement("button");
            searchEl.setAttribute("class", "btn btn-secondary m-1");
            searchEl.textContent = search;
            searchEl.addEventListener("click", async function (event) {
                event.preventDefault();
                cityInput.value = search;
                query = setQuery();
                await getWeather();
                displayForecast();
                document.getElementById("cityName").innerHTML = cityInput.value.trim();
            });
            recentSearchesContainer.appendChild(searchEl);
        });
    }
}

function saveSearch(search) {
    let recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
    if (!recentSearches) {
        recentSearches = [];
    } 
    if (!recentSearches.includes(search)) {
        recentSearches.push(search);
    }
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
}

function displayForecast() {
    console.log(days);
    // clear the forecast display
    forecastDisplay.innerHTML = "";
    days.forEach(day => {
        // get the information we need from the day
        let maxTemp = Math.floor(getMax(day)); 
        let minTemp = Math.floor(getMin(day));
        let date = createDateObject(day[0].dt_txt).day;
        let icon = day[0].weather[0].icon;
        let iconURL = "http://openweathermap.org/img/w/" + icon + ".png";
        let wind = getWind(day);
        let humidity = getHumidity(day);
        console.log(minTemp, maxTemp, date, iconURL, wind, humidity);

        //creating the elements to display the data
        let dayContainer = document.createElement("div");
        dayContainer.setAttribute("class", "card m-2 p-2");
        let dayHeader = document.createElement("h3");
        dayHeader.textContent = date;
        let dayIcon = document.createElement("img");
        dayIcon.setAttribute("src", iconURL);
        let dayTemp = document.createElement("p");
        dayTemp.textContent = "High: " + maxTemp + " Low: " + minTemp;
        let dayWind = document.createElement("p");
        dayWind.textContent = "Wind: " + wind;
        let dayHumidity = document.createElement("p");
        dayHumidity.textContent = "Humidity: " + humidity;

        //appending the elements to the page
        dayContainer.appendChild(dayHeader);
        dayContainer.appendChild(dayIcon);
        dayContainer.appendChild(dayTemp);
        dayContainer.appendChild(dayWind);
        dayContainer.appendChild(dayHumidity);
        forecastDisplay.appendChild(dayContainer);

    });

}

function getWind(day){
    return day.reduce((max, p) => p.wind.speed > max ? p.wind.speed : max, day[0].wind.speed);
}

function getHumidity(day){
    return day.reduce((max, p) => p.main.humidity > max ? p.main.humidity : max, day[0].main.humidity);
}

function getMax(day){
    return day.reduce((max, p) => p.main.temp > max ? p.main.temp : max, day[0].main.temp);
}

function getMin(day){
    return day.reduce((min, p) => p.main.temp < min ? p.main.temp : min, day[0].main.temp);
}

displayRecentSearches();