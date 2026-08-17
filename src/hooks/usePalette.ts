import { useCallback, useMemo, useState } from 'react';
import { toColour } from '@/lib/color';
import { DEFAULT_HEX, ROLE_ORDER, createDefaultPalette } from '@/types/palette';
import type { PaletteRoleId, RatioPalette } from '@/types/palette';

export function usePalette() {
  const [palette, setPalette] = useState<RatioPalette>(() => createDefaultPalette());

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
