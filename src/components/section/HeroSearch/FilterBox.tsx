'use client';

import React, { useState } from 'react';

import { X, ChevronDown, Filter } from 'lucide-react';

import { CustomDropdown } from '@/components/form/CustomDropdown';
import { useDropdown } from '@/components/useDropdown';
import pincodeLookup from '@/utils/pincodeLookup';

interface Filters {
    state: string;
    district: string;
    pincode: string;
    gender: 'All' | 'Male' | 'Female';
}


const renderDropdownItem = (
    item: string,
    onClick: () => void,
    extraProps?: React.HTMLAttributes<HTMLDivElement>
) => (
    <div
        key={item || 'empty'}
        className="px-4 py-4 cursor-pointer whitespace-nowrap"
        onMouseDown={(e) => {
            e.preventDefault(); // prevent input blur
            onClick();
        }}
        {...extraProps}
    >
        {item || "Select"}
    </div>
);

interface FilterBoxProps {
    filtersExpanded: boolean;
}

const FilterBox: React.FC<FilterBoxProps> = ({ filtersExpanded }) => {
    /** -------------------------------
     *  Refs
     *  ------------------------------- */
    const stateDropdown = useDropdown();
    const districtDropdown = useDropdown();
    const pincodeDropdown = useDropdown();

    /** -------------------------------
     *  Form State
     *  ------------------------------- */
    const [filters, setFilters] = useState<Filters>({
        state: '',
        district: '',
        pincode: '',
        gender: 'All',
    });


    /** -------------------------------
     *  Data (Static Lists)
     *  ------------------------------- */
    const pincodeList = ['123456', '722132', '234472', '722329', '732321', '722321', '422123', '622321'];

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
        <>
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
                        <CustomDropdown targetRef={pincodeDropdown.ref} visible={pincodeDropdown.open} enableTypeAhead={false}>
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

        </>)
}

export default FilterBox;