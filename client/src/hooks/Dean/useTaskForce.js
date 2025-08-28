import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { USER_ROLES, USER_STATUS } from "../../constants/user";
import PATH from "../../constants/path";
import { useUsersBy } from "../fetch-react-query/useUsers";
import MODAL_TYPES from "../../constants/modalTypes";
import { TOAST_MESSAGES } from "../../constants/messages";
import { checkUserEmail, deleteUser, postUser, updateUser } from "../../api/users/userAPI";
import { showErrorToast, showSuccessToast } from "../../utils/toastNotification";
import { emailRegex } from "../../utils/regEx";
import { useRef } from "react";

export const useTaskForce = () => {
  const { users, loading, error } = useUsersBy();

  const navigate = useNavigate();
  const dropdownRef = useRef();

  const { ADD_USER, UPDATE_USER, USER_DELETION_CONFIRMATION } = MODAL_TYPES;
  const { TASK_FORCE, TASK_FORCE_DETAIL } = PATH.DEAN;
  const { TASK_FORCE_ADDITION, TASK_FORCE_UPDATE, TASK_FORCE_DELETION } = TOAST_MESSAGES;
  const { TASK_FORCE_CHAIR, TASK_FORCE_MEMBER } = USER_ROLES;
  const { VERIFIED } = USER_STATUS;

  const taskForceChair = users.filter(u => u.role === TASK_FORCE_CHAIR);
  const taskForceMember = users.filter(u => u.role === TASK_FORCE_MEMBER);
  
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [emailAlreadyExist, setEmailAlreadyExist] = useState(false);
  const [modalType, setModalType] = useState(null);
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
        fullName: selectedUser.full_name || '',
        email: selectedUser.email || '',
        role: selectedUser.role || ''
      })
    }
  }, [selectedUser]);

  // Close when clicking outside of the user card menu options
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdownId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
        console.error("Error checking email:", err);
      }
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [formValue.email])

  const isUpdateBtnDisabled = useMemo(() => {
    const unchanged = 
      selectedUser?.full_name.trim() === updatedValue.fullName.trim() &&
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
    setModalType(ADD_USER);
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

  const handleSaveAdded =  async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('fullName', formValue.fullName);
      data.append('email', formValue.email);
      data.append('role', formValue.role);
      if (profilePic) data.append('profilePic', profilePic);

      const res = await postUser(data);

      res?.data?.success && showSuccessToast(TASK_FORCE_ADDITION.SUCCESS);

    } catch (error) {
      console.error(error);
      showErrorToast(TASK_FORCE_ADDITION.ERROR);
    }

    handleCloseModal({untoggleDropdown: true, clearForm: true});
  };

  const handleChange = (e) => {
    setUpdatedValue(prev => ({...prev, [e.target.name]: e.target.value}));
  };

  const handleEllipsisClick = (e, user) => {
    e.stopPropagation();
    setActiveDropdownId(prev => prev === user.user_uuid ? null : user.user_uuid);
  };

  const handleDropdown = (e, menu, user) => {
    e.stopPropagation();

    if (menu?.label === 'View Details') {
      navigate(TASK_FORCE_DETAIL(user?.user_uuid));
      setActiveDropdownId(null);

    } else if (menu?.label === 'Update') {
      handleUpdate(e, user);
      setActiveDropdownId(null);

    } else if (menu?.label === 'Delete') {
      handleDelete(e, user);
      setActiveDropdownId(null);
    }
  };

  const handleUpdate = (e, selectedUser) => {
    e.stopPropagation();
    setSelectedUser(selectedUser);
    setModalType(UPDATE_USER);
  };

  const handleProfilePicUpdate = (newFile) => {
    newFile && setUpdatedProfilePic(newFile);
  }

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
    setModalType(USER_DELETION_CONFIRMATION);
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

    handleCloseModal({removeActiveDropdownId: true, removeSelectedUser: true});
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

  return {
    chevron: {
      handleChevronClick
    },

    data: {
      taskForceChair,
      taskForceMember
    },

    confirmDelete: {
      handleConfirmDelete
    },

    dropdown: {
      activeDropdownId,
      setActiveDropdownId,
      handleDropdown,
      handleDropdownMenuClick,
      toggleDropdown,
      setToggleDropdown
    },

    ellipsis: {
      handleEllipsisClick
    },

    form: {
      updatedValue,
      emailAlreadyExist,
      handleChange
    },

    info: {
      infoClick,
      handleInfoClick
    },

    modal: {
      modalType,
      handleCloseModal
    },

    navigation: {
      navigate,
    },

    profilePic: {
      setProfilePic,
      updatedProfilePic,
      setUpdatedProfilePic,
      handleProfilePicUpdate,
      handleProfilePic
    },

    ref: {
      dropdownRef
    },

    saveButton: {
      isUpdateBtnDisabled
    },

    search: {
      handleSearchClick,
      searchClick
    },

    state: {
      loading, 
      error
    },

    user: {
      selectedUser
    },

    userAdd: {
      formValue,
      handleAddUser,
      handleAddUserInputChange,
      handleSaveAdded
    },

    userDelete: {
      handleDelete
    },

    userUpdate: {
      handleUpdate,
      handleSaveUpdate
    },
  };
};
