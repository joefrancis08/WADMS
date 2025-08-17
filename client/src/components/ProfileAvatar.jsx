import React from 'react';

const ProfileAvatar = ({ name, profilePic, height = 'h-12', width = 'w-12', border = 'rounded-full', textSize = 'text-xl' }) => {
  const initials = getInitials(name);

  return (
    <div className={`flex items-center justify-center ${height} ${width} ${border} bg-gray-200 overflow-hidden`}>
      {profilePic ? (
        <img
          src={profilePic}
          alt={name}
          className={`object-cover w-full h-full`} // fill container
        />
      ) : (
        <div className={`bg-green-700 text-white flex items-center justify-center font-bold ${height} ${width} ${border} ${textSize}`}>
          {initials}
        </div>
      )}
    </div>
  );
};

function getInitials(name) {
  if (!name) return '';
  const words = name.trim().split(' ');
  if (words.length === 1) return words[0][0].toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

export default ProfileAvatar;
