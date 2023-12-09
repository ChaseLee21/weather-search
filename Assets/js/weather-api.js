const apikey = "fa4a15873725d3e5be6c755a8f395ec9";

const apiURL = "https://api.openweathermap.org/data/2.5/forecast/"

const city = "";

const query = apiURL + "q=" + city + "&appid=" + apikey;

const cityInput = document.getElementById("city");

const searchBtn = document.getElementById("search");

searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    getWeather();
});

function getWeather() {
    fetch(query)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
        });
}

