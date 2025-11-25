'use client';

import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { X, Search, MapPin, Clock, ChevronDown, Fullscreen, Minimize2, LocateIcon, Filter } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import pincodeLookup from '@/utils/pincodeLookup';
import { RoomCard, RoomCardProps } from './FeaturedRooms';
import { durgapurSearchKeywords } from '@/data/mockData';
import { CustomDropdown } from '@/components/form/CustomDropdown'
import ClickOutside from '../ClickedOutside';

export default function HeroSearch() {
    // Fixed: Initialize ref with null
    const searchRef = useRef<HTMLDivElement>(null);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [isFilter, setIsFilter] = useState(true);
    const [showPincodeSuggestions, setShowPincodeSuggestions] = useState(false);
    const pincodeRef = useRef<HTMLDivElement>(null);
    const pincodeSuggestions = ['123456', '722132', '234472', '722329', '732321', '722321', '422123', '622321'];
    const stateSuggestions = ['West Bengal', 'Bihar', 'Odisha', 'Jharkhand', 'Assam', 'Tripura'];
    const districtSuggestions = ['Durgapur', 'Asansol', 'Kolkata', 'Siliguri', 'Darjeeling', 'Howrah'];
    const [pincode, setPincode] = useState('');

    return (
        <div className='bg-gradient-to-br from-teal-600 to-cyan-700'>
            <div className="bg-line-pattern bg-transparent w-full text-white">
                <section className="container py-20  p-2 flex flex-col items-center justify-center mx-auto">
                    <div className="m-4 text-center w-full gap-2">
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Find your Perfect<span className="text-teal-200"> PG & Rooms</span>
                        </h1>
                        <p className='text-xl mt-2'>
                            Verified listings • No brokerage • Move-in ready
                        </p>
                    </div>

                    <div className="w-full h-full md:w-2/3 mx-4 mt-6">
                        <ClickOutside onClickOutside={() => setShowSuggestions(false)}>
                            <div
                                ref={searchRef}
                                className="bg-white/80 backdrop-blur-sm p-4 w-full rounded-lg shadow-md text-gray-700 flex flex-col sm:flex-row items-end justify-center sm:items-center gap-2 relative"
                            >
                                <span className="flex w-full h-full gap-1 justify-center items-center">
                                    <MapPin className="w-6 h-6 text-gray-600" />
                                    <input
                                        type="text"
                                        className="w-full h-full border-none outline-none"
                                        placeholder="Enter name or location of PGs."
                                        value={searchText}
                                        onChange={(e) => {
                                            setSearchText(e.target.value);
                                            setShowSuggestions(((e.target.value).trim() != "" && true));
                                        }}
                                        onFocus={(e) => (e.currentTarget.value) && setShowSuggestions(true)}
                                    />
                                    {searchText && <X className="w-6 h-6 text-gray-600 cursor-pointer" onClick={() => setSearchText("")} />}
                                </span>
                                <span className='flex h-full justify-center items-center'>
                                    <button className="text-gray-600 px-2" onClick={() => setIsFilter(prev => !prev)}>
                                        <Filter className="w-5 h-5" />
                                    </button>
                                    <button className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-md flex items-center gap-2">
                                        <Search className="w-4 h-4" />
                                        Search
                                    </button>
                                </span>
                            </div>
                        </ClickOutside>

                        {isFilter &&
                            <div className="bg-white/70 backdrop-blur-xl p-6 w-full rounded-xl shadow-md border border-white/30 mt-2 text-gray-700 transition-all duration-300">
                                <div className="flex items-center gap-2 mb-5">
                                    <Filter className="w-5 h-5 text-teal-600" />
                                    <h3 className="font-semibold text-gray-700">Refine Your Search</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                        <button
                                            className="group w-full h-12 px-4 bg-teal-50/30 border border-teal-900/40 rounded-xl flex items-center justify-between hover:bg-teal-50/10 focus:outline-none focus:ring-2 focus:ring-teal-900/70 focus:border-transparent transition-all"
                                            tabIndex={0}
                                        >
                                            <span className="text-gray-700">Select State</span>
                                            <ChevronDown className="w-4 h-4 text-gray-500 group-focus:text-teal-700 transition-colors" />
                                        </button>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
                                        <button
                                            className="group w-full h-12 px-4 bg-teal-50/30 border border-teal-900/40 rounded-xl flex items-center justify-between hover:bg-teal-50/10 focus:outline-none focus:ring-2 focus:ring-teal-900/70 focus:border-transparent transition-all"
                                            tabIndex={0}
                                        >
                                            <span className="text-gray-700">Select District</span>
                                            <ChevronDown className="w-4 h-4 text-gray-500 group-focus:text-teal-700 transition-colors" />
                                        </button>
                                    </div>

                                    <ClickOutside onClickOutside={() => setShowPincodeSuggestions(false)}>
                                        <div ref={pincodeRef}>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    value={pincode}
                                                    placeholder="e.g. 713201, 713216"
                                                    className="w-full h-12 pl-4 pr-10 bg-teal-50/30 border border-teal-900/40 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-900/70 focus:border-transparent transition-all"
                                                    onChange={(e) => {
                                                        setPincode(e?.target.value || "");
                                                        setShowPincodeSuggestions(true);
                                                    }}
                                                    onFocus={(e) => e.target.value.trim() && setShowPincodeSuggestions(true)}
                                                />
                                                <button onClick={() => { setPincode(""); setShowPincodeSuggestions(false) }} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700">
                                                    <X className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    </ClickOutside>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">For</label>
                                        <div className="flex gap-1">
                                            {['All', 'Male', 'Female'].map((option) => (
                                                <button
                                                    key={option}
                                                    className={`flex-1 h-12 rounded-xl font-medium text-sm transition-all ${option === 'All'
                                                        ? 'bg-teal-600 text-white hover:bg-teal-700 shadow-md'
                                                        : 'bg-teal-50/30 border border-teal-900/40 text-gray-700 hover:bg-teal-50/10 hover:shadow-sm'
                                                        }`}
                                                >
                                                    {option}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                </section >
                <CustomDropdown targetRef={searchRef} visible={showSuggestions}>
                    {durgapurSearchKeywords.map((keyword, index) => (
                        <div
                            key={index}
                            className="px-4 py-4 hover:bg-black/10 rounded-sm hover:text-white cursor-pointer whitespace-nowrap"
                            onClick={
                                () => {
                                    console.log("hello world")
                                }
                            }
                        >
                            {keyword}
                        </div>
                    ))}
                </CustomDropdown>
                <CustomDropdown targetRef={pincodeRef} visible={showPincodeSuggestions}>
                    {pincodeSuggestions.map((keyword, index) => (
                        <div
                            key={index}
                            className="px-4 py-4 hover:bg-black/10 rounded-sm hover:text-white cursor-pointer whitespace-nowrap"
                        >
                            {keyword}
                        </div>
                    ))}
                </CustomDropdown>
            </div >
        </div >
    );
}