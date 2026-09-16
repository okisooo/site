import assert from 'node:assert/strict';
import test from 'node:test';
import { createModelPerformanceBudget, heroPixelRatio } from './modelPerformanceBudget';

test('hero rendering stays within its pixel budget on desktop and retina phones', () => {
  for (const [width, height, density] of [[847, 1040, 1], [450, 740, 3], [1800, 1040, 2], [200, 300, 1]]) {
    const ratio = heroPixelRatio(width, height, density, false);
    assert(ratio <= density);
    assert(width * height * ratio ** 2 <= 600_001);
    assert(heroPixelRatio(width, height, density, true) < ratio);
  }
});

test('healthy 60 to 320 Hz pages keep their animated model', () => {
  for (const hz of [60, 75, 120, 144, 240, 320]) {
    const budget = createModelPerformanceBudget();
    for (let i = 0; i < hz * 20; i++) {
      budget.rendered(3);
      assert.equal(budget.sample(i * 1000 / hz), 'full');
    }
  }
});

test('sustained slow delivery reduces quality, then stops instead of retrying forever', () => {
  const budget = createModelPerformanceBudget();
  for (let time = 0; time <= 3000; time += 50) budget.sample(time);
  assert.equal(budget.sample(3050), 'reduced');
  for (let time = 3100; time <= 6200; time += 50) budget.sample(time);
  assert.equal(budget.sample(6250), 'fallback');
  budget.reset();
  assert.equal(budget.sample(10000), 'fallback');
});

test('resolution reduction can recover without disabling the model', () => {
  const budget = createModelPerformanceBudget();
  for (let time = 0; time <= 3050; time += 50) budget.sample(time);
  for (let time = 3067; time < 18000; time += 1000 / 60) {
    budget.rendered(3);
    assert.equal(budget.sample(time), 'reduced');
  }
});

test('expensive model work backs off even on a high-refresh display', () => {
  const budget = createModelPerformanceBudget();
  for (let time = 0; time <= 3100; time += 1000 / 120) {
    budget.rendered(20);
    budget.sample(time);
  }
  assert.equal(budget.sample(3110), 'reduced');
});

test('startup stalls and suspended tabs do not count as sustained overload', () => {
  const budget = createModelPerformanceBudget();
  budget.sample(0);
  budget.rendered(500);
  budget.sample(500);
  for (let time = 1000; time <= 3100; time += 1000 / 60) {
    budget.rendered(2);
    assert.equal(budget.sample(time), 'full');
  }
  budget.reset();
  assert.equal(budget.sample(60000), 'full');
  for (let time = 60017; time < 64000; time += 1000 / 60) {
    budget.rendered(2);
    assert.equal(budget.sample(time), 'full');
  }
});
