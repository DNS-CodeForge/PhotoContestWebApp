import React from 'react';
import classes from './ContestCard.module.css';
import image from "../assets/react.svg";

const formatDate = (date) => {
    const optionsDate = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    };

    const optionsTime = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, // 24-hour format
    };

    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString(undefined, optionsDate);
    const formattedTime = dateObj.toLocaleTimeString(undefined, optionsTime);

    return `${formattedTime} | ${formattedDate}`;
};

const ContestCard = ({ contest }) => {
    return (
        <li className={classes.contest}>
            <a href={contest.link} className={classes.link}>
                <img src={image} alt={contest.title}/>
                <h3 className={classes.title}>{contest.title}</h3>
                <div className={classes.container}>
                    <div className={classes.submissionPeriod}>
                        <div className={classes.label}>Submission Period</div>
                        <div className={classes.dates}>
                            <div className={classes.dateRange}>
                                <time className={classes.time}>
                                    {formatDate(contest.startDate)}
                                </time>
                                <p>To:</p>
                            </div>
                            <div className={classes.dateRange}>
                                <time className={classes.time}>
                                    {formatDate(contest.submissionEndDate)}
                                </time>
                            </div>
                        </div>
                    </div>
                    <div className={classes.endDate}>
                        <div className={classes.label}>End Date</div>
                        <time className={classes.time}>
                            {formatDate(contest.endDate)}
                        </time>
                    </div>
                </div>

            </a>
        </li>
    )
        ;
};

export default ContestCard;
