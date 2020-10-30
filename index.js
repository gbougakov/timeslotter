const moment = require("moment");

/**
 * @typedef {Object} Slot
 * @property {string} start Start of blocked time slot, formatted as ISO-8601
 * @property {string} end End of blocked time slot, formatted as ISO-8601
 */

/**
 * Generate time slots
 * @param {string} startTime Start time, or more specifically, the beggining of the first slot formatted as ISO-8601
 * @param {string} endTime End time, or more specifically, the time after which slots cannot end formatted as ISO-8601
 * @param {number} slotLength Length of the time slot in minutes
 * @param {number} slotInterval Interval of slot start times, must be equal or more that slotLength
 * @param {Slot[]} blockedSlots List of blocked slots
 * @returns {Slot[]} List of available slots
 */
function generateTimeSlots(
  startTime,
  endTime,
  slotLength,
  slotInterval = slotLength,
  blockedSlots = []
) {
  if (slotInterval < slotLength) {
    throw new Error("Slot interval is less than slot length");
  }

  if (!moment(startTime).isSame(endTime, "day")) {
    throw new Error("Start and end date are on different days");
  }

  if (moment(startTime).isAfter(endTime)) {
    throw new Error("Start date is after end date");
  }

  const startTimeInMinutes =
    moment(startTime).hour() * 60 + moment(startTime).minute();
  const endTimeInMinutes =
    moment(endTime).hour() * 60 + moment(endTime).minute();

  const timeSlotCount = Math.floor(
    (endTimeInMinutes - startTimeInMinutes) / slotInterval
  );

  const timeSlots = new Array(timeSlotCount)
    .fill(0)
    .map(
      (_, timeSlotNumber) => slotInterval * timeSlotNumber + startTimeInMinutes
    )
    .map((minutes) => {
      const timeSlotStart = moment(startTime);
      timeSlotStart.hour(Math.floor(minutes / 60));
      timeSlotStart.minute(minutes % 60);
      const timeSlotEnd = timeSlotStart.clone();
      timeSlotEnd.add(slotLength, "minutes");
      return {
        start: timeSlotStart.toISOString(),
        end: timeSlotEnd.toISOString(),
      };
    }).filter((slot) => {
      for (const blockedSlot of blockedSlots) {
        if (
          moment(slot.start).isBetween(
            blockedSlot.start,
            blockedSlot.end,
            undefined,
            "[]"
          ) ||
          moment(slot.end).isBetween(
            blockedSlot.start,
            blockedSlot.end,
            undefined,
            "[]"
          ) ||
          moment(blockedSlot.start).isBetween(
            slot.start,
            slot.end,
            undefined,
            "[]"
          ) ||
          moment(blockedSlot.end).isBetween(
            slot.start,
            slot.end,
            undefined,
            "[]"
          )
        ) {
          return false;
        }
      }
      return true;
    });

  return timeSlots;
}

module.exports = {generateTimeSlots};
