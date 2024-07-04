import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './StarRating.css'; 

const StarRating = ({ initialRating, onChange }) => {
  const [rating, setRating] = useState(initialRating);

  const handleClick = (value) => {
    setRating(value);
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const value = index + 1;
        return (
          <FaStar
            key={index}
            size={24}
            style={{ marginRight: 10, cursor: 'pointer' }}
            color={value <= rating ? '#ffc107' : '#e4e5e9'}
            onClick={() => handleClick(value)}
          />
        );
      })}
    </div>
  );
};

export default StarRating;