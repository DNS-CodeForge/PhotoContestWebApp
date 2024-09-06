import React from 'react';
import ContestCard from './ContestCard'; // Import the ContestCard component
import classes from './ContestList.module.css'; // Import the CSS module

const ContestList = ({ contests }) => {
    return (
        <section className={classes.allContests}>
            <h2>Contests</h2>
            <ul className={classes.contestGrid}>
                {contests.map((contest) => (
                    <ContestCard key={contest.id} contest={contest} />
                ))}
            </ul>
        </section>
    );
};

export default ContestList;
