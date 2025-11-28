// src/hooks/useDropdown.ts
'use client';

import { useRef, useState, useCallback, useEffect, useId } from 'react';
import ClickOutside from '@/components/ClickedOutside';

interface UseDropdownReturn {
    ref: React.RefObject<HTMLElement | undefined>;  // ← HTMLElement, not HTMLDivElement
    open: boolean;
    toggle: (isOpen?: boolean) => void;
    openDropdown: () => void;
    closeDropdown: () => void;
    DropdownWrapper: React.FC<{ children: React.ReactNode }>;
}

export type { UseDropdownReturn };

export function useDropdown() {
    // ← Use HTMLElement (div, button, input — all work)
    const ref = useRef<HTMLElement | undefined>(undefined);
    const [open, setOpen] = useState(false);

    const toggle = useCallback((isOpen?: boolean) => {
        setOpen(prev => isOpen ?? !prev);
    }, []);

    const openDropdown = useCallback(() => setOpen(true), []);
    const closeDropdown = useCallback(() => setOpen(false), []);

    // Escape key support
    useEffect(() => {
        if (!open) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                closeDropdown();
                ref.current?.focus();
            }
        };

        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [open, closeDropdown]);

    const DropdownWrapper: React.FC<{ children: React.ReactNode }> = useCallback(
        ({ children }) => (
            <ClickOutside onClickOutside={closeDropdown} excludeRefs={[ref]}>
                {children}
            </ClickOutside>
        ),
        [closeDropdown, ref]
    );

    return {
        ref,
        open,
        toggle,
        openDropdown,
        closeDropdown,
        DropdownWrapper,
    };
}