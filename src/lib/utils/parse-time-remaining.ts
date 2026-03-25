/**
 * Parse a string time in format "MM:SS" to total seconds remaining.
 * @param time remaining time in format "MM:SS"
 */
export const parseTimeRemaining = (time: string): number => {
  const [minutes, seconds] = time.split(':').map(Number);

  return minutes * 60 + seconds;
};
