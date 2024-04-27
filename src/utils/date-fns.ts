import datefns from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

export const differenceInCalendarDays = (
  dateLeft: Date | number,
  dateRight: Date | number,
  timezone: string,
) => {
  const dateLeftZoned = toZonedTime(dateLeft, timezone);
  const dateRightZoned = toZonedTime(dateRight, timezone);

  return datefns.differenceInCalendarDays(dateLeftZoned, dateRightZoned);
};
