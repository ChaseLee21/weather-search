const apikey = "fa4a15873725d3e5be6c755a8f395ec9";

const apiURL = "https://api.openweathermap.org/data/2.5/forecast/"

const city = "";

const cityInput = document.getElementById("city");

const searchBtn = document.getElementById("search");

searchBtn.addEventListener("click", function (event) {
    event.preventDefault();
    console.log(cityInput.value);
    console.log("clicked");
});