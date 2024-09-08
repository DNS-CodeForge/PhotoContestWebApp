import { useNavigate } from 'react-router-dom';
import classes from './ContestCard.module.css';
import portraitImage from '../../assets/portrait.png';
import landscapeImage from '../../assets/landscape.png';
import streetImage from '../../assets/street.png';
import wildlifeImage from '../../assets/wild.png';
import abstractImage from '../../assets/abstract.png';

const categoryToImageMap = {
    'PORTRAIT': portraitImage,
    'LANDSCAPE': landscapeImage,
    'STREET': streetImage,
    'WILDLIFE': wildlifeImage,
    'ABSTRACT': abstractImage,
};

const getContestStatus = (startDate, submissionEndDate, endDate) => {
    const start = new Date(startDate);
    const subEnd = new Date(submissionEndDate);
    const end = new Date(endDate);
    const now = new Date();

    if (now < start) {
        return "Starting Soon";
    } else if (now >= start && now < subEnd) {
        return "Ongoing";
    } else if (now >= subEnd && now < end) {
        return "Ranking";
    } else {
        return "Finished";
    }
};

const ContestCard = ({ contest }) => {
    const navigate = useNavigate();


    const handleCardClick = () => {
        navigate(`/contest/${contest.id}`);
    };

    const { category } = contest;
    const image = categoryToImageMap[category.toUpperCase()] || abstractImage;

    return (
        <div className={classes.card} onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div className={classes.card_form}>
                <img src={image} alt='contest category'/>
                <span>{contest.isPrivate ? "Private" : "Public"}
                    <p>{getContestStatus(contest.startDate, contest.submissionEndDate, contest.endDate)}</p>
                </span>
            </div>
            <div className={classes.card_data}>
                <div className={classes.data}>
                    <div className={classes.text}>
                        <div className={classes.cube}>
                            <label className={`${classes.side} ${classes.front}`}>
                                {contest.title}
                            </label>
                            <label className={`${classes.side} ${classes.top}`}>
                                {contest.category}
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContestCard;
