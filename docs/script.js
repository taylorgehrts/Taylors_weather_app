
//wait for document to be ready
$(document).ready(function () {
    const apiKey = '89af5f7a4a50fd2c28874bd71ce48ff7';
    // Clear button click event handler
    $('#clearButton').click(function () {
        // Clear search input value
        $('#searchInput').val('');

        // Clear search results
        $('#searchResults').empty();

        // Clear local storage
        localStorage.clear();
    })

    // Function to handle form submission
    function handleFormSubmit(event) {
        event.preventDefault(); // Prevent form submission

        const city = $('#searchInput').val().trim();
        const searchResults = $('#searchResults');
        //check to make sure something was entered if not exit function
        if (city === "") {
            return;
        }

        // Create a new list item for the search
        const listItem = $('<li>').text(city);

        // Append the list item to the search results
        searchResults.append(listItem);

        // Store the search value in local storage
        const searches = JSON.parse(localStorage.getItem('searches')) || [];
        searches.push(city);
        localStorage.setItem('searches', JSON.stringify(searches));

        // Additional code to perform the search and update the search results
        performSearch(city);

        // Clear the search input field
        $('#searchInput').val('');


    }

    // Function to perform the search and update the weather data
    function performSearch(city) {
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
                                updateWeatherData(data);
                            })
                            .catch(error => console.log(error));
                    } else {
                        console.log('Geocoding data not found');
                    }
                })
                .catch(error => console.log(error));
        } else {
            console.log('City name is empty');
        }
    }

    // Function to update the weather data on the page
    function updateWeatherData(data) {
        console.log(data);
        // Populate current weather card with data
        $('#currentWeather').removeClass('d-none');
        $('#currentCity').text(data.city.name);
        $('#currentDate').text(new Date().toLocaleDateString());
        $('#currentIcon').attr('src', `https://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`);
        $('#currentConditions').text(data.list[0].weather[0].description);
        $('#currentTemp').text(`Temperature: ${kelvinToFahrenheit(data.list[0].main.temp)}°F`);
        $('#currentWind').text(`Wind Speed: ${data.list[0].wind.speed} m/s`);
        $('#currentHumidity').text(`Humidity: ${data.list[0].main.humidity}%`);
        $('#day-1, #day-2, #day-3, #day-4, #day-5').removeClass('d-none');

        // Populate day-1 to day-5 cards with data
        let dayCount = 0;
        for (let i = 0; i <= 5; i++) {
            const forecastIndex = i * 7 +4;
            const forecast = data.list[forecastIndex];
            console.log(forecast);
            const cardId = `day-${i}`;
            const cardDate = new Date(forecast.dt * 1000).toLocaleDateString();
            const cardIcon = forecast.weather[0].icon;
            const cardConditions = forecast.weather[0].description;
            const cardTemp = kelvinToFahrenheit(forecast.main.temp);
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
                cardIconElem.src = `https://openweathermap.org/img/w/${cardIcon}.png`;
                cardIconElem.alt = 'Weather Icon';

                const cardConditionsElem = document.createElement('p');
                cardConditionsElem.classList.add('card-text');
                cardConditionsElem.textContent = cardConditions;

                const cardTempElem = document.createElement('p');
                cardTempElem.classList.add('card-text');
                cardTempElem.textContent = `Temperature: ${cardTemp}°F`;

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

                // Add click event to each forecast card
                $(cardContainer).on('click', function () {
                    showForecastDetails(forecast);
                });
            }

            dayCount++;
        }
    }

    // Function to show forecast details for a specific day
    function showForecastDetails(forecast) {
        // Extract and display the necessary details from the forecast object
        const forecastDate = new Date(forecast.dt * 1000).toLocaleDateString();
        const forecastIcon = forecast.weather[0].icon;
        const forecastConditions = forecast.weather[0].description;
        const forecastTemp = kelvinToFahrenheit(forecast.main.temp);
        const forecastWind = forecast.wind.speed;
        const forecastHumidity = forecast.main.humidity;

        // Update the forecast details in the HTML elements
        $('#forecastDate').text(forecastDate);
        $('#forecastIcon').attr('src', `https://openweathermap.org/img/w/${forecastIcon}.png`);
        $('#forecastConditions').text(forecastConditions);
        $('#forecastTemp').text(`Temperature: ${forecastTemp}°F`);
        $('#forecastWind').text(`Wind Speed: ${forecastWind} m/s`);
        $('#forecastHumidity').text(`Humidity: ${forecastHumidity}%`);

        // Show the forecast details modal
        $('#forecastModal').modal('show');
    }

    // Function to convert temperature from Kelvin to Fahrenheit
    function kelvinToFahrenheit(kelvin) {
        return ((kelvin - 273.15) * 9 / 5 + 32).toFixed(2);
    }

    // Event listener for form submission
    $('#searchForm').submit(handleFormSubmit);

    // Event listener for search result click
    $('#searchResults').on('click', 'li', function () {
        const city = $(this).text().trim();
        performSearch(city);
    });

    // Retrieve previous searches from local storage and update the search results
    const searches = JSON.parse(localStorage.getItem('searches')) || [];
    const searchResults = $('#searchResults');
    for (const search of searches) {
        const listItem = $('<li>').text(search);
        searchResults.append(listItem);
    }
});




