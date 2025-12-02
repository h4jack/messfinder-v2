// src/hooks/useDropdown.ts
'use client';

import { useRef, useState, useCallback, useEffect, useId } from 'react';
import ClickOutside from '@/components/ClickedOutside';
import { CustomDropdown } from '@/components/ui/dropdown/CustomDropdown';
import { createPortal } from 'react-dom';

interface UseDropdownReturn {
    ref: React.RefObject<HTMLElement | undefined>;  // ← HTMLElement, not HTMLDivElement
    open: boolean;
    toggle: (isOpen?: boolean) => void;
    openDropdown: () => void;
    closeDropdown: () => void;
    DropdownWrapper: React.FC<{ children: React.ReactNode }>;
    FieldWrapper: React.FC<{ children: React.ReactNode }>;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    error: string;
    setError: React.Dispatch<React.SetStateAction<string>>;
}

export type { UseDropdownReturn };

export function useDropdown() {
    // ← Use HTMLElement (div, button, input — all work)
    const ref = useRef<HTMLElement | undefined>(undefined);
    const dropdownRef = useRef<HTMLDivElement | undefined>(undefined);
    const [open, setOpen] = useState(false);

    const [value, setValue] = useState('');
    const [error, setError] = useState('');

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

    const FieldWrapper: React.FC<{ children: React.ReactNode }> = useCallback(
        ({ children }) => (
            <ClickOutside onClickOutside={closeDropdown} excludeRefs={[ref, dropdownRef]}>
                {children}
            </ClickOutside>
        ),
        [closeDropdown, ref]
    );

    const DropdownWrapper: React.FC<{ children: React.ReactNode }> = useCallback(
        ({ children }) => (
            createPortal((
                <CustomDropdown
                    targetRef={ref}
                    dropdownRef={dropdownRef}
                    visible={open}
                    enableTypeAhead={false}
                >
                    {children}
                </CustomDropdown>
            ), document.body)
        ),
        [open, ref, dropdownRef]
    );

    return {
        ref,
        open,
        toggle,
        openDropdown,
        closeDropdown,
        FieldWrapper,
        DropdownWrapper,
        value,
        setValue,
        error,
        setError,
    };
}