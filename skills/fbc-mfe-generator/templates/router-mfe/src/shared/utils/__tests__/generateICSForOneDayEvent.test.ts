import { generateICSForOneDayEvent } from '../generateICSForOneDayEvent';

describe('generateICSForOneDayEvent', () => {
  beforeAll(() => {
    // Freeze time so UID and DTSTAMP are predictable
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-10T12:00:00Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('generates a valid ICS string for a one-day event', () => {
    const date = new Date('2024-02-15T00:00:00Z');

    const result = generateICSForOneDayEvent({
      title: 'Inspection Day',
      description: 'Factory inspection',
      date,
      location: 'Santiago',
    });

    expect(result).toContain('BEGIN:VCALENDAR');
    expect(result).toContain('VERSION:2.0');
    expect(result).toContain('BEGIN:VEVENT');

    // UID uses Date.now(), which is now mocked
    expect(result).toContain('UID:1704888000000@yourcompany.com');

    // DTSTAMP uses mocked system time
    expect(result).toContain('DTSTAMP:20240110');

    // Start date formatted correctly
    expect(result).toContain('DTSTART;VALUE=DATE:20240215');

    // End date is +1 day
    expect(result).toContain('DTEND;VALUE=DATE:20240216');

    expect(result).toContain('SUMMARY:Inspection Day');
    expect(result).toContain('DESCRIPTION:Factory inspection');
    expect(result).toContain('LOCATION:Santiago');

    expect(result).toContain('END:VEVENT');
    expect(result).toContain('END:VCALENDAR');
  });

  it('handles missing description and location', () => {
    const date = new Date('2024-03-01T00:00:00Z');

    const result = generateICSForOneDayEvent({
      title: 'Event Without Details',
      date,
    });

    expect(result).toContain('DESCRIPTION:');
    expect(result).toContain('LOCATION:');
  });
});
