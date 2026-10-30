export const FONT_STYLES = [
  { id: 'jakarta', name: 'Plus Jakarta Sans', family: "'Plus Jakarta Sans', sans-serif" },
  { id: 'inter', name: 'Inter UI', family: "'Inter', sans-serif" },
  { id: 'mono', name: 'JetBrains Mono', family: "'JetBrains Mono', monospace" },
  { id: 'serif', name: 'Editorial Serif', family: "ui-serif, Georgia, Cambria, 'Times New Roman', serif" },
];

export const FONT_SIZES = [
  { id: 'compact', name: 'Compact', scale: '0.92' },
  { id: 'standard', name: 'Standard', scale: '1.0' },
  { id: 'spacious', name: 'Spacious', scale: '1.08' },
];

export const COLOR_THEMES = [
  {
    id: 'cyan-sapphire',
    name: 'Cyber Cyan & Sapphire (Figma)',
    primary: '#00F0FF',
    accent: '#2563EB',
    glow: 'rgba(0, 240, 255, 0.35)',
    border: 'rgba(37, 99, 235, 0.4)'
  },
  {
    id: 'violet-fuchsia',
    name: 'Neon Violet & Fuchsia',
    primary: '#A855F7',
    accent: '#EC4899',
    glow: 'rgba(168, 85, 247, 0.35)',
    border: 'rgba(236, 72, 153, 0.4)'
  },
  {
    id: 'emerald-teal',
    name: 'Emerald Obsidian',
    primary: '#10B981',
    accent: '#06B6D4',
    glow: 'rgba(16, 185, 129, 0.35)',
    border: 'rgba(6, 182, 212, 0.4)'
  },
  {
    id: 'amber-gold',
    name: 'Sunset Amber & Gold',
    primary: '#F59E0B',
    accent: '#EA580C',
    glow: 'rgba(245, 158, 11, 0.35)',
    border: 'rgba(234, 88, 12, 0.4)'
  },
  {
    id: 'monochrome',
    name: 'Minimalist Mono',
    primary: '#E2E8F0',
    accent: '#94A3B8',
    glow: 'rgba(226, 232, 240, 0.25)',
    border: 'rgba(148, 163, 184, 0.3)'
  }
];

export function applyTheme(themeId, fontId, sizeId) {
  const theme = COLOR_THEMES.find(t => t.id === themeId) || COLOR_THEMES[0];
  const font = FONT_STYLES.find(f => f.id === fontId) || FONT_STYLES[0];
  const size = FONT_SIZES.find(s => s.id === sizeId) || FONT_SIZES[1];

  const root = document.documentElement;
  root.style.setProperty('--font-primary', font.family);
  root.style.setProperty('--font-scale', size.scale);
  root.style.setProperty('--color-primary', theme.primary);
  root.style.setProperty('--color-accent', theme.accent);
  root.style.setProperty('--color-glow', theme.glow);
  root.style.setProperty('--color-border', theme.border);
}
