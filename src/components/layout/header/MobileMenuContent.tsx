// components/MobileMenuContent.tsx
import Link from 'next/link';
import { NAV_ITEMS } from '@/data/ui/navItems';
import { headerLinks } from '@/data/ui/pageLinks';
import { Avatar } from './Avatar';
import type { User } from '@/types/User';

type Props = {
  user: User | null;
  onClose: () => void;
  onLogout: () => void;
};

export function MobileMenuContent({ user, onClose, onLogout }: Props) {
  return (
    <nav className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
      {user ? (
        <>
          <div className="flex items-center gap-3 py-2">
            <div className="w-10 h-10">
              <Avatar user={user} />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          {NAV_ITEMS.owner.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="block py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <hr className="my-2 border-teal-100" />
          <button onClick={onLogout} className="w-full text-left py-2 text-red-600 font-medium">
            Logout
          </button>
        </>
      ) : (
        <>
          <nav className="flex flex-col justify-center ml-4 space-y-3">
            {headerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200 relative group"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <hr className="border-t border-teal-100" />
          <Link href="/register" onClick={onClose} className="btn-register full">
            Register
          </Link>
          <Link href="/login" onClick={onClose} className="btn-login full">
            Login
          </Link>
        </>
      )}
    </nav>
  );
}