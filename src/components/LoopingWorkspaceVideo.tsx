import { useEffect, useRef, useState } from 'react';
import {
  Bell,
  Calendar,
  Check,
  ChevronLeft,
  Compass,
  GitBranch,
  Home,
  LayoutDashboard,
  MapPin,
  Send,
  Users,
  Workflow,
  Zap,
} from 'lucide-react';

const LOOP_SECONDS = 16;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function rangeProgress(t: number, start: number, end: number): number {
  if (t <= start) return 0;
  if (t >= end) return 1;
  return easeInOutCubic((t - start) / (end - start));
}

function windowEnvelope(t: number, fadeInStart: number, fadeInEnd: number, fadeOutStart: number, fadeOutEnd: number): number {
  if (t < fadeInStart || t > fadeOutEnd) return 0;
  if (t < fadeInEnd) return rangeProgress(t, fadeInStart, fadeInEnd);
  if (t > fadeOutStart) return 1 - rangeProgress(t, fadeOutStart, fadeOutEnd);
  return 1;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const RADAR_AXES = [
  'Pipeline',
  'Response',
  'Delivery',
  'Retention',
  'Billing',
  'Dispatch',
  'Portal',
  'Sync',
];

function polarPoint(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function buildPolygon(cx: number, cy: number, r: number, values: number[], scale: number): string {
  return values
    .map((v, i) => {
      const p = polarPoint(cx, cy, r * v * scale, (i * 360) / values.length);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(' ');
}

const TEAM_RANKING = [
  { rank: 3, name: 'Liam', initials: 'LM', lightBg: '#e0e7ff', lightFg: '#3730a3' },
  { rank: 4, name: 'Charlotte', initials: 'CH', lightBg: '#dcfce7', lightFg: '#166534' },
  { rank: 5, name: 'Jack', initials: 'JK', lightBg: '#fef3c7', lightFg: '#92400e' },
  { rank: 6, name: 'Olivia', initials: 'OL', lightBg: '#fce7f3', lightFg: '#9d174d' },
];

type NavTab = 'Home' | 'Contacts' | 'Dashboard' | 'Automations';

export function LoopingWorkspaceVideo() {
  const [elapsed, setElapsed] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  // Continuous, non-pausing loop via requestAnimationFrame
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

  // Responsive scaling for desktop/tablet 3D stage (1040px logical width)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      if (w > 0) setScale(Math.min(1, w / 1040));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Phase calculations (16s seamless cycle):
  // 0.0 - 4.0s: Unified Workspace Dashboard (KPIs + Spline Chart + Radar)
  // 4.0 - 8.0s: Live Automations & Direct Engineering Dispatch
  // 8.0 - 12.0s: Cross-Device Mobile Field App & Client Sign-Off
  // 12.0 - 16.0s: Client Portal & Melbourne HQ Map -> Smooth reset to 0s
  const phaseIndex = elapsed < 4 ? 0 : elapsed < 8 ? 1 : elapsed < 12 ? 2 : 3;
  const activeNav: NavTab =
    phaseIndex === 0 ? 'Dashboard' : phaseIndex === 1 ? 'Automations' : phaseIndex === 2 ? 'Contacts' : 'Home';

  // Seamless periodic camera tilt (sinusoidal so t=0 and t=16 match identically)
  const rad = (elapsed / LOOP_SECONDS) * Math.PI * 2;
  const rotY = Math.sin(rad) * 4.5 - 2;
  const rotX = Math.cos(rad) * 2.2 + 2.5;
  const floatY = Math.sin(rad * 2) * 5;

  // Animated numbers & chart sweep
  const kpiRamp = clamp01(0.35 + 0.65 * Math.sin(rad * 0.5 + 0.35));
  const wonRevenue = Math.round(67877 * (0.72 + 0.28 * kpiRamp)).toLocaleString('en-US');
  const newDeals = Math.round(31436 * (0.7 + 0.3 * kpiRamp)).toLocaleString('en-US');
  const totalClients = Math.round(52 + 12 * kpiRamp);
  const radarScale = 0.78 + 0.22 * (0.5 + 0.5 * Math.sin(rad));

  // Overlay card envelopes
  const supportCardOp = windowEnvelope(elapsed, 3.6, 4.3, 7.6, 8.2);
  const phoneCardOp = windowEnvelope(elapsed, 7.4, 8.2, 12.6, 13.4);
  const portalCardOp = windowEnvelope(elapsed, 11.4, 12.2, 15.2, 15.9);
  const emailSent = elapsed >= 13.2 && elapsed <= 15.5;

  // Desktop stage height scales cleanly with container width
  const logicalWidth = 1040;
  const logicalHeight = 560;

  return (
    <div
      className="relative w-full select-none pointer-events-none"
      aria-label="Continuous animated preview of a unified TechStack Sydney web and mobile workspace"
    >
      {/* DESKTOP & TABLET STAGE (>= 768px): Transparent 3D perspective stage, no background box */}
      <div
        ref={containerRef}
        className="hidden md:block relative mx-auto w-full max-w-[1040px]"
        style={{ height: `${Math.round(logicalHeight * scale)}px` }}
      >
        <div
          className="origin-top-left"
          style={{
            width: `${logicalWidth}px`,
            height: `${logicalHeight}px`,
            transform: `scale(${scale})`,
            perspective: '1800px',
          }}
        >
          <div
            className="relative w-full h-full flex items-center justify-center"
            style={{
              transformStyle: 'preserve-3d',
              transform: `translate3d(0px, ${floatY.toFixed(2)}px, 0px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`,
            }}
          >
            {/* Primary Unified Workspace Window (floats directly in hero glow — no outer frame) */}
            <div className="relative w-[840px] h-[492px] rounded-[20px] border border-[#dde5f1] dark:border-[#28354b] bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md shadow-[0_28px_70px_-18px_rgba(13,21,36,0.18)] dark:shadow-[0_32px_76px_-18px_rgba(0,0,0,0.68)] flex flex-col overflow-hidden">
              {/* Top App Bar */}
              <div className="h-12 px-6 border-b border-[#edf1f7] dark:border-[#1e293b] flex items-center justify-between bg-white/90 dark:bg-[#0d1320]/90 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] flex items-center justify-center shadow-sm">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <rect x="3" y="4" width="18" height="4" rx="1.5" fill="#fff" />
                      <rect x="3" y="10" width="14" height="4" rx="1.5" fill="#fff" fillOpacity="0.85" />
                      <rect x="3" y="16" width="10" height="4" rx="1.5" fill="#fff" fillOpacity="0.7" />
                    </svg>
                  </div>
                  <span className="text-[13px] font-bold tracking-tight text-[#0d1524] dark:text-[#f1f5f9] font-heading">
                    One Workspace
                  </span>
                </div>

                {/* App Navigation Tabs */}
                <div className="flex items-center gap-1.5 text-[11.5px] font-medium">
                  {(
                    [
                      { id: 'Home', Icon: Home },
                      { id: 'Contacts', Icon: Users },
                      { id: 'Dashboard', Icon: LayoutDashboard },
                      { id: 'Automations', Icon: Workflow },
                    ] as const
                  ).map(({ id, Icon }) => {
                    const active = activeNav === id;
                    return (
                      <div
                        key={id}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg transition-colors duration-300 ${
                          active
                            ? 'bg-indigo-50 dark:bg-indigo-500/20 text-[#4338ca] dark:text-[#a5b4fc] font-semibold'
                            : 'text-[#64748b] dark:text-[#94a3b8]'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{id}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-[#64748b] dark:text-[#94a3b8]" aria-hidden="true" />
                  <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-500/25 text-[#4338ca] dark:text-[#c7d2fe] text-[10px] font-bold flex items-center justify-center">
                    LC
                  </div>
                </div>
              </div>

              {/* Workspace Body */}
              <div className="flex-1 p-5 bg-[#f8f9fb]/80 dark:bg-[#090d16]/75 flex flex-col gap-3.5 overflow-hidden">
                {/* Top KPI Strip */}
                <div className="grid grid-cols-3 gap-3.5">
                  {/* Donut / Active Clients */}
                  <div className="rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] p-3.5 flex items-center gap-3.5">
                    <svg viewBox="0 0 64 64" className="w-14 h-14 shrink-0 -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="24"
                        fill="none"
                        className="stroke-[#eef2f6] dark:stroke-[#1e293b]"
                        strokeWidth="7"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="24"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="7"
                        strokeDasharray={`${(150.8 * 0.48).toFixed(1)} 150.8`}
                        strokeLinecap="round"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="24"
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="7"
                        strokeDasharray={`${(150.8 * 0.28).toFixed(1)} 150.8`}
                        strokeDashoffset={`${(-150.8 * 0.5).toFixed(1)}`}
                        strokeLinecap="round"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r="24"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="7"
                        strokeDasharray={`${(150.8 * 0.18).toFixed(1)} 150.8`}
                        strokeDashoffset={`${(-150.8 * 0.8).toFixed(1)}`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="min-w-0">
                      <div className="text-[11px] font-medium text-[#475569] dark:text-[#94a3b8]">
                        Active Accounts
                      </div>
                      <div className="text-xl font-bold text-[#0d1524] dark:text-[#f1f5f9] tabular-nums font-heading">
                        {totalClients}
                      </div>
                      <div className="text-[10px] text-[#047857] dark:text-[#34d399] font-medium">
                        CRM · Billing · Portal
                      </div>
                    </div>
                  </div>

                  {/* New Deals */}
                  <div className="rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] p-3.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px] font-medium text-[#475569] dark:text-[#94a3b8]">
                      <span>Pipeline Value</span>
                      <span className="font-mono-code text-[10px] text-[#4338ca] dark:text-[#a5b4fc]">
                        +18.4%
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-[#0d1524] dark:text-[#f1f5f9] tabular-nums font-heading">
                      ${newDeals}
                    </div>
                    <div className="text-[10.5px] text-[#64748b] dark:text-[#94a3b8]">
                      Quotes synced automatically
                    </div>
                  </div>

                  {/* Won Deals */}
                  <div className="rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] p-3.5 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-[11px] font-medium text-[#475569] dark:text-[#94a3b8]">
                      <span>Revenue Settled</span>
                      <span className="font-mono-code text-[10px] text-[#047857] dark:text-[#34d399]">
                        Live
                      </span>
                    </div>
                    <div className="text-2xl font-bold text-[#0d1524] dark:text-[#f1f5f9] tabular-nums font-heading">
                      ${wonRevenue}
                    </div>
                    <div className="text-[10.5px] text-[#64748b] dark:text-[#94a3b8]">
                      Zero manual re-entry
                    </div>
                  </div>
                </div>

                {/* Main Analytics Row */}
                <div className="flex-1 grid grid-cols-[1.45fr_1fr_0.85fr] gap-3.5 min-h-0">
                  {/* Revenue Spline Chart */}
                  <div className="rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] p-4 flex flex-col justify-between relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[12.5px] font-semibold text-[#0d1524] dark:text-[#f1f5f9]">
                        Unified Sales & Ops Trend
                      </span>
                      <span className="text-[10.5px] font-mono-code text-[#64748b] dark:text-[#94a3b8]">
                        Jan – Aug
                      </span>
                    </div>

                    <div className="relative flex-1 mt-2">
                      <svg viewBox="0 0 380 155" className="w-full h-full overflow-visible">
                        <defs>
                          <linearGradient id="tssAreaIndigo" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.24" />
                            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01" />
                          </linearGradient>
                          <linearGradient id="tssAreaBlue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.01" />
                          </linearGradient>
                        </defs>

                        {[30, 65, 100, 135].map((y) => (
                          <line
                            key={y}
                            x1="28"
                            y1={y}
                            x2="372"
                            y2={y}
                            className="stroke-[#eef2f6] dark:stroke-[#1e293b]"
                            strokeWidth="1"
                          />
                        ))}

                        <path
                          d="M32,102 C68,84 96,76 132,94 C168,110 202,48 242,66 C280,84 322,36 368,26 L368,135 L32,135 Z"
                          fill="url(#tssAreaIndigo)"
                        />
                        <path
                          d="M32,102 C68,84 96,76 132,94 C168,110 202,48 242,66 C280,84 322,36 368,26"
                          fill="none"
                          stroke="#6366f1"
                          strokeWidth="2.4"
                          strokeLinecap="round"
                        />

                        <path
                          d="M32,120 C72,108 102,112 138,100 C176,88 212,92 252,74 C294,54 330,62 368,46 L368,135 L32,135 Z"
                          fill="url(#tssAreaBlue)"
                        />
                        <path
                          d="M32,120 C72,108 102,112 138,100 C176,88 212,92 252,74 C294,54 330,62 368,46"
                          fill="none"
                          stroke="#38bdf8"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />

                        {/* Moving cursor guide */}
                        <line
                          x1={140 + Math.sin(rad) * 80 + 80}
                          y1="20"
                          x2={140 + Math.sin(rad) * 80 + 80}
                          y2="135"
                          className="stroke-indigo-300 dark:stroke-indigo-500/50"
                          strokeDasharray="3 3"
                        />

                        {MONTHS.map((m, i) => (
                          <text
                            key={m}
                            x={36 + i * 47}
                            y="151"
                            textAnchor="middle"
                            className="fill-[#64748b] dark:fill-[#94a3b8] text-[9px] font-mono-code"
                          >
                            {m}
                          </text>
                        ))}
                      </svg>
                    </div>
                  </div>

                  {/* Team Capability Radar */}
                  <div className="rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] p-4 flex flex-col justify-between">
                    <span className="text-[12.5px] font-semibold text-[#0d1524] dark:text-[#f1f5f9]">
                      Stack Coverage
                    </span>
                    <div className="flex-1 flex items-center justify-center">
                      <svg viewBox="0 0 210 175" className="w-full h-[155px] overflow-visible">
                        {[0.3, 0.6, 0.9].map((level) => (
                          <polygon
                            key={level}
                            points={buildPolygon(105, 88, 56, [1, 1, 1, 1, 1, 1, 1, 1], level)}
                            fill="none"
                            className="stroke-[#e2e8f0] dark:stroke-[#1e293b]"
                            strokeWidth="1"
                          />
                        ))}
                        {RADAR_AXES.map((label, i) => {
                          const angle = (i * 360) / RADAR_AXES.length;
                          const outer = polarPoint(105, 88, 52, angle);
                          const textPos = polarPoint(105, 88, 69, angle);
                          return (
                            <g key={label}>
                              <line
                                x1="105"
                                y1="88"
                                x2={outer.x}
                                y2={outer.y}
                                className="stroke-[#e2e8f0] dark:stroke-[#1e293b]"
                                strokeWidth="1"
                              />
                              <text
                                x={textPos.x}
                                y={textPos.y + 3}
                                textAnchor="middle"
                                className="fill-[#64748b] dark:fill-[#94a3b8] text-[7.5px]"
                              >
                                {label}
                              </text>
                            </g>
                          );
                        })}
                        <polygon
                          points={buildPolygon(105, 88, 52, [0.88, 0.72, 0.9, 0.68, 0.84, 0.76, 0.92, 0.82], radarScale)}
                          fill="rgba(99, 102, 241, 0.2)"
                          stroke="#6366f1"
                          strokeWidth="1.7"
                        />
                        <polygon
                          points={buildPolygon(105, 88, 52, [0.62, 0.86, 0.68, 0.88, 0.64, 0.9, 0.72, 0.85], radarScale)}
                          fill="rgba(56, 189, 248, 0.16)"
                          stroke="#38bdf8"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Team Leaderboard */}
                  <div className="rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] p-4 flex flex-col justify-between">
                    <span className="text-[12.5px] font-semibold text-[#0d1524] dark:text-[#f1f5f9]">
                      Team Velocity
                    </span>
                    <div className="flex items-end justify-around py-2 border-b border-[#edf1f7] dark:border-[#1e293b]">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 text-[10px] font-bold flex items-center justify-center border border-sky-200 dark:border-sky-500/30">
                          CH
                        </div>
                        <span className="text-[10px] text-[#64748b] dark:text-[#94a3b8] mt-1">Chloe</span>
                        <span className="text-[10.5px] font-bold text-[#0d1524] dark:text-[#f1f5f9] tabular-nums">
                          30,010
                        </span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className="w-9 h-9 rounded-full bg-violet-100 dark:bg-violet-500/25 text-violet-800 dark:text-violet-200 text-[11px] font-bold flex items-center justify-center border-2 border-[#7c3aed] dark:border-[#a78bfa]">
                          LC
                        </div>
                        <span className="text-[10px] text-[#64748b] dark:text-[#94a3b8] mt-1">Lachlan</span>
                        <span className="text-[11px] font-bold text-[#0d1524] dark:text-[#f1f5f9] tabular-nums">
                          40,950
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1.5 pt-2">
                      {TEAM_RANKING.map((member) => (
                        <div
                          key={member.rank}
                          className="flex items-center gap-2 text-[10.5px] text-[#334155] dark:text-[#cbd5e1]"
                        >
                          <span className="w-3 font-mono-code text-[#94a3b8] tabular-nums">
                            {member.rank}
                          </span>
                          <span
                            className="w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center shrink-0"
                            style={{ backgroundColor: member.lightBg, color: member.lightFg }}
                          >
                            {member.initials}
                          </span>
                          <span className="truncate font-medium">{member.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* FLOATING CARD 1 (Phase 2): Live Automations & Engineering Dispatch */}
            {supportCardOp > 0.01 && (
              <div
                className="absolute left-6 top-14 w-[396px] rounded-2xl border border-indigo-200/90 dark:border-indigo-500/35 bg-white/98 dark:bg-[#111827]/98 p-4 shadow-[0_24px_56px_-14px_rgba(79,70,229,0.28)] dark:shadow-[0_24px_56px_-14px_rgba(0,0,0,0.75)] backdrop-blur-md"
                style={{
                  opacity: supportCardOp,
                  transform: `translate3d(${((1 - supportCardOp) * -28).toFixed(1)}px, 0px, 44px)`,
                }}
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#edf1f7] dark:border-[#1e293b]">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/20 text-[#4f46e5] dark:text-[#a5b4fc] flex items-center justify-center">
                      <GitBranch className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[13px] font-semibold text-[#0d1524] dark:text-[#f1f5f9]">
                        Automated Dispatch
                      </div>
                      <div className="text-[11px] text-[#64748b] dark:text-[#94a3b8]">
                        Ticket #SUP-418 · Live Sync
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono-code font-semibold text-[#4f46e5] dark:text-[#a5b4fc]">
                    SLA &lt; 5m
                  </span>
                </div>

                <div className="mt-3 space-y-2.5 text-xs">
                  <div className="rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-[#f8f9fb] dark:bg-[#0d1320] p-3">
                    <div className="flex justify-between text-[11px] mb-1">
                      <span className="font-semibold text-[#0d1524] dark:text-[#f1f5f9]">
                        Sarah Mitchell · Client Ops
                      </span>
                      <span className="font-mono-code text-[#64748b] dark:text-[#94a3b8] tabular-nums">
                        09:40
                      </span>
                    </div>
                    <p className="text-[#4b5565] dark:text-[#cbd5e1] leading-relaxed">
                      Route Melbourne field check-ins directly into Xero invoices and client timelines.
                    </p>
                  </div>

                  <div className="rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] text-white p-3 ml-5 shadow-sm">
                    <div className="flex justify-between text-[11px] mb-1 text-indigo-100">
                      <span className="font-semibold text-white">Liam · Full-Stack Build</span>
                      <span className="font-mono-code tabular-nums">09:42</span>
                    </div>
                    <p className="text-indigo-50 leading-relaxed">
                      Workflow compiled and deployed. Mobile & web clients updated in real time.
                    </p>
                  </div>

                  <div className="rounded-lg border border-emerald-200 dark:border-emerald-700/50 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-2 flex items-center justify-between text-emerald-800 dark:text-emerald-300">
                    <span className="flex items-center gap-1.5 font-medium text-[11.5px]">
                      <Check className="w-3.5 h-3.5" />
                      Synced to Sydney Edge
                    </span>
                    <span className="font-mono-code text-[11px] tabular-nums">2m 18s</span>
                  </div>
                </div>
              </div>
            )}

            {/* FLOATING CARD 2 (Phase 3): Mobile Field App + Client Sign-off */}
            {phoneCardOp > 0.01 && (
              <>
                <div
                  className="absolute left-8 bottom-4 w-[390px] rounded-2xl border border-violet-200/90 dark:border-violet-500/35 bg-white/98 dark:bg-[#111827]/98 p-4 shadow-[0_22px_52px_-14px_rgba(124,58,237,0.24)] dark:shadow-[0_22px_52px_-14px_rgba(0,0,0,0.75)] backdrop-blur-md"
                  style={{
                    opacity: phoneCardOp,
                    transform: `translate3d(0px, ${((1 - phoneCardOp) * 24).toFixed(1)}px, 38px)`,
                  }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[11px] font-semibold text-[#7c3aed] dark:text-[#a78bfa]">
                        Client Portal Sign-Off
                      </div>
                      <div className="text-sm font-bold text-[#0d1524] dark:text-[#f1f5f9] mt-0.5">
                        One Workspace Approved
                      </div>
                    </div>
                    <div className="px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-700/50 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold flex items-center gap-1 shrink-0">
                      <Check className="w-3.5 h-3.5" />
                      <span>Verified</span>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      { title: 'AI Notes', sub: 'Auto-logged', Icon: Zap },
                      { title: 'iOS & Web', sub: 'Shared DB', Icon: Compass },
                      { title: 'Check-In', sub: 'VIC & NSW', Icon: MapPin },
                    ].map(({ title, sub, Icon }) => (
                      <div
                        key={title}
                        className="rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-[#f8f9fb] dark:bg-[#0d1320] p-2.5"
                      >
                        <div className="w-6 h-6 rounded-md bg-violet-100 dark:bg-violet-500/20 text-[#7c3aed] dark:text-[#c4b5fd] flex items-center justify-center mb-1.5">
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <div className="text-[11px] font-semibold text-[#0d1524] dark:text-[#f1f5f9]">
                          {title}
                        </div>
                        <div className="text-[10px] text-[#64748b] dark:text-[#94a3b8]">{sub}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Floating iPhone Frame */}
                <div
                  className="absolute right-6 bottom-2 w-[238px] rounded-[28px] border-2 border-[#c7d2fe] dark:border-[#334155] bg-white dark:bg-[#0f172a] p-4 shadow-[0_28px_64px_-14px_rgba(79,70,229,0.28)] dark:shadow-[0_28px_64px_-14px_rgba(0,0,0,0.8)]"
                  style={{
                    opacity: phoneCardOp,
                    transform: `translate3d(${((1 - phoneCardOp) * 28).toFixed(1)}px, ${((1 - phoneCardOp) * 16).toFixed(1)}px, 56px)`,
                  }}
                >
                  <div className="flex items-center justify-between text-[10px] font-semibold text-[#0d1524] dark:text-[#f1f5f9] px-1 mb-3 tabular-nums">
                    <span>9:41</span>
                    <span className="w-9 h-1.5 rounded-full bg-[#e4e8ef] dark:bg-[#334155]" />
                    <span className="font-mono-code text-[9px] text-[#4f46e5] dark:text-[#818cf8]">5G</span>
                  </div>

                  <div className="flex items-center gap-3 mb-3">
                    <ChevronLeft className="w-4 h-4 text-[#64748b] dark:text-[#94a3b8]" />
                    <span className="text-xs font-bold text-[#0d1524] dark:text-[#f1f5f9]">
                      Field Activity
                    </span>
                  </div>

                  <div className="space-y-2.5 text-[11px]">
                    <div>
                      <div className="text-[#475569] dark:text-[#94a3b8] font-medium">Account</div>
                      <div className="mt-1 rounded-lg border border-[#e4e8ef] dark:border-[#1e293b] bg-[#f8f9fb] dark:bg-[#1e293b]/70 px-2.5 py-1.5 font-semibold text-[#0d1524] dark:text-[#f1f5f9]">
                        Hannah Walsh
                      </div>
                    </div>
                    <div>
                      <div className="text-[#475569] dark:text-[#94a3b8] font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>Schedule</span>
                      </div>
                      <div className="mt-1 rounded-lg border border-[#e4e8ef] dark:border-[#1e293b] bg-[#f8f9fb] dark:bg-[#1e293b]/70 px-2.5 py-1.5 font-mono-code text-[10.5px] text-[#334155] dark:text-[#cbd5e1] tabular-nums">
                        2026-11-21 · 10:30 AM
                      </div>
                    </div>
                    <div>
                      <div className="text-[#475569] dark:text-[#94a3b8] font-medium">Notes</div>
                      <div className="mt-1 rounded-lg border border-indigo-200 dark:border-indigo-500/40 bg-indigo-50/60 dark:bg-indigo-500/15 px-2.5 py-1.5 text-[#3730a3] dark:text-[#c7d2fe] font-medium">
                        AI summary synced to CRM
                      </div>
                    </div>
                    <div>
                      <div className="text-[#475569] dark:text-[#94a3b8] font-medium flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>Location</span>
                      </div>
                      <div className="mt-1 rounded-lg border border-[#e4e8ef] dark:border-[#1e293b] bg-[#f8f9fb] dark:bg-[#1e293b]/70 px-2.5 py-1.5 text-[10px] text-[#475569] dark:text-[#cbd5e1] leading-snug">
                        42 Collins St, Melbourne VIC
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* FLOATING CARD 3 (Phase 4): Customer Website & Instant Lead Sync */}
            {portalCardOp > 0.01 && (
              <div
                className="absolute right-8 top-12 w-[360px] rounded-2xl border border-[#dde5f1] dark:border-[#28354b] bg-white/98 dark:bg-[#111827]/98 p-4 shadow-[0_24px_56px_-14px_rgba(13,21,36,0.22)] dark:shadow-[0_24px_56px_-14px_rgba(0,0,0,0.75)] backdrop-blur-md"
                style={{
                  opacity: portalCardOp,
                  transform: `translate3d(${((1 - portalCardOp) * 24).toFixed(1)}px, 0px, 46px)`,
                }}
              >
                <div className="rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-[#f3f5fa] dark:bg-[#0d1320] h-24 relative overflow-hidden flex items-center justify-center">
                  <svg viewBox="0 0 320 96" className="w-full h-full opacity-70">
                    <line x1="0" y1="24" x2="320" y2="12" className="stroke-white dark:stroke-[#1e293b]" strokeWidth="4" />
                    <line x1="0" y1="62" x2="320" y2="48" className="stroke-white dark:stroke-[#1e293b]" strokeWidth="5" />
                    <line x1="80" y1="0" x2="104" y2="96" className="stroke-white dark:stroke-[#1e293b]" strokeWidth="4" />
                    <line x1="210" y1="0" x2="232" y2="96" className="stroke-white dark:stroke-[#1e293b]" strokeWidth="4" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] text-white flex items-center justify-center shadow-md">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span className="mt-1 px-2 py-0.5 rounded bg-white dark:bg-[#111827] border border-[#e4e8ef] dark:border-[#28354b] text-[10px] font-semibold text-[#0d1524] dark:text-[#f1f5f9] shadow-sm">
                      Customer Portal Live
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <div className="flex-1 h-9 rounded-lg border border-[#e4e8ef] dark:border-[#1e293b] bg-[#f8f9fb] dark:bg-[#0d1320] px-3 flex items-center text-[11px] font-mono-code text-[#475569] dark:text-[#cbd5e1] truncate">
                    {emailSent ? 'hannah@enterprise.com.au' : 'Enter work email...'}
                  </div>
                  <div
                    className={`h-9 px-3.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 transition-colors duration-200 ${
                      emailSent
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#4f46e5] text-white'
                    }`}
                  >
                    {emailSent ? <Check className="w-3.5 h-3.5" /> : <Send className="w-3.5 h-3.5" />}
                    <span>{emailSent ? 'Synced' : 'Send'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE STAGE (< 768px): Crisp, full-legibility transparent showcase built for small viewports */}
      <div className="md:hidden mx-auto w-full max-w-[400px] px-1">
        {/* Main Mobile Workspace Card (no outer page background — floats over hero glow) */}
        <div className="rounded-2xl border border-[#dde5f1] dark:border-[#28354b] bg-white/95 dark:bg-[#111827]/95 backdrop-blur-md p-4 shadow-[0_20px_50px_-14px_rgba(13,21,36,0.16)] dark:shadow-[0_24px_56px_-14px_rgba(0,0,0,0.65)]">
          {/* App Header */}
          <div className="flex items-center justify-between pb-3 border-b border-[#edf1f7] dark:border-[#1e293b]">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-gradient-to-br from-[#7c3aed] to-[#4f46e5] flex items-center justify-center">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <rect x="3" y="4" width="18" height="4" rx="1.5" fill="#fff" />
                  <rect x="3" y="10" width="14" height="4" rx="1.5" fill="#fff" fillOpacity="0.85" />
                  <rect x="3" y="16" width="10" height="4" rx="1.5" fill="#fff" fillOpacity="0.7" />
                </svg>
              </div>
              <span className="text-xs font-bold text-[#0d1524] dark:text-[#f1f5f9] font-heading">
                One Workspace
              </span>
            </div>
            <span className="text-[11px] font-mono-code font-medium text-[#4f46e5] dark:text-[#a5b4fc]">
              {activeNav}
            </span>
          </div>

          {/* KPI Pair */}
          <div className="grid grid-cols-2 gap-2.5 mt-3">
            <div className="rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-[#f8f9fb] dark:bg-[#0d1320] p-3">
              <div className="text-[11px] text-[#475569] dark:text-[#94a3b8]">Revenue Settled</div>
              <div className="mt-0.5 text-lg font-bold text-[#0d1524] dark:text-[#f1f5f9] tabular-nums font-heading">
                ${wonRevenue}
              </div>
            </div>
            <div className="rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-[#f8f9fb] dark:bg-[#0d1320] p-3">
              <div className="text-[11px] text-[#475569] dark:text-[#94a3b8]">Active Accounts</div>
              <div className="mt-0.5 text-lg font-bold text-[#0d1524] dark:text-[#f1f5f9] tabular-nums font-heading">
                {totalClients}
              </div>
            </div>
          </div>

          {/* Dynamic Center Panel cycling through the 4 phases */}
          <div className="mt-3 rounded-xl border border-[#e4e8ef] dark:border-[#1e293b] bg-[#f8f9fb] dark:bg-[#0d1320] p-3.5 min-h-[146px] flex flex-col justify-between">
            {phaseIndex === 0 && (
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#0d1524] dark:text-[#f1f5f9]">
                  <span>Unified Pipeline Trend</span>
                  <span className="text-[11px] font-mono-code text-[#047857] dark:text-[#34d399]">+18.4%</span>
                </div>
                <svg viewBox="0 0 280 90" className="w-full h-24 mt-2 overflow-visible">
                  <path
                    d="M8,72 C48,54 84,60 120,44 C156,28 198,42 234,20 C252,12 264,14 274,10 L274,84 L8,84 Z"
                    fill="rgba(99, 102, 241, 0.16)"
                  />
                  <path
                    d="M8,72 C48,54 84,60 120,44 C156,28 198,42 234,20 C252,12 264,14 274,10"
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                  <circle cx="234" cy="20" r="4" fill="#6366f1" />
                </svg>
              </div>
            )}

            {phaseIndex === 1 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#0d1524] dark:text-[#f1f5f9]">
                  <span>Automated Workflow</span>
                  <span className="text-[11px] font-mono-code text-[#4f46e5] dark:text-[#a5b4fc]">#SUP-418</span>
                </div>
                <div className="rounded-lg bg-gradient-to-r from-[#7c3aed] to-[#4f46e5] p-2.5 text-xs text-white leading-snug">
                  Field check-ins synced directly to Xero invoices and team schedules.
                </div>
                <div className="flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Deployed to Sydney Edge
                  </span>
                  <span className="font-mono-code tabular-nums">2m 18s</span>
                </div>
              </div>
            )}

            {phaseIndex === 2 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-[#0d1524] dark:text-[#f1f5f9]">
                  <span>Mobile Field Sync</span>
                  <span className="text-[11px] text-[#7c3aed] dark:text-[#a78bfa] font-medium">iOS & Android</span>
                </div>
                <div className="rounded-lg border border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] p-2.5 text-xs">
                  <div className="font-semibold text-[#0d1524] dark:text-[#f1f5f9]">Hannah Walsh</div>
                  <div className="text-[11px] text-[#475569] dark:text-[#94a3b8] mt-0.5">
                    42 Collins St, Melbourne VIC · AI notes saved
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-emerald-700 dark:text-emerald-300 font-medium">
                  <span className="flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Q4 Release Signed Off
                  </span>
                  <span className="font-mono-code">Live</span>
                </div>
              </div>
            )}

            {phaseIndex === 3 && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#0d1524] dark:text-[#f1f5f9]">
                  <span>Client Portal & Booking</span>
                  <span className="text-[11px] font-mono-code text-[#047857] dark:text-[#34d399]">Synced</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-[#4b5565] dark:text-[#cbd5e1]">
                  <MapPin className="w-4 h-4 text-[#4f46e5] dark:text-[#818cf8] shrink-0" />
                  <span>Customers log in, book, and approve in one place.</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex-1 rounded-lg border border-[#e4e8ef] dark:border-[#1e293b] bg-white dark:bg-[#111827] px-2.5 py-1.5 text-[11px] font-mono-code text-[#475569] dark:text-[#cbd5e1] truncate">
                    hannah@enterprise.com.au
                  </div>
                  <span className="rounded-lg bg-emerald-600 px-2.5 py-1.5 text-[11px] font-semibold text-white">
                    Sent
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
