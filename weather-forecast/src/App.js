import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [city, setCity] = useState('Chennai');
  const [weatherData, setWeatherData] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWeatherData = async () => {
    setLoading(true);
    setError('');
    try {
      const API_KEY = '4c70ce85b49349759f0190114242712'; 
      const currentUrl = `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`;
      const forecastUrl = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=10`;

      const currentResponse = await axios.get(currentUrl);
      setWeatherData(currentResponse.data);

      const forecastResponse = await axios.get(forecastUrl);
      console.log('Forecast Response:', forecastResponse.data);
      setForecastData(forecastResponse.data.forecast.forecastday);
    } catch (err) {
      setError('Failed to fetch weather data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeatherData();
  }, [city]);

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const getWeatherIcon = (condition) => {
    const conditionLower = condition.toLowerCase();
    if (conditionLower.includes('clear')) return 'wi-day-sunny';
    if (conditionLower.includes('rain')) return 'wi-rain';
    if (conditionLower.includes('cloudy')) return 'wi-cloudy';
    if (conditionLower.includes('snow')) return 'wi-snow';
    if (conditionLower.includes('thunderstorm')) return 'wi-thunderstorm';
    if (conditionLower.includes('fog')) return 'wi-fog';
    if (conditionLower.includes('wind')) return 'wi-windy';
    if (conditionLower.includes('sunny')) return 'wi-day-sunny';
    return 'wi-na';
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div
        className="relative w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: `url('https://static.vecteezy.com/system/resources/thumbnails/051/263/379/small/rainy-day-serenity-water-droplets-and-floating-autumn-leaves-photo.jpg')`,
        }}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="container mx-auto flex justify-center items-center h-full z-10">
          <div className="w-full max-w-2xl bg-white bg-opacity-50 p-8 rounded-xl shadow-xl backdrop-blur-md">
            <h1 className="text-4xl font-bold text-center text-white font-['Rock Salt']">
              Weather Forecast
            </h1>

            <div className="my-4">
              <input
                type="text"
                className="w-full p-3 rounded-md border-none text-lg"
                value={city}
                onChange={handleCityChange}
                placeholder="Enter city name"
              />
            </div>

            <button
              onClick={fetchWeatherData}
              className="w-full p-3 mt-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Get Weather
            </button>

            {loading && <p className="text-center text-white mt-4">Loading...</p>}
            {error && <p className="text-center text-red-500 mt-4">{error}</p>}

            {weatherData && (
              <div className="mt-6">
                <h2 className="text-2xl font-semibold text-white">
                  {weatherData.location.name}, {weatherData.location.country}
                </h2>
                <p className="text-xl text-white mt-2">
                  Current Temperature: {weatherData.current.temp_c}°C
                </p>
                <p className="text-white mt-2">{weatherData.current.condition.text}</p>
                <p className="text-white mt-2">Humidity: {weatherData.current.humidity}%</p>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-white">10-Day Forecast</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    {forecastData.length > 0 ? (
                      forecastData.map((day) => (
                        <div
                          key={day.date}
                          className="bg-slate-700 text-white p-4 rounded-md shadow-lg backdrop-blur-md"
                        >
                          <h4 className="font-semibold text-lg text-center">{day.date}</h4>
                          <div className="flex justify-center mt-4">
                            <i className={`wi ${getWeatherIcon(day.day.condition.text)} text-4xl`}></i>
                          </div>
                          <p className="text-center mt-2">{day.day.avgtemp_c}°C</p>
                          <p className="text-center mt-2">{day.day.condition.text}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center">No forecast data available.</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
