"use client";

import { useState } from "react";

type SearchBarProps = {
  onSearch: (city: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [city, setCity] = useState("");

  const handleSearch = () => {
    if (city.trim() !== "") {
      onSearch(city);
    }
  };

  return (
    <div className="flex items-center gap-2 bg-[#2c2c54] rounded-lg p-2 shadow-lg w-80">
      <input
        type="text"
        placeholder="Buscar cidade..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="bg-transparent outline-none text-white w-full placeholder-gray-400"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
      >
        🔍
      </button>
    </div>
  );
}