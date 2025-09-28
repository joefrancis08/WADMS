import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { USER_ROLES, USER_STATUS } from "../../constants/user";
import PATH from "../../constants/path";
import { useUsersBy } from "../fetch-react-query/useUsers";
import MODAL_TYPES from "../../constants/modalTypes";
import { TOAST_MESSAGES } from "../../constants/messages";
import { checkUserEmail, deleteUser, postUser, updateUser } from "../../api-calls/Users/userAPI";
import { showErrorToast, showSuccessToast } from "../../utils/toastNotification";
import { emailRegex } from "../../utils/regEx";
import { useRef } from "react";
import useOutsideClick from "../useOutsideClick";
import usePageTitle from "../usePageTitle";

const { 
  ADD_TF, 
  ADD_TF_CARD, 
  UPDATE_TF,
  TF_DELETION_CONFIRMATION 
} = MODAL_TYPES;
const { TASK_FORCE, TASK_FORCE_DETAIL } = PATH.DEAN;
const { TASK_FORCE_CREATION, TASK_FORCE_UPDATE, TASK_FORCE_DELETION } = TOAST_MESSAGES;
const { TASK_FORCE_CHAIR, TASK_FORCE_MEMBER } = USER_ROLES;
const { VERIFIED } = USER_STATUS;

export const useTaskForce = () => {
  const { users, loading, error } = useUsersBy();

  const navigate = useNavigate();
  const dropdownRef = useRef();

  const taskForceChair = users.filter(u => u.role === TASK_FORCE_CHAIR);
  const taskForceMember = users.filter(u => u.role === TASK_FORCE_MEMBER);
  
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [emailAlreadyExist, setEmailAlreadyExist] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [infoClick, setInfoClick] = useState(false);
  const [searchClick, setSearchClick] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [updatedProfilePic, setUpdatedProfilePic] = useState(null);
  const [formValue, setFormValue] = useState({
    fullName: '',
    email: '',
    role: '',
  });
 
  const [updatedValue, setUpdatedValue] = useState({
    fullName: '',
    email: '',
    role: ''
  });

  useEffect(() => {
    if(selectedUser) {
      setUpdatedValue({
        fullName: selectedUser.fullName || '',
        email: selectedUser.email || '',
        role: selectedUser.role || ''
      })
    }
  }, [selectedUser]);

  // Reuse useOutsideClick hook to make dropdown gone when clicking outside
  useOutsideClick(dropdownRef, () => setActiveDropdownId(null));
  usePageTitle('Task Force | WDMS');

  // Check real-time if email already exist
  useEffect(() => {
    if (!formValue.email) {
      setEmailAlreadyExist(false);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await checkUserEmail(formValue.email);
        setEmailAlreadyExist(res.data.alreadyExist); 

        console.log(res);

        console.log(res.data.alreadyExist);
      } catch (err) {
        console.error('Error checking email:', err);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [formValue.email])

  const isUpdateBtnDisabled = useMemo(() => {
    const unchanged = 
      selectedUser?.fullName.trim() === updatedValue.fullName.trim() &&
      selectedUser?.email.trim() === updatedValue.email.trim() &&
      selectedUser?.role.trim() === updatedValue.role.trim();

    const profilePicChanged =
      (selectedUser?.profile_pic && updatedProfilePic === null) || // removed
      (!selectedUser?.profile_pic && updatedProfilePic !== null) || // added
      (selectedUser?.profile_pic && updatedProfilePic !== null); // replaced

    const anyEmpty = updatedValue.fullName.trim() === '' || updatedValue.email.trim() === '';
    const invalidEmail = !emailRegex.test(updatedValue.email);

    // Enable save if fields changed OR profile pic changed
    return (unchanged && !profilePicChanged) || anyEmpty || invalidEmail;
  }, [selectedUser, updatedValue, updatedProfilePic]);

  const handleSearchClick = () => {
    setSearchClick(!searchClick);
  }

  const handleAddUser = () => {
    activeDropdownId && setActiveDropdownId(null);
    setModalType(ADD_TF);
  };

  const handleAddUserInputChange = (e) => {
    setFormValue(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleProfilePic = (file) => {
    file && setProfilePic(file);
  };

  const handleInfoClick = () => {
    setInfoClick(!infoClick);
  };

  const handleSaveAdded =  async (e, options = {}) => {
    e.preventDefault();
    try {
      const data = new FormData();
      if (options && options.from === 'main') {
        data.append('fullName', formValue.fullName);
        data.append('email', formValue.email);
        data.append('role', formValue.role);
        if (profilePic) data.append('profilePic', profilePic);

      } else if (options && options.from === 'card' && options?.data?.role) {
        data.append('fullName', formValue.fullName);
        data.append('email', formValue.email);
        data.append('role', options?.data?.role);
        if (profilePic) data.append('profilePic', profilePic);
      }

      const res = await postUser(data);

      res?.data?.success && showSuccessToast(TASK_FORCE_CREATION.SUCCESS);

    } catch (error) {
      console.error(error);
      showErrorToast(TASK_FORCE_CREATION.ERROR);
    }

    handleCloseModal({untoggleDropdown: true, clearForm: true});
  };

  const handleChange = (e) => {
    setUpdatedValue(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleEllipsisClick = (e, user) => {
    e.stopPropagation();
    setActiveDropdownId(prev => prev === user.uuid ? null : user.uuid);
  };

  const handleDropdown = (e, menu, user) => {
    e.stopPropagation();

    if (menu?.label === 'View Details') {
      navigate(TASK_FORCE_DETAIL(user?.uuid));
      setActiveDropdownId(null);
      console.log(user?.uuid);

    } else if (menu?.label === 'Update') {
      handleUpdate(e, user);
      setActiveDropdownId(null);

    } else if (menu?.label === 'Delete') {
      handleDelete(e, user);
      setActiveDropdownId(null);
    }
  };

  const handleUpdate = (e, selectedUser) => {
    console.log('Update');
    e.stopPropagation();
    setSelectedUser(selectedUser);
    setModalType(UPDATE_TF);
  };

  const handleProfilePicUpdate = (newFile) => {
    newFile && setUpdatedProfilePic(newFile);
  };

  const handleSaveUpdate = async () => {
    const { fullName, email, role } = updatedValue;

    try {
      const updatedData = new FormData();
      if (updatedProfilePic) updatedData.append('newProfilePic', updatedProfilePic);
      updatedData.append('newFullName', fullName);
      updatedData.append('newEmail', email);
      updatedData.append('newRole', role);
      const res = await updateUser(updatedData, selectedUser?.user_uuid);

      console.log(res);

      res.data.success && showSuccessToast(TASK_FORCE_UPDATE.SUCCESS);

    } catch (error) {
      console.log('Error updating user: ', error);
      showErrorToast(TASK_FORCE_UPDATE.ERROR);
    }

    handleCloseModal({removeSelectedUser: true});
  };

  const handleDelete = (e, selectedUser) => {
    e.stopPropagation();

    setSelectedUser(selectedUser);
    setModalType(TF_DELETION_CONFIRMATION);
  };

  const handleConfirmDelete = async (selectedUserId, options = {}) => {
    try {
      const res = await deleteUser(selectedUserId);
      res.success && showSuccessToast(TASK_FORCE_DELETION.SUCCESS);

    } catch (error) {
      console.error('Error deleting user: ', error);
      showErrorToast(TASK_FORCE_DELETION.ERROR);
    }

    options.navigateBack && navigate(-1);

    handleCloseModal({ removeActiveDropdownId: true, removeSelectedUser: true });
  };

  const handleCloseModal = (options = {}) => {
    setModalType(null);
    setInfoClick(false);

    options.removeSelectedUser && setSelectedUser(null);
    options.untoggleDropdown && setToggleDropdown(false);
    options.removeActiveDropdownId && setActiveDropdownId(null);
    options.clearForm && setFormValue({
      fullName: '',
      email: '',
      role: ''
    });
  };

  const handleChevronClick = () => {
    setToggleDropdown(!toggleDropdown);
  };

  const handleDropdownMenuClick = (role, options = {}) => {
    setToggleDropdown(false);

    options.isForAddUser && setFormValue(prev => ({...prev, role}));
    options.isForUpdateUser && setUpdatedValue(prev => ({...prev, role}));
  };

  const handleAddCardClick = (data) => {
    if (data && data.role && data.from) {
      setModalType(ADD_TF_CARD);
      setModalData({
        role: data.role,
        from: data.from
      });
    }
  };

  return {
    navigate,
    refs: {
      dropdownRef
    },

    states: {
      activeDropdownId,
      setActiveDropdownId,
      toggleDropdown,
      setToggleDropdown,
      setProfilePic,
      updatedProfilePic,
      setUpdatedProfilePic,
    },

    datas: {
      taskForceChair,
      taskForceMember,
      updatedValue,
      emailAlreadyExist,
      modalType,
      modalData,
      isUpdateBtnDisabled,
      searchClick,
      loading, 
      error,
      selectedUser,
      formValue,
      infoClick,
    },

    handlers: {
      handleChevronClick,
      handleConfirmDelete,
      handleDropdown,
      handleDropdownMenuClick,
      handleEllipsisClick,
      handleChange,
      handleInfoClick,
      handleCloseModal,
      handleProfilePicUpdate,
      handleProfilePic,
      handleSearchClick,
      handleAddUser,
      handleAddUserInputChange,
      handleSaveAdded,
      handleDelete,
      handleUpdate,
      handleSaveUpdate,
      handleAddCardClick
    }
  };
};
