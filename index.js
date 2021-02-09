let forecast = new Array();
let arrayOfWeekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
let currentWeather = {};


async function getWeather(city) {
    forecast = [];
    currentWeather = {};
    document.querySelector('.weather-panel-container').style.display = "none"; 
    document.querySelector('.weather-report').innerHTML = '';

    url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=612063be1ae68a9db6d031baba132bda`;
    res = await fetch(url);
    data = await res.json(); 

    getForecast(data.list);
    
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=612063be1ae68a9db6d031baba132bda`;
    res = await fetch(url);
    data = await res.json();
    
    currentWeather = {
        cityName: data.name,
        cityCountry: data.sys.country,
        temp: data.main.temp,
        icon: data.weather[0].icon,
        weather: data.weather[0].description,
        wind: data.wind.speed,
        humidity: data.main.humidity
    }

    document.querySelector('.city-name').innerHTML = currentWeather.cityName + ', ' + currentWeather.cityCountry;
    document.querySelector('.weather-icon').src = 'http://openweathermap.org/img/wn/' + currentWeather.icon + '@2x.png'
    // document.querySelector('.temperature').innerHTML = toFahrenheit(currentWeather.temp);
    document.querySelector('.weather-panel-container').style.display = 'grid';
    document.querySelector('.date').innerHTML = arrayOfWeekdays[new Date().getDay()] + ' ' + new Date().getHours() + ':' + new Date().getMinutes();
    document.querySelector('.weather-description').innerHTML = currentWeather.weather;
    document.querySelector('.wind').innerHTML = 'Wind: ' + currentWeather.wind + 'm/s';
    document.querySelector('.humidity').innerHTML = 'Humidity: ' + currentWeather.humidity + '%';

    forecast.forEach(elem => {
        forecastElem = document.createElement('div')
        forecastElem.className = 'forecast-day';
        // forecastElem.innerHTML = '<div style="color: #ffffff80">' + elem.weekday.slice(0, 3) + '</div><div>' + toFahrenheit(elem.day_t) + '</div><div style="color: #ffffff80; font-size: 0.75em">' + toFahrenheit(elem.night_t) + '</div>';
        document.querySelector('.weather-report').appendChild(forecastElem);
    });

    temperatureChange();
}

function getForecast(forecast_list) {
    let currentDate = new Date();
    let date_temp;
    currentDate.setDate(currentDate.getDate() + 1);
    if ((currentDate.getMonth() + 1) < 10) {
        date_temp = currentDate.getFullYear() + '-0' + Number(currentDate.getMonth() + 1) + '-' + currentDate.getDate();
    }
    else {
        date_temp = currentDate.getFullYear() + '-' + Number(currentDate.getMonth() + 1) + '-' + currentDate.getDate();
    }

    let i = 0;

    while (forecast.length < 5) {
        if (forecast_list[i].dt_txt.match(date_temp+' 00:00:00')) {
            forecast.push({
                date: date_temp,
                weekday: arrayOfWeekdays[currentDate.getDay()],
                night_t: forecast_list[i].main.temp,
                day_t: forecast_list[i + 4].main.temp,
            })

            currentDate.setDate(currentDate.getDate() + 1);
            if ((currentDate.getMonth() + 1) < 10) {
                date_temp = currentDate.getFullYear() + '-0' + Number(currentDate.getMonth() + 1) + '-' + currentDate.getDate();
            }
            else {
                date_temp = currentDate.getFullYear() + '-' + Number(currentDate.getMonth() + 1) + '-' + currentDate.getDate();
            }        
        }    
        i++;
    }
}

const toFahrenheit = (temp) => {
    return Math.round((temp - 273.15) * 9/5 + 32); 
}

const toCelsius = (temp) => {
    return Math.round(temp - 273.15);
}

const temperatureChange = () => {
    i = 0;

    if(document.querySelector('#F').checked) {
        document.querySelector('.temperature').innerHTML = toFahrenheit(currentWeather.temp);
        
        document.querySelectorAll('.weather-report .forecast-day').forEach(elem => {
            elem.innerHTML = '<div style="color: #ffffff80">' + forecast[i].weekday.slice(0, 3) + '</div><div>' + toFahrenheit(forecast[i].day_t) + '</div><div style="color: #ffffff80; font-size: 0.75em">' + toFahrenheit(forecast[i].night_t) + '</div>';
            i++;
        });

        document.querySelector('label[for="F"]').style.color = '#ffffff';
        document.querySelector('label[for="C"]').style.color = '#ffffff80'
    }
    else {
        document.querySelector('.temperature').innerHTML = toCelsius(currentWeather.temp);

        document.querySelectorAll('.weather-report .forecast-day').forEach(elem => {
            elem.innerHTML = '<div style="color: #ffffff80">' + forecast[i].weekday.slice(0, 3) + '</div><div>' + toCelsius(forecast[i].day_t) + '</div><div style="color: #ffffff80; font-size: 0.75em">' + toCelsius(forecast[i].night_t) + '</div>';
            i++;
        });

        document.querySelector('label[for="F"]').style.color = '#ffffff80';
        document.querySelector('label[for="C"]').style.color = '#ffffff'
    }
}