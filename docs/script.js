// var apiKey = "89af5f7a4a50fd2c28874bd71ce48ff7";

// Wait for the document to be ready
const apiKey = '89af5f7a4a50fd2c28874bd71ce48ff7';

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault(); // Prevent form submission

    const city = document.getElementById('searchInput').value.trim();
    function kelvinToCelsius(kelvin) {
        return Math.round(kelvin - 273.15);
    }


    if (city !== '') {
        // Retrieve weather data and populate current weather card
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                // Populate current weather card with data
                
                $('#currentDate').text(new Date().toLocaleDateString());
                $('#currentConditions').text(data.weather[0].description);
                $('#currentTemp').text(`Temperature: ${kelvinToCelsius(data.main.temp)}°C`);
                $('#currentWind').text(`Wind Speed: ${data.wind.speed} m/s`);
                $('#currentHumidity').text(`Humidity: ${data.main.humidity}%`);
            })
            .catch(error => {
                console.error(error);
            });


    }
}

// Add event listener to the form submission
const searchForm = document.getElementById('searchForm');
searchForm.addEventListener('submit', handleFormSubmit);



    // kelvin to fahrenheit formula (291.15K − 273.15) × 9/5 + 32 = 64.4°F
    //kelvin to celsius formula (291.15K − 273.15) 

