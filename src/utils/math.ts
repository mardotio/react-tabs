export const mathClamp = (min: number, max: number, value: number) => (
  Math.max(Math.min(value, max), min)
);
