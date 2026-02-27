export function nanoid(size?: number): string {
  const base = Math.random().toString(36).slice(2);
  return (base + base).slice(0, size ?? 21);
}
