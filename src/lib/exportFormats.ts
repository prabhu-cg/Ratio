import type { ProjectPalette, RatioPalette } from '@/types/palette';

export function buildCssVariables(palette: ProjectPalette): string {
  return `:root {
  --ratio-dominant: ${palette.ratio.dominant.colour.hex};
  --ratio-secondary: ${palette.ratio.secondary.colour.hex};
  --ratio-accent: ${palette.ratio.accent.colour.hex};
  --ratio-text: ${palette.supporting.text.colour.hex};
}
`;
}

export function buildJsonExport(palette: ProjectPalette): string {
  const data = {
    brand: 'RATIO',
    ratio: {
      dominant: palette.ratio.dominant.colour.hex,
      secondary: palette.ratio.secondary.colour.hex,
      accent: palette.ratio.accent.colour.hex,
    },
    supporting: {
      text: palette.supporting.text.colour.hex,
    },
  };
  return `${JSON.stringify(data, null, 2)}\n`;
}

const SVG_WIDTH = 600;
const SVG_HEIGHT = 200;

export function buildPaletteSvg(palette: RatioPalette): string {
  const dominantWidth = SVG_WIDTH * (palette.dominant.percentage / 100);
  const secondaryWidth = SVG_WIDTH * (palette.secondary.percentage / 100);
  const accentWidth = SVG_WIDTH - dominantWidth - secondaryWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SVG_WIDTH}" height="${SVG_HEIGHT}" viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}">
  <rect x="0" y="0" width="${dominantWidth}" height="${SVG_HEIGHT}" fill="${palette.dominant.colour.hex}" />
  <rect x="${dominantWidth}" y="0" width="${secondaryWidth}" height="${SVG_HEIGHT}" fill="${palette.secondary.colour.hex}" />
  <rect x="${dominantWidth + secondaryWidth}" y="0" width="${accentWidth}" height="${SVG_HEIGHT}" fill="${palette.accent.colour.hex}" />
</svg>
`;
}

/** Renders the same 60/30/10 bar to an offscreen canvas and resolves a PNG Blob. */
export function buildPalettePngBlob(palette: RatioPalette): Promise<Blob | null> {
  const scale = 2;
  const width = SVG_WIDTH * scale;
  const height = SVG_HEIGHT * scale;

  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve(null);
      return;
    }

    const dominantWidth = width * (palette.dominant.percentage / 100);
    const secondaryWidth = width * (palette.secondary.percentage / 100);
    const accentWidth = width - dominantWidth - secondaryWidth;

    ctx.fillStyle = palette.dominant.colour.hex;
    ctx.fillRect(0, 0, dominantWidth, height);
    ctx.fillStyle = palette.secondary.colour.hex;
    ctx.fillRect(dominantWidth, 0, secondaryWidth, height);
    ctx.fillStyle = palette.accent.colour.hex;
    ctx.fillRect(dominantWidth + secondaryWidth, 0, accentWidth, height);

    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

export function downloadTextFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  downloadBlob(blob, filename);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
