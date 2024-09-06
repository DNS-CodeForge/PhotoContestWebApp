import React from 'react';
import classes from './ContestCard.module.css';
import image from "../assets/desert.png";

const formatDate = (date) => {
    const optionsDate = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    };

    const optionsTime = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };

    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString(undefined, optionsDate);
    const formattedTime = dateObj.toLocaleTimeString(undefined, optionsTime);

    return `${formattedTime} | ${formattedDate}`;
};

const ContestCard = ({ contest }) => {
 return (
    <div className={classes.card}>
      <div className={classes.card_form}>
        <img src={image} alt='image'/>
        <span>{contest.isPrivate ? "Private" : "Public"}</span>
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
 )
};

export default ContestCard;
