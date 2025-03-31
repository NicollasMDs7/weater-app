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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="relative flex items-center">
      <input
        type="text"
        placeholder="Buscar cidade..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-full bg-white/20 backdrop-blur-lg text-white placeholder-white/70 rounded-full py-3 px-6 pr-12 outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-lg"
      />
      <button
        onClick={handleSearch}
        className="absolute right-3 bg-white/30 hover:bg-white/40 transition-colors rounded-full p-2 text-white"
        aria-label="Buscar"
      >
        🔍
      </button>
    </div>
  );
}