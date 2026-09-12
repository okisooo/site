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
    <div className="ed-page">
      <section className="ed-empty">
        <p className="ed-label">
          release sync // secure handoff
        </p>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">
          {callback.kind === 'ready' ? 'authorization received.' : callback.kind === 'error' ? 'authorization paused.' : 'authorization.'}
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
              className="ed-button"
            >
              {copied ? 'callback copied' : 'copy callback url'}
            </button>
            <p className="font-mono text-xs text-black/45 dark:text-white/45">
              this page receives a short-lived code only. your client secret and access token stay in the local terminal.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
