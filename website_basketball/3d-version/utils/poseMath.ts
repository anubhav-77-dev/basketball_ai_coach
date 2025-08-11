export function getAngle(a: {x: number, y: number}, b: {x: number, y: number}, c: {x: number, y: number}): number {
  // Returns angle at point b in degrees
  const ab = {x: a.x - b.x, y: a.y - b.y};
  const cb = {x: c.x - b.x, y: c.y - b.y};
  const dot = ab.x * cb.x + ab.y * cb.y;
  const magAB = Math.sqrt(ab.x**2 + ab.y**2);
  const magCB = Math.sqrt(cb.x**2 + cb.y**2);
  const angleRad = Math.acos(dot / (magAB * magCB));
  return angleRad * (180 / Math.PI);
} 