export default function DateRangePicker({
    startDate,
    endDate,
    onStartChange,
    onEndChange,
}) {
    return (
        <div className="space-y-3">
            <div>
                <label className="label">Start Date & Time</label>
                <input
                    type="datetime-local"
                    value={startDate}
                    onChange={(e) => onStartChange(e.target.value)}
                    className="input"
                />
            </div>

            <div>
                <label className="label">End Date & Time</label>
                <input
                    type="datetime-local"
                    value={endDate}
                    onChange={(e) => onEndChange(e.target.value)}
                    className="input"
                />
            </div>
        </div>
    );
}
