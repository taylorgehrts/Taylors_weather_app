// var apiKey = "89af5f7a4a50fd2c28874bd71ce48ff7";

// Wait for the document to be ready
const apiKey = '89af5f7a4a50fd2c28874bd71ce48ff7';

// Function to handle form submission
function handleFormSubmit(event) {
    event.preventDefault(); // Prevent form submission

    const city = document.getElementById('searchInput').value.trim();
    function kelvinToCelsius(kelvin) {
        return Math.round(kelvin - 273.15) * 9 / 5 + 32;
    }

    if (city !== '') {
        // Retrieve coordinates using geocoding API
        fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`)
            .then(response => response.json())
            .then(geocodingData => {
                if (geocodingData.length > 0) {
                    const { lat, lon } = geocodingData[0];

                    // Retrieve weather data using coordinates
                    fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`)
                        .then(response => response.json())
                        .then(data => {
                            console.log(data);

                            // Populate current weather card with data
                            $('#currentWeather').removeClass('d-none');
                            $('#currentDate').text(new Date().toLocaleDateString());
                            $('#currentIcon').attr('src', `https://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`);
                            $('#currentConditions').text(data.list[0].weather[0].description);
                            $('#currentTemp').text(`Temperature: ${kelvinToCelsius(data.list[0].main.temp)}°C`);
                            $('#currentWind').text(`Wind Speed: ${data.list[0].wind.speed} m/s`);
                            $('#currentHumidity').text(`Humidity: ${data.list[0].main.humidity}%`);

                            // Populate day-1 to day-5 cards with data
                            let dayCount = 1;
                            for (let i = 1; i <= 4; i++) {
                                const forecastIndex = i * 8;
                                const forecast = data.list[forecastIndex];
                                console.log(forecast);
                                const cardId = `day-${i}`;
                                const cardDate = new Date(forecast.dt * 1000).toLocaleDateString();
                                const cardIcon = forecast.weather[0].icon;
                                const cardConditions = forecast.weather[0].description;
                                const cardTemp = kelvinToCelsius(forecast.main.temp);
                                const cardWind = forecast.wind.speed;
                                const cardHumidity = forecast.main.humidity;

                                const cardContainer = document.getElementById(cardId);
                                if (cardContainer) {
                                    const cardBody = cardContainer.querySelector('.card-body');
                                    cardBody.innerHTML = ''; // Clear previous data

                                    const cardTitle = document.createElement('h5');
                                    cardTitle.classList.add('card-title');
                                    cardTitle.textContent = `Day ${dayCount} Forecast`;

                                    const cardDateElem = document.createElement('p');
                                    cardDateElem.classList.add('card-text');
                                    cardDateElem.textContent = cardDate;

                                    const cardIconElem = document.createElement('img');
                                    cardIconElem.classList.add('card-img-top');
                                    cardIconElem.src = `https://openweathermap.org/img/w/${cardIcon}.png`;
                                    cardIconElem.alt = 'Weather Icon';

                                    const cardConditionsElem = document.createElement('p');
                                    cardConditionsElem.classList.add('card-text');
                                    cardConditionsElem.textContent = cardConditions;

                                    const cardTempElem = document.createElement('p');
                                    cardTempElem.classList.add('card-text');
                                    cardTempElem.textContent = `Temperature: ${cardTemp}°C`;

                                    const cardWindElem = document.createElement('p');
                                    cardWindElem.classList.add('card-text');
                                    cardWindElem.textContent = `Wind Speed: ${cardWind} m/s`;

                                    const cardHumidityElem = document.createElement('p');
                                    cardHumidityElem.classList.add('card-text');
                                    cardHumidityElem.textContent = `Humidity: ${cardHumidity}%`;

                                    cardBody.appendChild(cardTitle);
                                    cardBody.appendChild(cardDateElem);
                                    cardBody.appendChild(cardIconElem);
                                    cardBody.appendChild(cardConditionsElem);
                                    cardBody.appendChild(cardTempElem);
                                    cardBody.appendChild(cardWindElem);
                                    cardBody.appendChild(cardHumidityElem);
                                }
                            }
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
            });
    }
}

// Add event listener to the form submission
const searchForm = document.getElementById('searchForm');
searchForm.addEventListener('submit', handleFormSubmit);



    // kelvin to fahrenheit formula (291.15K − 273.15) × 9/5 + 32 = 64.4°F
    //kelvin to celsius formula (291.15K − 273.15) 

