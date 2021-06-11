import React from 'react';
import './details.scss';

type PropsDetails = {
  icon: string;
  data: number | string;
  simbol?: string | '';
};

const Details = ({ icon, data, simbol }: PropsDetails) => {
  return (
    <div className="details">
      <img src={icon} alt="min-temp" className="details--icon" />
      <p className="details--value">
        {data}
        <span>{simbol}</span>
      </p>
    </div>
  );
};

export default Details;
