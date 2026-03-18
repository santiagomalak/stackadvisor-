'use client';

import Link from 'next/link';
import Image from 'next/image';
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
    { href: '/blueprint', label: '🏗️ Blueprint' },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <nav className="bg-slate-900 border-b border-slate-700 sticky top-0 z-50 shadow-sm transition-colors">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center group" onClick={() => setMobileOpen(false)}>
            <Image
              src="/logo.png"
              alt="StackAdvisor"
              width={180}
              height={44}
              className="h-9 w-auto object-contain group-hover:opacity-90 transition-opacity"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-2">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium px-3 py-2 rounded-lg transition-colors ${
                  isActive(href)
                    ? 'text-white bg-white/15'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {label}
              </Link>
            ))}

            <button
              onClick={toggle}
              aria-label="Cambiar tema"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-600 text-slate-300 hover:border-primary hover:text-primary transition-all"
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
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-slate-600 text-slate-300 hover:border-primary hover:text-primary transition-all"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menú"
              className="w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg border border-slate-600 hover:border-primary transition-all"
            >
              <span className={`block w-4 h-0.5 bg-slate-300 transition-all origin-center ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-4 h-0.5 bg-slate-300 transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`block w-4 h-0.5 bg-slate-300 transition-all origin-center ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-slate-700 bg-slate-900 px-4 py-4 space-y-2 animate-fade-in">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                isActive(href)
                  ? 'text-white bg-white/15'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
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
