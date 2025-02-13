import { faker } from '@faker-js/faker';

import { Event, EventForm } from '../../types';
import { push } from '../../utils/array';

export const makeNewEvent = (eventForm: EventForm | Event): Event => {
  let id = faker.string.uuid();

  // 테스트를 위해 id 까지 넘겨받은 경우 해당 id로 반환
  if ('id' in eventForm) {
    id = eventForm.id;
  }

  return { ...eventForm, id };
};

export const makeNewEventsList = (events: EventForm[] | Event[]): Event[] => {
  const repeatId = faker.string.uuid();

  return events.map((event) => {
    const id = faker.string.uuid();
    const isRepeatEvent = event.repeat.type !== 'none';

    return { ...event, id, repeat: { ...event.repeat, id: isRepeatEvent ? repeatId : undefined } };
  });
};

export const addEvent = (events: Event[], newEvent: Event) => {
  return push(events, newEvent);
};
