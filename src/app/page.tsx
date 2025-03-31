"use client";

import { useState, useEffect } from "react";
import {
  getWeatherByCity,
  getForecastByCity,
} from "./services/weater-services";
import SearchBar from "./componentes/search-weater";
import CityList from "./componentes/city-list";
import { BotMessageSquare, Sun, SunMoon} from "lucide-react";

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

  // Função formatDate corrigida para garantir a exibição correta dos dias
  const formatDate = (dateString: string) => {
    // dateString está no formato YYYY-MM-DD
    const date = new Date(dateString);

    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      day: "numeric",
      month: "short",
    };

    return date.toLocaleDateString("pt-BR", options);
  };

  return (
    <div className="min-h-screen  bg-[#013a63] text-white">
      <div className="container  mx-auto px-4 py-8 max-w-6xl">
        <div className="flex flex-col mt-6 md:flex-row gap-6 justify-center">
          {/* Coluna da esquerda: clima atual e previsão */}
          <div className="w-full md:w-2/3 max-w-3xl mx-auto">
            {/* Estado de carregamento */}
            {loading && (
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-lg mb-6 text-center">
                <p className="text-xl">Carregando dados do clima...</p>
              </div>
            )}

            {/* Exibir clima atual */}
            {!loading && weather && (
              <div className="bg-white/20 backdrop-blur-lg flex flex-col justify-center items-center rounded-xl p-4 shadow-lg mb-2  ">
                <div className="flex w-full items-center justify-between mb-2">
                  
                  <div className="w-10 flex justify-start border-r-2 border-white/20 pl-2">
                    <Sun   className="cursor-pointer transform transition-transform duration-300 hover:scale-125" />
                  </div>
                  {/* Espaço vazio para equilibrar */}
                  <h1 className="text-4xl font-bold font-poppins">
                    Previsão do Tempo
                  </h1>
                  <div className="w-10 flex justify-end border-l-2 border-white/20 pl-2">
                    <BotMessageSquare  className="cursor-pointer transform transition-transform duration-300 hover:scale-125" />
                  </div>
                </div>

                <div className="max-w-md w-full mx-auto">
                  <SearchBar onSearch={handleSearch} />
                </div>
                <div className="flex bg-white/10 backdrop-blur-lg rounded-xl hover:bg-white/20 transition-colors w-[450px] items-center justify-around">
                  <div>
                    <h2 className="text-3xl font-bold">{weather.name}</h2>
                    <p className="text-xl capitalize">
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
                      className="w-16 h-16"
                    />
                    <p className="text-4xl font-bold">
                      {Math.round(weather.main.temp)}°C
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Exibir previsão para os próximos dias */}
            {!loading && forecast.length > 0 && (
              <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 shadow-lg">
                <h2 className="text-2xl text-center font-bold mb-4 uppercase">
                  Próximos dias
                </h2>
                <div className="flex justify-center overflow-x-auto pb-2 md:overflow-visible">
                  <div className="flex gap-3 min-w-max justify-center">
                    {forecast.map((item) => (
                      <div
                        key={item.date}
                        className="bg-white/10 rounded-2xl p-3 text-center hover:bg-white/20 transition-colors w-[140px] shadow-lg border border-white/10 backdrop-blur-sm"
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
                        <p className="text-xs flex flex-col">
                          <span className="text-blue-200">
                            Mín: {Math.round(item.temp_min)}°C
                          </span>{" "}
                          <span className="text-red-200">
                            {" "}
                            Máx: {Math.round(item.temp_max)}°C
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
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
      </div>
    </div>
  );
}
