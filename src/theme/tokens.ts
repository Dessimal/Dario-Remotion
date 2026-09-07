// Locked visual system — import these everywhere instead of hardcoding values.

export const FONT_DISPLAY = '"Poppins", "Montserrat", sans-serif';
export const FONT_BODY = '"Inter", "Poppins", sans-serif';

export const THEME = {
  monopoly: {
    bgFrom: '#0B0620', bgTo: '#1B0B3D',
    accentColor: '#22D3EE', secondaryColor: '#A855F7',
    textColor: '#F5F3FF',
  },
  outrage: {
    bgFrom: '#170821', bgTo: '#3B0A3D',
    accentColor: '#E879F9', highlightColor: '#5EEAD4',
    textColor: '#FFFFFF',
  },
  underdog: {
    bgFrom: '#140B2E', bgTo: '#341463',
    accentColor: '#FBBF24', neutralColor: '#E9E4FF',
    textColor: '#FFFFFF',
  },
  vox: {
    bgFrom: '#0F0A29', bgTo: '#221049',
    accentColor: '#FDE68A', highlightColor: '#FDE68A',
    blueAccent: '#67E8F9',
    textColor: '#F5F3FF',
  },
} as const;

// Critically-damped spring configs — silky, no bounce, unless noted.
export const SPRINGS = {
  silk: { mass: 0.6, stiffness: 90, damping: 26 },
  flow: { mass: 1, stiffness: 40, damping: 20 },
  drift: { mass: 2, stiffness: 10, damping: 26 },
  rostrum: { mass: 2.4, stiffness: 10, damping: 34 },
  punch: { mass: 0.4, stiffness: 260, damping: 14 }, // the one deliberate "hit" spring
} as const;

export const msToFrame = (ms: number, fps = 30) => Math.round((ms / 1000) * fps);
