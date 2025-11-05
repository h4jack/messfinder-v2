'use client';
import { useEffect, useRef, useState } from 'react';

const states = ['Delhi', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat'];
const districts: Record<string, string[]> = {
    Delhi: ['Central Delhi', 'New Delhi', 'North Delhi'],
    Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
    Karnataka: ['Bangalore', 'Mysore', 'Hubli'],
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
    Gujarat: ['Ahmedabad', 'Surat', 'Vadodara'],
};
const genders = ['All', 'Male', 'Female'];

// Mock search suggestions (mess names + locations)
const mockSuggestions = [
    'Shanti Mess, Delhi',
    'Annapurna Hostel, Mumbai',
    'Green Leaf Mess, Bangalore',
    'Royal Residency, Pune',
    'Sri Krishna Bhavan, Chennai',
    'Student PG, Ahmedabad',
    'Food Court Deluxe, Nagpur',
];

// Valid pincodes (mock)
const validPincodes = ['110001', '400001', '560001', '600001', '380001', '411001', '440001'];

export default function HomeSearch() {
    const containerRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [search, setSearch] = useState('');
    const [state, setState] = useState('');
    const [gender, setGender] = useState('All');
    const [pincode, setPincode] = useState('');

    // Validation states
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

    // Mouse glow effect
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            containerRef.current.style.setProperty('--mouse-x', `${x}px`);
            containerRef.current.style.setProperty('--mouse-y', `${y}px`);
        };
        const el = containerRef.current;
        el?.addEventListener('mousemove', handleMouseMove);
        return () => el?.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Click outside → collapse
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsExpanded(false);
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    // Search suggestions
    useEffect(() => {
        if (search.length > 1) {
            const filtered = mockSuggestions.filter((s) =>
                s.toLowerCase().includes(search.toLowerCase())
            );
            setFilteredSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
            setFilteredSuggestions([]);
        }
    }, [search]);

    // Validate pincode
    const validatePincode = (value: string) => {
        const cleaned = value.trim();
        if (!cleaned) return '';
        if (!/^\d{6}$/.test(cleaned)) {
            return 'Pincode must be exactly 6 digits';
        }
        if (!validPincodes.includes(cleaned)) {
            const suggestions = validPincodes
                .filter((p) => p.startsWith(cleaned.slice(0, 3)))
                .slice(0, 2);
            return suggestions.length
                ? `Invalid pincode. Did you mean: ${suggestions.join(', ')}?`
                : 'Invalid pincode';
        }
        return '';
    };

    // Handle search submit
    const handleSearch = () => {
        const newErrors: Record<string, string> = {};

        if (!search.trim()) {
            newErrors.search = 'Please enter a location or mess name';
        }

        const pinError = validatePincode(pincode);
        if (pinError) newErrors.pincode = pinError;

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            console.log('Search:', { search, state, pincode, gender });
            // Perform search
        }
    };

    return (
        <div className='container'>
            <section
                ref={containerRef}
                className={`
         mx-auto mt-4 p-5 md:p-8
        bg-line-pattern rounded-2xl text-white
        transition-all duration-500 ease-out overflow-hidden
        ${isExpanded ? 'h-auto py-10' : 'h-64'}
        flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8
        relative
        before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none
        before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent
        before:bg-[length:200%_100%] before:animate-shine
      `}
                style={{
                    // @ts-ignore
                    '--mouse-x': '0px',
                    '--mouse-y': '0px',
                }}
            >
                {/* Motto */}
                <div
                    className={`
          transition-all duration-500 ease-out text-center md:text-left
          ${isExpanded ? 'w-full order-1' : 'w-full order-2 md:order-1'}
        `}
                >
                    <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                        Find your <span className="text-teal-200">Desired Mess</span>
                        <br />
                        with <span className="text-teal-100">MessFinder</span>..
                    </h2>
                </div>

                {/* Search Form */}
                <div
                    className={`
          w-full order-1 md:order-2 space-y-3
          ${isExpanded ? 'mt-4' : ''}
        `}
                >
                    <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="space-y-3">
                        {/* Main Search with Suggestions */}
                        <div className="relative">
                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={search}
                                        onChange={(e) => {
                                            setSearch(e.target.value);
                                            setErrors((prev) => ({ ...prev, search: '' }));
                                        }}
                                        onFocus={() => {
                                            setIsExpanded(true);
                                            if (search.length > 1) setShowSuggestions(true);
                                        }}
                                        placeholder="Location or mess name..."
                                        className={`
                    w-full px-5 py-3 rounded-xl text-sm md:text-base
                    bg-white/20 backdrop-blur-sm border
                    placeholder-white/70 text-white font-medium
                    focus:outline-none focus:ring-2 focus:ring-white/60
                    focus:bg-white/30 transition-all duration-300
                    ${errors.search ? 'border-orange-400' : 'border-white/30'}
                  `}
                                    />
                                    {errors.search && (
                                        <p className="absolute -bottom-5 left-0 text-orange-300 text-xs mt-1 animate-in fade-in">
                                            {errors.search}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    className="px-6 py-3 bg-white text-teal-600 rounded-xl font-bold text-sm md:text-base
                         shadow-md hover:shadow-lg hover:bg-teal-50 transition-all duration-300"
                                >
                                    Search
                                </button>
                            </div>

                            {/* Suggestions Dropdown */}
                            {showSuggestions && filteredSuggestions.length > 0 && (
                                <div
                                    className="absolute top-full left-0 right-0 mt-2 bg-white/20 backdrop-blur-md
                           border border-white/30 rounded-xl shadow-xl overflow-hidden
                           animate-in slide-in-from-top-2 fade-in duration-200 z-10"
                                >
                                    {filteredSuggestions.map((suggestion, i) => (
                                        <button
                                            key={i}
                                            type="button"
                                            onClick={() => {
                                                setSearch(suggestion);
                                                setShowSuggestions(false);
                                                searchInputRef.current?.focus();
                                            }}
                                            className="w-full text-left px-4 py-2.5 text-white/90 hover:bg-white/20
                               transition-colors text-sm first:rounded-t-xl last:rounded-b-xl"
                                        >
                                            🔍 {suggestion}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Advanced Panel - Animated Expand */}
                        <div
                            className={`
              overflow-hidden transition-all duration-500 ease-out
              ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}
            `}
                        >
                            {isExpanded && (
                                <div
                                    className="p-5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20
                           animate-in fade-in slide-in-from-top-4 duration-400 space-y-4 mt-4"
                                >
                                    <h3 className="text-sm font-semibold text-teal-100">Advanced Filters</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                        {/* State */}
                                        <select
                                            value={state}
                                            onChange={(e) => setState(e.target.value)}
                                            className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white
                             focus:outline-none focus:ring-2 focus:ring-white/50"
                                        >
                                            <option value="">State</option>
                                            {states.map((s) => (
                                                <option key={s} value={s}>{s}</option>
                                            ))}
                                        </select>

                                        {/* District */}
                                        <select
                                            disabled={!state}
                                            className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white
                             focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
                                        >
                                            <option>{state ? 'District' : '—'}</option>
                                            {state && districts[state].map((d) => (
                                                <option key={d} value={d}>{d}</option>
                                            ))}
                                        </select>

                                        {/* Pincode with Error */}
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={pincode}
                                                onChange={(e) => {
                                                    setPincode(e.target.value);
                                                    setErrors((prev) => ({ ...prev, pincode: '' }));
                                                }}
                                                placeholder="Pincode"
                                                maxLength={6}
                                                className={`
                        w-full px-4 py-2 rounded-lg bg-white/20 border
                        placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/50
                        ${errors.pincode ? 'border-orange-400' : 'border-white/30'}
                      `}
                                            />
                                            {errors.pincode && (
                                                <p className="absolute -bottom-5 left-0 text-orange-300 text-xs mt-1 animate-in fade-in">
                                                    {errors.pincode}
                                                </p>
                                            )}
                                        </div>

                                        {/* Gender Toggle */}
                                        <div className="flex gap-1 bg-white/10 p-1 rounded-lg">
                                            {genders.map((g) => (
                                                <button
                                                    key={g}
                                                    type="button"
                                                    onClick={() => setGender(g)}
                                                    className={`
                          flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200
                          ${gender === g
                                                            ? 'bg-white text-teal-600 shadow-sm'
                                                            : 'text-white/80 hover:text-white hover:bg-white/20'
                                                        }
                        `}
                                                >
                                                    {g}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </section>
        </div>

    );
}