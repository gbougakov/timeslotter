const test = require("ava");
const { generateTimeSlots } = require("./index");

test("simple", (t) => {
  const slots = generateTimeSlots(
    "2020-10-30T06:00:00Z",
    "2020-10-30T09:00:00Z",
    60
  );
  t.deepEqual(slots, [
    {
      start: "2020-10-30T06:00:00.000Z",
      end: "2020-10-30T07:00:00.000Z",
    },
    {
      start: "2020-10-30T07:00:00.000Z",
      end: "2020-10-30T08:00:00.000Z",
    },
    {
      start: "2020-10-30T08:00:00.000Z",
      end: "2020-10-30T09:00:00.000Z",
    },
  ]);
});

test("with a different interval", (t) => {
  const slots = generateTimeSlots(
    "2020-10-30T06:00:00Z",
    "2020-10-30T09:00:00Z",
    45,
    60
  );
  t.deepEqual(slots, [
    {
      start: "2020-10-30T06:00:00.000Z",
      end: "2020-10-30T06:45:00.000Z",
    },
    {
      start: "2020-10-30T07:00:00.000Z",
      end: "2020-10-30T07:45:00.000Z",
    },
    {
      start: "2020-10-30T08:00:00.000Z",
      end: "2020-10-30T08:45:00.000Z",
    },
  ]);
});

test("with blocked slots", (t) => {
  const slots = generateTimeSlots(
    "2020-10-30T12:00:00Z",
    "2020-10-30T16:00:00Z",
    45,
    60,
    [{ start: "2020-10-30T13:00:00Z", end: "2020-10-30T14:00:00Z" }]
  );
  t.deepEqual(slots, [
    {
      start: "2020-10-30T12:00:00.000Z",
      end: "2020-10-30T12:45:00.000Z",
    },
    {
      start: "2020-10-30T15:00:00.000Z",
      end: "2020-10-30T15:45:00.000Z",
    },
  ]);
});

test("error - end before start", (t) => {
  t.throws(
    () => generateTimeSlots("2020-10-30T10:00:00Z", "2020-10-30T09:00:00Z", 60),
    { message: "Start date is after end date" }
  );
});

test("error - different days", (t) => {
  t.throws(
    () => generateTimeSlots("2020-10-29T10:00:00Z", "2020-10-30T09:00:00Z", 60),
    { message: "Start and end date are on different days" }
  );
});

test("error - interval less that length", (t) => {
  t.throws(
    () =>
      generateTimeSlots("2020-10-30T08:00:00Z", "2020-10-30T09:00:00Z", 60, 40),
    { message: "Slot interval is less than slot length" }
  );
});
