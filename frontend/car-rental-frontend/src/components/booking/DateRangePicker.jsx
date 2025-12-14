import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useState } from "react";

export default function DateRangePicker({
    value,
    minDate,
    onSave,
    onClose,
    title = "Pick-up date",
}) {
    const initialDate = value ? new Date(value) : new Date();

    const [selectedDate, setSelectedDate] = useState(initialDate);
    const [hour, setHour] = useState(initialDate.getHours() % 12 || 12);
    const [minute, setMinute] = useState(initialDate.getMinutes());
    const [ampm, setAmpm] = useState(
        initialDate.getHours() >= 12 ? "PM" : "AM"
    );

    /* ---------- SAVE ---------- */
    function saveAndClose() {
        const date = new Date(selectedDate);

        let h = hour % 12;
        if (ampm === "PM") h += 12;

        date.setHours(h);
        date.setMinutes(minute);
        date.setSeconds(0);

        onSave(date.toISOString());
        onClose?.();
    }

    /* ---------- CONTROLS ---------- */
    const incHour = () => setHour(h => (h === 12 ? 1 : h + 1));
    const decHour = () => setHour(h => (h === 1 ? 12 : h - 1));
    const incMinute = () => setMinute(m => (m + 5) % 60);
    const decMinute = () => setMinute(m => (m - 5 + 60) % 60);
    const toggleAmPm = () => setAmpm(a => (a === "AM" ? "PM" : "AM"));

    return (
        <div className="fixed inset-0 z-50">
            {/* BACKDROP — REAL OUTSIDE CLICK */}
            <div
                className="absolute inset-0 bg-black/30"
                onClick={saveAndClose}
            />

            {/* PICKER */}
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-xl max-w-3xl w-full"
                onClick={e => e.stopPropagation()} // prevent backdrop click
            >
                {/* HEADER */}
                <div className="px-6 py-4 border-b">
                    <div className="text-sm text-gray-500">{title}</div>
                    <div className="text-lg font-semibold">
                        {selectedDate.toDateString()} ·{" "}
                        {String(hour).padStart(2, "0")}:
                        {String(minute).padStart(2, "0")} {ampm}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* CALENDAR */}
                    <div className="p-5">
                        <DayPicker
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            disabled={
                                minDate
                                    ? { before: new Date(minDate) }
                                    : { before: new Date() }
                            }
                            className="text-sm" modifiersClassNames={
                                {
                                    selected: "bg-indigo-600 text-white rounded-full",
                                    today: "text-red-600 font-semibold",
                                }
                            }
                        />
                    </div>

                    {/* TIME */}
                    <div className="border-l p-5 flex justify-center items-center gap-6">
                        <Time value={hour} onUp={incHour} onDown={decHour} />
                        <div className="text-2xl font-bold">:</div>
                        <Time value={minute} onUp={incMinute} onDown={decMinute} />

                        <div className="flex flex-col items-center gap-2">
                            <button onClick={toggleAmPm}>▲</button>
                            <div className="font-semibold">{ampm}</div>
                            <button onClick={toggleAmPm}>▼</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Time({ value, onUp, onDown }) {
    return (
        <div className="flex flex-col items-center gap-2">
            <button onClick={onUp}>▲</button>
            <div className="text-2xl font-bold w-10 text-center">
                {String(value).padStart(2, "0")}
            </div>
            <button onClick={onDown}>▼</button>
        </div>
    );
}
