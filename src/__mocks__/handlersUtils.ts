import { server } from '../setupTests';
import { Event } from '../types';
import {
  createEvent,
  createEventsList,
  deleteEvent,
  deleteEventsList,
  getEvents,
  updateEvent,
  updateEventsList,
} from './events/api';

// ! Hard
// ! 이벤트는 생성, 수정 되면 fetch를 다시 해 상태를 업데이트 합니다. 이를 위한 제어가 필요할 것 같은데요. 어떻게 작성해야 테스트가 병렬로 돌아도 안정적이게 동작할까요?
// ! 아래 이름을 사용하지 않아도 되니, 독립적이게 테스트를 구동할 수 있는 방법을 찾아보세요. 그리고 이 로직을 PR에 설명해주세요.

export const setupMockHandlerCreation = (initEvents = [] as Event[], isError?: boolean) => {
  const mockData = {
    events: [...initEvents],
  };

  server.use(
    getEvents(mockData),
    createEvent(mockData, isError),
    createEventsList(mockData, isError),
    updateEventsList(mockData, isError),
    deleteEventsList(mockData, isError)
  );
};

export const setupMockHandlerUpdating = (initEvents = [] as Event[], isError?: boolean) => {
  const mockData = {
    events: [...initEvents],
  };

  server.use(
    getEvents(mockData),
    updateEvent(mockData, isError),
    createEventsList(mockData, isError),
    updateEventsList(mockData, isError),
    deleteEventsList(mockData, isError)
  );
};

export const setupMockHandlerDeletion = (initEvents = [] as Event[], isError?: boolean) => {
  const mockData = {
    events: [...initEvents],
  };

  server.use(
    getEvents(mockData),
    deleteEvent(mockData, isError),
    createEventsList(mockData, isError),
    updateEventsList(mockData, isError),
    deleteEventsList(mockData, isError)
  );
};

export const setupMockHandler = (initEvents = [] as Event[], isError?: boolean) => {
  const mockData = {
    events: [...initEvents],
  };

  server.use(
    getEvents(mockData),
    createEvent(mockData, isError),
    updateEvent(mockData, isError),
    deleteEvent(mockData, isError),
    createEventsList(mockData, isError),
    updateEventsList(mockData, isError),
    deleteEventsList(mockData, isError)
  );
};
