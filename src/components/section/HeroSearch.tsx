'use client';

import { useState } from 'react';

import { X, Search, MapPin, ChevronDown, Filter } from 'lucide-react';

import { durgapurSearchKeywords } from '@/data/mockData';
import { CustomDropdown } from '@/components/form/CustomDropdown';
import { useDropdown } from '../useDropdown';
import pincodeLookup from '@/utils/pincodeLookup';

interface Filters {
    state: string;
    district: string;
    pincode: string;
    gender: 'All' | 'Male' | 'Female';
}

const renderDropdownItem = (item: string, onClick: () => void) => (
    <div
        key={item || 'empty'}
        className="px-4 py-4 hover:bg-black/10 rounded-sm hover:text-white cursor-pointer whitespace-nowrap"
        onMouseDown={onClick}
    >
        {item || "Select"}
    </div>
);


export default function HeroSearch() {
    /** -------------------------------
     *  Refs
     *  ------------------------------- */
    const searchDropdown = useDropdown();
    const stateDropdown = useDropdown();
    const districtDropdown = useDropdown();
    const pincodeDropdown = useDropdown();

    /** -------------------------------
     *  Form State
     *  ------------------------------- */
    const [searchText, setSearchText] = useState('');
    const [filters, setFilters] = useState<Filters>({
        state: '',
        district: '',
        pincode: '',
        gender: 'All',
    });

    const [filtersExpanded, setFiltersExpanded] = useState(false);
    const [filterAnimating, setFilterAnimating] = useState(false);

    /** -------------------------------
     *  Data (Static Lists)
     *  ------------------------------- */
    const pincodeList = ['123456', '722132', '234472', '722329', '732321', '722321', '422123', '622321'];



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


    interface FilterErrors {
        state?: string;
        district?: string;
        pincode?: string;
        search?: string;
    }


    const [errors, setErrors] = useState<FilterErrors>({
    });

    const getInputClasses = (field: keyof FilterErrors) => {
        if (!errors[field]) return "focus:ring-teal-900/70 border-2 border-teal-900/40"; // default

        const isWarning = errors[field]?.includes("Warning");
        return isWarning
            ? "border-2 border-orange-500 focus:ring-orange-500/70"
            : "border-2 border-red-500 focus:ring-red-500/70";
    };

    // For wrapper divs (like search box)
    const getWrapperClasses = (field: keyof FilterErrors) => {
        if (!errors[field]) return "border-0"; // no extra border
        const isWarning = errors[field]?.includes("Warning");
        return isWarning ? "border-2 border-orange-500" : "border-2 border-red-500";
    };



    return (
        <div className='bg-gradient-to-br from-teal-600 to-cyan-700'>
            <div className="bg-line-pattern bg-transparent w-full text-white">

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
                        <searchDropdown.DropdownWrapper>
                            <div
                                ref={searchDropdown.ref}
                                className={`bg-white/80 z-20 backdrop-blur-sm p-4 w-full rounded-lg shadow-md text-gray-700 flex flex-col sm:flex-row items-end justify-center sm:items-center gap-2 relative transition-all
        ${errors.search ? 'border-2 border-red-500' : 'border-0'}`}
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
                                                setErrors((prev) => ({ ...prev, search: "Search term too short" }));
                                            } else if (e.target.value.includes("test")) {
                                                setErrors((prev) => ({ ...prev, search: "Warning: generic search term" }));
                                            } else {
                                                setErrors((prev) => ({ ...prev, search: undefined }));
                                            }

                                            e.target.value.trim() ? searchDropdown.openDropdown() : searchDropdown.closeDropdown();
                                        }}
                                        onFocus={(e) => e.currentTarget.value.trim() && searchDropdown.openDropdown()}
                                    />

                                    {searchText && (
                                        <X
                                            className="w-6 h-6 text-gray-600 cursor-pointer"
                                            onClick={() => {
                                                setSearchText("");
                                                setErrors((prev) => ({ ...prev, search: undefined }));
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
                                {errors.search && (
                                    <p className={`absolute -bottom-5 left-0 text-sm text-white px-2 rounded-sm ${errors.search.includes("Warning") ? "bg-orange-500" : "bg-red-500"}`}>
                                        {errors.search}
                                    </p>
                                )}
                            </div>
                        </searchDropdown.DropdownWrapper>


                        {/* ---------------- Filters Section ---------------- */}
                        <div className={`filter-panel ${filtersExpanded ? 'expanded' : ''} ${filterAnimating ? 'closing' : ''}`}>
                            {filtersExpanded && (
                                <div className="bg-white/70 backdrop-blur-xl p-6 w-full rounded-xl shadow-md border border-white/30 mt-2 text-gray-700 transition-all duration-300">
                                    <div className="flex items-center gap-2 mb-5">
                                        <Filter className="w-5 h-5 text-teal-600" />
                                        <h3 className="font-semibold text-gray-700">Refine Your Search</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        {/* State Dropdown */}
                                        <div ref={stateDropdown.ref}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                            <button
                                                className={`group w-full h-12 px-4 bg-teal-50/30 rounded-xl flex items-center justify-between hover:bg-teal-50/10 focus:outline-none focus:ring-2 transition-all ${getInputClasses('state')}`}
                                                onClick={stateDropdown.toggle}>
                                                {filters.state || 'Select State'}
                                                <ChevronDown className="w-4 h-4 text-gray-500 group-focus:text-teal-700" />
                                            </button>
                                            {errors.state && (
                                                <p className={`mt-1 text-sm ${errors.state.includes("Warning") ? "text-orange-500" : "text-red-500"}`}>
                                                    {errors.state}
                                                </p>
                                            )}
                                        </div>


                                        {/* ---------------- District Dropdown ---------------- */}
                                        <div ref={districtDropdown.ref}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                                            <button
                                                disabled={!filters.state} // disable unless state selected
                                                className={`group w-full h-12 px-4 rounded-xl flex items-center justify-between transition-all 
                                                    ${!filters.state ? 'bg-gray-300/60 opacity-50 text-gray-500 cursor-not-allowed' : 'bg-teal-50/30 hover:bg-teal-50/10 text-gray-700'} 
                                                    ${getInputClasses('district')}`}
                                                onClick={districtDropdown.toggle}
                                            >
                                                {filters.district || 'Select District'}
                                                <ChevronDown className="w-4 h-4 text-gray-500 group-focus:text-teal-700" />
                                            </button>
                                            {errors.district && (
                                                <p className={`mt-1 text-sm ${errors.district.includes("Warning") ? "text-orange-500" : "text-red-500"}`}>
                                                    {errors.district}
                                                </p>
                                            )}
                                        </div>

                                        {/* ---------------- Pincode Input ---------------- */}
                                        <div ref={pincodeDropdown.ref}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                                            <span className='relative'>

                                                <input
                                                    type="text"
                                                    value={filters.pincode}
                                                    placeholder="e.g. 713201, 713216"
                                                    className={`w-full h-12 pl-4 pr-10 rounded-xl placeholder-gray-400 focus:outline-none transition-all ${getInputClasses('pincode')}`}
                                                    onChange={(e) => {
                                                        let pincode = e.target.value.replace(/\D/g, '').slice(-6);
                                                        setFilters((prev) => ({ ...prev, pincode }));

                                                        if (pincode.length === 6 && pincodeLookup.isValidPincode(pincode)) {
                                                            const loc = pincodeLookup.findLocationByPincode(Number(pincode));
                                                            if (loc) {
                                                                setFilters((prev) => ({
                                                                    ...prev,
                                                                    state: loc.state,
                                                                    district: loc.district,
                                                                }));
                                                                setErrors((prev) => ({ ...prev, pincode: undefined, state: undefined, district: undefined }));
                                                            } else {
                                                                setErrors((prev) => ({ ...prev, pincode: 'Invalid pincode' }));
                                                            }
                                                        } else if (pincode.length > 0 && pincode.length < 6) {
                                                            setErrors((prev) => ({ ...prev, pincode: 'Invalid pincode' }));
                                                        } else {
                                                            setErrors((prev) => ({ ...prev, pincode: undefined }));
                                                        }

                                                        pincode ? pincodeDropdown.openDropdown() : pincodeDropdown.closeDropdown();
                                                    }}
                                                />

                                                {filters.pincode.length > 0 && (
                                                    <button
                                                        onClick={() => {
                                                            setFilters((prev) => ({ ...prev, pincode: "" }));
                                                            setErrors((prev) => ({ ...prev, pincode: undefined }));
                                                            pincodeDropdown.closeDropdown();
                                                        }}
                                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                                    >
                                                        <X className="w-5 h-5" />
                                                    </button>
                                                )}
                                            </span>

                                            {errors.pincode && (
                                                <p className={`mt-1 text-sm ${errors.pincode.includes("Warning") ? "text-orange-500" : "text-red-500"}`}>
                                                    {errors.pincode}
                                                </p>
                                            )}
                                        </div>



                                        {/* Gender Filter */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">For</label>
                                            <div className="flex gap-1">
                                                {(['All', 'Male', 'Female'] as const).map((option) => (
                                                    <button
                                                        key={option}
                                                        className={`flex-1 h-12 rounded-xl font-medium text-sm transition-all ${option === filters.gender
                                                            ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md'
                                                            : 'bg-teal-50/30 border border-teal-900/40 text-gray-700 hover:bg-teal-50/10 hover:shadow-sm'
                                                            }`}
                                                        onClick={() => setFilters((prev) => ({ ...prev, gender: option }))}
                                                    >
                                                        {option}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                </section>

                {/* ---------------- Dropdown Portals ---------------- */}

                {
                    searchDropdown.open && (
                        <searchDropdown.DropdownWrapper>
                            <CustomDropdown targetRef={searchDropdown.ref} visible={searchDropdown.open}>
                                {durgapurSearchKeywords.map((keyword) => (
                                    renderDropdownItem(keyword, () => {
                                        setSearchText(keyword);
                                        searchDropdown.closeDropdown();
                                    })
                                ))}
                            </CustomDropdown>
                        </searchDropdown.DropdownWrapper>
                    )
                }


                {
                    stateDropdown.open && (
                        <stateDropdown.DropdownWrapper>
                            <CustomDropdown targetRef={stateDropdown.ref} visible={stateDropdown.open}>
                                {["", ...pincodeLookup.getAllStates()].map((s) => (
                                    renderDropdownItem(s || "Select State", () => {
                                        setFilters((prev) => {
                                            if (prev.state !== s) {
                                                // Reset district if state changes
                                                return { ...prev, state: s, district: '' };
                                            }
                                            return { ...prev, state: s };
                                        });
                                        stateDropdown.closeDropdown();
                                    })
                                ))}
                            </CustomDropdown>
                        </stateDropdown.DropdownWrapper>
                    )
                }

                {
                    districtDropdown.open && (
                        <districtDropdown.DropdownWrapper>
                            <CustomDropdown targetRef={districtDropdown.ref} visible={districtDropdown.open}>
                                {["", ...pincodeLookup.getDistrictsByState(filters.state)].map((s) => (
                                    renderDropdownItem(s || "Select District", () => {
                                        setFilters((prev) => ({ ...prev, district: s }));
                                        districtDropdown.closeDropdown();
                                    })
                                ))}
                            </CustomDropdown>
                        </districtDropdown.DropdownWrapper>
                    )
                }

                {
                    pincodeDropdown.open && (
                        <pincodeDropdown.DropdownWrapper>
                            <CustomDropdown targetRef={pincodeDropdown.ref} visible={pincodeDropdown.open}>
                                {pincodeList.map((s) => (
                                    renderDropdownItem(s, () => {
                                        setFilters((prev) => ({ ...prev, pincode: s }));
                                        pincodeDropdown.closeDropdown();
                                    })
                                ))}
                            </CustomDropdown>
                        </pincodeDropdown.DropdownWrapper>
                    )
                }
            </div >
        </div >
    );
}
