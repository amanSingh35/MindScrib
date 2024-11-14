import React from "react";
import { getinitials } from "../../utils/helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
  if (!userInfo) {
    return null; // or a loading indicator
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {getinitials(userInfo.fullName)}
      </div>
      <div className="flex flex-col items-start">
        <p className="text-sm font-medium">{userInfo.fullName}</p>
        <button className="text-xs text-blue-700 underline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
