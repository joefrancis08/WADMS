import React from 'react'

const ProfileStack = ({ images = [], maxVisible = 5 }) => {
  const visibleImages = images.slice(0, maxVisible);

  const extraCount = images.length - maxVisible;

  console.log(images);

  return (
    <div className='flex items-center'>
      {Object.entries(visibleImages).map((src, index) => (
        <img 
          key={index}
          src={src}
          alt="Profile Picture"
          className='h-6 w-6 rounded-full border-l border-white/80 -ml-2 first:ml-0'
        />
      ))}

      {extraCount > 0 && (
        <div className='h-6 w-6 rounded-full bg-gray-300 text-xs font-medium flex items-center justify-center border-2 border-white -ml-2'>
          +{extraCount}
        </div>
      )}
    </div>
  )
}

export default ProfileStack
