import React from 'react';
import classes from './ContestCard.module.css'; // Import the CSS module

const ContestCard = ({ contest }) => {
    return (
        <li className={classes.contest}>
            <a href={contest.link} className={classes.link}>
                <img src={contest.image} alt={contest.title} className={classes.image} />
                <h3 className={classes.title}>{contest.title}</h3>
                <time className={classes.time}>{contest.date}</time>
            </a>
        </li>
    );
};

export default ContestCard;
