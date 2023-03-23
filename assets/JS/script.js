
let city = $("#searchTerm").val();

const apiKey = "f1837a3312558b6de68f3fa4accd33b9";

let date = new Date();

let cityArray = [];

$("#searchTerm").keypress(function(event) { 
	
	if (event.keyCode === 13) { 
		event.preventDefault();
		$("#searchBtn").click(); 
	} 
});



$("#searchBtn").on("click", function() {

  $('#forecastH5').addClass('show');

  city = $("#searchTerm").val();
  
  $("#searchTerm").val("");  

  getWeather(city);
});

function getWeather(city) {

  const queryUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

  $.ajax({
    url: queryUrl,
    method: "GET"
  })
  .then(function (response){


    getCurrentConditions(response);
    getCurrentForecast(response);
    makeList();

    })
  };

  function makeList() {
    if (cityArray.indexOf(city) === -1) {
      cityArray.push(city);
   
    let listItem = $("<button>").addClass("list-group-item").text(city);
    $(".list").append(listItem);
    
    addEventListener("click", reloadConditions)
  }};

  function reloadConditions(e) {
    getWeather(e.target.textContent);
  }

  function getCurrentConditions (response) {

    // get the temperature and convert to fahrenheit 
    let tempF = (response.main.temp);
    let backgroundImageParam = response.weather[0].main;
    
    $('#currentCity').empty();

    // get and set the content 
    const card = $("<div>").addClass("card-transparent justify-content");
    const cardBody = $("<div>").addClass("card-body embed-responsive text-white bg-image text-center");
    const background = $("<div>").addClass("card-img-top").attr(backgroundImageParam)
    const city = $("<h3>").addClass("card-title").text(response.name);
    const cityDate = $("<h3>").addClass("card-title").text(date.toLocaleDateString('en-US'));
    const temperature = $("<h4>").addClass("card-text current-temp").text("Temperature: " + tempF + " °F");
    const humidity = $("<h4>").addClass("card-text current-humidity").text("Humidity: " + response.main.humidity + "%");
    const wind = $("<h4>").addClass("card-text current-wind").text("Wind Speed: " + response.wind.speed + " MPH");
    const image = $("<img>").attr("src", "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png")


    // add to page
    city.append(cityDate, image)
    cardBody.append(city, temperature, humidity, wind);
    card.append(cardBody);
    $("#currentCity").append(card)
   
    switch (backgroundImageParam) {
      case "Snow":
      document.getElementById("currentCity").style.backgroundImage =
      "url('https://mdbgo.io/ascensus/mdb-advanced/img/snow.gif')";
      break;
      case "Clouds":
      document.getElementById("currentCity").style.backgroundImage =
      "url('https://mdbgo.io/ascensus/mdb-advanced/img/clouds.gif')";
      break;
      case "Fog":
      document.getElementById("currentCity").style.backgroundImage =
      "url('https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif')";
      break;
      case "Rain":
      document.getElementById("currentCity").style.backgroundImage =
      "url('https://mdbgo.io/ascensus/mdb-advanced/img/rain.gif')";
      break;
      case "Clear":
      document.getElementById("currentCity").style.backgroundImage =
      "url('https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif')";
      break;
      case "Thunderstorm":
      document.getElementById("currentCity").style.backgroundImage =
      "url('https://mdbgo.io/ascensus/mdb-advanced/img/thunderstorm.gif')";
      break;
      default:
      document.getElementById("currentCity").style.backgroundImage =
      "url('https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif')";
      break;
      };
  }

  function getCurrentForecast () {
  
    $.ajax({
      url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`,
      method: "GET"
    }).then(function (response){
  
      console.log(response)
      console.log(response.dt.dt_txt)
      $('#forecast').empty();
    
      lat = response.coord.lat;
      lon = response.coord.lon;

      $.ajax({
        url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=imperial&exclude={part}&appid=${apiKey}`,
        method: "GET"
      }).then(function (response){

   
      let results = response.daily;
      console.log(results)
  
  
      for (let i = 1; i < 6; i++) {
  
  
        if(results[i] !== -1){

          var timestamp = results[i].dt * 1000;
      var date = new Date(timestamp);
          
  
          const card = $("<div>").addClass("card col-md-2 ml-4 bg-primary text-white");
          const cardBody = $("<div>").addClass("card-body p-3 forecastBody")
          const cityDate = $("<h4>").addClass("card-title").text(date.toLocaleDateString('en-US'));
          const temperature = $("<p>").addClass("card-text forecastTemp").text("Temperature: " + results[i].temp.day + " °F");
          const humidity = $("<p>").addClass("card-text forecastHumidity").text("Humidity: " + results[i].humidity + "%");
  
          const image = $("<img>").attr("src", "https://openweathermap.org/img/wn/" + results[i].weather[0].icon + ".png")
          const windSpeed = $("<p>").addClass("card-text forecastWind").text("Wind Speed: " + results[i].wind_speed + " MPH");

          cardBody.append(cityDate, image, temperature, humidity, windSpeed);
          card.append(cardBody);
          $("#forecast").append(card);
  
        }
      }
    
    });
  
  })};