import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useState } from "react";
import { ChevronUp, ChevronDown, Check } from "lucide-react";

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
        if (!selectedDate) {
            onClose?.();
            return;
        }

        const date = new Date(selectedDate);

        let h = hour % 12;
        if (ampm === "PM") h += 12;

        date.setHours(h);
        date.setMinutes(minute);
        date.setSeconds(0);

        if (minDate) {
            const min = new Date(minDate);

            const selectedDay = new Date(date);
            selectedDay.setHours(0, 0, 0, 0);

            const minDay = new Date(min);
            minDay.setHours(0, 0, 0, 0);

            if (selectedDay <= minDay) {
                alert("Drop-off must be after pickup date");
                return;
            }
        }

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
                onClick={onClose}
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
                        {selectedDate ? selectedDate.toDateString() : "Select date"} ·{" "}
                        {String(hour).padStart(2, "0")}:
                        {String(minute).padStart(2, "0")} {ampm}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* CALENDAR */}
                    <div className="p-5">
                        <DayPicker
                            key={minDate}
                            mode="single"
                            selected={selectedDate}
                            onSelect={(date) => {
                                if (date) setSelectedDate(date);
                            }}
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

                        <div className="relative p-6 flex justify-center items-center">

                            <div className="flex items-center gap-6">

                                <ModernTime value={hour} onUp={incHour} onDown={decHour} label="Hour" />

                                <div className="text-3xl font-light text-gray-400">:</div>

                                <ModernTime value={minute} onUp={incMinute} onDown={decMinute} label="Min" />

                                {/* AM PM Toggle */}
                                <div className="flex flex-col items-center ml-4">
                                    <div className="bg-gray-100 rounded-full p-1 flex flex-col shadow-inner">
                                        <button
                                            onClick={() => setAmpm("AM")}
                                            className={`px-4 py-1 rounded-full text-sm transition ${ampm === "AM"
                                                ? "btn-dark-gradient text-white shadow-md"
                                                : "text-gray-500"
                                                }`}
                                        >
                                            AM
                                        </button>
                                        <button
                                            onClick={() => setAmpm("PM")}
                                            className={`px-4 py-1 rounded-full text-sm transition ${ampm === "PM"
                                                ? "btn-dark-gradient text-white shadow-md"
                                                : "text-gray-500"
                                                }`}
                                        >
                                            PM
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* SELECT BUTTON */}
                        </div>
                        <button
                            onClick={saveAndClose}
                            className="absolute bottom-4 right-4 btn-dark-gradient text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 text-sm transition"
                        >
                            <Check size={16} />
                            Select
                        </button>

                    </div>
                </div>
            </div>
        </div>
    );
}

function ModernTime({ value, onUp, onDown, label }) {
    return (
        <div className="flex flex-col items-center gap-3">

            <button
                onClick={onUp}
                className="p-2 rounded-full bg-gray-100 hover:bg-indigo-100 transition shadow-sm"
            >
                <ChevronUp size={18} />
            </button>

            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-50 to-white shadow-inner flex items-center justify-center border text-2xl font-semibold">
                {String(value).padStart(2, "0")}
            </div>

            <button
                onClick={onDown}
                className="p-2 rounded-full bg-gray-100 hover:bg-indigo-100 transition shadow-sm"
            >
                <ChevronDown size={18} />
            </button>

            <div className="text-xs text-gray-400">{label}</div>
        </div>
    );
}

