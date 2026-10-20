import { useEffect, useRef, useState } from "react";

import {
  BarChart2,
  Moon,
  Palette,
  Settings,
  Sun,
  Users,
  Store,
  Sparkles,
  Search,
} from "lucide-react";
import { useAI } from "../context/AIContext";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

import { useThemeContext } from "../context/ThemeContext";
import { useChannel } from "../context/ChannelContext";
import { StoreAppearanceModal } from "./StoreAppearanceModal";
import { ChannelSelectionModal } from "./ChannelSelectionModal";
import { DobehaLogo } from "./common/DobehaLogo";
import LanguageSwitcher from "./LanguageSwitcher";
import NotificationDropdown from "./NotificationDropdown";
import ProfileMenu from "./ProfileMenu";

interface NavbarProps {
  onAddProduct: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  onOpenCommandPalette?: () => void;
}

const Navbar = ({ darkMode, toggleDarkMode, onOpenCommandPalette }: NavbarProps) => {
  const { t } = useTranslation();
  const { themePreset } = useThemeContext();
  const { channels, activeChannel } = useChannel();
  const { setIsOpen: setIsAIOpen } = useAI();
  const [appearanceOpen, setAppearanceOpen] = useState(false);
  const [channelModalOpen, setChannelModalOpen] = useState(false);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const isUsersPage = location.pathname === "/users" || location.pathname === "/customers";
  const isSettingsPage = location.pathname === "/settings";
  const isProductsPage = location.pathname === "/";

  // Close mobile menu on Escape key press
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mobileMenuOpen]);


  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md transition-colors duration-300 dark:border-zinc-800 dark:bg-zinc-900/90">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-3 py-2.5 sm:py-3 md:px-4 lg:px-6">
        {/* 1. Logo & Mobile Toggle */}
        <div className="flex items-center gap-x-2 sm:gap-x-3">
         

          <Link to="/" className="group flex items-center gap-x-2 sm:gap-x-3">
            <DobehaLogo size="sm" />
            <span className="ms-1 hidden rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 text-[10px] font-semibold text-zinc-600 lg:inline-block dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400">
              {t("common.version", "v2.4")}
            </span>
          </Link>
        </div>

        {/* 2. Desktop & Tablet Navigation */}
        <nav className="hidden items-center gap-x-0.5 rounded-xl border border-zinc-200/60 bg-zinc-100/80 p-1 text-xs font-medium md:flex lg:gap-x-1 dark:border-zinc-800 dark:bg-zinc-800/60">
          <Link
            to="/"
            title={t("nav.productsAnalytics", "Products & Analytics")}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg p-2 transition-all xl:gap-2 xl:px-3.5 xl:py-1.5 ${
              isProductsPage
                ? "bg-white font-semibold text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            <BarChart2 className="h-4 w-4 shrink-0 xl:h-3.5 xl:w-3.5" />
            <span className="hidden lg:inline">
              {t("nav.productsAnalytics", "Products & Analytics")}
            </span>
          </Link>

          <Link
            to="/customers"
            title={t("nav.usersManagement", "Clientes & Usuarios")}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg p-2 transition-all xl:gap-2 xl:px-3.5 xl:py-1.5 ${
              isUsersPage
                ? "bg-white font-semibold text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            <Users className="h-4 w-4 shrink-0 xl:h-3.5 xl:w-3.5" />
            <span className="hidden lg:inline">
              {t("nav.usersManagement", "Clientes")}
            </span>
          </Link>

          <Link
            to="/settings"
            title={t("nav.settings", "Settings")}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg p-2 transition-all xl:gap-2 xl:px-3.5 xl:py-1.5 ${
              isSettingsPage
                ? "bg-white font-semibold text-zinc-900 shadow-xs dark:bg-zinc-900 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            }`}
          >
            <Settings className="h-4 w-4 shrink-0 xl:h-3.5 xl:w-3.5" />
            <span className="hidden lg:inline">
              {t("nav.settings", "Settings")}
            </span>
          </Link>
        </nav>

        {/* 3. Actions: [ Quick Command Search ] [ Channel Selector ] [ Store Identity ] [ Language Switcher ] [ Notifications ] [ Theme Toggle ] [ Profile Menu ] */}
        <div className="flex items-center gap-x-1.5 lg:gap-x-2">
          {/* Quick Search / Command Palette (Ctrl+K) */}
          <button
            type="button"
            onClick={() => onOpenCommandPalette?.()}
            className="flex h-8 sm:h-9 items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-2 sm:px-2.5 text-xs text-zinc-500 transition hover:bg-zinc-100 hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-750 cursor-pointer shadow-xs"
            title="Buscar o comandos rápidos (Ctrl + K)"
          >
            <Search className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <span className="hidden xl:inline text-[11px] text-zinc-500 dark:text-zinc-400">Buscar...</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-zinc-200 bg-white px-1.5 py-0.2 text-[9px] font-mono text-zinc-400 dark:border-zinc-700 dark:bg-zinc-900">
              ⌘K
            </kbd>
          </button>

          {/* Channel Selector / Store Switcher Button */}
          {channels.length > 0 && (
            <button
              type="button"
              onClick={() => setChannelModalOpen(true)}
              className="flex h-8 sm:h-9 items-center gap-1.5 sm:gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-2 sm:px-2.5 text-xs font-semibold text-zinc-700 transition hover:bg-zinc-100 hover:border-sky-300 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-750 cursor-pointer shadow-xs"
              title="Cambiar Tienda / Administrar Canales"
            >
              <div
                className="h-2.5 w-2.5 rounded-full shrink-0 shadow-xs"
                style={{ backgroundColor: activeChannel?.customFields?.brandColor || '#0ea5e9' }}
              />
              <span className="max-w-[100px] sm:max-w-[150px] truncate font-bold">
                {activeChannel?.customFields?.displayName || activeChannel?.code || 'Mi Tienda'}
              </span>
              <Store className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            </button>
          )}

          {/* Store Appearance Button */}
          <button
            type="button"
            onClick={() => setAppearanceOpen(true)}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition hover:bg-zinc-100 sm:h-9 sm:w-9 dark:border-zinc-700 dark:bg-zinc-800 dark:text-sky-400 dark:hover:bg-zinc-700"
            title="Personalizar Identidad de Tienda"
          >
            <Palette className="h-4 w-4" />
          </button>

          {/* AI Assistant Chat Button */}
          <button
            type="button"
            onClick={() => setIsAIOpen(true)}
            className="flex h-8 sm:h-9 cursor-pointer items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-2.5 text-xs font-bold text-indigo-600 transition hover:bg-indigo-100 hover:border-indigo-300 dark:border-indigo-900/60 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 shadow-xs"
            title="Abrir Chat IA (Asistente Inteligente Gemini)"
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
            <span className="hidden sm:inline">Chat IA</span>
          </button>

          {/* Language Switcher */}
          <LanguageSwitcher />

          {/* Notifications Dropdown */}
          <NotificationDropdown />

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-zinc-50 text-zinc-700 transition-all duration-200 hover:bg-zinc-100 sm:h-9 sm:w-9 dark:border-zinc-700 dark:bg-zinc-800 dark:text-amber-400 dark:hover:bg-zinc-700"
            aria-label={t("nav.toggleTheme", "Toggle Dark Mode")}
            title={
              darkMode
                ? t("nav.switchLight", "Switch to Light Mode")
                : t("nav.switchDark", "Switch to Dark Mode")
            }
          >
            {darkMode ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform duration-200 hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-zinc-600 transition-transform duration-200 hover:-rotate-12 dark:text-zinc-300" />
            )}
          </button>

          {/* Profile Menu Dropdown */}
          <ProfileMenu />
        </div>
      </div>

      {/* Mobile Navigation Drawer Dropdown */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="animate-in fade-in slide-in-from-top-2 border-b border-zinc-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md md:hidden dark:border-zinc-800 dark:bg-zinc-900/95"
        >
          <nav className="flex flex-col gap-1.5 text-sm font-medium">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors ${
                isProductsPage
                  ? `${themePreset.badgeBg} font-semibold ${themePreset.text}`
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <BarChart2 className="h-4.5 w-4.5" />
                <span>{t("nav.productsAnalytics", "Products & Analytics")}</span>
              </div>
            </Link>

            <Link
              to="/customers"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors ${
                isUsersPage
                  ? `${themePreset.badgeBg} font-semibold ${themePreset.text}`
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="h-4.5 w-4.5" />
                <span>{t("nav.usersManagement", "Clientes")}</span>
              </div>
            </Link>

            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors ${
                isSettingsPage
                  ? `${themePreset.badgeBg} font-semibold ${themePreset.text}`
                  : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
              }`}
            >
              <div className="flex items-center gap-3">
                <Settings className="h-4.5 w-4.5" />
                <span>{t("nav.settings", "Settings")}</span>
              </div>
            </Link>
          </nav>
        </div>
      )}

      {/* Modal de Personalización de Identidad de Tienda */}
      <StoreAppearanceModal
        isOpen={appearanceOpen}
        onClose={() => setAppearanceOpen(false)}
      />

      {/* Modal de Selección y Administración de Tiendas / Canales */}
      <ChannelSelectionModal
        isOpen={channelModalOpen}
        onClose={() => setChannelModalOpen(false)}
      />
    </header>
  );
};

export default Navbar;
