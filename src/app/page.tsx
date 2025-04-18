"use client";

import { useState, useEffect } from "react";
import {
  getWeatherByCity,
  getForecastByCity,
} from "./services/weater-services";
import SearchBar from "./componentes/search-weater";
import CityList from "./componentes/city-list";
import Turistics from "./componentes/turistics";

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
  const [forecast, setForecast] = useState<
    { date: string; temp_max: number; temp_min: number; icon?: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Efeito para ocultar a barra de rolagem em telas desktop
  useEffect(() => {
    // Função para verificar o tamanho da tela e aplicar os estilos
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // 768px é o breakpoint 'md' no Tailwind
        // Estilos para desktop - ocultar barra de rolagem
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
        document.documentElement.style.height = "100%";
        document.body.style.height = "100%";
      } else {
        // Estilos para mobile - permitir rolagem
        document.documentElement.style.overflow = "auto";
        document.body.style.overflow = "auto";
        document.documentElement.style.height = "auto";
        document.body.style.height = "auto";
      }
    };

    // Aplicar os estilos iniciais
    handleResize();

    // Adicionar listener para redimensionamento
    window.addEventListener("resize", handleResize);

    // Limpar listener ao desmontar o componente
    return () => {
      window.removeEventListener("resize", handleResize);
      // Restaurar os estilos padrão
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.documentElement.style.height = "";
      document.body.style.height = "";
    };
  }, []);

  // Função para buscar dados do clima e previsão
  const fetchWeatherData = async (city: string) => {
    setLoading(true);
    try {
      // Obter o clima atual
      const data = await getWeatherByCity(city);
      setWeather(data);

      // Obter a previsão para os próximos dias (excluindo o dia atual)
      const forecastData = await getForecastByCity(city);
      if (forecastData) {
        // Obter a data atual para comparação
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Criar um objeto para armazenar a previsão de cada dia
        const dailyForecasts: Record<string, any> = {};

        // Processar cada item da lista de previsões
        forecastData.list.forEach((item: ForecastItem) => {
          const itemDate = new Date(item.dt * 1000);
          itemDate.setHours(0, 0, 0, 0);

          // Pular se for o dia atual
          if (itemDate.getTime() === today.getTime()) {
            return;
          }

          // Criar uma chave para o dia (YYYY-MM-DD)
          const dateKey = itemDate.toISOString().split("T")[0];

          // Se ainda não temos uma previsão para este dia ou se este item é do meio-dia (melhor representação)
          const itemHour = new Date(item.dt * 1000).getHours();
          const isMidDay = itemHour >= 11 && itemHour <= 14;

          if (!dailyForecasts[dateKey] || isMidDay) {
            dailyForecasts[dateKey] = {
              date: dateKey, // Armazena a data no formato ISO YYYY-MM-DD
              temp_max: item.main.temp_max,
              temp_min: item.main.temp_min,
              icon: item.weather[0].icon,
              description: item.weather[0].description,
            };
          } else {
            // Atualizar temperaturas máximas e mínimas
            dailyForecasts[dateKey].temp_max = Math.max(
              dailyForecasts[dateKey].temp_max,
              item.main.temp_max
            );
            dailyForecasts[dateKey].temp_min = Math.min(
              dailyForecasts[dateKey].temp_min,
              item.main.temp_min
            );
          }
        });

        // Converter o objeto em um array e pegar os primeiros 5 dias
        const dailyForecastArray = Object.values(dailyForecasts).sort((a, b) =>
          a.date.localeCompare(b.date)
        ); // Ordenar por data crescente

        setForecast(dailyForecastArray.slice(1, 6));
      }
    } catch (error) {
      console.error("Erro ao buscar dados do clima:", error);
    } finally {
      setLoading(false);
    }
  };

  // Carregar dados de São Paulo ao iniciar a aplicação
  useEffect(() => {
    fetchWeatherData("São Paulo");
  }, []);

  // Função para lidar com a pesquisa de cidades
  const handleSearch = async (city: string) => {
    await fetchWeatherData(city);
  };

  // Função formatDate modificada para mostrar apenas o dia da semana
  const formatDate = (dateString: string) => {
    // dateString está no formato YYYY-MM-DD
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long", // "long" para nome completo do dia, "short" para abreviado
    };

    // Formata e capitaliza a primeira letra
    const dayOfWeek = date.toLocaleDateString("pt-BR", options);
    return dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
  };

  return (
    <div className="min-h-screen  bg-[#013a63] text-white">
      <div className="container  mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-center w-full mb-6 gap-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-poppins">
            One-Climas.com
          </h1>
          <div className="w-full md:w-2/5 lg:w-1/3">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        <div className="flex flex-col mt-6 md:flex-row gap-6 justify-center">
          {/* Coluna da esquerda: clima atual e previsão */}
          <div className="w-full md:w-2/3 max-w-3xl mx-auto">
            {/* Estado de carregamento */}
            {loading && (
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-lg mb-6 text-center">
                <p className="text-xl">Carregando dados do clima...</p>
              </div>
            )}

            {/* Exibir clima atual e previsão para os próximos dias em um único card */}
            {!loading && weather && (
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 shadow-lg">
                {/* Clima atual */}
                <div className="flex justify-between items-center w-full mb-6">
                  <div>
                    <h2 className="text-2xl font-bold">{weather.name}</h2>
                    <p className="capitalize">
                      {weather.weather[0].description}
                    </p>
                    <p className="text-sm mt-2">
                      Máx: {Math.round(weather.main.temp_max)}°C | Mín:{" "}
                      {Math.round(weather.main.temp_min)}°C
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <img
                      src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                      alt={weather.weather[0].description}
                      className="w-8 h-8"
                    />
                    <p className="text-2xl font-bold">
                      {Math.round(weather.main.temp)}°C
                    </p>
                  </div>
                </div>

                {/* Previsão para os próximos dias */}
                {forecast.length > 0 && (
                  <div className="flex justify-center overflow-x-auto pb-2 md:overflow-visible">
                    <div className=" bg-white/10 flex gap-3 justify-center">
                      {forecast.map((item) => (
                        <div
                          key={item.date}
                          className="relative bg-white/10 rounded-br-full p-3 text-center hover:bg-white/20 transition-colors w-[140px] shadow-lg border border-white/10 backdrop-blur-sm after:content-[''] after:absolute after:inset-1 after:rounded-br-full after:bg-gradient-to-tr after:from-cyan-500/10 after:to-purple-500/10 after:-z-10 before:content-[''] before:absolute before:inset-0 before:rounded-br-full before:bg-blue-400/5 before:-z-20"
                        >
                          <p className="font-semibold text-sm">
                            {formatDate(item.date)}
                          </p>
                          {item.icon && (
                            <img
                              src={`https://openweathermap.org/img/wn/${item.icon}@2x.png`}
                              alt="Clima"
                              className="w-14 h-14 mx-auto"
                            />
                          )}
                          <p className="text-xs flex flex-col font-semibold">
                            <span className="text-blue-200  ">
                              Mín: {Math.round(item.temp_min)}°C
                            </span>{" "}
                            <span className="text-red-200  ">
                              {" "}
                              Máx: {Math.round(item.temp_max)}°C
                            </span>
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Coluna da direita: histórico de pesquisas */}
          <div className="w-full md:w-1/3 max-w-md mx-auto">
            <CityList
              cities={
                weather
                  ? [
                      {
                        name: weather.name,
                        temp: weather.main.temp,
                        icon: weather.weather[0].icon,
                        description: weather.weather[0].description,
                      },
                    ]
                  : []
              }
              onCityClick={handleSearch}
            />
          </div>
        </div>
        <Turistics />
      </div>
    </div>
  );
}
