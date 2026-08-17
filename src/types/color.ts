export interface RGB {
  r: number;
  g: number;
  b: number;
}

export interface HSL {
  h: number;
  s: number;
  l: number;
}

export interface Colour {
  hex: string;
  rgb: RGB;
  hsl: HSL;
}
