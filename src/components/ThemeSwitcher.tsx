import { Monitor, Moon, Sun } from 'lucide-react';

export type ThemePreference = 'light' | 'device' | 'dark';

interface ThemeSwitcherProps {
  preference: ThemePreference;
  onChange: (pref: ThemePreference) => void;
}

const OPTIONS: Array<{
  value: ThemePreference;
  label: string;
  Icon: typeof Sun;
}> = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'device', label: 'System', Icon: Monitor },
  { value: 'dark', label: 'Dark', Icon: Moon },
];

export function ThemeSwitcher({ preference, onChange }: ThemeSwitcherProps) {
  const activeIndex = OPTIONS.findIndex((o) => o.value === preference);

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className="relative inline-grid grid-cols-3 items-center rounded-full border border-[#dde5f1] dark:border-[#28354b] bg-[#eef2f6]/90 dark:bg-[#162033]/90 p-1 backdrop-blur-md"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1 bottom-1 left-1 w-[calc((100%-8px)/3)] rounded-full border border-[#dde5f1] dark:border-slate-400/30 bg-white dark:bg-[#24314a] shadow-sm transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `translateX(${Math.max(0, activeIndex) * 100}%)` }}
      />
      {OPTIONS.map(({ value, label, Icon }) => {
        const selected = preference === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={selected}
            aria-label={`${label} theme`}
            onClick={() => onChange(value)}
            className={`relative z-10 inline-flex min-h-[34px] items-center justify-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 dark:focus-visible:outline-indigo-400 ${
              selected
                ? 'text-[#0d1524] dark:text-[#f1f5f9]'
                : 'text-[#475569] hover:text-[#0d1524] dark:text-[#94a3b8] dark:hover:text-[#f1f5f9]'
            }`}
          >
            <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
