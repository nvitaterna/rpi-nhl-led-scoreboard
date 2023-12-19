export const parseMinutesSeconds = (time: string) => {
  const [minutes, seconds] = time.split(':');
  return parseInt(minutes) * 60 + parseInt(seconds);
};

export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (time % 60).toString().padStart(2, '0');

  return `${minutes}:${seconds}`;
};
