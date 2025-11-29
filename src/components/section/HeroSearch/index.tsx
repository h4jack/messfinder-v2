'use client';

import { useState } from 'react';

import { X, Search, MapPin, Filter, Fullscreen, Minimize2 } from 'lucide-react';

import { durgapurSearchKeywords } from '@/data/mockData';
import { useDropdown } from '@/components/ui/dropdown/useDropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';

import FilterBox from './FilterBox';

export default function HeroSearch() {
    /** -------------------------------
     *  Refs
     *  ------------------------------- */
    const searchDropdown = useDropdown();

    /** -------------------------------
     *  Form State
     *  ------------------------------- */
    const [searchText, setSearchText] = useState('');

    const [filtersExpanded, setFiltersExpanded] = useState(false);
    const [filterAnimating, setFilterAnimating] = useState(false);

    const toggleFilters = () => {
        if (filterAnimating) return; // Prevent multiple clicks
        setFilterAnimating(true);
        if (filtersExpanded) {
            setTimeout(() => {
                setFiltersExpanded(false);
                setFilterAnimating(false);
            }, 300); // match CSS transition duration
        } else {
            setFiltersExpanded(true);
            setFilterAnimating(false); // No animation required when opening
        }
    };


    const [searchErrors, setSearchErrors] = useState("");

    const [fullScreen, setFullScreen] = useState(false);

    return (
        <div className={"bg-gradient-to-br " + (fullScreen
            ? "from-gray-900 to-gray-600 fixed h-screen overflow-auto z-1000 w-full top-0 left-0"
            : "from-teal-600 to-cyan-600 relative")}>
            <div className="bg-line-pattern bg-transparent w-full text-white h-full">
                <button
                    className="absolute top-4 right-4 z-30 bg-white/20 hover:bg-white/30 text-white p-2 rounded-md transition-all"
                    onClick={() => setFullScreen(!fullScreen)}
                >
                    {fullScreen ? <Minimize2 className="w-6 h-6" /> : <Fullscreen className="w-6 h-6" />}
                </button>
                {/* ---------------- Header Section ---------------- */}
                <section className="container py-20 p-2 flex flex-col items-center justify-center mx-auto">
                    <div className="m-4 text-center w-full gap-2">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Find your Perfect<span className="text-teal-200"> PG & Rooms</span>
                        </h1>
                        <p className='text-xl mt-2'>
                            Verified listings • No brokerage • Move-in ready
                        </p>
                    </div>

                    {/* ---------------- Search Box ---------------- */}
                    <div className="w-full h-full md:w-2/3 mx-4 mt-6">
                        <searchDropdown.FieldWrapper>
                            <div
                                ref={searchDropdown.ref as React.RefObject<HTMLDivElement>}
                                className={`bg-white/80 z-20 backdrop-blur-sm p-4 w-full rounded-lg shadow-md text-gray-700 flex flex-col sm:flex-row items-end justify-center sm:items-center gap-2 relative transition-all
        ${searchErrors ? 'border-2 border-red-500' : 'border-0'}`}
                            >
                                <span className="relative flex w-full h-full gap-1 justify-center items-center">
                                    <MapPin className="w-6 h-6 text-gray-600" />

                                    <input
                                        type="text"
                                        className="w-full h-full border-none outline-none bg-white/0 placeholder-gray-500 px-2 py-2 transition-all"
                                        placeholder="Enter name or location of PGs."
                                        value={searchText}
                                        onChange={(e) => {
                                            setSearchText(e.target.value);

                                            if (e.target.value.length > 0 && e.target.value.length < 3) {
                                                setSearchErrors("Search term too short");
                                            } else if (e.target.value.includes("test")) {
                                                setSearchErrors("Warning: generic search term");
                                            } else {
                                                setSearchErrors("");
                                            }

                                            e.target.value.trim() ? searchDropdown.openDropdown() : searchDropdown.closeDropdown();
                                        }}
                                        onMouseDown={(e) => e.currentTarget.value.trim() && searchDropdown.openDropdown()}
                                    />

                                    {searchText && (
                                        <X
                                            className="w-6 h-6 text-gray-600 cursor-pointer"
                                            onClick={() => {
                                                setSearchText("");
                                                setSearchErrors("");
                                                searchDropdown.closeDropdown();
                                            }}
                                        />
                                    )}
                                </span>

                                <span className='flex h-full justify-center items-center'>
                                    <button className="text-gray-600 px-2" onClick={toggleFilters}>
                                        <Filter className="w-5 h-5" />
                                    </button>

                                    <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
                                        <Search className="w-4 h-4" />
                                        Search
                                    </button>
                                </span>

                                {/* Search Error Message below the search box */}
                                {searchErrors && (
                                    <p className={`absolute -bottom-5 left-0 text-sm text-white px-2 rounded-sm ${searchErrors.includes("Warning") ? "bg-orange-500" : "bg-red-500"}`}>
                                        {searchErrors}
                                    </p>
                                )}
                            </div>
                        </searchDropdown.FieldWrapper>


                        {/* ---------------- Filters Section ---------------- */}
                        <div className={`filter-panel ${filtersExpanded ? 'expanded' : ''} ${filterAnimating ? 'closing' : ''}`}>
                            <FilterBox
                                filtersExpanded={filtersExpanded}
                            />
                        </div>
                    </div>
                </section>

                {/* ---------------- Dropdown Portals ---------------- */}


                <searchDropdown.DropdownWrapper>
                    {durgapurSearchKeywords.map((keyword) => (
                        DropdownItem(keyword, () => {
                            setSearchText(keyword);
                            searchDropdown.closeDropdown();
                        })
                    ))}
                </searchDropdown.DropdownWrapper>


            </div >
        </div >
    );
}
