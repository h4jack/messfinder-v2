'use client';

import React, { useRef, useEffect, ReactNode } from 'react';

interface ClickOutsideProps {
  children: ReactNode;
  onClickOutside: () => void;
  className?: string;
  excludeRefs?: React.RefObject<HTMLElement>[];
}

const ClickOutside: React.FC<ClickOutsideProps> = ({
  children,
  onClickOutside,
  className,
  excludeRefs = [],
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = (e: PointerEvent) => {
      const target = e.target as Node;

      if (wrapperRef.current?.contains(target)) return;
      if (excludeRefs.some(ref => ref.current?.contains(target))) return;

      setTimeout(onClickOutside, 0);
    };

    const focusHandler = (e: FocusEvent) => {
      const target = e.target as Node;

      // If focus stays inside → ignore
      if (wrapperRef.current?.contains(target)) return;
      if (excludeRefs.some(ref => ref.current?.contains(target))) return;

      onClickOutside();
    };

    document.addEventListener('pointerdown', clickHandler);
    document.addEventListener('focusin', focusHandler); // ← handles TAB navigation

    return () => {
      document.removeEventListener('pointerdown', clickHandler);
      document.removeEventListener('focusin', focusHandler);
    };
  }, [onClickOutside, excludeRefs]);

  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
};

export default ClickOutside;
