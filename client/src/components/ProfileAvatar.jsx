import React from 'react';

const ProfileAvatar = ({ name, height, width, border, textSize = 'text-xl' }) => {
  const initials = getInitials(name);

  return (
    <div className={`bg-green-700 text-white flex items-center justify-center font-bold shadow-md ${height} ${width} ${border} ${textSize}`}>
      {initials}
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
