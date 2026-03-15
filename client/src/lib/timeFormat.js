// src/utils/timeFormat.js

/**
 * Converts minutes to "Xh Ym" format
 * @param {number} minutes - Total minutes
 * @returns {string} - Formatted time string
 */
export const timeFormat = (minutes) => {
  if (!minutes || typeof minutes !== 'number') return '0h 0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}
