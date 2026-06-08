import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility helper to join Tailwind class names with logical override merging.
 *
 * @param {ClassValue[]} inputs - Array of raw class expressions.
 * @returns {string} The resolved clean list of classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
