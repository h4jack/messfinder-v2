// components/ProfileButton.tsx
import { Avatar } from './Avatar';
import type { User } from '@/types/User';

type Props = {
  user: User;
  isOpen: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
  as?: 'button' | 'div'; // NEW: control if it's a button or div
};

export function ProfileButton({ user, isOpen, onToggle, size = 'md', as = 'button' }: Props) {
  const avatarSize = size === 'sm' ? 'w-8 h-8' : 'w-8 h-8';
  const textSize = size === 'sm' ? 'hidden md:inline' : 'font-medium text-gray-800';

  const baseClasses = `
    flex items-center gap-2 rounded-lg hover:bg-teal-100/50 transition-colors
    ${size === 'md' ? 'px-4 py-2 bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md border border-teal-50' : 'p-2'}
  `;

  const content = (
    <>
      <div className={avatarSize}>
        <Avatar user={user} />
      </div>
      <span className={textSize}>
        {user.name.split(' ')[0]}
      </span>
      <svg
        className={`w-4 h-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </>
  );

  if (as === 'div') {
    return (
      <div
        onClick={onToggle}
        className={baseClasses}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onToggle()}
        aria-label="Open profile menu"
        aria-expanded={isOpen}
      >
        {content}
      </div>
    );
  }

  return (
    <button
      onClick={onToggle}
      className={baseClasses}
      aria-label="Open profile menu"
      aria-expanded={isOpen}
    >
      {content}
    </button>
  );
}