import { useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

import * as apis from '../apis/events';
import { Event, EventForm } from '../types';
import { generateRepeatDates } from '../utils/dateRepeat';

export const useEventOperations = (editing: boolean, onSave?: () => void) => {
  const [events, setEvents] = useState<Event[]>([]);
  const toast = useToast();

  const fetchEvents = async () => {
    try {
      const events = await apis.fetchEvents();
      setEvents(events);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast({
        title: '이벤트 로딩 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const saveEvent = async (
    eventData: Event | EventForm,
    repeatEditMode: 'single' | 'all' = 'single'
  ) => {
    const isRepeatEvent = !!eventData.repeat.id;
    try {
      if (editing) {
        // 이벤트 수정
        if (isRepeatEvent) {
          // 기존 반복 이벤트
          // -> repeatEditMode: all 같은 반복이벤트 모두 수정
          // -> repeatEditMode: single 현재 이벤트만 삭제 후 단일 이벤트로 수정
          if (eventData.repeat.type === 'none') return;
          if (repeatEditMode === 'all') {
            const repeatEvents = events
              .filter((event) => event.repeat.id === eventData.repeat.id)
              .map((event) => ({
                ...eventData,
                id: event.id,
                date: event.date,
              }));
            await apis.updateEventsList(repeatEvents);
          } else {
            await apis.deleteEvent((eventData as Event).id);
            await apis.addEvent({ ...eventData, repeat: { ...eventData.repeat, id: undefined } });
          }
        } else {
          await apis.updateEvent(eventData as Event);
        }
      } else {
        // 이벤트 추가
        // 기본 일정 추가: addEvent 호출
        // 반복 일정 추가: addEventList 호출
        if (eventData.repeat.type === 'none') {
          await apis.addEvent(eventData as EventForm);
        } else {
          const dates = generateRepeatDates({
            startDate: eventData.date,
            endDate: eventData.repeat.endDate,
            frequency: eventData.repeat.type,
            interval: eventData.repeat.interval,
            occurrences: eventData.repeat.count,
          });
          const repeatEvents = dates.map((date) => ({ ...eventData, date }));
          await apis.addEventsList(repeatEvents);
        }
      }

      await fetchEvents();
      onSave?.();
      toast({
        title: editing ? '일정이 수정되었습니다.' : '일정이 추가되었습니다.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error saving event:', error);
      toast({
        title: '일정 저장 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const deleteEvent = async (id: string | string[]) => {
    try {
      if (!Array.isArray(id)) {
        await apis.deleteEvent(id);
      } else {
        await apis.deleteEventsList(id);
      }
      await fetchEvents();
      toast({
        title: '일정이 삭제되었습니다.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting event:', error);
      toast({
        title: '일정 삭제 실패',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  async function init() {
    await fetchEvents();
    toast({
      title: '일정 로딩 완료!',
      status: 'info',
      duration: 1000,
    });
  }

  useEffect(() => {
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { events, fetchEvents, saveEvent, deleteEvent };
};
