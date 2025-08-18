 const getProfilePicPath = (path) => (
  path 
    ? `${import.meta.env.VITE_PROFILE_PIC_PATH}/${path}`
    : `${import.meta.env.VITE_PROFILE_PIC_PATH}/default-profile-picture.png` 
 );

 export default getProfilePicPath;