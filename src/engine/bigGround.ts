/**
 * The large ground decor (the Gardebois bridge, `big` in scripts/tiles-def.mjs) : one picture over a block of water
 * cells, drawn with the ground. Two things set it apart from a flat picture (retour de Cyril, 2026-11-04 : « il passe à
 * côté, pas dessus ; on voit que c'est une image de fond ») :
 * - its deck must lie on the line where the walkers' feet go: the picture is moved by `shift` ;
 * - its front railing hides the walkers' feet: the lowest pixels of each column of the picture (its railing and the
 *   deck's edge) are drawn a second time, over the walkers of the block and under whatever stands in front of it.
 */
export interface BigGroundArt {
  /** Moves the picture from its default place (centred on the block, its bottom on the front cell's), in pixels. */
  shift: { x: number; y: number };
  /**
   * The front of the picture: how high the railing and the deck's edge rise above the lowest pixel of each column, and
   * the first column where they start (the stone footing before it stays on the ground: a fern grows in front of it).
   */
  front: { height: number; fromX: number };
}

export const BIG_GROUND_ART: Record<string, BigGroundArt> = {
  // Measured on public/decor/pont.png: the deck lay about 18 px behind the feet line (half a cell along the rows); its
  // front railing and edge rise 14 px, from its first front post (x 34).
  pont: { shift: { x: -18, y: 9 }, front: { height: 14, fromX: 34 } },
};

/** An opaque enough pixel belongs to the picture. */
const OPAQUE = 128;

/**
 * Keeps only the front of a picture (RGBA, row by row): in each column from `fromX`, the pixels at most `height` above
 * its lowest opaque pixel. Everything else becomes transparent. Changes `data` in place.
 */
export function keepFront(data: Uint8ClampedArray, width: number, imageHeight: number, { height, fromX }: BigGroundArt['front']): Uint8ClampedArray {
  for (let x = 0; x < width; x++) {
    let lowest = -1;
    for (let y = imageHeight - 1; y >= 0 && x >= fromX; y--) {
      if (data[(y * width + x) * 4 + 3] >= OPAQUE) {
        lowest = y;
        break;
      }
    }
    for (let y = 0; y < imageHeight; y++) {
      if (lowest < 0 || y < lowest - height) data[(y * width + x) * 4 + 3] = 0;
    }
  }
  return data;
}
