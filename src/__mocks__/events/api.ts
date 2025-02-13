import { http, HttpResponse } from 'msw';

import { addEvent, makeNewEvent, makeNewEventsList } from './utils';
import { Event, EventForm } from '../../types';

export const getEvents = (mockData: { events: Event[] }, isError?: boolean) => {
  return http.get('/api/events', () => {
    if (isError) return HttpResponse.json(null, { status: 500 });

    return HttpResponse.json(mockData);
  });
};

export const createEvent = (mockData: { events: Event[] }, isError?: boolean) => {
  return http.post('/api/events', async ({ request }) => {
    if (isError) return HttpResponse.json(null, { status: 500 });

    const eventForm = (await request.json()) as EventForm | Event;

    const newEvent = makeNewEvent(eventForm);
    mockData.events = addEvent(mockData.events, newEvent);

    return HttpResponse.json(newEvent, { status: 201 });
  });
};

export const updateEvent = (mockData: { events: Event[] }, isError?: boolean) => {
  return http.put('/api/events/:id', async ({ params, request }) => {
    if (isError) return HttpResponse.json(null, { status: 500 });

    const { id } = params;
    const foundEvent = mockData.events.find((event) => event.id === id);

    if (!foundEvent) return HttpResponse.json(null, { status: 404 });

    const updatedEventForm = (await request.json()) as EventForm;
    const updatedEvent: Event = { id: id as string, ...updatedEventForm };
    mockData.events = mockData.events.map((event) => (event.id === id ? updatedEvent : event));

    return HttpResponse.json(updatedEvent);
  });
};

export const deleteEvent = (mockData: { events: Event[] }, isError?: boolean) => {
  return http.delete('/api/events/:id', async ({ params }) => {
    if (isError) return HttpResponse.json(null, { status: 500 });

    const { id } = params;
    const foundEvent = mockData.events.find((event) => event.id === id);

    if (!foundEvent) return HttpResponse.json(null, { status: 404 });

    mockData.events = mockData.events.filter((event) => event.id !== id);

    return new HttpResponse(null, { status: 204 });
  });
};

export const createEventsList = (mockData: { events: Event[] }, isError?: boolean) => {
  return http.post('/api/events-list', async ({ request }) => {
    if (isError) return HttpResponse.json(null, { status: 500 });

    const { events } = (await request.json()) as { events: EventForm[] | Event[] };

    const newEvents = makeNewEventsList(events);

    for (const event of newEvents) {
      mockData.events = addEvent(mockData.events, event);
    }

    return HttpResponse.json(newEvents, { status: 201 });
  });
};

export const updateEventsList = (mockData: { events: Event[] }, isError?: boolean) => {
  return http.put('/api/events-list', async ({ request }) => {
    if (isError) return HttpResponse.json(null, { status: 500 });

    let isUpdated = false;

    const { events: updatedEvents } = (await request.json()) as { events: Event[] };

    const newEvents = mockData.events.map((event) => {
      const founedEvent = updatedEvents.find((updatedEvent) => updatedEvent.id === event.id);
      if (founedEvent) {
        isUpdated = true;
        return { ...event, ...founedEvent };
      }
      return event;
    });

    if (!isUpdated) return HttpResponse.json(null, { status: 404 });

    mockData.events = newEvents;
    return HttpResponse.json(newEvents);
  });
};

export const deleteEventsList = (mockData: { events: Event[] }, isError?: boolean) => {
  return http.delete('/api/events-list', async ({ request }) => {
    if (isError) return HttpResponse.json(null, { status: 500 });

    const { eventIds } = (await request.json()) as { eventIds: string[] };

    mockData.events = mockData.events.filter((event) => !eventIds.includes(event.id));

    return new HttpResponse(null, { status: 204 });
  });
};
