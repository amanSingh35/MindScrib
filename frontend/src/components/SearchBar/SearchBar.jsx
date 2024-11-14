import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ({ value, onChange, handleSearch, onClearSearch }) => {
  return (
    <div className="flex items-center bg-slate-100 rounded-md w-full max-w-xs md:max-w-md p-2">
      <input
        type="text"
        placeholder="Search Notes"
        className="w-full text-xs bg-transparent py-1 outline-none"
        value={value}
        onChange={onChange}
      />
      {value && (
        <IoMdClose
          className="text-xl text-slate-400 cursor-pointer hover:text-black"
          onClick={onClearSearch}
        />
      )}
      <FaMagnifyingGlass
        className="text-slate-400 cursor-pointer hover:text-black"
        onClick={handleSearch}
      />
    </div>
  );
};

export default SearchBar;
