import moment from 'moment';
import {arrayToDate} from "./dateUtils.jsx";


export function isContestActive(contest) {
    const now = moment();
    const startDate = arrayToDate(contest.startDate);
    const submissionEndDate = arrayToDate(contest.submissionEndDate);

    return now.isAfter(startDate) && now.isBefore(submissionEndDate);
}

export function isContestInRanking(contest) {
    const now = moment();
    const submissionEndDate = arrayToDate(contest.submissionEndDate);
    const endDate = arrayToDate(contest.endDate);

    return now.isAfter(submissionEndDate) && now.isBefore(endDate);
}

export function getContestPhase(contest) {
    if (isContestActive(contest)) {
        return 'active';
    } else if (isContestInRanking(contest)) {
        return 'ranking';
    } else {
        return 'finished';
    }
}
