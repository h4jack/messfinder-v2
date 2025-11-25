'use client';

import React, { useRef, useEffect, ReactNode } from 'react';

interface ClickOutsideProps {
  children: ReactNode;
  onClickOutside: () => void;
  /** Optional: add className to the wrapper */
  className?: string;
  /** Optional: exclude certain elements from triggering outside click */
  excludeRefs?: React.RefObject<HTMLElement>[];
}

/**
 * Detects clicks outside the wrapped element and calls onClickOutside()
 */
const ClickOutside: React.FC<ClickOutsideProps> = ({
  children,
  onClickOutside,
  className,
  excludeRefs = [],
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as Node;

      // If clicked inside the wrapper → do nothing
      if (wrapperRef.current?.contains(target)) return;

      // If clicked on any excluded ref → do nothing
      const clickedOnExcluded = excludeRefs.some(
        (ref) => ref.current && ref.current.contains(target)
      );
      if (clickedOnExcluded) return;

      // Otherwise → it's truly outside
      onClickOutside();
    };

    document.addEventListener('mousedown', handleClick);
    // Also cover touch devices
    document.addEventListener('touchstart', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [onClickOutside, excludeRefs]);

  return (
    <span ref={wrapperRef} className={className}>
      {children}
    </span>
  );
};

export default ClickOutside;