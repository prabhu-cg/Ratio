import { useCallback, useEffect, useMemo, useState } from 'react';
import { toColour } from '@/lib/color';
import { loadPersistedState, patchPersistedState } from '@/lib/storage';
import { DEFAULT_HEX, ROLE_ORDER, createDefaultPalette } from '@/types/palette';
import type { PaletteRoleId, RatioPalette } from '@/types/palette';

function initialPalette(): RatioPalette {
  const base = createDefaultPalette();
  const persisted = loadPersistedState();

  const dominant = persisted.dominant ? toColour(persisted.dominant) : null;
  const secondary = persisted.secondary ? toColour(persisted.secondary) : null;
  const accent = persisted.accent ? toColour(persisted.accent) : null;

  return {
    dominant: dominant ? { ...base.dominant, colour: dominant } : base.dominant,
    secondary: secondary ? { ...base.secondary, colour: secondary } : base.secondary,
    accent: accent ? { ...base.accent, colour: accent } : base.accent,
  };
}

export function usePalette() {
  const [palette, setPalette] = useState<RatioPalette>(initialPalette);

  useEffect(() => {
    patchPersistedState({
      dominant: palette.dominant.colour.hex,
      secondary: palette.secondary.colour.hex,
      accent: palette.accent.colour.hex,
    });
  }, [palette]);

  const setRoleHex = useCallback((roleId: PaletteRoleId, hexInput: string): boolean => {
    const colour = toColour(hexInput);
    if (!colour) return false;

    setPalette((prev) => ({
      ...prev,
      [roleId]: { ...prev[roleId], colour },
    }));
    return true;
  }, []);

  const resetRole = useCallback((roleId: PaletteRoleId) => {
    const colour = toColour(DEFAULT_HEX[roleId]);
    if (!colour) return;
    setPalette((prev) => ({ ...prev, [roleId]: { ...prev[roleId], colour } }));
  }, []);

  const resetPalette = useCallback(() => {
    setPalette(createDefaultPalette());
  }, []);

  const isModified = useMemo(
    () => ROLE_ORDER.some((id) => palette[id].colour.hex !== DEFAULT_HEX[id]),
    [palette],
  );

  return { palette, setRoleHex, resetRole, resetPalette, isModified };
}
