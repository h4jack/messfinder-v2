'use client';

import { useLayoutEffect, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';


export function CustomDropdown({ children, targetRef, visible }: DropdownProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (!visible || !targetRef.current || !dropdownRef.current) return;

        const dropdown = dropdownRef.current;
        const trigger = targetRef.current;

        const updatePosition = () => {
            const rect = trigger.getBoundingClientRect();
            const dropdownHeight = dropdown.offsetHeight || 200;
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;

            dropdown.style.position = 'fixed';
            dropdown.style.left = `${rect.left}px`;
            dropdown.style.width = `${rect.width}px`;
            dropdown.style.zIndex = '2147483647'; // max z-index

            if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
                // Flip to top
                dropdown.style.top = 'auto';
                dropdown.style.bottom = `${window.innerHeight - rect.top + 8}px`;
            } else {
                // Normal: below
                dropdown.style.top = `${rect.bottom + 8}px`;
                dropdown.style.bottom = 'auto';
            }
        };

        updatePosition();

        const handleUpdate = () => updatePosition();
        window.addEventListener('scroll', handleUpdate, true);
        window.addEventListener('resize', handleUpdate);

        return () => {
            window.removeEventListener('scroll', handleUpdate, true);
            window.removeEventListener('resize', handleUpdate);
        };
    }, [visible, targetRef]);

    if (!visible) return null;

    // This is the magic: portal directly to body
    const dropdownElement = (
        <div
            ref={dropdownRef}
            className="bg-teal-900/60 text-white backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl p-1 max-h-80 overflow-y-auto pointer-events-auto"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
            }}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </div>
    );

    return createPortal(dropdownElement, document.body);
}