import { useEffect, useState } from 'react';
import { GetStartedModal } from './components/GetStartedModal';
import { LoopingIosVideo } from './components/LoopingIosVideo';
import { LoopingWorkspaceVideo } from './components/LoopingWorkspaceVideo';
import { AppPage, Navbar } from './components/Navbar';
import { ThemePreference, ThemeSwitcher } from './components/ThemeSwitcher';

function resolveTheme(pref: ThemePreference): 'light' | 'dark' {
  if (pref === 'light' || pref === 'dark') return pref;
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
}

function getInitialPage(): AppPage {
  if (typeof window === 'undefined') return 'web-apps';
  const hash = window.location.hash.toLowerCase();
  const path = window.location.pathname.toLowerCase();
  if (hash === '#mobile-apps' || path.includes('mobile-apps')) {
    return 'mobile-apps';
  }
  return 'web-apps';
}

export default function App() {
  const [activePage, setActivePage] = useState<AppPage>(getInitialPage);

  const [themePref, setThemePref] = useState<ThemePreference>(() => {
    try {
      const stored = localStorage.getItem('tss-theme-pref');
      if (stored === 'light' || stored === 'dark' || stored === 'device') return stored;
    } catch {
      // Ignore storage access errors
    }
    return 'device';
  });

  const [modalOpen, setModalOpen] = useState(false);

  const handleNavigatePage = (page: AppPage) => {
    setActivePage(page);
    const nextHash = page === 'mobile-apps' ? '#mobile-apps' : '#web-apps';
    if (window.location.hash !== nextHash) {
      window.history.pushState({ page }, '', nextHash);
    }
  };

  useEffect(() => {
    const onPopState = () => {
      setActivePage(getInitialPage());
    };
    window.addEventListener('popstate', onPopState);
    window.addEventListener('hashchange', onPopState);
    return () => {
      window.removeEventListener('popstate', onPopState);
      window.removeEventListener('hashchange', onPopState);
    };
  }, []);

  useEffect(() => {
    document.title =
      activePage === 'mobile-apps'
        ? 'TechStack Sydney — Mobile Apps | One Workspace Instead'
        : 'TechStack Sydney — Web Apps | One Workspace Instead';
  }, [activePage]);

  useEffect(() => {
    const apply = (pref: ThemePreference) => {
      const resolved = resolveTheme(pref);
      document.documentElement.setAttribute('data-theme-pref', pref);
      document.documentElement.setAttribute('data-theme', resolved);
      document.documentElement.classList.toggle('dark', resolved === 'dark');
    };

    apply(themePref);
    try {
      localStorage.setItem('tss-theme-pref', themePref);
    } catch {
      // Ignore storage access errors
    }

    if (themePref !== 'device' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => apply('device');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [themePref]);

  const isMobilePage = activePage === 'mobile-apps';

  return (
    <div className="min-h-screen bg-[#f8f9fb] dark:bg-[#090d16] text-[#0d1524] dark:text-[#f1f5f9] flex flex-col">
      <Navbar
        activePage={activePage}
        onNavigatePage={handleNavigatePage}
        onOpenGetStarted={() => setModalOpen(true)}
      />

      <main className="flex-1">
        {/* Hero Section matching TechStack Sydney Home Hero Color Scheme */}
        <section id="top" className="relative overflow-hidden">
          <div className="tss-hero-backdrop relative pt-24 sm:pt-28 pb-20 sm:pb-24">
            {/* Subtle Radial Dot Grid on Outer Edges */}
            <div className="tss-hero-dots pointer-events-none absolute inset-0" aria-hidden="true" />

            {/* Bottom Canvas Blend */}
            <div
              className="tss-hero-bottom-fade pointer-events-none absolute inset-x-0 bottom-0 h-28 sm:h-36 z-10"
              aria-hidden="true"
            />

            <div className="relative z-20 mx-auto w-full max-w-[1240px] px-4 sm:px-6">
              {/* Theme Switcher Bar */}
              <div className="flex justify-center sm:justify-end mb-6 sm:mb-8">
                <ThemeSwitcher preference={themePref} onChange={setThemePref} />
              </div>

              {/* Hero Copy Block */}
              <header className="mx-auto max-w-[50rem] text-center">
                <p className="text-[13px] font-medium tracking-[0.025em] text-[#4b5565] dark:text-[#cbd5e1]">
                  {isMobilePage
                    ? 'Mobile Apps · Custom iOS & Android'
                    : 'Web Apps · Custom Business Workspaces'}
                </p>

                {/* Signature 5-Segment TechStack Sydney Spectrum */}
                <div className="my-3 mb-5 flex justify-center gap-1" aria-hidden="true">
                  <span className="h-[3px] w-4 rounded-full bg-[var(--hero-rose)]" />
                  <span className="h-[3px] w-4 rounded-full bg-[var(--hero-amber)]" />
                  <span className="h-[3px] w-4 rounded-full bg-[var(--hero-yellow)]" />
                  <span className="h-[3px] w-4 rounded-full bg-[var(--hero-mint)]" />
                  <span className="h-[3px] w-4 rounded-full bg-[var(--hero-blue)]" />
                </div>

                <h1 className="font-heading text-[clamp(2.1rem,5.4vw,4.15rem)] font-bold leading-[1.07] tracking-[-0.045em] text-[#0d1524] dark:text-[#f1f5f9] [text-wrap:balance]">
                  {isMobilePage ? (
                    <>
                      <span className="tss-headline-accent">One app</span>. Not Five.
                    </>
                  ) : (
                    <>
                      <span className="tss-headline-accent">One Workspace</span>. All of your tools.
                    </>
                  )}
                </h1>

                <p className="mx-auto mt-5 max-w-[40rem] text-base sm:text-lg font-medium leading-relaxed tracking-[-0.01em] text-[#4b5565] dark:text-[#cbd5e1]">
                  {isMobilePage ? 'Build whatever you need.' : 'Stunning. Functional. Full Stack.'}
                </p>

                <div className="mt-8 mb-3 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setModalOpen(true)}
                    className="tss-hero-glass-cta w-full sm:w-auto"
                  >
                    Start the conversation
                  </button>
                </div>
                <p className="text-xs text-[#475569] dark:text-[#94a3b8]">5-min phone call</p>
              </header>

              {/* Continuous, Transparent-Background, Fast-Loading Looping App Showcase */}
              <div className="mt-10 sm:mt-14">
                {isMobilePage ? <LoopingIosVideo /> : <LoopingWorkspaceVideo />}
              </div>
            </div>
          </div>

          {/* Signature Curved Portal Bridge Seam (matches Home Hero) */}
          <div className="tss-portal-bridge" aria-hidden="true">
            <div className="tss-bridge-mist" />
            <svg
              className="tss-bridge-arc"
              viewBox="0 0 1440 88"
              preserveAspectRatio="none"
              focusable="false"
            >
              <defs>
                <linearGradient id="tss-seam-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--accent-indigo)" stopOpacity="0" />
                  <stop offset="22%" stopColor="var(--hero-rose)" stopOpacity="0.45" />
                  <stop offset="40%" stopColor="var(--hero-amber)" stopOpacity="0.48" />
                  <stop offset="50%" stopColor="var(--accent-violet-soft)" stopOpacity="0.9" />
                  <stop offset="65%" stopColor="var(--hero-mint)" stopOpacity="0.48" />
                  <stop offset="82%" stopColor="var(--hero-blue)" stopOpacity="0.52" />
                  <stop offset="100%" stopColor="var(--accent-indigo)" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path className="tss-bridge-fill" d="M0,12 Q720,82 1440,12 L1440,88 L0,88 Z" />
              <path className="tss-bridge-stroke-glow" d="M0,12 Q720,82 1440,12" />
              <path className="tss-bridge-stroke" d="M0,12 Q720,82 1440,12" />
            </svg>
          </div>
        </section>

        {/* Grounded Capabilities Strip below Hero */}
        <section
          id="capabilities"
          className="mx-auto w-full max-w-[1240px] px-4 sm:px-6 py-16 sm:py-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] p-6 sm:p-7">
              <p className="font-mono-code text-xs font-medium text-[#4f46e5] dark:text-[#818cf8]">
                01. Unified Operations
              </p>
              <h2 className="mt-2 text-lg font-bold tracking-tight text-[#0d1524] dark:text-[#f1f5f9] font-heading">
                Built around how your business runs
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#4b5565] dark:text-[#cbd5e1]">
                Replace disconnected spreadsheets, booking links, and SaaS add-ons with one shared system tailored to your team.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] p-6 sm:p-7">
              <p className="font-mono-code text-xs font-medium text-[#4f46e5] dark:text-[#818cf8]">
                02. Cross-Device Speed
              </p>
              <h2 className="mt-2 text-lg font-bold tracking-tight text-[#0d1524] dark:text-[#f1f5f9] font-heading">
                Web and mobile from a single codebase
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#4b5565] dark:text-[#cbd5e1]">
                Office staff manage pipelines on desktop while field crews and clients check in cleanly from iOS and Android.
              </p>
            </div>

            <div className="rounded-2xl border border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] p-6 sm:p-7">
              <p className="font-mono-code text-xs font-medium text-[#4f46e5] dark:text-[#818cf8]">
                03. Full-Stack Ownership
              </p>
              <h2 className="mt-2 text-lg font-bold tracking-tight text-[#0d1524] dark:text-[#f1f5f9] font-heading">
                No more half-used per-seat plans
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-[#4b5565] dark:text-[#cbd5e1]">
                Database, authentication, automations, and UI engineered together so every feature you pay for gets used daily.
              </p>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e4e8ef] dark:border-[#1e293b] bg-white/60 dark:bg-[#0d1320]/60">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-6 text-xs text-[#475569] dark:text-[#94a3b8]">
          <span>TechStack Sydney · Custom Web &amp; Mobile Software</span>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="font-semibold text-[#0d1524] dark:text-[#f1f5f9] hover:text-[#4f46e5] dark:hover:text-[#818cf8] transition-colors cursor-pointer"
          >
            Start a project conversation
          </button>
        </div>
      </footer>

      <GetStartedModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
