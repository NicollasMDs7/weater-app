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
};

export default function CityList({ cities }: CityListProps) {
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
    <div className="mt-6 w-80">
      <h2 className="text-lg font-semibold text-white mb-2">Histórico de Pesquisas</h2>

      {history.map((city, index) => (
        <div key={index} className="bg-[#3a3a70] p-4 rounded-lg shadow-lg mb-2 flex items-center flex ">
          <img src={`https://openweathermap.org/img/wn/${city.icon}@2x.png`} alt="Ícone do clima" className="w-12" />
          <div className="ml-4">
            <h2 className="text-lg font-semibold">{city.name}</h2>
            <p className="text-md">{Math.round(city.temp)}°C</p>
            <p className="text-sm">{city.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
