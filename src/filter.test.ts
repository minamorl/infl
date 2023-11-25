// filter.test.ts
import { filter } from './filter'; // Adjust the import path as needed
import { Event } from './event';

describe('filter function', () => {
    const createEvent = (
      isActive: boolean,
      type: string,
      publisher: string,
      timestamp: number
    ) =>
      new Event({
        id: "test",
        data: {
          hello: "test",
        },

        isActive,
        type,
        publisher,
        timestamp,
      });

    test('should filter out inactive events', () => {
        const events = [
            createEvent(true, 'Type1', 'Publisher1', 1000),
            createEvent(false, 'Type2', 'Publisher2', 2000),
            createEvent(true, 'Type3', 'Publisher3', 3000)
        ];
        const result = filter(events);
        expect(result).toEqual([events[0], events[2]]);
    });

    test('should handle an empty array', () => {
        const events: Event[] = [];
        const result = filter(events);
        expect(result).toEqual([]);
    });

    test('should keep only the most recent 5 events of the same type and publisher', () => {
        const events = [
            createEvent(true, 'Type1', 'Publisher1', 1000),
            createEvent(true, 'Type1', 'Publisher1', 2000),
            createEvent(true, 'Type1', 'Publisher1', 3000),
            createEvent(true, 'Type1', 'Publisher1', 4000),
            createEvent(true, 'Type1', 'Publisher1', 5000),
            createEvent(true, 'Type1', 'Publisher1', 6000)
        ];
        const result = filter(events);
        expect(result).toHaveLength(5);
        expect(result).not.toContain(events[0]);
    });

    test('should sort events by timestamp', () => {
        const events = [
            createEvent(true, 'Type1', 'Publisher1', 3000),
            createEvent(true, 'Type2', 'Publisher2', 1000),
            createEvent(true, 'Type3', 'Publisher3', 2000)
        ];
        const result = filter(events);
        expect(result).toEqual([events[1], events[2], events[0]]);
    });

    // Additional tests for other scenarios and edge cases
});
