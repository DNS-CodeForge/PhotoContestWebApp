export function arrayToDate(arr) {
    const [year, month, day, hour, minute, second] = arr;
    return new Date(year, month - 1, day, hour, minute, second);
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
