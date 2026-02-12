/**
 * Utility function to combine class names
 * A lightweight alternative to clsx
 */
export function cn(...inputs) {
  return inputs
    .flat()
    .filter((x) => typeof x === "string")
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}