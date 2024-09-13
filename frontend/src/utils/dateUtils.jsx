export function arrayToDate(arr) {
    const [year, month, day, hour, minute, second = 0, millisecond = 0] = arr;
    return new Date(year, month - 1, day, hour, minute, second, millisecond);
}

export function formatDate(date) {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: false
    });
}
