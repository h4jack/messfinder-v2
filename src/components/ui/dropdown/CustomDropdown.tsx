'use client';

import React, {
    useRef,
    useState,
    useEffect,
    useLayoutEffect,
    isValidElement,
    cloneElement,
} from 'react';

export interface DDStyle {
    type: 'light' | 'dark' | 'teal' | 'gray';
    focusedStyle?: string;
    isBlur?: boolean;
}
interface CustomDropdownProps {
    children: React.ReactNode;
    targetRef: React.RefObject<HTMLElement | undefined>;  // ← same type
    visible: boolean;
    onSelect?: (value: string) => void;
    enableTypeAhead?: boolean;
    dropdownRef: React.RefObject<HTMLDivElement | undefined>;
    DDStyle?: DDStyle;
}



export const CustomDropdown: React.FC<CustomDropdownProps> = ({
    children,
    targetRef,
    visible,
    onSelect,
    enableTypeAhead = true, // default: on
    dropdownRef,
    DDStyle = { type: 'dark', isBlur: true },
}) => {
    const itemRefs = useRef<(HTMLDivElement | undefined)[]>([]);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const searchQuery = useRef('');
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);

    const items = React.Children.toArray(children).filter(Boolean) as React.ReactElement[];

    // --- Dropdown Style System -------------------------------------

    // Better variable names
    const DROPDOWN_THEMES = {
        dark: "bg-neutral-900/80 text-white shadow-xl border border-white/10",
        gray: "bg-gray-800/70 text-white shadow-xl border border-white/10",
        teal: "bg-teal-900/70 text-teal-50 shadow-xl border border-white/10",
        light: "bg-white/90 text-neutral-900 shadow-xl border border-black/10",
    };

    // Focused option style (visually strong, accessible)
    const DROPDOWN_ITEM_FOCUSED = "bg-black/20 text-white ring-2 ring-gray-300/20 rounded-sm";

    const BORDER_STYLE = "border border-white/30 rounded-md shadow-2xl"
    // Blur background if enabled
    const BACKDROP_BLUR = "backdrop-blur-md";

    // Compute final dropdown container style
    const dropdownThemeClass = BORDER_STYLE + ' ' + ((DDStyle && DROPDOWN_THEMES[DDStyle.type])
        ? `${DDStyle.isBlur ? BACKDROP_BLUR : ''} ${DROPDOWN_THEMES[DDStyle.type]}`
        : `${BACKDROP_BLUR} ${DROPDOWN_THEMES.dark}`);



    useEffect(() => {
        if (visible) {
            setFocusedIndex(-1);
            searchQuery.current = '';
            itemRefs.current = [];
            if (searchTimeout.current) clearTimeout(searchTimeout.current);
        }
    }, [visible]);

    // Keyboard Navigation — FIXED: no more "e is undefined"
    useEffect(() => {
        if (!visible) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key; // ← Read immediately!

            if (focusedIndex >= 0 && (key === 'Enter' || (key === ' ' && enableTypeAhead))) {
                e.preventDefault();
                const item = items[focusedIndex];
                const text = String(item.props.children || '').trim();

                // Safely trigger onClick or onMouseDown
                const handler = item.props.onClick || item.props.onMouseDown;
                if (typeof handler === 'function') {
                    // Create a fake mouse event to simulate real click
                    const fakeEvent = {
                        preventDefault: () => { },
                        stopPropagation: () => { },
                        currentTarget: itemRefs.current[focusedIndex],
                    } as unknown as React.MouseEvent<HTMLDivElement>;

                    handler(fakeEvent);
                }

                onSelect?.(text);
                return;
            }

            if (key === 'ArrowDown') {
                e.preventDefault();
                setFocusedIndex(prev => (prev < items.length - 1 ? prev + 1 : 0));
            }

            if (key === 'ArrowUp') {
                e.preventDefault();
                setFocusedIndex(prev => (prev <= 0 ? items.length - 1 : prev - 1));
            }

            // Type-to-select: INSTANT, no timeout
            if (enableTypeAhead && /^[a-zA-Z]$/.test(key)) {
                e.preventDefault();

                // Append the pressed letter
                searchQuery.current += key.toLowerCase();

                // Optional: limit length to avoid huge strings (e.g. user holds key)
                if (searchQuery.current.length > 10) {
                    searchQuery.current = searchQuery.current.slice(-10);
                }

                const start = focusedIndex >= 0 ? focusedIndex + 1 : 0;
                const wrapped = [...items.slice(start), ...items.slice(0, start)];

                const matchIdx = wrapped.findIndex(item => {
                    const text = String(item.props.children || '').toLowerCase();
                    return text.startsWith(searchQuery.current);
                });

                if (matchIdx !== -1) {
                    setFocusedIndex((start + matchIdx) % items.length);
                } else {
                    // Optional: if no match, try with just the last letter (like native select)
                    const fallbackMatch = wrapped.findIndex(item => {
                        const text = String(item.props.children || '').toLowerCase();
                        return text.startsWith(key.toLowerCase());
                    });
                    if (fallbackMatch !== -1) {
                        setFocusedIndex((start + fallbackMatch) % items.length);
                        searchQuery.current = key.toLowerCase(); // reset to single char
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [visible, focusedIndex, items, onSelect, targetRef, enableTypeAhead]);

    // Auto-scroll
    useEffect(() => {
        const el = itemRefs.current[focusedIndex];
        el?.scrollIntoView({ block: 'nearest' });
    }, [focusedIndex]);

    const enhancedChildren = items.map((child, index) => {
        if (!isValidElement(child)) return child;

        const childText = String(child.props.children || '').trim();
        const isFocused = index === focusedIndex;

        return cloneElement(child, {
            ref: (el: HTMLDivElement | null) => (itemRefs.current[index] = el),
            className: `${child.props.className || ''
                } px-6 py-3 cursor-pointer transition-all ${isFocused
                    ? DROPDOWN_ITEM_FOCUSED
                    : 'hover:bg-white/20'
                }`,
            onMouseEnter: () => setFocusedIndex(index),
            onClick: (e: React.MouseEvent) => {
                e.preventDefault();
                child.props.onClick?.(e);
                child.props.onMouseDown?.(e);
                onSelect?.(childText);
            },
        } as any);
    });

    // Positioning (unchanged)
    useLayoutEffect(() => {
        if (!visible || !targetRef.current || !dropdownRef.current) return;

        const dropdown = dropdownRef.current;
        const trigger = targetRef.current;

        const update = () => {
            const rect = trigger.getBoundingClientRect();
            const height = dropdown.offsetHeight || 200;
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            dropdown.style.position = 'fixed';
            dropdown.style.left = `${rect.left}px`;
            dropdown.style.width = `${rect.width}px`;
            dropdown.style.zIndex = '2147483647';

            if (spaceBelow < height && spaceAbove > spaceBelow) {
                dropdown.style.top = 'auto';
                dropdown.style.bottom = `${window.innerHeight - rect.top + 8}px`;
            } else {
                dropdown.style.top = `${rect.bottom + 8}px`;
                dropdown.style.bottom = 'auto';
            }
        };

        update();
        const handler = () => update();
        window.addEventListener('scroll', handler, true);
        window.addEventListener('resize', handler);
        return () => {
            window.removeEventListener('scroll', handler, true);
            window.removeEventListener('resize', handler);
        };
    }, [visible, targetRef]);




    if (!visible) return null;
    // if (!targetRef.current) return null;
    if (!items.length) return null;
    return (
        <div
            ref={dropdownRef as React.RefObject<HTMLDivElement>}
            className={`${dropdownThemeClass} p-1 max-h-80 overflow-y-auto select-none`}
            style={{ position: 'fixed', top: 0, left: 0 }}
            onClick={e => e.stopPropagation()}
        >
            {enhancedChildren}
        </div>
    );
};