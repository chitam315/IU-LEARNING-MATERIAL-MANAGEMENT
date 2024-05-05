import { Tag } from 'antd';
import React, { useState, useEffect } from 'react';

const TimeDifference = ({ createdAt, style }) => {
  const [timeDifference, setTimeDifference] = useState('');

  useEffect(() => {
    const calculateTimeDifference = () => {
      const currentTime = new Date();
      const announcementTime = new Date(createdAt);
      const differenceInSeconds = Math.floor((currentTime - announcementTime) / 1000);

      // Logic to convert seconds to a human-readable format
      const secondsInMinute = 60;
      const secondsInHour = 3600;
      const secondsInDay = 86400;

      if (differenceInSeconds < secondsInDay) {
        const hours = Math.floor(differenceInSeconds / secondsInHour);
        setTimeDifference(`${hours} hour${hours !== 1 ? 's' : ''} ago`);
      } else {
        const days = Math.floor(differenceInSeconds / secondsInDay);
        setTimeDifference(`${days} day${days !== 1 ? 's' : ''} ago`);
      }
    };

    // Call the function initially
    calculateTimeDifference();

    // Update time difference every minute (or as needed)
    const intervalId = setInterval(calculateTimeDifference, 3600000);

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);
  }, [createdAt]);

  return <Tag color='cyan' bordered={false}>{timeDifference}</Tag>;
};

export default TimeDifference;
