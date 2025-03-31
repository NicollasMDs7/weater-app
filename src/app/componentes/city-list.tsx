"use client";

import { useEffect, useState } from "react";

type City = {
  name: string;
  temp: number;
  icon: string;
  description: string;
};

type CityListProps = {
  cities: City[];
  onCityClick?: (cityName: string) => void;
};

export default function CityList({ cities, onCityClick }: CityListProps) {
  const [history, setHistory] = useState<City[]>([]);

  // Carrega o histórico do localStorage ao iniciar
  useEffect(() => {
    const storedHistory = localStorage.getItem("weatherHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Atualiza o histórico quando uma nova cidade é pesquisada
  useEffect(() => {
    if (cities.length > 0) {
      const newCity = cities[0];

      setHistory((prev) => {
        // Remove a cidade se já estiver no histórico
        const updatedHistory = prev.filter((city) => city.name !== newCity.name);

        // Adiciona a nova cidade no topo e mantém apenas as últimas 5
        const newHistory = [newCity, ...updatedHistory].slice(0, 6);

        // Salva no localStorage
        localStorage.setItem("weatherHistory", JSON.stringify(newHistory));

        return newHistory;
      });
    }
  }, [cities]);

  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-xl p-4 md:p-3 shadow-lg">
      <h2 className="text-xl font-bold mb-3 text-white">Histórico de Pesquisas</h2>

      {history.length === 0 ? (
        <p className="text-white/70 text-center py-2">Nenhuma pesquisa recente</p>
      ) : (
        history.map((city, index) => (
          <div
            key={index}
            className={"bg-white/10 rounded-lg p-2 mb-2 flex items-center hover:bg-white/20 transition-colors cursor-pointer"}
            onClick={() => onCityClick && onCityClick(city.name)}
          >
            <img
              src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`}
              alt="Ícone do clima"
              className="w-10 h-10 md:w-8 md:h-8"
            />
            <div className="ml-2">
              <h2 className="text-base font-semibold text-white">{city.name}</h2>
              <div className="flex items-center">
                <p className="text-lg md:text-base font-bold text-white">{Math.round(city.temp)}°C</p>
                <p className="text-xs text-white/80 capitalize ml-2 hidden md:block">{city.description}</p>
              </div>
              <p className="text-xs text-white/80 capitalize md:hidden">{city.description}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
