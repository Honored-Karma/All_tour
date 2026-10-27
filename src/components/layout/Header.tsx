import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, ChevronDown, Heart, Sparkles } from "lucide-react";
import type { Dictionary } from "../../i18n/ru";
import type { Locale } from "../../lib/whatsapp";
import { BrandLogo } from "./BrandLogo";
import { destinations } from "../../data/destinations";
import { CurrencySwitcher } from "../common/CurrencySwitcher";

interface HeaderProps {
  dict: Dictionary;
  locale: Locale;
  onToggleLocale: (next: Locale) => void;
  favoritesCount?: number;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  dict,
  locale,
  onToggleLocale,
  favoritesCount = 0,
  onOpenMobileMenu,
}) => {
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // Close dropdown on outside click or route change
  useEffect(() => {
    setDestDropdownOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDestDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  return (
    <header className="fixed top-0 inset-x-0 z-40 px-3 sm:px-6 pt-2 sm:pt-3 pointer-events-none">
      <div className="max-w-7xl mx-auto pointer-events-auto liquid-glass-nav rounded-2xl px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-4">
        {/* Zone 1: Official Brand Logo with light surface capsule */}
        <BrandLogo variant="header" className="shrink-0 whitespace-nowrap" />

        {/* Zone 2: Navigation Links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden xl:flex items-center gap-5 text-sm font-medium text-muted"
        >
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `relative py-1 transition-colors hover:text-ink ${
                isActive ? "text-ink font-semibold" : "text-muted"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {dict.nav.home}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[2px] bg-accent rounded-full" />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/tours"
            className={({ isActive }) =>
              `relative py-1 transition-colors hover:text-ink ${
                isActive ? "text-ink font-semibold" : "text-muted"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {dict.nav.tours}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[2px] bg-accent rounded-full" />
                )}
              </>
            )}
          </NavLink>

          {/* Destinations Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDestDropdownOpen((v) => !v)}
              className={`flex items-center gap-1.5 py-1 transition-colors hover:text-ink cursor-pointer ${
                location.pathname.startsWith("/destinations")
                  ? "text-ink font-semibold"
                  : "text-muted"
              }`}
            >
              <span>{dict.nav.destinations}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  destDropdownOpen ? "rotate-180" : ""
                }`}
              />
              {location.pathname.startsWith("/destinations") && (
                <span className="absolute bottom-0 inset-x-0 h-[2px] bg-accent rounded-full" />
              )}
            </button>

            {destDropdownOpen && (
              <div className="absolute top-full left-0 mt-3 w-64 rounded-2xl bg-surface/95 border border-line p-2 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 z-50">
                <div className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-muted">
                  {dict.nav.selectDestination}
                </div>
                {destinations.map((dest) => (
                  <Link
                    key={dest.id}
                    to={`/destinations/${dest.id}`}
                    onClick={() => setDestDropdownOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-hover transition-colors group"
                  >
                    <div>
                      <div className="text-sm font-semibold text-ink group-hover:text-accent transition-colors">
                        {dest.name[locale]}
                      </div>
                      <div className="text-[11px] text-muted line-clamp-1">
                        {dest.tagline[locale]}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface-soft text-muted">
                      {dest.indexLabel}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <NavLink
            to="/about"
            className={({ isActive }) =>
              `relative py-1 transition-colors hover:text-ink ${
                isActive ? "text-ink font-semibold" : "text-muted"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {dict.nav.about}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[2px] bg-accent rounded-full" />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/reviews"
            className={({ isActive }) =>
              `relative py-1 transition-colors hover:text-ink ${
                isActive ? "text-ink font-semibold" : "text-muted"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {dict.nav.reviews}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[2px] bg-accent rounded-full" />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/faq"
            className={({ isActive }) =>
              `relative py-1 transition-colors hover:text-ink ${
                isActive ? "text-ink font-semibold" : "text-muted"
              }`
            }
          >
            {({ isActive }) => (
              <>
                FAQ
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[2px] bg-accent rounded-full" />
                )}
              </>
            )}
          </NavLink>

          <NavLink
            to="/contacts"
            className={({ isActive }) =>
              `relative py-1 transition-colors hover:text-ink ${
                isActive ? "text-ink font-semibold" : "text-muted"
              }`
            }
          >
            {({ isActive }) => (
              <>
                {dict.nav.contacts}
                {isActive && (
                  <span className="absolute bottom-0 inset-x-0 h-[2px] bg-accent rounded-full" />
                )}
              </>
            )}
          </NavLink>
        </nav>

        {/* Zone 3: Actions (Favorites, Currency switch, Lang switch, CTA, Mobile Menu) */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Currency Switcher */}
          <CurrencySwitcher locale={locale} variant="header" className="hidden sm:block" />

          {/* Favorites Link */}
          <Link
            to="/tours?favorites=true"
            aria-label={dict.nav.favoritesAria}
            className="hidden sm:block relative p-2 rounded-xl bg-surface-soft hover:bg-surface-hover text-ink transition-colors"
          >
            <Heart
              className={`w-4 h-4 ${
                favoritesCount > 0 ? "fill-accent text-accent" : "text-muted"
              }`}
            />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent text-[10px] font-bold text-on-accent flex items-center justify-center animate-in zoom-in">
                {favoritesCount}
              </span>
            )}
          </Link>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => onToggleLocale(locale === "ru" ? "kz" : "ru")}
            aria-label={dict.nav.langSwitchAria}
            className="text-xs font-mono tracking-wider text-muted hover:text-ink transition-colors px-2 py-1.5 rounded-lg bg-surface-soft hover:bg-surface-hover cursor-pointer"
          >
            <span className={locale === "ru" ? "text-ink font-bold" : "opacity-50"}>
              RU
            </span>
            <span className="mx-1 opacity-30">/</span>
            <span className={locale === "kz" ? "text-ink font-bold" : "opacity-50"}>
              KZ
            </span>
          </button>

          {/* Primary CTA */}
          <Link
            to="/tours#tour-planner"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent hover:bg-accent-hover text-on-accent text-xs sm:text-sm font-semibold transition-all shadow-md shadow-accent/10 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{dict.nav.cta}</span>
          </Link>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label={dict.nav.mobileMenuOpen}
            className="xl:hidden inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-surface-soft hover:bg-surface-hover text-ink transition-colors cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};
