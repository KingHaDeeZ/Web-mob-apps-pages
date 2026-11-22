import { useEffect, useRef, useState } from 'react';
import {
  Activity,
  BarChart3,
  Bell,
  Calendar,
  Check,
  ChevronLeft,
  Home,
  Lock,
  Mail,
  MapPin,
  TrendingUp,
  Users,
  Workflow,
} from 'lucide-react';

const LOOP_SECONDS = 14;
const DEMO_EMAIL = 'hannah@enterprise.com.au';
const DEMO_PASSWORD_LEN = 10;
const LOGICAL_WIDTH = 330;
const LOGICAL_HEIGHT = 610;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function progress(t: number, start: number, end: number): number {
  if (t <= start) return 0;
  if (t >= end) return 1;
  return easeInOutCubic((t - start) / (end - start));
}

export function LoopingIosVideo() {
  const [elapsed, setElapsed] = useState(0);
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Continuous, non-pausing infinite loop via requestAnimationFrame
  useEffect(() => {
    let rafId = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const sec = ((now - startTime) / 1000) % LOOP_SECONDS;
      setElapsed(sec);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Responsive scaling across all breakpoints (320px -> 1440px+)
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const updateScale = () => {
      const w = el.clientWidth;
      if (w > 0) {
        setScale(Math.min(1.12, w / LOGICAL_WIDTH));
      }
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // 14-second seamless iOS sequence:
  // 0.0 - 4.0s : iOS Sign In (full-height screen, zero blank bottom bar)
  // 4.0 - 9.5s : Signed-in shell slides in with Sales & Site Overview + bottom tab bar
  // 9.5 - 13.4s: Field Activity Tracking slides in inside signed-in shell
  // 13.4 - 14.0s: Smooth cross-fade back to Sign In for seamless loop

  const rad = (elapsed / LOOP_SECONDS) * Math.PI * 2;
  const floatY = Math.sin(rad * 2) * 4;
  const tiltY = Math.sin(rad) * 3;
  const tiltX = Math.cos(rad) * 1.6 + 1.2;

  // Phase 1: Sign-in typing & auth states
  const typedEmailCount = Math.floor(
    clamp01((elapsed - 0.35) / 1.45) * DEMO_EMAIL.length
  );
  const typedPassCount = Math.floor(
    clamp01((elapsed - 1.85) / 0.75) * DEMO_PASSWORD_LEN
  );
  const isSigningIn = elapsed >= 2.7 && elapsed < 3.25;
  const isAuthenticated = elapsed >= 3.25 && elapsed < 4.4;
  const buttonPressScale = elapsed >= 2.65 && elapsed <= 2.9 ? 0.95 : 1;

  // Screen slide transitions
  const slideToSignedIn = progress(elapsed, 3.7, 4.35);
  const slideToField = progress(elapsed, 9.1, 9.75);
  const loopFadeOut = progress(elapsed, 13.3, 13.95);
  const loopFadeIn = progress(elapsed, 0.0, 0.35);
  const masterOpacity =
    elapsed >= 13.3 ? 1 - loopFadeOut : elapsed <= 0.35 ? loopFadeIn : 1;

  // Dashboard staggered entrance & scroll
  const dashAge = Math.max(0, elapsed - 4.15);
  const kpiEnter = easeOutCubic(clamp01(dashAge / 0.55));
  const chartEnter = easeOutCubic(clamp01((dashAge - 0.18) / 0.55));
  const teamEnter = easeOutCubic(clamp01((dashAge - 0.36) / 0.55));
  const dashScrollY = progress(elapsed, 6.2, 8.6) * 48;

  // Field activity stagger
  const fieldAge = Math.max(0, elapsed - 9.5);
  const fieldEnter = easeOutCubic(clamp01(fieldAge / 0.6));
  const fieldSynced = elapsed >= 11.2;

  const activeTab: 'Home' | 'Contacts' | 'Sales' | 'Auto' =
    elapsed >= 9.4 ? 'Contacts' : elapsed >= 6.8 ? 'Sales' : 'Home';

  const scaledWidth = Math.round(LOGICAL_WIDTH * scale);
  const scaledHeight = Math.round(LOGICAL_HEIGHT * scale);

  return (
    <div
      ref={hostRef}
      className="relative mx-auto w-full max-w-[368px] flex justify-center select-none pointer-events-none"
      aria-label="Continuous animated preview of a TechStack Sydney iOS mobile app"
    >
      <div
        className="relative"
        style={{
          width: `${scaledWidth}px`,
          height: `${scaledHeight}px`,
          perspective: '1600px',
        }}
      >
        {/* Scaled Logical iPhone Chassis */}
        <div
          className="origin-top-left"
          style={{
            width: `${LOGICAL_WIDTH}px`,
            height: `${LOGICAL_HEIGHT}px`,
            transform: `scale(${scale})`,
            transformStyle: 'preserve-3d',
          }}
        >
          <div
            className="w-full h-full rounded-[46px] border border-[#cbd5e1] dark:border-[#334155] bg-white dark:bg-[#0f172a] p-[10px] shadow-[0_30px_70px_-16px_rgba(13,21,36,0.22)] dark:shadow-[0_32px_76px_-16px_rgba(0,0,0,0.78)]"
            style={{
              transformStyle: 'preserve-3d',
              transform: `translate3d(0px, ${floatY.toFixed(2)}px, 0px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`,
            }}
          >
            {/* Inner iOS Screen */}
            <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[36px] border border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827]">
              {/* iOS Status Bar + Dynamic Island */}
              <div className="relative z-30 flex h-11 shrink-0 items-center justify-between bg-white dark:bg-[#111827] px-5 pt-1.5">
                <span className="text-[11px] font-semibold text-[#0d1524] dark:text-[#f1f5f9] tabular-nums">
                  9:41
                </span>
                <div className="flex h-[22px] w-[84px] items-center justify-end rounded-full bg-[#0d1524] dark:bg-black px-2">
                  <span className="h-2 w-2 rounded-full border border-indigo-400/50 bg-indigo-950" />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex h-2.5 items-end gap-[1.5px]">
                    <span className="h-1 w-[2px] rounded-full bg-[#0d1524] dark:bg-[#f1f5f9]" />
                    <span className="h-1.5 w-[2px] rounded-full bg-[#0d1524] dark:bg-[#f1f5f9]" />
                    <span className="h-2 w-[2px] rounded-full bg-[#0d1524] dark:bg-[#f1f5f9]" />
                    <span className="h-2.5 w-[2px] rounded-full bg-[#0d1524] dark:bg-[#f1f5f9]" />
                  </div>
                  <div className="flex h-2.5 w-4 items-center rounded-[3px] border border-[#0d1524] dark:border-[#f1f5f9] p-[1px]">
                    <div className="h-full w-full rounded-[1px] bg-[#0d1524] dark:bg-[#f1f5f9]" />
                  </div>
                </div>
              </div>

              {/* Animated Screen Viewport (fills full height above home indicator) */}
              <div
                className="relative flex-1 overflow-hidden"
                style={{ opacity: masterOpacity }}
              >
                {/* SCREEN 1: Full-Height iOS Sign In (zero blank bottom menu gap) */}
                <div
                  className="absolute inset-0 flex flex-col justify-between bg-white dark:bg-[#111827] px-5 pt-6 pb-4"
                  style={{
                    transform: `translateX(${(-slideToSignedIn * 100).toFixed(2)}%)`,
                  }}
                >
                  <div className="my-auto">
                    <div className="mb-7 flex flex-col items-center text-center">
                      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] shadow-md">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <rect x="3" y="4" width="18" height="4.5" rx="1.75" fill="#fff" />
                          <rect x="3" y="10" width="14" height="4.5" rx="1.75" fill="#fff" fillOpacity="0.85" />
                          <rect x="3" y="16" width="10" height="4.5" rx="1.75" fill="#fff" fillOpacity="0.7" />
                        </svg>
                      </div>
                      <div className="font-heading text-base font-bold text-[#0d1524] dark:text-[#f1f5f9]">
                        One Workspace
                      </div>
                      <div className="mt-0.5 text-[11.5px] text-[#4b5565] dark:text-[#94a3b8]">
                        Sign in to your mobile app
                      </div>
                    </div>

                    <div className="space-y-3.5">
                      <div>
                        <div className="mb-1 text-[11px] font-medium text-[#475569] dark:text-[#cbd5e1]">
                          Work Email
                        </div>
                        <div className="flex h-10 items-center gap-2 rounded-xl border border-indigo-200 dark:border-indigo-500/40 bg-[#f8f9fb] dark:bg-[#0d1320] px-3 font-mono-code text-[11px] text-[#0d1524] dark:text-[#f1f5f9]">
                          <Mail className="h-3.5 w-3.5 shrink-0 text-[#4f46e5] dark:text-[#818cf8]" />
                          <span className="truncate">
                            {DEMO_EMAIL.slice(0, typedEmailCount)}
                            {elapsed >= 0.35 && elapsed < 1.85 && (
                              <span className="ml-0.5 inline-block h-3.5 w-[1.5px] bg-[#4f46e5] dark:bg-[#818cf8] align-middle" />
                            )}
                          </span>
                        </div>
                      </div>

                      <div>
                        <div className="mb-1 text-[11px] font-medium text-[#475569] dark:text-[#cbd5e1]">
                          Password
                        </div>
                        <div className="flex h-10 items-center gap-2 rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-[#f8f9fb] dark:bg-[#0d1320] px-3 font-mono-code text-xs text-[#0d1524] dark:text-[#f1f5f9]">
                          <Lock className="h-3.5 w-3.5 shrink-0 text-[#64748b] dark:text-[#94a3b8]" />
                          <span className="tracking-widest">
                            {'•'.repeat(typedPassCount)}
                          </span>
                        </div>
                      </div>

                      <div className="pt-2">
                        <div
                          className={`flex h-10 items-center justify-center gap-2 rounded-xl text-xs font-semibold text-white shadow-sm transition-colors duration-200 ${
                            isAuthenticated
                              ? 'bg-emerald-600'
                              : 'bg-gradient-to-r from-[#7c3aed] to-[#4f46e5]'
                          }`}
                          style={{ transform: `scale(${buttonPressScale})` }}
                        >
                          {isAuthenticated ? (
                            <>
                              <Check className="h-4 w-4" />
                              <span>Authenticated</span>
                            </>
                          ) : isSigningIn ? (
                            <span>Signing in...</span>
                          ) : (
                            <span>Sign In</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 text-center font-mono-code text-[10px] text-[#64748b] dark:text-[#94a3b8]">
                    ap-southeast-2 · Sydney &amp; Melbourne SSO
                  </div>
                </div>

                {/* SIGNED-IN APP SHELL (slides in cleanly with its bottom tab bar attached) */}
                <div
                  className="absolute inset-0 flex flex-col bg-[#f8f9fb] dark:bg-[#090d16]"
                  style={{
                    transform: `translateX(${((1 - slideToSignedIn) * 100).toFixed(2)}%)`,
                  }}
                >
                  <div className="relative flex-1 overflow-hidden">
                    {/* SCREEN 2: iOS Sales & Site Overview */}
                    <div
                      className="absolute inset-0 flex flex-col bg-[#f8f9fb] dark:bg-[#090d16]"
                      style={{
                        transform: `translateX(${(-slideToField * 100).toFixed(2)}%)`,
                      }}
                    >
                      <div className="flex shrink-0 items-center justify-between border-b border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <div className="flex h-5 w-5 items-center justify-center rounded bg-gradient-to-br from-[#7c3aed] to-[#4f46e5]">
                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                              <rect x="3" y="4" width="18" height="4.5" rx="1.75" fill="#fff" />
                              <rect x="3" y="10" width="14" height="4.5" rx="1.75" fill="#fff" fillOpacity="0.85" />
                              <rect x="3" y="16" width="10" height="4.5" rx="1.75" fill="#fff" fillOpacity="0.7" />
                            </svg>
                          </div>
                          <span className="font-heading text-xs font-bold text-[#0d1524] dark:text-[#f1f5f9]">
                            One Workspace
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bell className="h-3.5 w-3.5 text-[#64748b] dark:text-[#94a3b8]" />
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-500/25 text-[9px] font-bold text-[#4338ca] dark:text-[#c7d2fe]">
                            HW
                          </div>
                        </div>
                      </div>

                      <div className="flex-1 overflow-hidden px-3.5 pt-3">
                        <div
                          className="space-y-2.5"
                          style={{ transform: `translate3d(0px, -${dashScrollY.toFixed(1)}px, 0px)` }}
                        >
                          <div className="px-0.5">
                            <div className="text-[10px] text-[#64748b] dark:text-[#94a3b8]">
                              Welcome back, Hannah Walsh
                            </div>
                            <div className="font-heading text-sm font-bold text-[#0d1524] dark:text-[#f1f5f9]">
                              Sales &amp; Site Overview
                            </div>
                          </div>

                          <div
                            className="grid grid-cols-2 gap-2"
                            style={{
                              opacity: kpiEnter,
                              transform: `translateY(${((1 - kpiEnter) * 10).toFixed(1)}px)`,
                            }}
                          >
                            <div className="rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] p-3">
                              <div className="text-[10px] text-[#475569] dark:text-[#94a3b8]">
                                New Deals
                              </div>
                              <div className="mt-0.5 text-base font-bold text-[#0d1524] dark:text-[#f1f5f9] tabular-nums font-heading">
                                $31,436
                              </div>
                              <div className="mt-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                +13% YoY
                              </div>
                            </div>

                            <div className="rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] p-3">
                              <div className="text-[10px] text-[#475569] dark:text-[#94a3b8]">
                                Deals Won
                              </div>
                              <div className="mt-0.5 text-base font-bold text-[#0d1524] dark:text-[#f1f5f9] tabular-nums font-heading">
                                $67,877
                              </div>
                              <div className="mt-0.5 text-[10px] font-semibold text-[#4f46e5] dark:text-[#818cf8] tabular-nums">
                                64 Accounts
                              </div>
                            </div>
                          </div>

                          <div
                            className="rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] p-3"
                            style={{
                              opacity: chartEnter,
                              transform: `translateY(${((1 - chartEnter) * 12).toFixed(1)}px)`,
                            }}
                          >
                            <div className="mb-2 flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-[#0d1524] dark:text-[#f1f5f9]">
                                Sales Velocity
                              </span>
                              <span className="font-mono-code text-[10px] font-semibold text-[#4f46e5] dark:text-[#a5b4fc] tabular-nums">
                                May · 190,239
                              </span>
                            </div>
                            <svg viewBox="0 0 220 64" className="h-14 w-full">
                              <defs>
                                <linearGradient id="iosMobGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#6366f1" stopOpacity="0.24" />
                                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01" />
                                </linearGradient>
                              </defs>
                              <path
                                d="M4,52 Q 36,24 68,38 T 134,18 T 216,22 L216,62 L4,62 Z"
                                fill="url(#iosMobGrad)"
                              />
                              <path
                                d="M4,52 Q 36,24 68,38 T 134,18 T 216,22"
                                fill="none"
                                stroke="#6366f1"
                                strokeWidth="2.1"
                                strokeLinecap="round"
                              />
                              <path
                                d="M4,42 Q 40,48 76,26 T 144,32 T 216,14"
                                fill="none"
                                stroke="#38bdf8"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>

                          <div
                            className="space-y-2 rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] p-3"
                            style={{
                              opacity: teamEnter,
                              transform: `translateY(${((1 - teamEnter) * 12).toFixed(1)}px)`,
                            }}
                          >
                            <div className="text-[11px] font-semibold text-[#0d1524] dark:text-[#f1f5f9]">
                              Live Platform &amp; Team
                            </div>
                            <div className="flex items-center justify-between border-b border-[#f1f5f9] dark:border-[#1e293b] py-1 text-[10.5px]">
                              <span className="flex items-center gap-1.5 text-[#334155] dark:text-[#cbd5e1]">
                                <Activity className="h-3 w-3 text-[#4f46e5] dark:text-[#818cf8]" />
                                Sydney Edge SLA
                              </span>
                              <span className="font-mono-code font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                                99.99%
                              </span>
                            </div>
                            <div className="flex items-center justify-between border-b border-[#f1f5f9] dark:border-[#1e293b] py-1 text-[10.5px]">
                              <span className="flex items-center gap-1.5 text-[#334155] dark:text-[#cbd5e1]">
                                <TrendingUp className="h-3 w-3 text-[#7c3aed] dark:text-[#a78bfa]" />
                                Lachlan · Top Rep
                              </span>
                              <span className="font-mono-code font-semibold text-[#0d1524] dark:text-[#f1f5f9] tabular-nums">
                                40,950
                              </span>
                            </div>
                            <div className="flex items-center justify-between pt-0.5 text-[10.5px]">
                              <span className="text-[#475569] dark:text-[#94a3b8]">
                                Chloe · Melbourne Deals
                              </span>
                              <span className="font-mono-code font-semibold text-[#0d1524] dark:text-[#f1f5f9] tabular-nums">
                                30,010
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SCREEN 3: iOS Field Activity Check-In */}
                    <div
                      className="absolute inset-0 flex flex-col bg-[#f8f9fb] dark:bg-[#090d16]"
                      style={{
                        transform: `translateX(${((1 - slideToField) * 100).toFixed(2)}%)`,
                      }}
                    >
                      <div className="flex shrink-0 items-center gap-3 border-b border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] px-4 py-2.5">
                        <ChevronLeft className="h-4 w-4 text-[#64748b] dark:text-[#94a3b8]" />
                        <span className="font-heading text-xs font-bold text-[#0d1524] dark:text-[#f1f5f9]">
                          Field Activity Tracking
                        </span>
                      </div>

                      <div
                        className="flex-1 flex flex-col justify-between p-3.5 text-[11px]"
                        style={{
                          opacity: fieldEnter,
                          transform: `translateY(${((1 - fieldEnter) * 10).toFixed(1)}px)`,
                        }}
                      >
                        <div className="space-y-2.5">
                          <div>
                            <div className="font-medium text-[#475569] dark:text-[#94a3b8]">
                              Account
                            </div>
                            <div className="mt-1 rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] px-3 py-2 font-semibold text-[#0d1524] dark:text-[#f1f5f9]">
                              Hannah Walsh
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5 font-medium text-[#475569] dark:text-[#94a3b8]">
                              <Calendar className="h-3.5 w-3.5" />
                              <span>Activity Date</span>
                            </div>
                            <div className="mt-1 rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] px-3 py-2 font-mono-code text-[11px] text-[#334155] dark:text-[#cbd5e1] tabular-nums">
                              2026-11-21 · 10:30 AM
                            </div>
                          </div>

                          <div>
                            <div className="font-medium text-[#475569] dark:text-[#94a3b8]">
                              Activity Notes
                            </div>
                            <div className="mt-1 flex items-center gap-2 rounded-xl border border-indigo-200 dark:border-indigo-500/40 bg-indigo-50/70 dark:bg-indigo-500/15 px-3 py-2 font-medium text-[#3730a3] dark:text-[#c7d2fe]">
                              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-[#4f46e5] text-[9px] font-bold text-white">
                                AI
                              </span>
                              <span>AI meeting notes captured</span>
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center gap-1.5 font-medium text-[#475569] dark:text-[#94a3b8]">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>Location</span>
                            </div>
                            <div className="mt-1 rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] px-3 py-2 text-[11px] leading-snug text-[#475569] dark:text-[#cbd5e1]">
                              42 Collins St, Level 8, Melbourne VIC 3000
                            </div>
                          </div>
                        </div>

                        <div
                          className={`flex h-9 items-center justify-center gap-2 rounded-xl text-xs font-semibold text-white transition-colors duration-200 ${
                            fieldSynced
                              ? 'bg-emerald-600'
                              : 'bg-gradient-to-r from-[#7c3aed] to-[#4f46e5]'
                          }`}
                        >
                          <Check className="h-4 w-4" />
                          <span>{fieldSynced ? 'Synced to Workspace' : 'Saving Check-In...'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* iOS Bottom Tab Bar (only mounted inside the signed-in shell) */}
                  <div className="grid h-12 shrink-0 grid-cols-4 items-center border-t border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] px-2 text-[9.5px] font-medium">
                    {(
                      [
                        { label: 'Home', Icon: Home },
                        { label: 'Contacts', Icon: Users },
                        { label: 'Sales', Icon: BarChart3 },
                        { label: 'Auto', Icon: Workflow },
                      ] as const
                    ).map(({ label, Icon }) => {
                      const isActive = activeTab === label;
                      return (
                        <div
                          key={label}
                          className={`flex flex-col items-center gap-0.5 ${
                            isActive
                              ? 'font-semibold text-[#4f46e5] dark:text-[#818cf8]'
                              : 'text-[#64748b] dark:text-[#94a3b8]'
                          }`}
                        >
                          <Icon className="h-3.5 w-3.5" />
                          <span>{label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* iOS Home Indicator */}
              <div className="flex h-4 shrink-0 items-center justify-center bg-white dark:bg-[#111827]">
                <div className="h-1 w-24 rounded-full bg-[#0d1524]/75 dark:bg-[#f1f5f9]/70" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
