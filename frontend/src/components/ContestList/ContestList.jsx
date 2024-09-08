import ContestCard from '../ContestCard/ContestCard.jsx';
import classes from './ContestList.module.css';

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
