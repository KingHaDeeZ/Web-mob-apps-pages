import { FormEvent, useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, X } from 'lucide-react';

interface GetStartedModalProps {
  open: boolean;
  onClose: () => void;
}

export function GetStartedModal({ open, onClose }: GetStartedModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subscriptions, setSubscriptions] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid work email address.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="get-started-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="fixed inset-0 bg-[#090d16]/60 backdrop-blur-sm transition-opacity"
        onClick={resetAndClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-[#dde5f1] dark:border-[#28354b] bg-white dark:bg-[#111827] p-6 sm:p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wide text-[#4f46e5] dark:text-[#818cf8]">
              TechStack Sydney
            </p>
            <h2
              id="get-started-title"
              className="mt-1 text-xl sm:text-2xl font-bold tracking-tight text-[#0d1524] dark:text-[#f1f5f9] font-heading"
            >
              Replace fragmented tools with one workspace
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close modal"
            onClick={resetAndClose}
            className="inline-flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg border border-[#e4e8ef] dark:border-[#1e293b] text-[#475569] dark:text-[#94a3b8] hover:bg-[#f3f5fa] dark:hover:bg-[#162033] hover:text-[#0d1524] dark:hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {submitted ? (
          <div className="mt-6 rounded-xl border border-emerald-200 dark:border-emerald-800/60 bg-emerald-50/70 dark:bg-emerald-950/30 p-5">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <div>
                <h3 className="text-base font-semibold text-[#0d1524] dark:text-[#f1f5f9]">
                  Project brief received
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-[#4b5565] dark:text-[#cbd5e1]">
                  Thanks {name.trim()}. We have recorded your workspace scope for{' '}
                  <span className="font-medium text-[#0d1524] dark:text-white">{email.trim()}</span>{' '}
                  and will follow up within one business day.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={resetAndClose}
              className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-[#0d1524] dark:bg-[#f1f5f9] px-5 py-2.5 text-sm font-semibold text-white dark:text-[#090d16] cursor-pointer"
            >
              Return to showcase
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
            <div>
              <label
                htmlFor="brief-name"
                className="block text-sm font-medium text-[#0d1524] dark:text-[#f1f5f9]"
              >
                Your name
              </label>
              <input
                id="brief-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Taylor"
                className="mt-1.5 w-full min-h-[44px] rounded-xl border border-[#cbd5e1] dark:border-[#334155] bg-[#f8f9fb] dark:bg-[#0c121e] px-3.5 text-sm text-[#0d1524] dark:text-[#f1f5f9] placeholder:text-[#94a3b8] focus:bg-white dark:focus:bg-[#151f33] focus:outline-2 focus:outline-indigo-600 dark:focus:outline-indigo-400"
              />
            </div>

            <div>
              <label
                htmlFor="brief-email"
                className="block text-sm font-medium text-[#0d1524] dark:text-[#f1f5f9]"
              >
                Work email
              </label>
              <input
                id="brief-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com.au"
                className="mt-1.5 w-full min-h-[44px] rounded-xl border border-[#cbd5e1] dark:border-[#334155] bg-[#f8f9fb] dark:bg-[#0c121e] px-3.5 text-sm text-[#0d1524] dark:text-[#f1f5f9] placeholder:text-[#94a3b8] focus:bg-white dark:focus:bg-[#151f33] focus:outline-2 focus:outline-indigo-600 dark:focus:outline-indigo-400"
              />
            </div>

            <div>
              <label
                htmlFor="brief-tools"
                className="block text-sm font-medium text-[#0d1524] dark:text-[#f1f5f9]"
              >
                Which subscriptions are you looking to replace?
              </label>
              <textarea
                id="brief-tools"
                rows={3}
                value={subscriptions}
                onChange={(e) => setSubscriptions(e.target.value)}
                placeholder="e.g. CRM, job scheduling, client portal, invoicing..."
                className="mt-1.5 w-full rounded-xl border border-[#cbd5e1] dark:border-[#334155] bg-[#f8f9fb] dark:bg-[#0c121e] p-3.5 text-sm text-[#0d1524] dark:text-[#f1f5f9] placeholder:text-[#94a3b8] focus:bg-white dark:focus:bg-[#151f33] focus:outline-2 focus:outline-indigo-600 dark:focus:outline-indigo-400"
              />
            </div>

            {error && (
              <p role="alert" className="text-sm font-medium text-rose-600 dark:text-rose-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#0d1524] dark:bg-[#f1f5f9] px-6 py-3 text-sm font-semibold text-white dark:text-[#090d16] hover:bg-[#19263f] dark:hover:bg-white cursor-pointer transition-all"
            >
              <span>Start the conversation</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
