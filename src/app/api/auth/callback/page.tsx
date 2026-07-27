'use client';

import { useEffect, useState } from 'react';

type CallbackState =
  | { kind: 'loading' }
  | { kind: 'ready'; callbackUrl: string }
  | { kind: 'error'; message: string };

export default function TooLostCallbackPage() {
  const [callback, setCallback] = useState<CallbackState>({ kind: 'loading' });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const currentUrl = new URL(window.location.href);
    const providerError = currentUrl.searchParams.get('error');
    const code = currentUrl.searchParams.get('code');

    if (providerError) {
      setCallback({ kind: 'error', message: `authorization stopped: ${providerError}` });
      return;
    }
    if (!code) {
      setCallback({ kind: 'error', message: 'authorization code missing. restart the local setup command.' });
      return;
    }

    setCallback({ kind: 'ready', callbackUrl: currentUrl.toString() });
    window.history.replaceState({}, '', currentUrl.pathname);
  }, []);

  const copyCallback = async () => {
    if (callback.kind !== 'ready') return;
    await navigator.clipboard.writeText(callback.callbackUrl);
    setCopied(true);
  };

  return (
    <main className="min-h-screen bg-ba-cream text-black dark:bg-black dark:text-white flex items-center justify-center px-6 py-16">
      <section className="w-full max-w-2xl border-4 border-black/10 dark:border-white/15 rounded-[2rem] bg-white dark:bg-[#111] p-8 md:p-12 shadow-2xl">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.28em] text-ba-pink mb-5">
          release sync // secure handoff
        </p>
        <h1 className="font-display text-5xl md:text-7xl font-black uppercase tracking-tighter leading-[0.88] mb-8">
          authorization<br />received.
        </h1>

        {callback.kind === 'loading' && <p className="font-mono text-sm">checking callback…</p>}

        {callback.kind === 'error' && (
          <div role="alert" className="border-l-4 border-red-500 pl-5 py-2">
            <p className="font-mono text-sm font-bold">{callback.message}</p>
          </div>
        )}

        {callback.kind === 'ready' && (
          <div className="space-y-6">
            <p className="text-lg font-bold leading-relaxed text-black/65 dark:text-white/65">
              copy the callback, return to your terminal, then paste it into the waiting setup command.
            </p>
            <button
              type="button"
              onClick={copyCallback}
              className="w-full rounded-full bg-ba-pink px-6 py-4 font-black uppercase tracking-widest text-white transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ba-pink/40"
            >
              {copied ? 'callback copied' : 'copy callback url'}
            </button>
            <p className="font-mono text-xs text-black/45 dark:text-white/45">
              this page receives a short-lived code only. your client secret and access token stay in the local terminal.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
