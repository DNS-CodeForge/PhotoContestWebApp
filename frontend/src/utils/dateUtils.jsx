import moment from 'moment';

export function arrayToDate(arr) {
    const [year, month, day, hour, minute, second = 0, millisecond = 0] = arr;

    const validMillisecond = Math.floor(millisecond % 1000);

    const date = moment.utc([year, month - 1, day, hour, minute, second, validMillisecond]);
    return date;
}

export function formatDate(date) {
    return date.format('YYYY-MM-DD HH:mm:ss');
}
