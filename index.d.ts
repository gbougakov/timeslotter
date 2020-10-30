export type Slot = {
  /** Start of blocked time slot, formatted as ISO-8601 */
  start: string,

  /** End of blocked time slot, formatted as ISO-8601 */
  end: string
}

export function generateTimeSlots(
  /** Start time, or more specifically, the beggining of the first slot formatted as ISO-8601 */
  startTime: string,

  /** End time, or more specifically, the time after which slots cannot end formatted as ISO-8601 */
  endTime: string,

  /** Length of the time slot in minutes */
  slotLength: number,

  /** Interval of slot start times, must be equal or more that slotLength */ 
  slotInterval: number | undefined,

  /** List of blocked slots */
  blockedSlots: Slot[] | undefined
): Slot[];
