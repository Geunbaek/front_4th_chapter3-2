import {
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Select,
  Tooltip,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';

import { categories, notificationOptions } from '../constants';
import { RepeatEndType, useEventForm } from '../hooks/useEventForm';
import { Event, EventForm as EventFormData, RepeatEventEditMode, RepeatType } from '../types';
import EventOverlapAlertDialog from './EventOverlapAlertDialog';
import RepeatEventEditOptionsDialog from './RepeatEventEditOptionsDialog';
import useEventOverlapCheck from '../hooks/useEventOverlapCheck';
import { generateRepeatDates } from '../utils/dateRepeat';
import { getTimeErrorMessage } from '../utils/timeValidation';

interface EventFormProps {
  editingEvent: Event | null;
  events: Event[];
  onSubmit: (eventData: Event | EventFormData, repeatEditMode?: 'all' | 'single') => Promise<void>;
}

function EventForm({ editingEvent, events, onSubmit }: EventFormProps) {
  const {
    title,
    setTitle,
    date,
    setDate,
    startTime,
    endTime,
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
  } = useEventForm(editingEvent ?? undefined);

  const { overlappingEvents, checkOverlap, checkEventListOverlap } = useEventOverlapCheck(events);
  const [isOverlapDialogOpen, setIsOverlapDialogOpen] = useState(false);
  const [isRepeatEventEditOptionDialogOpen, setIsRepeatEventEditOptionDialogOpen] = useState(false);
  const [repeatEditMode, setRepeatEditMode] = useState<RepeatEventEditMode>('all');

  const toast = useToast();

  const addOrUpdateEvent = async () => {
    if (!title || !date || !startTime || !endTime) {
      toast({
        title: '필수 정보를 모두 입력해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (startTimeError || endTimeError) {
      toast({
        title: '시간 설정을 확인해주세요.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const eventData: Event | EventFormData = {
      id: editingEvent ? editingEvent.id : undefined,
      title,
      date,
      startTime,
      endTime,
      description,
      location,
      category,
      repeat: {
        ...editingEvent?.repeat,
        type: isRepeating ? repeatType : 'none',
        interval: repeatInterval,
        endDate: repeatEndDate || undefined,
        count: repeatCount || undefined,
      },
      notificationTime,
    };

    // 반복 일정 수정 시
    if (editingEvent?.repeat.id) {
      setIsRepeatEventEditOptionDialogOpen(true);
      return;
    }

    if (eventData.repeat.type === 'none') {
      // 단일 일정 추가 시
      if (checkOverlap(eventData)) {
        setIsOverlapDialogOpen(true);
        return;
      }
    } else {
      // 반복 일정 추가 시
      const dates = generateRepeatDates({
        startDate: eventData.date,
        endDate: eventData.repeat.endDate,
        frequency: eventData.repeat.type,
        interval: eventData.repeat.interval,
        occurrences: eventData.repeat.count,
      });
      const repeatEvents = dates.map((date) => ({ ...eventData, date }));
      if (checkEventListOverlap(repeatEvents)) {
        setIsOverlapDialogOpen(true);
        return;
      }
    }

    await onSubmit(eventData);
    resetForm();
  };

  return (
    <>
      <VStack w="400px" spacing={5} align="stretch">
        <Heading>{editingEvent ? '일정 수정' : '일정 추가'}</Heading>

        <FormControl>
          <FormLabel>제목</FormLabel>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>날짜</FormLabel>
          <Input
            disabled={!!editingEvent?.repeat.id}
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </FormControl>

        <HStack width="100%">
          <FormControl>
            <FormLabel>시작 시간</FormLabel>
            <Tooltip label={startTimeError} isOpen={!!startTimeError} placement="top">
              <Input
                type="time"
                value={startTime}
                onChange={handleStartTimeChange}
                onBlur={() => getTimeErrorMessage(startTime, endTime)}
                isInvalid={!!startTimeError}
              />
            </Tooltip>
          </FormControl>
          <FormControl>
            <FormLabel>종료 시간</FormLabel>
            <Tooltip label={endTimeError} isOpen={!!endTimeError} placement="top">
              <Input
                type="time"
                value={endTime}
                onChange={handleEndTimeChange}
                onBlur={() => getTimeErrorMessage(startTime, endTime)}
                isInvalid={!!endTimeError}
              />
            </Tooltip>
          </FormControl>
        </HStack>

        <FormControl>
          <FormLabel>설명</FormLabel>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>위치</FormLabel>
          <Input value={location} onChange={(e) => setLocation(e.target.value)} />
        </FormControl>

        <FormControl>
          <FormLabel>카테고리</FormLabel>
          <Select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">카테고리 선택</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </Select>
        </FormControl>

        <FormControl>
          <FormLabel>반복 설정</FormLabel>
          <Checkbox
            disabled={!!editingEvent?.repeat.id}
            isChecked={isRepeating}
            onChange={(e) => setIsRepeating(e.target.checked)}
          >
            반복 일정
          </Checkbox>
        </FormControl>

        <FormControl>
          <FormLabel>알림 설정</FormLabel>
          <Select
            value={notificationTime}
            onChange={(e) => setNotificationTime(Number(e.target.value))}
          >
            {notificationOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </FormControl>

        {isRepeating && (
          <VStack width="100%">
            <FormControl>
              <FormLabel>반복 유형</FormLabel>
              <Select
                disabled={!!editingEvent?.repeat.id}
                value={repeatType}
                onChange={(e) => setRepeatType(e.target.value as RepeatType)}
              >
                <option value="daily">매일</option>
                <option value="weekly">매주</option>
                <option value="monthly">매월</option>
                <option value="yearly">매년</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>종료 유형</FormLabel>
              <Select
                disabled={!!editingEvent?.repeat.id}
                value={repeatEndType}
                onChange={(e) => setRepeatEndType(e.target.value as RepeatEndType)}
              >
                <option value="none">없음</option>
                <option value="endDate">반복 종료일</option>
                <option value="count">반복 횟수</option>
              </Select>
            </FormControl>
            <HStack width="100%">
              <FormControl>
                <FormLabel>반복 간격</FormLabel>
                <Input
                  disabled={!!editingEvent?.repeat.id}
                  type="number"
                  value={repeatInterval}
                  onChange={(e) => setRepeatInterval(Number(e.target.value))}
                  min={1}
                />
              </FormControl>
              {repeatEndType === 'endDate' && (
                <FormControl>
                  <FormLabel>반복 종료일</FormLabel>
                  <Input
                    disabled={!!editingEvent?.repeat.id}
                    type="date"
                    value={repeatEndDate}
                    onChange={(e) => setRepeatEndDate(e.target.value)}
                  />
                </FormControl>
              )}
              {repeatEndType === 'count' && (
                <FormControl>
                  <FormLabel>반복 횟수</FormLabel>
                  <Input
                    disabled={!!editingEvent?.repeat.id}
                    type="number"
                    value={repeatCount}
                    onChange={(e) => setRepeatCount(Number(e.target.value))}
                    min={1}
                  />
                </FormControl>
              )}
            </HStack>
          </VStack>
        )}
        <Button data-testid="event-submit-button" onClick={addOrUpdateEvent} colorScheme="blue">
          {editingEvent ? '일정 수정' : '일정 추가'}
        </Button>
      </VStack>
      <EventOverlapAlertDialog
        isOpen={isOverlapDialogOpen}
        overlappingEvents={overlappingEvents}
        onConfirm={(eventData) => {
          onSubmit(eventData, repeatEditMode);
          resetForm();
        }}
        close={() => setIsOverlapDialogOpen(false)}
        savedEvent={{
          id: editingEvent ? editingEvent.id : undefined,
          title,
          date,
          startTime,
          endTime,
          description,
          location,
          category,
          repeat: {
            ...editingEvent?.repeat,
            type: isRepeating ? repeatType : 'none',
            interval: repeatInterval,
            endDate: repeatEndDate || undefined,
            count: repeatCount || undefined,
          },
          notificationTime,
        }}
      />
      <RepeatEventEditOptionsDialog
        events={events}
        isOpen={isRepeatEventEditOptionDialogOpen}
        repeatEditMode={repeatEditMode}
        setRepeatEditMode={setRepeatEditMode}
        checkOverlap={checkOverlap}
        checkEventListOverlap={checkEventListOverlap}
        openOverlapDialog={() => setIsOverlapDialogOpen(true)}
        savedEvent={{
          id: editingEvent ? editingEvent.id : '',
          title,
          date,
          startTime,
          endTime,
          description,
          location,
          category,
          repeat: {
            ...editingEvent?.repeat,
            type: isRepeating ? repeatType : 'none',
            interval: repeatInterval,
            endDate: repeatEndDate || undefined,
            count: repeatCount || undefined,
          },
          notificationTime,
        }}
        onConfirm={onSubmit}
        close={() => setIsRepeatEventEditOptionDialogOpen(false)}
      />
    </>
  );
}

export default EventForm;
