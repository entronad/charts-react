import { DateFormat } from 'package:dart/intl';

// Interface for factory that creates [DateTime] and [DateFormat].
//
// This allows for creating of locale specific date time and date format.
export abstract class DateTimeFactory {
  // TODO: Per cbraun@, we need to allow setting the timezone that
  // is used globally (along with other settings like which day the week starts
  // on. Use DateTimeFactory - either return a local DateTime or a UTC date time
  // based on the setting.

  // TODO: We need to incorporate the time zoned calendar here
  // because Dart DateTime doesn't do this. TZDateTime implements DateTime, so
  // we can use DateTime as the interface.
  abstract createDateTimeFromMilliSecondsSinceEpoch(millisecondsSinceEpoch: number): Date;

  abstract createDateTime(
    year: number,
    month?: number,
    day?: number,
    hour?: number,
    minute?: number,
    second?: number,
    millisecond?: number,
  ): Date;

  // Returns a [DateFormat].
  abstract createDateFormat(pattern: string): DateFormat;
}

// A local time [DateTimeFactory].
export class LocalDateTimeFactory implements DateTimeFactory {
  createDateTimeFromMilliSecondsSinceEpoch = (millisecondsSinceEpoch: number) =>
    new Date(millisecondsSinceEpoch);
  
  createDateTime = (
    year: number,
    month: number = 1,
    day: number = 1,
    hour: number = 0,
    minute: number = 0,
    second: number = 0,
    millisecond: number = 0,
  ) => new Date(year, month, day, hour, minute, second, millisecond);

  // Returns a [DateFormat].
  createDateFormat = (pattern: string) =>
    new DateFormat(pattern);
}

// An UTC time [DateTimeFactory].
export class UTCDateTimeFactory implements DateTimeFactory {
  createDateTimeFromMilliSecondsSinceEpoch = (millisecondsSinceEpoch: number) =>
    new Date(millisecondsSinceEpoch);
  
  createDateTime = (
    year: number,
    month: number = 1,
    day: number = 1,
    hour: number = 0,
    minute: number = 0,
    second: number = 0,
    millisecond: number = 0,
  ) => new Date(Date.UTC(year, month, day, hour, minute, second, millisecond));

  // Returns a [DateFormat].
  createDateFormat = (pattern: string) =>
    new DateFormat(pattern);
}
