import assert from 'node:assert/strict';
import test from 'node:test';
import { captureVideoPlayback, restoreVideoPlayback, watchVideoReturn } from './videoRecovery';

function fixture() {
  let nextFrame = 0;
  let plays = 0;
  const callbacks = new Map<number, VideoFrameRequestCallback>();
  const video = {
    currentTime: 84.5, duration: 218, paused: false, ended: false, seeking: false,
    readyState: 4, volume: .4, muted: true, playbackRate: 1.25, isConnected: true,
    getBoundingClientRect: () => ({ top: 40, bottom: 440, left: 0, right: 700, width: 700, height: 400 }),
    requestVideoFrameCallback(callback: VideoFrameRequestCallback) { callbacks.set(++nextFrame, callback); return nextFrame; },
    cancelVideoFrameCallback(id: number) { callbacks.delete(id); },
    play() { plays++; video.paused = false; return Promise.resolve(); },
  };
  const page = Object.assign(new EventTarget(), { hidden: false });
  const host = Object.assign(new EventTarget(), { innerWidth: 1000, innerHeight: 800 });
  let repairs = 0;
  const start = () => watchVideoReturn(video as unknown as HTMLVideoElement, () => repairs++, page as Document, host as unknown as Window);
  const frame = () => {
    const entry = callbacks.entries().next().value;
    if (entry) { callbacks.delete(entry[0]); entry[1](0, {} as VideoFrameCallbackMetadata); }
  };
  return { video, page, host, start, frame, callbacks, plays: () => plays, repairs: () => repairs };
}

test('recovery preserves position, speed, volume and mute without starting paused video', async () => {
  const f = fixture();
  f.video.paused = true;
  const saved = captureVideoPlayback(f.video as unknown as HTMLVideoElement);
  Object.assign(f.video, { currentTime: 0, volume: 1, muted: false, playbackRate: 1 });
  await restoreVideoPlayback(f.video as unknown as HTMLVideoElement, saved);
  assert.equal(f.video.currentTime, 84.5);
  assert.equal(f.video.volume, .4);
  assert.equal(f.video.muted, true);
  assert.equal(f.video.playbackRate, 1.25);
  assert.equal(f.plays(), 0);
});

test('recovery resumes playing media and keeps seek within the available duration', async () => {
  const f = fixture();
  const saved = captureVideoPlayback(f.video as unknown as HTMLVideoElement);
  Object.assign(f.video, { currentTime: 0, paused: true, duration: 50 });
  await restoreVideoPlayback(f.video as unknown as HTMLVideoElement, saved);
  assert.equal(f.video.currentTime, 49.95);
  assert.equal(f.plays(), 1);
});

test('return recovery fires once only when playback advances without submitted frames', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const f = fixture(); const stop = f.start();
  f.host.dispatchEvent(new Event('focus'));
  f.video.currentTime += 2;
  t.mock.timers.tick(1600);
  assert.equal(f.repairs(), 1);
  t.mock.timers.tick(5000);
  assert.equal(f.repairs(), 1);
  assert.equal(f.callbacks.size, 0);
  stop();
});

test('healthy frames cancel recovery and repeated return events do not create duplicate probes', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const f = fixture(); const stop = f.start();
  f.host.dispatchEvent(new Event('focus'));
  f.page.dispatchEvent(new Event('visibilitychange'));
  assert.equal(f.callbacks.size, 1);
  f.frame(); f.frame();
  f.video.currentTime += 2;
  t.mock.timers.tick(1600);
  assert.equal(f.repairs(), 0);
  stop();
});

test('hidden, paused, seeking, buffering and offscreen videos are never automatically restarted', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  for (const state of ['hidden', 'paused', 'seeking', 'buffering', 'offscreen']) {
    const f = fixture(); const stop = f.start();
    f.host.dispatchEvent(new Event('focus'));
    if (state === 'hidden') f.page.hidden = true;
    if (state === 'paused') f.video.paused = true;
    if (state === 'seeking') f.video.seeking = true;
    if (state === 'buffering') f.video.readyState = 2;
    if (state === 'offscreen') f.video.getBoundingClientRect = () => ({ top: 900, bottom: 1300, left: 0, right: 700, width: 700, height: 400 });
    f.video.currentTime += 2;
    t.mock.timers.tick(1600);
    assert.equal(f.repairs(), 0, state);
    stop();
  }
});

test('cleanup cancels pending recovery when the source or page is removed', (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const f = fixture(); const stop = f.start();
  f.host.dispatchEvent(new Event('pageshow'));
  stop();
  f.video.currentTime += 2;
  f.host.dispatchEvent(new Event('focus'));
  t.mock.timers.tick(5000);
  assert.equal(f.repairs(), 0);
  assert.equal(f.callbacks.size, 0);
});
