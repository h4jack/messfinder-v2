'use client';
import Logo from "@/components/logo/Logo";
import Link from "next/link";
import { useState } from "react";

// Mock user (toggle `true` to test logged-in state)
const mockUser = {
  name: "Rahul Sharma",
  email: "rahul@example.com",
  avatar: null, // or use a URL: "/avatar.jpg"
};

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/mess-list", label: "Find Mess" },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const isLoggedIn = true; // Toggle: true = logged in, false = guest

  const user = isLoggedIn ? mockUser : null;

  return (
    <>
      <div className="w-full bg-gradient-to-b from-teal-50/50 to-transparent backdrop-blur-sm sticky top-0 z-50">
        <header className="container mx-auto flex justify-between items-center p-3 md:p-4 h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-2xl font-bold text-teal-700 group-hover:text-teal-600 transition-colors">
                MessFinder
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-teal-600 font-medium transition-colors duration-200 relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-600 group-hover:w-full transition-all duration-300"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA / Profile */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-200 border border-teal-50"
                >
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="font-medium text-gray-800">{user.name.split(" ")[0]}</span>
                  <svg
                    className={`w-4 h-4 text-gray-600 transition-transform ${isProfileOpen ? "rotate-180" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-teal-100 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                    <div className="p-4 border-b border-teal-50">
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <div className="py-2">
                      <Link
                        href="/profile"
                        className="block px-4 py-2.5 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/bookings"
                        className="block px-4 py-2.5 text-gray-700 hover:bg-teal-50 hover:text-teal-600 transition-colors"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Bookings
                      </Link>
                      <hr className="my-1 border-teal-100" />
                      <button
                        onClick={() => {
                          setIsProfileOpen(false);
                          alert("Logged out!");
                        }}
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
                <Link
                  href="/register"
                  className="px-5 py-2 bg-teal-100 text-teal-700 rounded-full font-medium hover:bg-teal-200 hover:shadow-md transition-all duration-200"
                >
                  Register
                </Link>
                <Link
                  href="/login"
                  className="px-5 py-2 bg-teal-600 text-white rounded-full font-medium hover:bg-teal-700 hover:shadow-md transition-all duration-200"
                >
                  Login
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-teal-100/50 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6 text-teal-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </header>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white/95 backdrop-blur-md border-t absolute w-full border-teal-100 shadow-lg animate-in slide-in-from-top duration-300">
            <nav className="container mx-auto py-4 px-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-gray-700 hover:text-teal-600 font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-teal-100" />
              {user ? (
                <>
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-teal-600 font-medium"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/bookings"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-teal-600 font-medium"
                  >
                    My Bookings
                  </Link>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      alert("Logged out!");
                    }}
                    className="w-full text-left py-2 text-red-600 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 bg-teal-100 text-teal-700 rounded-full font-medium hover:bg-teal-200 transition-colors"
                  >
                    Register
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-center py-2.5 bg-teal-600 text-white rounded-full font-medium hover:bg-teal-700 transition-colors"
                  >
                    Login
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>

      {/* CSS Animations (No Tailwind Config Needed) */}
      <style jsx>{`
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-in {
          animation: slideInFromTop 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}