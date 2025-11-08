'use client';

import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { X, Search, MapPin, Clock, ChevronDown, Fullscreen, Minimize2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import pincodeLookup from '@/utils/pincodeLookup';

interface Suggestion {
  type: 'mess' | 'location' | 'history';
  label: string;
  value: string;
}

const mockMesses = [
  'Shanti Mess, Delhi',
  'Annapurna PG, Mumbai',
  'Green Leaf Hostel, Bangalore',
  'Royal Residency, Pune',
  'Sri Krishna Bhavan, Chennai',
  'Student PG Deluxe, Ahmedabad',
  'Food Court Nagpur',
];

// MINIMAL PORTAL — YOU CONTROL EVERYTHING
interface FloatingDropdownProps {
  children: React.ReactNode;
  targetRef: React.RefObject<HTMLElement | null>;
  visible: boolean;
}

function FloatingDropdown({ children, targetRef, visible }: FloatingDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!visible || !targetRef.current || !dropdownRef.current) return;

    const dropdown = dropdownRef.current;
    const trigger = targetRef.current;

    const updatePosition = () => {
      const rect = trigger.getBoundingClientRect();
      const dropdownHeight = dropdown.offsetHeight || 200; // fallback
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      dropdown.style.position = 'fixed';
      dropdown.style.left = `${rect.left}px`;
      dropdown.style.width = `${rect.width}px`;
      dropdown.style.zIndex = '1000';

      // AUTO-FLIP: Show above if not enough space below
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        dropdown.style.bottom = `${window.innerHeight - rect.top + 8}px`;
        dropdown.style.top = 'auto';
      } else {
        dropdown.style.top = `${rect.bottom + 8}px`;
        dropdown.style.bottom = 'auto';
      }
    };

    updatePosition();

    const handleScroll = () => updatePosition();
    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [visible, targetRef, children]); // Add children to deps

  if (!visible) return null;

  return (
    <div
      ref={dropdownRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        pointerEvents: 'auto',
      }}
      className="bg-teal-900/40 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl p-1 max-h-80 overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

// MAIN COMPONENT
export default function HomeSearch() {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const stateTriggerRef = useRef<HTMLDivElement>(null);
  const districtTriggerRef = useRef<HTMLDivElement>(null);
  const pincodeInputRef = useRef<HTMLDivElement>(null);

  const [isExpanded, setIsExpanded] = useState(false);
  const [search, setSearch] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [pincode, setPincode] = useState('');
  const [gender, setGender] = useState('All');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showSearchSuggestions, setShowSearchSuggestions] = useState(false);
  const [showStateOptions, setShowStateOptions] = useState(false);
  const [showDistrictOptions, setShowDistrictOptions] = useState(false);
  const [pincodeSuggestions, setPincodeSuggestions] = useState<string[]>([]);
  const [states] = useState<string[]>(pincodeLookup.getAllStates());
  const [districts, setDistricts] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Suggestion[]>([]);

  const [showFullScreen, setShowFullScreen] = useState(false);

  // Update districts when state changes
  useEffect(() => {
    if (state) {
      const dists = pincodeLookup.getDistrictsByState(state);
      setDistricts(dists);
      setDistrict('');
      setPincode('');
    } else {
      setDistricts([]);
      setDistrict('');
    }
  }, [state]);

  // Pincode suggestions
  useEffect(() => {
    const val = pincode.trim();
    if (val.length >= 3 && val.length <= 6) {
      const suggestions = pincodeLookup
        .searchByPartialPincode(val)
        .slice(0, 5)
        .map(s => s.from.toString());
      setPincodeSuggestions(suggestions);
    } else {
      setPincodeSuggestions([]);
    }
  }, [pincode]);

  // Search suggestions
  useEffect(() => {
    if (search.length < 2) {
      setFilteredSuggestions([]);
      setShowSearchSuggestions(false);
      return;
    }

    const query = search.toLowerCase();

    const messMatches: Suggestion[] = mockMesses
      .filter(m => m.toLowerCase().includes(query))
      .slice(0, 3)
      .map(m => ({ type: 'mess', label: m, value: m }));

    const locationMatches: Suggestion[] = states
      .filter(s => s.toLowerCase().includes(query))
      .slice(0, 2)
      .map(s => {
        const firstDist = pincodeLookup.getDistrictsByState(s)[0] || '';
        return { type: 'location', label: `${s}, ${firstDist}`, value: `${s}, ${firstDist}` };
      });

    const historyMatches: Suggestion[] = JSON.parse(localStorage.getItem('searchHistory') || '[]')
      .filter((h: string) => h.toLowerCase().includes(query))
      .slice(0, 2)
      .map((h: string) => ({ type: 'history', label: h, value: h }));

    setFilteredSuggestions([...messMatches, ...locationMatches, ...historyMatches]);
    setShowSearchSuggestions(true);
  }, [search, states]);

  const addToHistory = (value: string) => {
    const history = JSON.parse(localStorage.getItem('searchHistory') || '[]');
    const filtered = history.filter((h: string) => h !== value);
    filtered.unshift(value);
    localStorage.setItem('searchHistory', JSON.stringify(filtered.slice(0, 10)));
  };

  const validatePincode = (value: string): string => {
    const cleaned = value.trim();
    if (!cleaned) return '';
    if (!/^\d{6}$/.test(cleaned)) return 'Pincode must be 6 digits';
    const loc = pincodeLookup.findLocationByPincode(Number(cleaned));
    if (!loc) return 'Invalid pincode';
    if (state && loc.state !== state) return `Pincode is in ${loc.state}`;
    if (district && loc.district !== district) return `Pincode is in ${loc.district}`;
    return '';
  };

  const handleSearch = () => {
    const newErrors: Record<string, string> = {};
    if (!search.trim()) newErrors.search = 'Enter location or mess name';
    const pinError = validatePincode(pincode);
    if (pinError) newErrors.pincode = pinError;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      addToHistory(search);
      const params = new URLSearchParams();
      params.set('q', search);
      if (state) params.set('state', state);
      if (district) params.set('district', district);
      if (pincode) params.set('pincode', pincode);
      if (gender !== 'All') params.set('gender', gender);
      router.push(`/search?${params.toString()}`);
    }
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        containerRef.current?.contains(target) ||
        searchInputRef.current?.contains(target) ||
        stateTriggerRef.current?.contains(target) ||
        districtTriggerRef.current?.contains(target) ||
        pincodeInputRef.current?.contains(target)
      ) return;

      setShowStateOptions(false);
      setShowDistrictOptions(false);
      setShowSearchSuggestions(false);
      setPincodeSuggestions([]);
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div className={`${showFullScreen ? "fixed inset-0 z-50 bg-white" : "container overflow-hidden relative"}`}>
      <section
        ref={containerRef}
        className={`
          mx-auto p-5 md:p-8 bg-line-pattern text-white
          transition-all duration-500 ease-out overflow-visible relativee
          ${showFullScreen ? "justify-start rounded-none" : "container justify-center rounded-2xl"} flex flex-col items-center gap-4 md:gap-8 h-full w-full
          before:absolute before:inset-0 before:rounded-2xl before:pointer-events-none
          before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent
          before:bg-[length:200%_100%] before:animate-shine overflow-y-visible relative
        `}
        style={{ '--mouse-x': '0px', '--mouse-y': '0px' } as any}
      >
        <button
          type="button"
          onClick={() => setShowFullScreen(prev => !prev)}
          className="absolute right-2 top-2 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
          aria-label={showFullScreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {showFullScreen ? (
            <Minimize2 className="w-5 h-5 text-white" />
          ) : (
            <Fullscreen className="w-5 h-5 text-white" />
          )}
        </button>
        {/* Logo */}
        {showFullScreen && (
          <div className="absolute top-0 left-0 p-2 px-4">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold text-teal-50 group-hover:text-teal-600 transition-colors">
                MessFinder
              </span>
            </Link>
          </div>
        )}
        <div className={`${showFullScreen && "mt-10"} "mb-8 text-center w-full md:w-1/2"`}>
          <h2 className="text-2xl md:text-3xl font-bold leading-tight">
            Find your <span className="text-teal-200">Desired Mess</span>
            <br />
            with <span className="text-teal-100">MessFinder</span>..
          </h2>
        </div>

        <div className={`w-full md:w-2/3 space-y-3 ${isExpanded ? 'mt-4' : ''}`}>
          <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="space-y-3">

            {/* Main Search */}
            <div className="relative">
              <div className="flex gap-2" ref={searchInputRef}>
                <div className="relative flex-1">
                  <input

                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setErrors(prev => ({ ...prev, search: '' }));
                    }}
                    onFocus={() => setIsExpanded(true)}
                    placeholder="Search mess, location..."
                    className={`
                      w-full px-5 py-3 pr-12 rounded-xl text-sm md:text-base
                      bg-white/20 backdrop-blur-sm border placeholder-white/70 text-white font-medium
                      focus:outline-none focus:ring-2 focus:ring-white/60 focus:bg-white/30
                      transition-all duration-300
                      ${errors.search ? 'border-orange-500' : 'border-white/30'}
                      `}
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch('');
                        searchInputRef.current?.focus();
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}

                </div>
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-teal-600 rounded-xl font-bold shadow-md hover:shadow-lg hover:bg-teal-50 transition-all"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
              {errors.search && (
                <p className="text-orange-500 text-xs">{errors.search}</p>
              )}

              {/* Search Suggestions Portal */}
              <FloatingDropdown
                targetRef={searchInputRef}
                visible={showSearchSuggestions && filteredSuggestions.length > 0}
              >
                {filteredSuggestions.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setSearch(s.value);
                      setShowSearchSuggestions(false);
                      addToHistory(s.value);
                      handleSearch();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 text-white hover:bg-white/20 transition-colors rounded-lg"
                  >
                    {s.type === 'history' && <Clock className="w-4 h-4 text-white/60" />}
                    {s.type === 'location' && <MapPin className="w-4 h-4 text-teal-300" />}
                    {s.type === 'mess' && <Search className="w-4 h-4 text-white/60" />}
                    <span className="text-sm">{s.label}</span>
                  </button>
                ))}
              </FloatingDropdown>
            </div>

            {/* Advanced Filters */}
            <div className={`overflow-hidden transition-all duration-500 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              {isExpanded && (
                <>
                  <div className="p-5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20 space-y-6 mt-4">
                    <h3 className="text-sm font-semibold text-teal-100">Advanced Filters</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">

                      {/* State */}
                      <div ref={stateTriggerRef} className="relative">
                        <button
                          type="button"
                          onClick={() => setShowStateOptions(!showStateOptions)}
                          className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-white/50"
                        >
                          <span>{state || 'State'}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${showStateOptions ? 'rotate-180' : ''}`} />
                        </button>
                      </div>

                      {/* District */}
                      <div ref={districtTriggerRef} className="relative">
                        <button
                          type="button"
                          onClick={() => state && setShowDistrictOptions(!showDistrictOptions)}
                          disabled={!state}
                          className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50"
                        >
                          <span>{district || (state ? 'District' : '—')}</span>
                          <ChevronDown className={`w-4 h-4 transition-transform ${showDistrictOptions ? 'rotate-180' : ''}`} />
                        </button>


                      </div>

                      {/* Pincode */}
                      <div ref={pincodeInputRef} className="relative">
                        <input
                          type="text"
                          value={pincode}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '').slice(0, 6);
                            setPincode(val);
                            setErrors(prev => ({ ...prev, pincode: '' }));
                          }}
                          onFocus={() => setIsExpanded(true)}
                          placeholder="Pincode"
                          className={`
                          w-full px-4 py-2 rounded-lg bg-white/20 border
                          placeholder-white/60 text-white focus:outline-none focus:ring-2 focus:ring-white/50
                          ${errors.pincode ? 'border-orange-500' : 'border-white/30'}
                        `}
                        />
                        {errors.pincode && (
                          <p className="sm:absolute text-orange-500 text-xs">{errors.pincode}</p>
                        )}


                      </div>

                      {/* Gender */}
                      <div className="flex gap-1 bg-white/10 p-1 rounded-lg">
                        {['All', 'Male', 'Female'].map(g => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setGender(g)}
                            className={`
                            flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all
                            ${gender === g ? 'bg-white text-teal-600 shadow-sm' : 'text-white/80 hover:text-white hover:bg-white/20'}
                          `}
                          >
                            {g}
                          </button>
                        ))}
                      </div>

                    </div>
                  </div>
                  <FloatingDropdown targetRef={stateTriggerRef} visible={showStateOptions}>
                    {states.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => {
                          setState(s);
                          setShowStateOptions(false);
                        }}
                        className="w-full text-left px-4 py-3 text-white hover:bg-white/20 transition-colors rounded-lg"
                      >
                        {s}
                      </button>
                    ))}
                  </FloatingDropdown>
                  <FloatingDropdown
                    targetRef={districtTriggerRef}
                    visible={showDistrictOptions && districts.length > 0}
                  >
                    {districts.map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => {
                          setDistrict(d);
                          setShowDistrictOptions(false);
                        }}
                        className="w-full text-left px-4 py-3 text-white hover:bg-white/20 transition-colors rounded-lg"
                      >
                        {d}
                      </button>
                    ))}
                  </FloatingDropdown>
                  <FloatingDropdown
                    targetRef={pincodeInputRef}
                    visible={pincodeSuggestions.length > 0}
                  >
                    {pincodeSuggestions.map((s, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setPincode(s);
                          setPincodeSuggestions([]);
                        }}
                        className="w-full text-left px-3 py-2 text-white hover:bg-white/20 transition-colors text-sm rounded-lg"
                      >
                        {s}
                      </button>
                    ))}
                  </FloatingDropdown>
                </>
              )}
            </div>
          </form>
        </div>
      </section>
    </div >
  );
}