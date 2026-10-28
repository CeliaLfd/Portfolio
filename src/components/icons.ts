// Simple stroke icons (24×24, currentColor) — inner SVG markup, rendered by Icon.astro
export const icons = {
  database:
    '<ellipse cx="12" cy="5.5" rx="7.5" ry="2.5"/><path d="M4.5 5.5v13c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5v-13"/><path d="M4.5 12c0 1.4 3.4 2.5 7.5 2.5s7.5-1.1 7.5-2.5"/>',
  speechBubble:
    '<path d="M20.5 11.5a8 8 0 0 1-11.7 7.1L3.5 20l1.4-4.9A8 8 0 1 1 20.5 11.5z"/><path d="M8.5 11.5h.01M12.5 11.5h.01M16.5 11.5h.01"/>',
  group:
    '<circle cx="9" cy="8" r="3.25"/><path d="M3 19.5c0-3.3 2.7-5.5 6-5.5s6 2.2 6 5.5"/><path d="M15.5 4.9a3.25 3.25 0 0 1 0 6.2"/><path d="M17.5 14.4c2 .7 3.5 2.6 3.5 5.1"/>',
  layout:
    '<rect x="3.5" y="3.5" width="17" height="17" rx="2.5"/><path d="M3.5 9.5h17M9.5 20.5v-11"/>',
  link:
    '<path d="M10 13.5a4.5 4.5 0 0 0 6.8.5l2.9-2.9a4.5 4.5 0 0 0-6.4-6.4l-1.6 1.6"/><path d="M14 10.5a4.5 4.5 0 0 0-6.8-.5l-2.9 2.9a4.5 4.5 0 0 0 6.4 6.4l1.6-1.6"/>',
  grid:
    '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
  growth:
    '<path d="M3.5 17.5l6-6 4 4 7-7"/><path d="M15 8.5h5.5V14"/>',
  bolt:
    '<path d="M13 3 4.5 13.5H12L11 21l8.5-10.5H12L13 3z"/>',
} as const;

export type IconName = keyof typeof icons;
