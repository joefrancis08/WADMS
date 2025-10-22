 const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;
 const getProfilePicPath = (path) => (
    path?.startsWith?.('http')
      ? path
      : `${PROFILE_PIC_PATH}/${path || 'default-profile-picture.png'}`
 );

 export default getProfilePicPath;