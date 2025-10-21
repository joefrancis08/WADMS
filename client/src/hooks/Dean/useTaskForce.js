import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { USER_ROLES, USER_STATUS } from "../../constants/user";
import PATH from "../../constants/path";
import { useUsersBy } from "../fetch-react-query/useUsers"; // your improved hook that returns an array
import MODAL_TYPES from "../../constants/modalTypes";
import { TOAST_MESSAGES } from "../../constants/messages";
import { checkUserEmail, deleteUser, fetchAccessToken, postUser, updateUser } from "../../api-calls/users/userAPI";
import { showErrorToast, showSuccessToast } from "../../utils/toastNotification";
import { emailRegex } from "../../utils/regEx";
import useOutsideClick from "../useOutsideClick";
import usePageTitle from "../usePageTitle";
import useFetchAccessToken from "../fetch-react-query/useFetchAccessToken";

const { 
  ADD_TF, 
  ADD_TF_CARD, 
  UPDATE_TF,
  TF_DELETION_CONFIRMATION ,
  VIEW_ACCESS_LINK
} = MODAL_TYPES;
const { TASK_FORCE, TASK_FORCE_DETAIL } = PATH.DEAN;
const { TASK_FORCE_CREATION, TASK_FORCE_UPDATE, TASK_FORCE_DELETION } = TOAST_MESSAGES;
const { TASK_FORCE_CHAIR, TASK_FORCE_MEMBER } = USER_ROLES;
const { VERIFIED } = USER_STATUS;

// Utility to normalize user id & names safely
const getUserId = (u) => u.uuid;
const getUserName = (u) => u?.fullName || u?.full_name || u?.name || "";
const getUserEmail = (u) => u?.email || "";

export const useTaskForce = () => {
  // Pull only chair & member — useUsersBy returns an array, not {data: ...}
  const { users, loading, error } = useUsersBy({ role: [TASK_FORCE_CHAIR, TASK_FORCE_MEMBER] });
  const { accessTokens, loadingAccessTokens, errorAccessTokens, refetchAccessTokens } = useFetchAccessToken();
  const navigate = useNavigate();
  const dropdownRef = useRef();

  console.log(users);

  // Normalize and sort once
  const taskForce = useMemo(() => {
    const list = Array.isArray(users) ? users : Array.isArray(users?.data) ? users.data : [];
    return [...list].sort((a, b) => getUserName(a).localeCompare(getUserName(b)));
  }, [users]);

  const taskForceChair = useMemo(
    () => taskForce.filter((u) => u?.role === TASK_FORCE_CHAIR),
    [taskForce]
  );
  const taskForceMember = useMemo(
    () => taskForce.filter((u) => u?.role === TASK_FORCE_MEMBER),
    [taskForce]
  );

  // UI state
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [emailAlreadyExist, setEmailAlreadyExist] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const [infoClick, setInfoClick] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [updatedProfilePic, setUpdatedProfilePic] = useState(null);
  const [formValue, setFormValue] = useState({ fullName: "", email: "", role: "" });
  const [updatedValue, setUpdatedValue] = useState({ fullName: "", email: "", role: "" });

  // Search state (consumed in component)
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Close dropdowns on outside click
  useOutsideClick(dropdownRef, () => setActiveDropdownId(null));
  usePageTitle("Task Force");

  console.log(accessTokens);

  // Prefill update form from selectedUser
  useEffect(() => {
    if (selectedUser) {
      setUpdatedValue({
        fullName: getUserName(selectedUser),
        email: getUserEmail(selectedUser),
        role: selectedUser?.role || "",
      });
    }
  }, [selectedUser]);

  // Debounced email existence check
  useEffect(() => {
    if (!formValue.email) {
      setEmailAlreadyExist(false);
      return;
    }

    const t = setTimeout(async () => {
      try {
        const res = await checkUserEmail(formValue.email);
        setEmailAlreadyExist(Boolean(res?.data?.alreadyExist));
      } catch (err) {
        console.error("Error checking email:", err);
      }
    }, 500);

    return () => clearTimeout(t);
  }, [formValue.email]);

  // Update button disabled logic
  const isUpdateBtnDisabled = useMemo(() => {
    if (!selectedUser) return true;
    const unchanged =
      getUserName(selectedUser).trim() === (updatedValue.fullName || "").trim() &&
      getUserEmail(selectedUser).trim() === (updatedValue.email || "").trim() &&
      (selectedUser?.role || "").trim() === (updatedValue.role || "").trim();

    const profilePicChanged =
      (!!selectedUser?.profile_pic && updatedProfilePic === null) ||
      (!selectedUser?.profile_pic && updatedProfilePic !== null) ||
      (!!selectedUser?.profile_pic && updatedProfilePic !== null);

    const anyEmpty = !updatedValue.fullName?.trim() || !updatedValue.email?.trim();
    const invalidEmail = !emailRegex.test(updatedValue.email || "");

    return (unchanged && !profilePicChanged) || anyEmpty || invalidEmail;
  }, [selectedUser, updatedValue, updatedProfilePic]);

  // Handlers
  const handleSearchToggle = () => setSearchOpen((s) => !s);
  const handleSearchChange = (v) => setSearchQuery(v);

  const handleAddUser = () => {
    activeDropdownId && setActiveDropdownId(null);
    setModalType(ADD_TF);
  };

  const handleAddUserInputChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePic = (file) => { if (file) setProfilePic(file); };
  const handleInfoClick = () => setInfoClick((v) => !v);

  const handleSaveAdded = async (e, options = {}) => {
    e.preventDefault();
    try {
      const data = new FormData();
      const roleFromCard = options?.from === "card" ? options?.data?.role : null;

      data.append("fullName", formValue.fullName);
      data.append("email", formValue.email);
      data.append("role", roleFromCard || formValue.role);
      if (profilePic) data.append("profilePic", profilePic);

      const res = await postUser(data);
      if (res?.data?.success) showSuccessToast(TASK_FORCE_CREATION.SUCCESS);
      else showErrorToast(TASK_FORCE_CREATION.ERROR);
    } catch (error) {
      console.error(error);
      showErrorToast(TASK_FORCE_CREATION.ERROR);
    }
    handleCloseModal({ untoggleDropdown: true, clearForm: true });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleEllipsisClick = (e, user) => {
    e.stopPropagation();
    const id = getUserId(user);
    setActiveDropdownId((prev) => (prev === id ? null : id));
  };

  console.log(modalType);
  const handleDropdown = (e, menu, user) => {
    e.stopPropagation();
    const id = getUserId(user);

    if (menu.label === 'View Access Link') {
      console.log(user);
      setModalType(VIEW_ACCESS_LINK);
      setModalData({
        userId: user.id,
        userUUID: user.uuid,
        email: user.email,
        fullName: user.fullName,
      });
      refetchAccessTokens();

    } else if (menu?.label === "View Details") {
      navigate(TASK_FORCE_DETAIL(id), { state: { from: TASK_FORCE } });
      setActiveDropdownId(null);

    } else if (menu?.label === "Update") {
      setSelectedUser(user);
      setModalType(UPDATE_TF);
      setActiveDropdownId(null);

    } else if (menu?.label === "Delete") {
      setSelectedUser(user);
      setModalType(TF_DELETION_CONFIRMATION);
      setActiveDropdownId(null);
      setModalData({
        fullName: user.fullName
      });
    }
  };

  const handleProfilePicUpdate = (newFile) => { if (newFile) setUpdatedProfilePic(newFile); };

  const handleSaveUpdate = async () => {
    if (!selectedUser) return;
    try {
      const updatedData = new FormData();
      if (updatedProfilePic) updatedData.append("newProfilePic", updatedProfilePic);
      updatedData.append("newFullName", updatedValue.fullName);
      updatedData.append("newEmail", updatedValue.email);
      updatedData.append("newRole", updatedValue.role);

      const res = await updateUser(updatedData, getUserId(selectedUser));
      if (res?.data?.success) showSuccessToast(TASK_FORCE_UPDATE.SUCCESS);
      else showErrorToast(TASK_FORCE_UPDATE.ERROR);
    } catch (error) {
      console.log("Error updating user: ", error);
      showErrorToast(TASK_FORCE_UPDATE.ERROR);
    }
    handleCloseModal({ removeSelectedUser: true });
  };

  const handleConfirmDelete = async (selectedUserId, options = {}) => {
    try {
      const res = await deleteUser(selectedUserId);
      if (res.data.success) showSuccessToast(TASK_FORCE_DELETION.SUCCESS);
      else showErrorToast(TASK_FORCE_DELETION.ERROR);

    } catch (error) {
      console.error("Error deleting user: ", error);
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
    options.viewAccessLink && setModalType(null) && setModalData(null);
    options.clearForm &&
      setFormValue({
        fullName: "",
        email: "",
        role: "",
      });

  };

  const handleChevronClick = () => setToggleDropdown((v) => !v);

  const handleDropdownMenuClick = (role, options = {}) => {
    setToggleDropdown(false);
    options.isForAddUser && setFormValue((prev) => ({ ...prev, role }));
    options.isForUpdateUser && setUpdatedValue((prev) => ({ ...prev, role }));
  };

  const handleAddCardClick = (data) => {
    if (data?.role && data?.from) {
      setModalType(ADD_TF_CARD);
      setModalData({ role: data.role, from: data.from });
    }
  };

  return {
    navigate,
    refs: { dropdownRef },
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
      // normalized, sorted, ready
      taskForceChair,
      taskForceMember,
      updatedValue,
      emailAlreadyExist,
      modalType,
      modalData,
      isUpdateBtnDisabled,
      loading,
      error,
      selectedUser,
      formValue,
      infoClick,
      accessTokens,
      loadingAccessTokens, 
      errorAccessTokens, 
      refetchAccessTokens, 

      // search
      searchOpen,
      searchQuery,
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
      handleAddUser,
      handleAddUserInputChange,
      handleSaveAdded,
      handleSaveUpdate,
      handleAddCardClick,
      handleSearchToggle,
      handleSearchChange,
    },
  };
};
