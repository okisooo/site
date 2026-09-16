import assert from 'node:assert/strict';
import test from 'node:test';
import { nextModelFrame } from './modelFrameTiming';

test('the model keeps its 30/60 fps cadence across display refresh rates', () => {
  for (const target of [30, 60]) for (const refresh of [60, 75, 90, 120, 144, 165, 240, 320]) {
    let deadline = 0, frames = 0;
    for (let tick = 0; tick < refresh * 10; tick++) {
      const now = tick * 1000 / refresh;
      if (now < deadline - 1) continue;
      frames++;
      deadline = nextModelFrame(deadline, now, 1000 / target);
    }
    assert(Math.abs(frames - target * 10) <= 1, `${target} fps at ${refresh} Hz: ${frames} frames`);
  }
});

test('late callbacks do not permanently reduce the requested frame rate', () => {
  const interval = 1000 / 30;
  let deadline = 0, frames = 0;
  for (let tick = 0; tick < 600; tick++) {
    const now = tick * 1000 / 60 + (tick % 5 === 0 ? 4 : 0);
    if (now < deadline - 1) continue;
    frames++;
    deadline = nextModelFrame(deadline, now, interval);
  }
  assert(Math.abs(frames - 300) <= 1, `${frames} frames`);
});

test('a long suspension drops missed frames instead of scheduling a catch-up burst', () => {
  assert.equal(nextModelFrame(100, 2000, 1000 / 30), 2000 + 1000 / 30);
  assert.equal(nextModelFrame(0, 5000, 1000 / 30), 5000 + 1000 / 30);
});
