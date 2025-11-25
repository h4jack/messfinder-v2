import { useLayoutEffect, useRef } from 'react';

export function CustomDropdown({ children, targetRef, visible }: DropdownProps) {
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
                pointerEvents: 'auto',
            }}
            className="bg-teal-900/40 z-50 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl p-1 max-h-80 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    );
};
