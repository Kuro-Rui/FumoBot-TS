export function formatDuration(seconds: number): string {
    const years = Math.floor(seconds / (365 * 24 * 60 * 60));
    seconds -= years * (365 * 24 * 60 * 60);

    const months = Math.floor(seconds / (30 * 24 * 60 * 60));
    seconds -= months * (30 * 24 * 60 * 60);

    const days = Math.floor(seconds / (24 * 60 * 60));
    seconds -= days * (24 * 60 * 60);

    const hours = Math.floor(seconds / (60 * 60));
    seconds -= hours * (60 * 60);

    const minutes = Math.floor(seconds / 60);
    seconds -= minutes * 60;

    const result = [];
    if (years > 0) result.push(`${years} year${years !== 1 ? "s" : ""}`);
    if (months > 0) result.push(`${months} month${months !== 1 ? "s" : ""}`);
    if (days > 0) result.push(`${days} day${days !== 1 ? "s" : ""}`);
    if (hours > 0) result.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    if (minutes > 0) result.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
    if (seconds > 0 || result.length === 0)
        result.push(`${seconds} second${seconds !== 1 ? "s" : ""}`);

    if (result.length > 1) {
        const last = result.pop();
        return `${result.join(", ")}, and ${last}`;
    }

    return result.join(", ");
}
