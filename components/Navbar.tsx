'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useTheme } from './ThemeProvider';

export default function Navbar() {
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: '/stacks', label: 'Explorar stacks' },
    { href: '/compare', label: 'Comparar' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-600 sticky top-0 z-50 shadow-sm transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" onClick={() => setMobileOpen(false)}>
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm group-hover:scale-110 transition-transform">
              S
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-lg">
              Stack<span className="text-primary">Advisor</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                  isActive(href)
                    ? 'text-primary bg-blue-50 dark:bg-blue-950'
                    : 'text-gray-500 dark:text-slate-400 hover:text-primary dark:hover:text-primary hover:bg-gray-50 dark:hover:bg-slate-700'
                }`}
              >
                {label}
              </Link>
            ))}

            <button
              onClick={toggle}
              aria-label="Cambiar tema"
              className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-gray-200 dark:border-slate-500 text-gray-500 dark:text-slate-400 hover:border-primary hover:text-primary transition-all"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>

            <Link
              href="/questionnaire"
              className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Obtener recomendación →
            </Link>
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={toggle}
              aria-label="Cambiar tema"
              className="w-9 h-9 flex items-center justify-center rounded-lg border-2 border-gray-200 dark:border-slate-500 text-gray-500 dark:text-slate-400 hover:border-primary hover:text-primary transition-all"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menú"
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-gray-200 dark:border-slate-500 hover:border-primary transition-all"
            >
              <span className={`block w-4 h-0.5 bg-gray-600 dark:bg-slate-300 transition-all origin-center ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-4 h-0.5 bg-gray-600 dark:bg-slate-300 transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-4 h-0.5 bg-gray-600 dark:bg-slate-300 transition-all origin-center ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-4 space-y-2 animate-fade-in">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'text-primary bg-blue-50 dark:bg-blue-950'
                  : 'text-gray-700 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-700 hover:text-primary'
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/questionnaire"
            onClick={() => setMobileOpen(false)}
            className="block bg-primary text-white px-4 py-3 rounded-xl text-sm font-medium text-center hover:bg-blue-600 transition-colors mt-2"
          >
            Obtener recomendación →
          </Link>
        </div>
      )}
    </nav>
  );
}
