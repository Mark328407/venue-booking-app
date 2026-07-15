const DAY_START = 8; // 8am
const DAY_END = 22; // 10pm
const HOURS = Array.from({ length: DAY_END - DAY_START }, (_, i) => DAY_START + i);

function toMinutes(time) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export default function AvailabilityStrip({ bookedSlots, selectedStart, selectedEnd }) {
  const isBooked = (hour) => {
    const slotStart = hour * 60;
    const slotEnd = (hour + 1) * 60;
    return bookedSlots.some(
      (slot) => toMinutes(slot.startTime) < slotEnd && toMinutes(slot.endTime) > slotStart
    );
  };

  const isSelected = (hour) => {
    if (!selectedStart || !selectedEnd) return false;
    const slotStart = hour * 60;
    const slotEnd = (hour + 1) * 60;
    return toMinutes(selectedStart) < slotEnd && toMinutes(selectedEnd) > slotStart;
  };

  return (
    <div className="availability-strip">
      <div className="availability-strip-label">
        <span>Availability for selected date</span>
      </div>
      <div className="availability-track">
        {HOURS.map((hour) => {
          const booked = isBooked(hour);
          const selected = !booked && isSelected(hour);
          return (
            <div
              key={hour}
              className={`availability-slot${booked ? " booked" : ""}${selected ? " selected" : ""}`}
              title={`${hour}:00 – ${hour + 1}:00`}
            />
          );
        })}
      </div>
      <div className="availability-hours">
        <span>{DAY_START}:00</span>
        <span>{DAY_END}:00</span>
      </div>
      <div className="availability-legend">
        <span>
          <span className="legend-swatch free" /> Open
        </span>
        <span>
          <span className="legend-swatch booked" /> Booked
        </span>
        <span>
          <span className="legend-swatch selected" /> Your selection
        </span>
      </div>
    </div>
  );
}
