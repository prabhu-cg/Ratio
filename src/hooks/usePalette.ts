import { useCallback, useEffect, useMemo, useState } from 'react';
import { toColour } from '@/lib/color';
import { loadPersistedState, patchPersistedState } from '@/lib/storage';
import {
  DEFAULT_HEX,
  DEFAULT_SUPPORTING_HEX,
  ROLE_ORDER,
  SUPPORTING_ROLE_ORDER,
  createDefaultProjectPalette,
} from '@/types/palette';
import type { AnyRoleId, ProjectPalette } from '@/types/palette';

function initialPalette(): ProjectPalette {
  const base = createDefaultProjectPalette();
  const persisted = loadPersistedState();

  const dominant = persisted.dominant ? toColour(persisted.dominant) : null;
  const secondary = persisted.secondary ? toColour(persisted.secondary) : null;
  const accent = persisted.accent ? toColour(persisted.accent) : null;
  const text = persisted.text ? toColour(persisted.text) : null;

  return {
    ratio: {
      dominant: dominant ? { ...base.ratio.dominant, colour: dominant } : base.ratio.dominant,
      secondary: secondary ? { ...base.ratio.secondary, colour: secondary } : base.ratio.secondary,
      accent: accent ? { ...base.ratio.accent, colour: accent } : base.ratio.accent,
    },
    supporting: {
      text: text ? { ...base.supporting.text, colour: text } : base.supporting.text,
    },
  };
}

export function usePalette() {
  const [palette, setPalette] = useState<ProjectPalette>(initialPalette);

  useEffect(() => {
    patchPersistedState({
      dominant: palette.ratio.dominant.colour.hex,
      secondary: palette.ratio.secondary.colour.hex,
      accent: palette.ratio.accent.colour.hex,
      text: palette.supporting.text.colour.hex,
    });
  }, [palette]);

  const setRoleHex = useCallback((roleId: AnyRoleId, hexInput: string): boolean => {
    const colour = toColour(hexInput);
    if (!colour) return false;

    setPalette((prev) =>
      roleId === 'text'
        ? { ...prev, supporting: { text: { ...prev.supporting.text, colour } } }
        : { ...prev, ratio: { ...prev.ratio, [roleId]: { ...prev.ratio[roleId], colour } } },
    );
    return true;
  }, []);

  const resetRole = useCallback((roleId: AnyRoleId) => {
    if (roleId === 'text') {
      const colour = toColour(DEFAULT_SUPPORTING_HEX.text);
      if (!colour) return;
      setPalette((prev) => ({ ...prev, supporting: { text: { ...prev.supporting.text, colour } } }));
      return;
    }

    const colour = toColour(DEFAULT_HEX[roleId]);
    if (!colour) return;
    setPalette((prev) => ({ ...prev, ratio: { ...prev.ratio, [roleId]: { ...prev.ratio[roleId], colour } } }));
  }, []);

  const resetPalette = useCallback(() => {
    setPalette(createDefaultProjectPalette());
  }, []);

  const isModified = useMemo(
    () =>
      ROLE_ORDER.some((id) => palette.ratio[id].colour.hex !== DEFAULT_HEX[id]) ||
      SUPPORTING_ROLE_ORDER.some(
        (id) => palette.supporting[id].colour.hex !== DEFAULT_SUPPORTING_HEX[id],
      ),
    [palette],
  );

  return { palette, setRoleHex, resetRole, resetPalette, isModified };
}
