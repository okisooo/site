"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, CalendarPlus } from "lucide-react";
import { countdown, plush, plushPhase } from "@/data/plush";

/** The campaign's live state. The export renders the build-time phase, then the visitor's clock takes over. */
export default function PlushStatus({ builtAt }: { builtAt: number }) {
  const [now, setNow] = useState(builtAt);
  useEffect(() => {
    const tick = () => setNow(Date.now());
    tick();
    const timer = setInterval(tick, 30_000);
    return () => clearInterval(timer);
  }, []);
  const phase = plushPhase(now);
  const view = {
    soon: {
      label: "pre-orders open in", big: countdown(plush.opens, now), when: "wed nov 18 · 10:30 pm jst · 8:30 am est",
      action: "get a launch alert", calendar: { href: "/plush/okiso-plushie-launch.ics", label: "add the launch to my calendar" },
    },
    open: {
      label: "pre-orders are open · closes in", big: countdown(plush.closes, now), when: "until dec 18 · 11:59 pm est (dec 19, 1:59 pm jst)",
      action: `pre-order · ${plush.price}`, calendar: { href: "/plush/okiso-plushie-last-call.ics", label: "remind me before it closes" },
    },
    closed: { label: "the campaign has ended", big: "thank you", when: "nov 18 – dec 18, 2026", action: "see it on gimme swag", calendar: null },
  }[phase];
  const orders = plush.orders;
  return <div className="ed-plush-status" data-phase={phase}>
    <p className="ed-label">{view.label}</p>
    <p className="ed-plush-countdown">{view.big}</p>
    <p className="ed-plush-when">{view.when}</p>
    {orders !== null && <div className="ed-plush-progress">
      <div role="progressbar" aria-label="pre-orders so far" aria-valuemin={0} aria-valuemax={plush.goal} aria-valuenow={orders}>
        <span style={{ width: `${Math.min(100, (orders / plush.goal) * 100)}%` }} />
      </div>
      <span className="ed-label">{orders} / {plush.goal} pre-orders</span>
    </div>}
    <div className="ed-plush-actions">
      <a className="ed-button ed-plush-cta" href={plush.store} target="_blank" rel="noopener noreferrer">{view.action} <ArrowUpRight size={18} aria-hidden="true" /></a>
      {view.calendar && <a className="ed-text-link" href={view.calendar.href} download>{view.calendar.label} <CalendarPlus size={16} aria-hidden="true" /></a>}
    </div>
  </div>;
}
