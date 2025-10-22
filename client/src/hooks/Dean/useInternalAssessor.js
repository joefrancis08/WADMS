import { useRef, useState } from "react";
import useOutsideClick from "../useOutsideClick";
import MODAL_TYPE from "../../constants/modalTypes";
import usePageTitle from "../usePageTitle";
import useAutoFocus from "../useAutoFocus";
import { deleteUser, postUser } from "../../api-calls/users/userAPI";
import { USER_ROLES } from "../../constants/user";
import { showErrorToast, showSuccessToast } from "../../utils/toastNotification";
import { TOAST_MESSAGES } from "../../constants/messages";
import { useUsersBy } from "../fetch-react-query/useUsers";

const { IA_ADDITION, IA_DELETION } = TOAST_MESSAGES;

const useInternalAssessor = () => {
  const menuOptionsRef = useRef();

  const {
    users: assessors,
    loading: iaLoading,
    error: iaError,
    refetch: iaRefetch
  } = useUsersBy({ role: USER_ROLES.IA });

  console.log(assessors);

  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [formValue, setFormValue] = useState({ fullName: '', email: ''});
  const [activeAssessorId, setActiveAssessorId] = useState(null);

  usePageTitle('Internal Assessor');
  useAutoFocus(modalType, modalType === MODAL_TYPE.ADD_ASSESSOR);
  useOutsideClick(menuOptionsRef, () => setActiveAssessorId(null));

  const handleAddNew = () => {
    setModalType(MODAL_TYPE.ADD_ASSESSOR);
  };

  const handleCloseModal = (from = {}) => {
    setModalType(null);

    if (from.addAssessor) {
      setModalType(null);
      setModalData(null);
      setFormValue({ fullName: '', email: '' })

    } else if (from.deleteAssessor) {
      setModalType(null);
      setModalData(null);
    }
  };

  const handleProfilePic = (file) => { if (file) setProfilePic(file); };
  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFormValue((prev) => ({ ...prev, [name]: value }));
  };

  console.log(formValue);

  const handleEllipsisClick = (e, user) => {
    e.stopPropagation();
    const userId = user.id;

    setActiveAssessorId(prev => (prev !== userId ? userId : null));
  };

  const handleAddAssessor = async (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append('fullName', formValue.fullName);
    data.append('email', formValue.email);
    data.append('role', USER_ROLES.IA);
    if (profilePic) data.append('profilePic', profilePic);

    try {
      const res = await postUser(data);
      if (res.data.success) showSuccessToast(IA_ADDITION.SUCCESS);

      iaRefetch();

      handleCloseModal({ addAssessor: true });

    } catch (error) {
      if (error) showErrorToast(IA_ADDITION.ERROR);
    }
  };

  const handleMenuItems = (e, menu, user) => {
    e.stopPropagation();
    console.log({ menu, user });

    if (Object.keys(menu) === 0 || Object.keys(user) === 0) return;
    
    if (menu.label === 'View Access Link') {
      console.log(menu.label);

    } else if (menu.label === 'View Details') {
      console.log(menu.label);

    } else if (menu.label === 'Update') {
      console.log(menu.label);

    } else if (menu.label === 'Delete') {
      console.log(menu.label);
      setActiveAssessorId(null);
      setModalType(MODAL_TYPE.DELETE_ASSESSOR);
      setModalData({
        id: user.id,
        uuid: user.user_uuid,
        fullName: user.full_name
      });

    }
  };

  const handleConfirmDelete = async (userUUID, fullName) => {
    console.log(userUUID, fullName);
    try {
      const res = await deleteUser(userUUID);

      handleCloseModal({ deleteAssessor: true });

      if (res.data.success) {
        return showSuccessToast(IA_DELETION.SUCCESS(fullName));
      }

    } catch (error) {
      if (error) showErrorToast(IA_DELETION.ERROR(fullName));
    }
  };

  return {
    refs: { menuOptionsRef },
    states: { setProfilePic },
    data: { 
      modalType, modalData, activeAssessorId, profilePic, 
      formValue, assessors 
    },
    handlers: { 
      handleAddNew, handleEllipsisClick, handleCloseModal, handleProfilePic,
      handleFieldChange, handleAddAssessor, handleMenuItems, handleConfirmDelete
    }
  };
};

export default useInternalAssessor;