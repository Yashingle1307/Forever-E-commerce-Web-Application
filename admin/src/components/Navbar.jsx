import React from 'react';
import { assets } from '../assets/assets';

export default function Navbar({ setToken }) {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <img className="w-[max(10%,80px)]" src={assets.logo} alt="Logo" />
      
      <button 
        onClick={() => setToken('')}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full sm:text-base cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}
