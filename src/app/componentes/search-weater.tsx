"use client";

import { useState } from "react";
import { Search } from 'lucide-react';

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
    <div className="relative mb-4  mt-4 w-full  max-w-2xl mx-auto">
      <input
        type="text"
        placeholder="Buscar cidade..."
        value={city}
        onChange={(e) => setCity(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-full bg-white/20 backdrop-blur-lg text-white placeholder-white/70 rounded-full py-3.5 pl-6 pr-14 outline-none focus:ring-2 focus:ring-white/50 transition-all shadow-lg border border-white/10"
      />
      <button
        onClick={handleSearch}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500/80 to-indigo-600/80 hover:from-blue-600/80 hover:to-indigo-700/80 transition-all rounded-full p-2.5 text-white shadow-md"
        aria-label="Buscar"
      >
        <Search size={18} />
      </button>
    </div>
  );
}
