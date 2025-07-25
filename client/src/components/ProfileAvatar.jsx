import React from 'react';

const ProfileAvatar = ({ name, height, width, border }) => {
  const initials = getInitials(name);

  return (
    <div className={`${height} ${width} ${border} bg-green-700 text-white flex items-center justify-center text-xl font-bold shadow-md`}>
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
