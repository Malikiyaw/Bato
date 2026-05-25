// utils.js – shared utility functions
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function lerp(a, b, t) {
  return a + (b - a) * t;
}
