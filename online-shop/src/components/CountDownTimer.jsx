import React, { useState, useEffect } from 'react';
import { Typography } from '@mui/material';

const CountdownTimer = (props) => {
  const [timeLeft, setTimeLeft] = useState(props.initialTime);
  const size = props.size;
  const className = props.className;
  const expiredText = props.expiredText;
  const id = props.id;

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.round(totalSeconds % 60)
    return `${hours}h ${minutes}m ${seconds}s`;
  };
  

  // SIZE
  function getSize() {
    if (size === 1) {
      return 'h7'
    }
    if (size === 2) {
      return 'h6'
    }
    if (size === 3) {
      return 'h5'
    }
    if (size === 4) {
      return 'h4'
    }
    if (size === 5) {
      return 'h3'
    }
    if (size === 6) {
      return 'h2'
    }
    if (size === 7) {
      return 'h1'
    }
  }

  


  useEffect(() => {
    if (timeLeft > 0) {
      const timerId = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);

      return () => clearTimeout(timerId);
    }

  }, [timeLeft]);

  return (
    <div id={props.reference} className={className}>
      <Typography variant={getSize()} color={'#6bd0ff'} >{(timeLeft > 0) ? formatTime(timeLeft) : expiredText }</Typography>
    </div>
  );
};

export default CountdownTimer;
