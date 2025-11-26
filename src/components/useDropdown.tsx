import { useRef, useState, useCallback } from 'react';
import ClickOutside from './ClickedOutside';

interface UseDropdownReturn {
    ref: React.RefObject<HTMLDivElement>;
    open: boolean;
    toggle: (isOpen?: boolean) => void;
    openDropdown: () => void;
    closeDropdown: () => void;
    DropdownWrapper: React.FC<{ children: React.ReactNode }>;
}

export type { UseDropdownReturn };


export function useDropdown() {
    const ref = useRef<HTMLDivElement>(null); // trigger element
    const [open, setOpen] = useState(false);

    const toggle = useCallback(() => setOpen(prev => !prev), []);
    const openDropdown = useCallback(() => setOpen(true), []);
    const closeDropdown = useCallback(() => setOpen(false), []);

    // Wrapper to combine ClickOutside automatically
    const DropdownWrapper = useCallback(
        ({ children }: { children: React.ReactNode }) => (
            <ClickOutside onClickOutside={closeDropdown} excludeRefs={[ref]}>
                {children}
            </ClickOutside>
        ),
        [closeDropdown]
    );

    return { ref, open, toggle, openDropdown, closeDropdown, DropdownWrapper };
}
