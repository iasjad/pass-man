import React from 'react';

const Footer = () => {
  return (
    <div className="bg-gray-900 text-white py-2 flex flex-col justify-center items-center">
      <div className="log font-bold text-2xl ">
        <span className="text-blue-800 border-b-2 border-white">Pass</span>
        <span className="text-red-800 border-t-2 border-white">Man</span>
        <span className="text-yellow-400">&#x26BF;</span>
      </div>
      <div className="flex gap-1 py-2">
        Created By{' '}
        <a href="https://github.com/iasjad" target="_blank" rel="noreferrer">
          {' '}
          github.com/iasjad
        </a>
      </div>
    </div>
  );
};

export default Footer;
