'use client';

import Link from 'next/link';
import { useState } from 'react';
import { NAV_ITEMS } from '@/data/ui/navItems';
import { headerLinks } from '@/data/ui/pageLinks';
import { ProfileButton } from './ProfileButton';
import { MobileMenuContent } from './MobileMenuContent';
import type { User } from '@/types/User';
// @ts-ignore
import './header.css';

// ─────────────────────────────────────────────────────────────────────────────
// Mock user — toggle `isLoggedIn` to test guest vs logged-in
// ─────────────────────────────────────────────────────────────────────────────
const mockUser: User = {
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  avatar: null,
};

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isLoggedIn = true; // Toggle for testing
  const user = isLoggedIn ? mockUser : null;

  // ─────────────────────────────────────────────────────────────────────────────
  // Handlers
  // ─────────────────────────────────────────────────────────────────────────────
  const toggleMobile = () => setIsMobileMenuOpen((v) => !v);
  const closeMobile = () => setIsMobileMenuOpen(false);
  const toggleProfile = () => setIsProfileOpen((v) => !v);
  const closeProfile = () => setIsProfileOpen(false);

  const handleLogout = () => {
    closeMobile();
    closeProfile();
    alert('Logged out!'); // Replace with real logout later
  };

  return (
    <>
      <div
        className={`w-full ${isMobileMenuOpen
          ? 'bg-teal-50'
          : 'bg-gradient-to-b from-teal-50/50 to-transparent backdrop-blur-sm'
          } sticky top-0 z-50`}
      >
        <header className="container mx-auto flex justify-between items-center p-3 md:p-4 h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold text-teal-700 group-hover:text-teal-600 transition-colors">
                MessFinder
              </span>
            </Link>
          </div>

          <div className="flex gap-8">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
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

            {/* Desktop CTA / Profile */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <div className="relative">
                  <ProfileButton
                    user={user}
                    isOpen={isProfileOpen}
                    onToggle={toggleProfile}
                    size="md"
                  />

                  {/* Desktop Dropdown */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-teal-100 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                      <div className="p-4 pb-0 border-b border-teal-50">
                        <p className="font-semibold text-gray-800">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                      <div className="py-2">
                        {NAV_ITEMS.owner.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="block px-4 py-2.5 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                            onClick={closeProfile}
                          >
                            {link.label}
                          </Link>
                        ))}
                        <hr className="my-1 border-teal-100" />
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2.5 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/register" className="btn-register">Register</Link>
                  <Link href="/login" className="btn-login">Login</Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile trigger (avatar OR hamburger) */}
          {user ? (
            <div className="block md:hidden">
              <ProfileButton
                user={user}
                isOpen={isMobileMenuOpen}
                onToggle={toggleMobile}
                size="sm"
                as="div"
              />
            </div>
          ) : (
            <button
              onClick={toggleMobile}
              className="md:hidden p-2 rounded-lg hover:bg-teal-100/50 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="absolute w-full h-auto bg-teal-50 left-0 z-50 border-b-2 border-t-2 border-teal-100 shadow-md flex flex-col md:hidden">
            <MobileMenuContent user={user} onClose={closeMobile} onLogout={handleLogout} />
          </div>
        )}
      </div>
    </>
  );
}