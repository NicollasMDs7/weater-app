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
        const newHistory = [newCity, ...updatedHistory].slice(0, 5);

        // Salva no localStorage
        localStorage.setItem("weatherHistory", JSON.stringify(newHistory));

        return newHistory;
      });
    }
  }, [cities]);

  return (
    <div className="bg-white/20 backdrop-blur-lg rounded-xl p-6 shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-white">Histórico de Pesquisas</h2>

      {history.length === 0 ? (
        <p className="text-white/70 text-center py-4">Nenhuma pesquisa recente</p>
      ) : (
        history.map((city, index) => (
          <div
            key={index}
            className={`
              bg-white/10 rounded-lg p-3 mb-3 flex items-center 
              hover:bg-white/20 transition-colors cursor-pointer
              ${index >= 3 ? 'md:hidden' : ''} // Oculta o 4º e 5º itens em telas médias e maiores
            `}
            onClick={() => onCityClick && onCityClick(city.name)}
          >
            <img
              src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`}
              alt="Ícone do clima"
              className="w-14 h-14"
            />
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-white">{city.name}</h2>
              <p className="text-xl font-bold text-white">{Math.round(city.temp)}°C</p>
              <p className="text-sm text-white/80 capitalize">{city.description}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
