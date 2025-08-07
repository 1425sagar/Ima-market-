import React from "react";

const Navbar = ({ setToken, setAdminId }) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between">
      <h1 className="text-xl md:text-3xl text-yellow-400">
        IMA-Market
        <span className="text-xs md:text-base text-black"> Admin Panel</span>
      </h1>
      <button
        onClick={() => {
          setToken("");
          setAdminId("");
        }}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
