//API key
let key = "&appid=bf0a61546d9083e91b1a07813951c139";
let infoCard = $("#current-info");

//Get weather info based on last weather user was looking at
window.onload = function(){
    let lastCity = localStorage.getItem("lastCity");
    getCoordinates(lastCity);
};

//When search button is clicked on
$("#search-btn").on("click", function(){
    let city = $("#search-bar").val();
    getCoordinates(city);
});

//function calls first api to get coordiantes of city
function getCoordinates(city){
    
    let URL = "https://api.openweathermap.org/data/2.5/weather?q="; //here
    let queryURL = URL + city + key;
    
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function(response) {
        localStorage.setItem("city",response.name);
        localStorage.setItem(response.name+"lon",response.coord.lon);
        localStorage.setItem(response.name+"lat",response.coord.lat);
        localStorage.setItem(response.name+"humidityLevel", response.main.humidity);
        displayStats(response.name);
        fiveDay(response.name);
        displayHistory();
        localStorage.setItem("lastCity", response.name);
    });
};

//function uses second api call to append current wetaher info to main card in html
function displayStats(cityName){
    
    let lonInfo = localStorage.getItem(cityName+"lon");
    let latInfo = localStorage.getItem(cityName+"lat");
    
    let URL = "https://api.openweathermap.org/data/2.5/onecall";
    let lat = "?lat=" + latInfo;
    let lon = "&lon=" + lonInfo;
    let queryURL = URL + lat + lon +"&units=imperial" + key;
    
    
    $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response) {
        
        clearCard();
        let today = moment().format('MMMM Do');
        let humidityLevel = localStorage.getItem(cityName+"humidityLevel");
            
        $("#date-current").append(cityName + ", " + today);
        let tempDiv = response.current.temp;
        $("#temp-current").append(tempDiv + " \u00B0F");
        let humidDiv = response.current.humidity;
        $("#humidity-current").append(humidDiv + "%");
        let windDiv = response.current.wind_speed;
        $("#windspeed-current").append(windDiv + " MPH");
        let uvDiv = $("<div>");
        uvDiv.attr("id", "uvi");
        uvDiv.text(response.current.uvi);
            if (humidityLevel < 34){
                uvDiv.attr("class", "low");
            }
            else if (humidityLevel > 66){
                uvDiv.attr("class", "high");
            }
            else{
                uvDiv.attr("class", "medium");
            }
        $("#uv-current").append(uvDiv);

    });
};

//funciton displays user searches in history card
function displayHistory(){
    let cityName = localStorage.getItem("city");
    let cityHistory = $("<li>");
    cityHistory.attr("class", "list-group-item");
    cityHistory.append(cityName);
    cityHistory.on("click",function(){historyClick(cityName);});   
    $(".list-group-flush").prepend(cityHistory);
};

//function creates a five day forecast
function fiveDay(cityName){
    let lonInfo = localStorage.getItem(cityName+"lon");
    let latInfo = localStorage.getItem(cityName+"lat");
    
    let URL = "https://api.openweathermap.org/data/2.5/onecall";
    let lat = "?lat=" + latInfo;
    let lon = "&lon=" + lonInfo;
    let queryURL = URL + lat + lon +"&units=imperial" + key;
    
    let nextFive = $(".five-day");
    nextFive.empty();
    
    
    $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
            for (let i=0; i < 5; i++){
                
                let iconNumber = response.daily[i+1].weather[0].icon;
                let temp = response.daily[i+1].temp.day;
                let humidity = response.daily[i+1].humidity;
                let day = moment().add(i, 'days').format('MMMM Do');
                icon = "http://openweathermap.org/img/wn/" + iconNumber + "@2x.png";
                
                
            
                let cardOuter = $("<div>");
                cardOuter.attr("class", "col-lg-2.4");
                let cardMiddle = $("<div>");
                cardMiddle.attr("class", "card card-color");
                cardMiddle.attr("style", "width: 9.5rem;");
                let cardInner = $("<div>");
                cardInner.attr("class", "card-body");
                cardInner.append(day + "<br/>")
                cardInner.append("<img src="+icon+">");
                cardInner.append("<br/>" + temp +" \u00B0F" + "<br/>" + humidity + "%");
                cardMiddle.append(cardInner);
                cardOuter.append(cardMiddle);

                nextFive.append(cardOuter);
        }
    });
};

//function allows user to click any of the previous search and display ressults
function historyClick(cityName){
    clearCard();
    displayStats(cityName);
    fiveDay(cityName);
    localStorage.setItem("lastCity", cityName);
};

//function clears information to allow new information
function clearCard(){
    $("#date-current").empty();
    $("#temp-current").empty();
    $("#humidity-current").empty();
    $("#windspeed-current").empty();
    $("#uv-current").empty();
}