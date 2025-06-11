export const generateTimeSlots = (
  start = '10:00',
  end = '18:30',
  interval = 30,
  emptySlots = []
) => {
  const slots = [];
  let [hours, minutes] = start.split(':').map(Number);
  const [endHours, endMinutes] = end.split(':').map(Number);
  const endTotalMinutes = endHours * 60 + endMinutes;

  while (hours * 60 + minutes < endTotalMinutes) {
    const time = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0'
    )}`;

    if (emptySlots.includes(time)) {
      slots.push({});
    } else {
      slots.push({ time, available: false });
    }

    minutes += interval;
    if (minutes >= 60) {
      hours++;
      minutes %= 60;
    }
  }

  return slots;
};

export const generateTimeFromIndex = (
  index,
  start = '10:00',
  interval = 30
) => {
  const [startHour, startMin] = start.split(':').map(Number);
  const totalMinutes = startHour * 60 + startMin + index * interval;
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
    2,
    '0'
  )}`;
};
