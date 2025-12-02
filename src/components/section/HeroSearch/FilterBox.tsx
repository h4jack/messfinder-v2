'use client';

import React, { useState } from 'react';

import { X, ChevronDown, Filter } from 'lucide-react';

import { useDropdown } from '@/components/ui/dropdown/useDropdown';
import { DropdownItem } from '@/components/ui/dropdown/DropdownItem';

import pincodeLookup from '@/utils/pincodeLookup';
interface FilterBoxProps {
    filtersExpanded: boolean;
    stateDropdown: ReturnType<typeof useDropdown>;
    districtDropdown: ReturnType<typeof useDropdown>;
    pincodeDropdown: ReturnType<typeof useDropdown>;
}

const FilterBox: React.FC<FilterBoxProps> = ({ filtersExpanded, stateDropdown, districtDropdown, pincodeDropdown }) => {
    /** -------------------------------
     *  Refs
     *  ------------------------------- */


    /** -------------------------------
     *  States
     *  ------------------------------- */
    const [gender, setGender] = useState("All")

    /** -------------------------------
     *  Data (Static Lists)
     *  ------------------------------- */
    const pincodeList = ['123456', '722132', '234472', '722329', '732321', '722321', '422123', '622321'];

    const getInputClasses = (error: string) => {
        if (!error) return "focus:ring-2 focus:ring-teal-900/70 border-2 border-gray-700/40"; // default

        const isWarning = error?.includes("Warning");
        return "focus:ring-2 border-none" + (isWarning
            ? "focus:ring-orange-500/70"
            : "focus:ring-red-500/70");
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
                        <stateDropdown.FieldWrapper>
                            <div ref={stateDropdown.ref as React.RefObject<HTMLDivElement>}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                <button
                                    className={`group w-full h-12 px-4 bg-teal-50/30 rounded-xl flex items-center justify-between hover:bg-teal-50/10 transition-all ${getInputClasses(stateDropdown.error)}`}
                                    onClick={() => {
                                        stateDropdown.toggle()
                                    }}>
                                    {stateDropdown.value || 'Select State'}
                                    <ChevronDown className={`${stateDropdown.open ? "rotate-180" : ""} w-4 h-4 text-gray-500 group-focus:text-teal-700`} />
                                </button>
                                {stateDropdown.error && (
                                    <p className={`mt-1 text-sm ${stateDropdown.error.includes("Warning") ? "text-orange-500" : "text-red-500"}`}>
                                        {stateDropdown.error}
                                    </p>
                                )}
                            </div>
                        </stateDropdown.FieldWrapper>


                        {/* ---------------- District Dropdown ---------------- */}
                        <districtDropdown.FieldWrapper>
                            <div ref={districtDropdown.ref as React.RefObject<HTMLDivElement>}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                                <button
                                    disabled={!stateDropdown.value} // disable unless state selected
                                    className={`group w-full h-12 px-4 rounded-xl flex items-center justify-between transition-all 
                                    ${!stateDropdown.value ? 'bg-gray-300/60 opacity-50 text-gray-500 cursor-not-allowed' : 'bg-teal-50/30 hover:bg-teal-50/10 text-gray-700'} 
                                    ${getInputClasses(districtDropdown.error)}`}
                                    onClick={() => {
                                        districtDropdown.toggle()
                                    }}
                                >
                                    {districtDropdown.value || 'Select District'}
                                    <ChevronDown className={`${districtDropdown.open ? "rotate-180" : ""} w-4 h-4 text-gray-500 group-focus:text-teal-700`} />
                                </button>
                                {districtDropdown.error && (
                                    <p className={`mt-1 text-sm ${districtDropdown.error.includes("Warning") ? "text-orange-500" : "text-red-500"}`}>
                                        {districtDropdown.error}
                                    </p>
                                )}
                            </div>
                        </districtDropdown.FieldWrapper>

                        {/* ---------------- Pincode Input ---------------- */}
                        <pincodeDropdown.FieldWrapper>
                            <div ref={pincodeDropdown.ref as React.RefObject<HTMLDivElement>}>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                                <span className='relative'>

                                    <input
                                        type="text"
                                        value={pincodeDropdown.value}
                                        placeholder="e.g. 713201, 713216"
                                        className={`w-full h-12 pl-4 pr-10 rounded-xl placeholder-gray-400 transition-all ${getInputClasses(pincodeDropdown.error)}`}
                                        onChange={(e) => {
                                            let pincode = e.target.value.replace(/\D/g, '').slice(-6);
                                            pincodeDropdown.setValue(pincode);

                                            if (pincode.length === 6 && pincodeLookup.isValidPincode(pincode)) {
                                                const loc = pincodeLookup.findLocationByPincode(Number(pincode));
                                                if (loc) {
                                                    stateDropdown.setValue(loc.state);
                                                    districtDropdown.setValue(loc.district);
                                                    stateDropdown.setError('');
                                                    districtDropdown.setError('');
                                                    pincodeDropdown.setError('');
                                                } else {
                                                    pincodeDropdown.setError('Pincode not found');
                                                    stateDropdown.setValue("");
                                                    districtDropdown.setValue("");
                                                }
                                            } else if (pincode.length > 0 && pincode.length < 6) {
                                                pincodeDropdown.setError('Pincode too short');
                                            } else {
                                                pincodeDropdown.setError('');
                                            }

                                            pincode ? pincodeDropdown.openDropdown() : pincodeDropdown.closeDropdown();
                                        }}
                                        onMouseDown={(e) => e.currentTarget.value.trim() && pincodeDropdown.openDropdown()}
                                    />
                                    {pincodeDropdown.value.length > 0 && (
                                        <button
                                            onClick={() => {
                                                pincodeDropdown.setValue('');
                                                pincodeDropdown.setError('');
                                                pincodeDropdown.closeDropdown();
                                            }}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    )}
                                </span>

                                {pincodeDropdown.error && (
                                    <p className={`mt-1 text-sm ${pincodeDropdown.error.includes("Warning") ? "text-orange-500" : "text-red-500"}`}>
                                        {pincodeDropdown.error}
                                    </p>
                                )}
                            </div>
                        </pincodeDropdown.FieldWrapper>


                        {/* Gender Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">For</label>
                            <div className="flex gap-1">
                                {(['All', 'Male', 'Female'] as const).map((option) => (
                                    <button
                                        key={option}
                                        className={`flex-1 h-12 rounded-xl font-medium text-sm transition-all ${option === gender
                                            ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md'
                                            : 'bg-teal-50/30 border border-teal-900/40 text-gray-700 hover:bg-teal-50/10 hover:shadow-sm'
                                            }`}
                                        onClick={() => setGender(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div >
            )}

            <stateDropdown.DropdownWrapper>
                {["", ...pincodeLookup.getAllStates()].map((s) => (
                    DropdownItem(s || "Select State", () => {
                        stateDropdown.setValue(prev => {
                            if (prev !== s) {
                                districtDropdown.setValue("");
                            }
                            return s;
                        });
                        stateDropdown.closeDropdown();
                    })
                ))}
            </stateDropdown.DropdownWrapper>

            <districtDropdown.DropdownWrapper>
                {["", ...pincodeLookup.getDistrictsByState(stateDropdown.value)].map((s) => (
                    DropdownItem(s || "Select District", () => {
                        districtDropdown.setValue(s);
                        districtDropdown.closeDropdown();
                    })
                ))}
            </districtDropdown.DropdownWrapper>

            <pincodeDropdown.DropdownWrapper>
                {pincodeList.map((s) => (
                    DropdownItem(s, () => {
                        pincodeDropdown.setValue(s);
                        pincodeDropdown.closeDropdown();
                    })
                ))}
            </pincodeDropdown.DropdownWrapper>

        </>)
}

export default FilterBox;