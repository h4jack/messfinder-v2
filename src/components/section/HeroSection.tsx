// components/HeroSearch.tsx
'use client';
import { Search, MapPin, Filter } from 'lucide-react';

export function HeroSearch() {
  return (
    <section className="relative bg-gradient-to-br from-teal-600 to-cyan-700 py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Find Your Perfect PG & Room
        </h1>
        <p className="text-xl text-teal-50 mb-10">
          Verified listings • No brokerage • Move-in ready
        </p>

        {/* Search Bar */}
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-2xl p-3 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-3 px-4">
            <MapPin className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Enter locality, area or landmark"
              className="w-full outline-none text-gray-800"
            />
          </div>
          <div className="flex gap-2">
            <button className="px-6 py-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
              <Filter className="w-5 h-5" />
            </button>
            <button className="px-8 py-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700 transition flex items-center gap-2">
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-center gap-4 text-sm text-teal-100">
          <span>Popular:</span>
          <button className="hover:underline">Bandra</button>
          <button className="hover:underline">Andheri</button>
          <button className="hover:underline">Kharghar</button>
        </div>
      </div>
    </section>
  );
}
