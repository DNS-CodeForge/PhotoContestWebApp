import { useNavigate } from 'react-router-dom';
import classes from './ContestCard.module.css';
import portraitImage from '../../assets/portrait.png';
import landscapeImage from '../../assets/landscape.png';
import streetImage from '../../assets/street.png';
import wildlifeImage from '../../assets/wild.png';
import abstractImage from '../../assets/abstract.png';
import {arrayToDate} from "../../utils/dateUtils.jsx";
import moment from "moment";

const categoryToImageMap = {
    'PORTRAIT': portraitImage,
    'LANDSCAPE': landscapeImage,
    'STREET': streetImage,
    'WILDLIFE': wildlifeImage,
    'ABSTRACT': abstractImage,
};

const getContestStatus = (startDate, submissionEndDate, endDate) => {
    const start = arrayToDate(startDate);
    const subEnd = arrayToDate(submissionEndDate);
    const end = arrayToDate(endDate);
    const now = new moment;

    if (now.isBefore(start)) {
        return "Starting Soon";
    } else if (now.isBetween(start, subEnd, null, '[)')) {
        return "Ongoing";
    } else if (now.isBetween(subEnd, end, null, '[)')) {
        return "Reviewing";
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
                <span>{contest.private ? "Private" : "Public"}
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
