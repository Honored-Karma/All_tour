import test, { before, after, afterEach } from "node:test";
import assert from "node:assert/strict";
import React, { act, lazy } from "react";
import { createRoot, type Root } from "react-dom/client";
import { JSDOM } from "jsdom";
import { Hero } from "./Hero";
import { GlassModal } from "../glass/GlassModal";
import { LazyModal } from "../common/LazyModal";
import { ru } from "../../i18n/ru";

let dom: JSDOM;
let root: Root;
let frames: Map<number, FrameRequestCallback>;
let nextFrame = 0;
before(() => {
  dom = new JSDOM('<html><body></body></html>', { url: 'http://localhost', pretendToBeVisual: true });
  for (const key of ['window', 'document', 'HTMLElement', 'Element', 'getComputedStyle']) {
    Object.defineProperty(globalThis, key, { configurable: true, value: (dom.window as any)[key] });
  }
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  dom.window.requestAnimationFrame = cb => { frames.set(++nextFrame, cb); return nextFrame; };
  dom.window.cancelAnimationFrame = id => { frames.delete(id); };
  dom.window.scrollTo = () => {};
});
afterEach(async () => { await act(async () => root.unmount()); });
after(() => dom.window.close());
async function mount(node: React.ReactNode) {
  frames = new Map();
  document.body.innerHTML = '<button id="opener">Open</button><div id="root"></div>';
  document.getElementById('opener')!.focus();
  root = createRoot(document.getElementById('root')!);
  await act(async () => root.render(node));
}
async function frame() {
  const callbacks = [...frames.values()]; frames.clear();
  await act(async () => callbacks.forEach(cb => cb(0)));
}
test('Hero mounts one high priority image, warms scenes before fades and retains them on reverse scroll', async () => {
  await mount(<Hero dict={ru} locale="ru" reducedMotion={false} onExploreClick={() => {}} />);
  const section = document.getElementById('hero')!;
  Object.defineProperty(section, 'offsetHeight', { value: 1100 });
  Object.defineProperty(document.querySelector('.hero-cinema-stage'), 'offsetHeight', { value: 100 });
  await act(async () => window.dispatchEvent(new dom.window.Event('resize'))); await frame();
  assert.equal(document.querySelectorAll('#hero img').length, 1);
  assert.equal(document.querySelector('#hero img')!.getAttribute('fetchpriority'), 'high');
  for (const [progress, count] of [[0.18, 2], [0.51, 3], [0, 3]]) {
    Object.defineProperty(window, 'scrollY', { configurable: true, value: progress * 1000 });
    await act(async () => window.dispatchEvent(new dom.window.Event('scroll'))); await frame();
    assert.equal(document.querySelectorAll('#hero img').length, count);
    if (progress === 0.51) {
      const layer = document.querySelector<HTMLElement>('.hero-cinema-image-1')!;
      assert.equal(layer.style.opacity, '0', 'Keep the previous backdrop while decoding');
      await act(async () => layer.querySelector('img')!.dispatchEvent(new dom.window.Event('load')));
      await frame();
      assert.equal(layer.style.opacity, '1');
    }
  }
  assert.equal(document.querySelector('.hero-cinema-image-1')!.getAttribute('style')?.includes('opacity: 0'), true);
});
test('reduced motion keeps scene navigation working without scroll animations', async () => {
  await mount(<Hero dict={ru} locale="ru" reducedMotion onExploreClick={() => {}} />);
  assert.equal(document.querySelectorAll('#hero img').length, 1);
  const controls = document.querySelectorAll<HTMLButtonElement>('.hero-scene-navigation button');
  await act(async () => controls[2].click());
  assert.equal(document.querySelector('#hero img')!.getAttribute('src'), '/media/china-hero.jpg');
  assert.equal(controls[2].getAttribute('aria-current'), 'step');
  assert.equal(frames.size, 0);
});
test('lazy modal stays dismissible while loading, traps focus, handles chunk failure and restores opener', async () => {
  const Pending = lazy(() => new Promise<{ default: React.ComponentType }>(() => {}));
  let closed = 0;
  await mount(<LazyModal dict={ru} onClose={() => { closed++; }}><Pending /></LazyModal>);
  const dialog = document.querySelector('[role="dialog"]')!;
  assert.ok(dialog.contains(document.activeElement));
  assert.ok(document.getElementById('opener')!.hasAttribute('inert'));
  await act(async () => document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true })));
  assert.equal(closed, 1);
  await act(async () => root.render(null));
  assert.equal(document.activeElement, document.getElementById('opener'));
  const Failing = lazy(() => Promise.reject(new Error('chunk unavailable')));
  const original = console.error; console.error = () => {};
  try { await act(async () => root.render(<LazyModal dict={ru} onClose={() => { closed++; }}><Failing /></LazyModal>)); }
  finally { console.error = original; }
  assert.ok(document.querySelector('[role="dialog"] [role="alert"]'));
  await act(async () => (document.querySelector(`[aria-label="${ru.compare.close}"]`) as HTMLButtonElement).click());
  assert.equal(closed, 2);
});

test('focus survives replacement of the loading dialog by a resolved lazy chunk', async () => {
  let resolve!: (value: { default: React.ComponentType }) => void;
  const Deferred = lazy(() => new Promise<{ default: React.ComponentType }>(done => { resolve = done; }));
  await mount(<LazyModal dict={ru} onClose={() => {}}><Deferred /></LazyModal>);
  await act(async () => resolve({ default: () => <GlassModal open title="Loaded" closeLabel="Close" onClose={() => {}}><input aria-label="Last control" /></GlassModal> }));
  const dialog = document.querySelector('[role="dialog"]')!;
  assert.ok(dialog.contains(document.activeElement));
  await act(async () => document.dispatchEvent(new dom.window.KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true })));
  assert.equal(document.activeElement, dialog.querySelector('input'));
  await act(async () => root.render(null));
  assert.equal(document.activeElement, document.getElementById('opener'));
  assert.equal(document.querySelector('[inert]'), null);
});
