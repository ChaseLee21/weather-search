const apikey = "fa4a15873725d3e5be6c755a8f395ec9";
const apiURL = "https://api.openweathermap.org/data/2.5/forecast"
const cityInput = document.getElementById("city");
const searchBtn = document.getElementById("search");
const forecastDisplay = document.getElementById("forecastDisplay");
let city = "";
let query = "";
let days = [[], [], [], [], []];

searchBtn.addEventListener("click", async function (event) {
    event.preventDefault();
    days = await getWeather(setQuery());
    displayForecast();
    document.getElementById("cityName").innerHTML = cityInput.value.trim();
    saveSearch(cityInput.value.trim());
});

// input: user input from the city input field
// returns: api query
function setQuery() {
    city = cityInput.value.trim();
    return apiURL + "?q=" + city + "&appid=" + apikey + "&units=imperial";
}

// api call to openweathermap.org
// input: api query
// returns: days[day][segment]
// 5 days, 8 segments per day
async function getWeather(query) {
    await fetch(query)
        .then(function (response) {
            return response.json();
        })
        .then(function (segments) {
            let dayCount = 0;
            days = [[], [], [], [], []];
            segments.list.forEach((segment) => {
                days[dayCount].push(segment);
                if (createDateObject(segment.dt_txt).time == "21:00:00") dayCount++;
            });
            return days;
        });
    }

// date/time string => {day: day, time: time}
function createDateObject(dateString) {
    let date = dateString.split(" ");
    let day = date[0];
    let time = date[1];
    return {
        day : day,
        time : time
    };
}

// displays the recent searches from local storage as buttons
function displayRecentSearches() {
    // gets the recent searches from local storage
    let recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
    let recentSearchesContainer = document.getElementById("recentSearches");
    recentSearchesContainer.innerHTML = "";
    if (recentSearches) {
        // generates button for each recent search
        recentSearches.forEach(search => {
            let searchEl = document.createElement("button");
            searchEl.setAttribute("class", "btn btn-secondary m-1");
            searchEl.textContent = search;
            // adds event listener to each button
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

//saves the users search to local storage
function saveSearch(search) {
    let recentSearches = JSON.parse(localStorage.getItem("recentSearches"));
    if (!recentSearches) {
        recentSearches = [];
    } 
    if (!recentSearches.includes(search)) {
        recentSearches.push(search);
    }
    localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
    displayRecentSearches();
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