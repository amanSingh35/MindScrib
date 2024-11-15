import React, { useState } from "react";
import ProfileInfo from "./Cards/ProfileInfo";
import SearchBar from "./SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onSearchNote, userInfo, handleClearSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearch = () => {
    if (searchQuery) {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch = () => {
    setSearchQuery("");
    handleClearSearch();
  };

  return (
    <div className="bg-white flex flex-wrap items-center justify-between px-4 py-2 drop-shadow-md">
  <h2 className="text-xl font-medium text-black flex-shrink-0">Note</h2>
  <div className="flex-grow mx-4">
    <SearchBar
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      handleSearch={handleSearch}
      onClearSearch={onClearSearch}
    />
  </div>
  <div className="flex-shrink-0">
    <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
  </div>
</div>

  );
};

export default Navbar;
