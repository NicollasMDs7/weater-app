"use client";

import { useState } from "react";
import { getWeatherByCity, getForecastByCity } from "./services/weater-services";
import SearchBar from "./componentes/search-weater";
import CityList from "./componentes/city-list";

type WeatherData = {
  name: string;
  main: { temp: number; temp_max: number; temp_min: number };
  weather: { description: string; icon: string }[];
};

// Ajuste no tipo da previsão para refletir a estrutura correta da API
type ForecastItem = {
  dt: number; // Data e hora da previsão
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  weather: { description: string; icon: string }[];
};

type ForecastResponse = {
  list: ForecastItem[]; // Lista de previsões
};

export default function Home() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<{ date: string; temp_max: number; temp_min: number }[]>([]);

  const handleSearch = async (city: string) => {
    // Obter o clima atual
    const data = await getWeatherByCity(city);
    setWeather(data);

    // Obter a previsão para os próximos 5 dias (excluindo o dia atual)
    const forecastData = await getForecastByCity(city);
    if (forecastData) {
      // Filtrar a previsão para excluir o primeiro dia (dia atual)
      const filteredForecast = forecastData.list.filter((item: ForecastItem) => {
        const date = new Date(item.dt * 1000);
        return date.getDate() !== new Date().getDate(); // Exclui o dia atual
      });

      // Agrupar as previsões por dia e pegar a temperatura máxima e mínima
      const dailyForecast = filteredForecast.reduce((acc: any[], item: ForecastItem) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const existingDay = acc.find((day: any) => day.date === date);

        if (existingDay) {
          existingDay.temp_max = Math.max(existingDay.temp_max, item.main.temp_max);
          existingDay.temp_min = Math.min(existingDay.temp_min, item.main.temp_min);
        } else {
          acc.push({
            date,
            temp_max: item.main.temp_max,
            temp_min: item.main.temp_min,
          });
        }

        return acc;
      }, []);

      setForecast(dailyForecast);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#1e1e30] to-[#4b306a] text-white p-4">
      <h1 className="text-2xl font-bold mb-4">Previsão do Tempo</h1>
      <SearchBar onSearch={handleSearch} />

      {/* Exibir clima atual */}
      {weather && (
        <div className="mt-6 bg-[#2c2c54] p-6 rounded-xl shadow-lg text-center w-80">
          <h2 className="text-xl font-semibold">{weather.name}</h2>
          <p className="text-lg capitalize">{weather.weather[0].description}</p>
          <p className="text-5xl font-bold">{Math.round(weather.main.temp)}°C</p>
          <p className="text-sm mt-2">
            Máx: {Math.round(weather.main.temp_max)}°C | Mín: {Math.round(weather.main.temp_min)}°C
          </p>
        </div>
      )}

      {/* Exibir previsão para os próximos 5 dias */}
      <div className="mt-6">
        {forecast.length > 0 && (
          <div className="bg-[#2c2c54] p-6 rounded-xl shadow-lg text-center w-80">
            <h2 className="text-xl font-semibold">Próximos 5 dias</h2>
            <div className="grid grid-cols-1 gap-4 mt-4">
              {forecast.map((item) => {
                return (
                  <div key={item.date} className="text-sm">
                    <p>{item.date}</p>
                    <p className="text-lg capitalize">Mín: {Math.round(item.temp_min)}°C | Máx: {Math.round(item.temp_max)}°C</p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Histórico de pesquisas */}
      <CityList
        cities={weather ? [{ 
          name: weather.name, 
          temp: weather.main.temp, 
          icon: weather.weather[0].icon, 
          description: weather.weather[0].description 
        }] : []}
      />
    </div>
  );
}