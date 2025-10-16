const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;

const ProfilePicture = ({
  profilePic,
  height = 'h-12',
  width = 'w-12',
  border = 'rounded-full'
}) => {

  return (
    <div className={`flex items-center justify-center ${height} ${width} ${border} overflow-hidden bg-slate-100`}>
      <img
        src={
          profilePic?.startsWith('http')
            ? profilePic
            : `${PROFILE_PIC_PATH}/${profilePic || 'default-profile-picture.png'}`
        }
        className="w-full h-full"
      />
    </div>
  );
};

export default ProfilePicture;
