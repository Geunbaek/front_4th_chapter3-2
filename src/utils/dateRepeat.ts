import { formatDate } from './dateUtils';

export function generateRepeatDates({
  startDate,
  endDate = '2025-06-30',
  frequency = 'daily',
  interval = 1,
  occurrences = Infinity,
  isLastDayOfMonth = false,
}: {
  startDate: string;
  endDate?: string;
  frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval?: number;
  occurrences?: number;
  isLastDayOfMonth?: boolean;
}) {
  const current = new Date(startDate);
  const end = new Date(endDate);
  let count = 0;

  const dates: string[] = [];

  while (current <= end) {
    if (occurrences && count >= occurrences) break;

    const date = formatDate(current);
    dates.push(date);
    count += 1;

    switch (frequency) {
      case 'daily':
        current.setDate(current.getDate() + interval);
        continue;
      case 'weekly':
        current.setDate(current.getDate() + interval * 7);
        continue;
      case 'monthly': {
        let year = current.getFullYear();
        let month = current.getMonth();
        const date = current.getDate();

        if (isLastDayOfMonth) {
          current.setFullYear(year);
          current.setMonth(month + interval + 1, 0);
          if (month === 13) {
            month = 0;
            year += 1;
          }
        } else {
          do {
            current.setFullYear(year);
            current.setMonth(month + interval);
            current.setDate(date);
            month += interval;
            if (month === 12) {
              month = 0;
              year += 1;
            }
          } while (current <= end && (current.getDate() !== date || current.getMonth() !== month));
        }
        continue;
      }
      case 'yearly': {
        let year = current.getFullYear();
        const month = current.getMonth();
        const date = current.getDate();

        do {
          current.setFullYear(year + interval);
          current.setMonth(month);
          current.setDate(date);
          year += interval;
        } while (
          current <= end &&
          (current.getFullYear() !== year ||
            current.getDate() !== date ||
            current.getMonth() !== month)
        );
        continue;
      }
    }
  }
  return dates;
}
