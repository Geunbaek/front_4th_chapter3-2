import { ChangeEvent, useEffect, useState } from 'react';

import { Event, RepeatType } from '../types';
import { getTimeErrorMessage } from '../utils/timeValidation';

export type RepeatEndType = 'endDate' | 'count' | 'none';
type TimeErrorRecord = Record<'startTimeError' | 'endTimeError', string | null>;

export const useEventForm = (initialEvent?: Event) => {
  const [title, setTitle] = useState(initialEvent?.title || '');
  const [date, setDate] = useState(initialEvent?.date || '');
  const [startTime, setStartTime] = useState(initialEvent?.startTime || '');
  const [endTime, setEndTime] = useState(initialEvent?.endTime || '');
  const [description, setDescription] = useState(initialEvent?.description || '');
  const [location, setLocation] = useState(initialEvent?.location || '');
  const [category, setCategory] = useState(initialEvent?.category || '');

  const [isRepeating, setIsRepeating] = useState(initialEvent?.repeat.type !== 'none');
  const [repeatType, setRepeatType] = useState<RepeatType>(initialEvent?.repeat.type || 'daily');
  const [repeatEndType, setRepeatEndType] = useState<RepeatEndType>(
    initialEvent?.repeat.endDate ? 'endDate' : initialEvent?.repeat.count ? 'count' : 'none'
  );
  const [repeatInterval, setRepeatInterval] = useState(initialEvent?.repeat.interval || 1);
  const [repeatEndDate, setRepeatEndDate] = useState(initialEvent?.repeat.endDate || '');
  const [repeatCount, setRepeatCount] = useState(initialEvent?.repeat.count || undefined);
  const [notificationTime, setNotificationTime] = useState(initialEvent?.notificationTime || 10);

  const [{ startTimeError, endTimeError }, setTimeError] = useState<TimeErrorRecord>({
    startTimeError: null,
    endTimeError: null,
  });

  const handleStartTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newStartTime = e.target.value;
    setStartTime(newStartTime);
    setTimeError(getTimeErrorMessage(newStartTime, endTime));
  };

  const handleEndTimeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newEndTime = e.target.value;
    setEndTime(newEndTime);
    setTimeError(getTimeErrorMessage(startTime, newEndTime));
  };

  const resetForm = () => {
    setTitle('');
    setDate('');
    setStartTime('');
    setEndTime('');
    setDescription('');
    setLocation('');
    setCategory('');
    setIsRepeating(false);
    setRepeatType('daily');
    setRepeatInterval(1);
    setRepeatEndDate('');
    setRepeatCount(undefined);
    setNotificationTime(10);
  };

  useEffect(() => {
    setTitle(initialEvent?.title || '');
    setDate(initialEvent?.date || '');
    setStartTime(initialEvent?.startTime || '');
    setEndTime(initialEvent?.endTime || '');
    setDescription(initialEvent?.description || '');
    setLocation(initialEvent?.location || '');
    setCategory(initialEvent?.category || '');
    setIsRepeating(!!initialEvent?.repeat.type && initialEvent.repeat.type !== 'none');
    setRepeatType(initialEvent?.repeat.type || 'daily');
    setRepeatEndType(
      initialEvent?.repeat.endDate ? 'endDate' : initialEvent?.repeat.count ? 'count' : 'none'
    );
    setRepeatInterval(initialEvent?.repeat.interval || 1);
    setRepeatEndDate(initialEvent?.repeat.endDate || '');
    setRepeatCount(initialEvent?.repeat.count || undefined);
    setNotificationTime(initialEvent?.notificationTime || 10);
  }, [initialEvent]);

  return {
    title,
    setTitle,
    date,
    setDate,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    description,
    setDescription,
    location,
    setLocation,
    category,
    setCategory,
    isRepeating,
    setIsRepeating,
    repeatType,
    setRepeatType,
    repeatEndType,
    setRepeatEndType,
    repeatInterval,
    setRepeatInterval,
    repeatEndDate,
    setRepeatEndDate,
    repeatCount,
    setRepeatCount,
    notificationTime,
    setNotificationTime,
    startTimeError,
    endTimeError,
    handleStartTimeChange,
    handleEndTimeChange,
    resetForm,
  };
};
