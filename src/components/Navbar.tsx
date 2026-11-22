import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export type AppPage = 'web-apps' | 'mobile-apps';

interface NavbarProps {
  activePage: AppPage;
  onNavigatePage: (page: AppPage) => void;
  onOpenGetStarted: () => void;
}

const NAV_ITEMS: Array<
  | { label: string; type: 'anchor'; href: string }
  | { label: string; type: 'page'; page: AppPage }
> = [
  { label: 'Websites', type: 'anchor', href: '#capabilities' },
  { label: 'Automations', type: 'anchor', href: '#capabilities' },
  { label: 'Web Apps', type: 'page', page: 'web-apps' },
  { label: 'Mobile Apps', type: 'page', page: 'mobile-apps' },
];

export function Navbar({ activePage, onNavigatePage, onOpenGetStarted }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handlePageSelect = (page: AppPage) => {
    onNavigatePage(page);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 pointer-events-none">
      <div className="mx-auto flex h-full w-[min(1240px,calc(100%-24px))] items-center justify-between gap-4 md:gap-8 rounded-b-[18px] border border-t-0 border-[#e4e8ef] dark:border-[#1e293b] bg-white/88 dark:bg-[#090d16]/86 px-4 sm:px-6 backdrop-blur-md shadow-[0_10px_28px_-14px_rgba(13,21,36,0.12)] dark:shadow-[0_14px_32px_-14px_rgba(0,0,0,0.56)] pointer-events-auto transition-colors duration-200">
        {/* Zone 1: Single-line Brand Wordmark */}
        <button
          type="button"
          onClick={() => handlePageSelect('web-apps')}
          className="inline-flex items-center gap-2.5 text-[1.0625rem] font-bold tracking-[-0.03em] text-[#0d1524] dark:text-[#f1f5f9] whitespace-nowrap shrink-0 font-heading cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400 rounded-md"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect x="3" y="4" width="18" height="4.5" rx="2" fill="#7c3aed" />
            <rect x="3" y="10" width="14" height="4.5" rx="2" fill="#4f46e5" />
            <rect x="3" y="16" width="10" height="4.5" rx="2" fill="#39a6de" />
          </svg>
          <span>TechStack Sydney</span>
        </button>

        {/* Zone 2: Concise single-line nav links */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-4 lg:gap-7 text-sm font-medium text-[#4b5565] dark:text-[#cbd5e1]"
        >
          {NAV_ITEMS.map((item) => {
            if (item.type === 'anchor') {
              return (
                <a
                  key={item.label}
                  href={item.href}
                  className="relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-[#0d1524] dark:hover:text-white after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:origin-center after:scale-x-0 after:bg-indigo-600 dark:after:bg-indigo-400 after:transition-transform after:duration-200 hover:after:scale-x-100 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400 rounded-sm"
                >
                  {item.label}
                </a>
              );
            }

            const isActive = activePage === item.page;
            return (
              <button
                key={item.label}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => handlePageSelect(item.page)}
                className={`relative py-1 whitespace-nowrap shrink-0 cursor-pointer transition-colors duration-150 after:absolute after:inset-x-0 after:bottom-0 after:h-[1.5px] after:origin-center after:bg-indigo-600 dark:after:bg-indigo-400 after:transition-transform after:duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400 rounded-sm ${
                  isActive
                    ? 'text-[#0d1524] dark:text-white font-semibold after:scale-x-100'
                    : 'hover:text-[#0d1524] dark:hover:text-white after:scale-x-0 hover:after:scale-x-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action + mobile drawer trigger */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenGetStarted}
            className="hidden sm:inline-flex min-h-[40px] items-center justify-center rounded-full bg-[#0d1524] dark:bg-[#f1f5f9] px-4 py-2 text-[13px] font-semibold text-white dark:text-[#090d16] whitespace-nowrap shrink-0 cursor-pointer transition-all duration-150 hover:bg-[#19263f] dark:hover:bg-white hover:-translate-y-px shadow-[0_2px_6px_rgba(13,21,36,0.14)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400"
          >
            Start the conversation
          </button>

          <button
            type="button"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex md:hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-[#e4e8ef] dark:border-[#1e293b] bg-[#f8f9fb] dark:bg-[#111827] text-[#0d1524] dark:text-[#f1f5f9] cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile slide-down drawer */}
      {mobileMenuOpen && (
        <div className="mx-auto mt-2 w-[min(1240px,calc(100%-24px))] rounded-2xl border border-[#e4e8ef] dark:border-[#1e293b] bg-white/95 dark:bg-[#0d1320]/95 p-4 backdrop-blur-lg shadow-xl pointer-events-auto md:hidden">
          <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
              if (item.type === 'anchor') {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex min-h-[44px] items-center rounded-xl px-3.5 text-sm font-medium text-[#0d1524] dark:text-[#f1f5f9] hover:bg-[#f3f5fa] dark:hover:bg-[#162033] transition-colors"
                  >
                    {item.label}
                  </a>
                );
              }
              const isActive = activePage === item.page;
              return (
                <button
                  key={item.label}
                  type="button"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => handlePageSelect(item.page)}
                  className={`flex min-h-[44px] w-full items-center rounded-xl px-3.5 text-left text-sm transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#eef2ff] dark:bg-indigo-500/20 font-semibold text-[#4338ca] dark:text-[#a5b4fc]'
                      : 'font-medium text-[#0d1524] dark:text-[#f1f5f9] hover:bg-[#f3f5fa] dark:hover:bg-[#162033]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>
          <div className="mt-3 border-t border-[#e4e8ef] dark:border-[#1e293b] pt-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenGetStarted();
              }}
              className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-[#0d1524] dark:bg-[#f1f5f9] px-4 py-2.5 text-sm font-semibold text-white dark:text-[#090d16] cursor-pointer"
            >
              Start the conversation
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
