import { useNavigate, useParams } from "react-router-dom";
import formatProgramParams from "../../utils/formatProgramParams";
import { useAreaParamsDetails, useProgramAreaDetails, useProgramToBeAccreditedDetails } from "../useAccreditationDetails";
import useFetchParamSubparam from "../fetch-react-query/useFetchParamSubparam";
import { useEffect, useState } from "react";
import useAutoFocus from "../useAutoFocus";
import MODAL_TYPE from "../../constants/modalTypes";
import { showErrorToast, showSuccessToast } from "../../utils/toastNotification";
import { addAssignment, addDocument, addSubParams, deleteAssignment, deleteDoc, deletePSPM, fetchDocumentsDynamically, updateDocName } from "../../api-calls/accreditation/accreditationAPI";
import { TOAST_MESSAGES } from "../../constants/messages";
import PATH from "../../constants/path";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { messageHandler } from "../../services/websocket/messageHandler";
import { useMemo } from "react";
import useOutsideClick from "../useOutsideClick";
import { useDocumentsQueries } from "../fetch-react-query/useDocumentsQueries";
import { useUsersBy } from "../fetch-react-query/useUsers";
import { getFullNameById } from "../../utils/getUserInfo";
import useFetchAssignments from "../fetch-react-query/useFetchAssignments";
import useFetchSubparamByParamId from "../fetch-react-query/useFetchSubparamByParamId";

const { SUBPARAMETER_ADDITION, ASSIGNMENT } = TOAST_MESSAGES;
const { SUBPARAM_INDICATORS } = PATH.DEAN;
const DOCUMENT_PATH = import.meta.env.VITE_DOCUMENT_PATH;

const useParamSubparam = () => {
  const navigate = useNavigate();
  const { accredInfoUUID, level, programUUID, areaUUID, parameterUUID } = useParams();
  const fileInputRef = useRef();
  const renameFileRef = useRef();
  const fileOptionRef = useRef();
  const navEllipsisRef = useRef();
  const subParamOptionRef = useRef();
  const assignedTaskForceRef = useRef();
  const queryClient = useQueryClient();
  const { level: levelName } = formatProgramParams(level);

  const {
    accredInfoId,
    title,
    year,
    accredBody,
    levelId,
    programId,
    program,
  } = useProgramToBeAccreditedDetails(accredInfoUUID, programUUID);

  const { areaId, area } = useProgramAreaDetails({
    title,
    year,
    accredBody,
    level: levelName,
    program,
    areaUUID
  });

  const { paramName: parameter, paramId } = useAreaParamsDetails({
    title,
    year,
    accredBody,
    level: levelName,
    program,
    area,
    parameterUUID
  });

  const {
    subParamsByParamId,
    loadingSubParam,
    errorSubParam,
    refetchSubParam
  } = useFetchSubparamByParamId(paramId);
  
  const { subParameters, loading, error, refetch } = useFetchParamSubparam({
    title,
    year,
    accredBody,
    level: levelName,
    program,
    area,
    parameter
  });

  const { 
    users: taskForce, 
    loading: taskForceLoading, 
    error: taskForceError, 
    refetch: taskForceRefetch 
  } = useUsersBy();

  const { 
    assignments, 
    loading: loadingAssignments, 
    error: errorAssignments,
    refetch: refetchAssignments 
  } = useFetchAssignments({ accredInfoId, levelId, programId, areaId, parameterId: paramId });
  const assignmentData = assignments?.assignmentData ?? [];

  const subParamsData = useMemo(() => subParameters?.data ?? [], [subParameters?.data]) ;
  const subParameter = subParamsData.map((sp) => sp.sub_parameter_id);
  const subParamsByParamIdData = subParamsByParamId?.subParameters ?? [];

  const subParamDocs = useDocumentsQueries(
    subParamsData,
    { accredInfoId, levelId, areaId, programId, paramId },
    fetchDocumentsDynamically,
    'sub_parameter_id',
    'subparam'
  );

  const documentsBySubParam = {};
  subParamDocs.forEach((q, i) => {
    const documents = q.data?.data?.documents ?? [];
    documentsBySubParam[subParamsData[i]?.sub_parameter_id] = Array.isArray(documents) ? documents : [];
  });

  // Check if any of the document queries are still loading
  const loadingDocs = subParamDocs.some(q => q.isLoading);

  // Check if any of the document queries encountered an error
  const errorDocs = subParamDocs.some(q => q.isError);

  const [isNavEllipsisClick, setIsNavEllipsisClick] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState(null); 
  const [subParameterInput, setSubParameterInput] = useState('');
  const [subParamsArr, setSubParamsArr] = useState([]);
  const [duplicateValues, setDuplicateValues] = useState([]);
  const [expandedId, setExpandedId] = useState(null); // State: only one dropdown expanded at a time
  const [selectedFiles, setSelectedFiles] = useState({});
  const [previewFile, setPreviewFile] = useState(null);
  const [activeDocId, setActiveDocId] = useState(null);
  const [isRename, setIsRename] = useState(false);
  const [renameInput, setRenameInput] = useState('');
  const [renameDocId, setRenameDocId] = useState(null); // Track which doc is being renamed
  const [loadingFileId, setLoadingFileId] = useState(null); // Store the doc id that's loading
  const [activeSubParamId, setActiveSubParamId] = useState(null); // Set state for each subparam option
  const [selectedTaskForce, setSelectedTaskForce] = useState([]); // Set state for task force selection
  const [activeTaskForceId, setActiveTaskForceId] = useState(null); // Set state for assigned task force option
  const [showConfirmUnassign, setShowConfirmUnassign] = useState(false); // Set state for unassigning confirmation

  // Auto-focus on sub-parameter input
  const subParamInputRef = useAutoFocus(
    modalType,
    modalType === MODAL_TYPE.ADD_SUBPARAMETERS
  );

  // Render VATFModal if modal data and modal type is available (usually it is available during navigation)
  useEffect(() => {
    const modalType = localStorage.getItem('modal-type');
    const modalData = localStorage.getItem('modal-data');
    setModalData(JSON.parse(modalData));
    setModalType(JSON.parse(modalType));
  }, []);

  // Remove duplicate automatically if sub-parameter state changes
  useEffect(() => {
    setDuplicateValues(prev => prev.filter(val => subParamsArr.includes(val)));
  }, [subParamsArr]);

  // Close navigation dropdown when click outside
  useOutsideClick(navEllipsisRef, () => setIsNavEllipsisClick(false));

  // Close file option when click outside
  useOutsideClick(fileOptionRef, () => setActiveDocId(null));

  // Close input when click outside
  useOutsideClick(renameFileRef, () => cancelRename());

  // Close subParamOption Dropdown when click outside
  useOutsideClick(subParamOptionRef, () => setActiveSubParamId(null));

  // Close assigned tf option when click outside
  useOutsideClick(assignedTaskForceRef, () => setActiveTaskForceId(null));

  // Refetch data if there are new updates such as addition and deletion
  useEffect(() => {
    // messageHandler accepts a callback that will run on updates
    const { cleanup } = messageHandler(() => {
      // For each subparam, invalidate its query to refetch
      subParamsData.forEach(sp => {
        queryClient.invalidateQueries(['subparam-documents', sp.sub_parameter_id, accredInfoId, levelId, programId, areaId, paramId]);
      });
    });

    return () => cleanup(); // Cleanup on unmount
  }, [subParamsData, queryClient, accredInfoId, levelId, programId, areaId, paramId]);

  const findDuplicate = (value) => {
    return subParamsData.some(d => d.sub_parameter.trim() === value.trim());
  };

  const handleNavEllipsis = () => {
    setIsNavEllipsisClick(!isNavEllipsisClick);
  };

  const handleAddSubparamClick = () => {
    setModalType(MODAL_TYPE.ADD_SUBPARAMETERS);
  };

  // Handler for dropdown expand
  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCloseModal = (from = {}) => {
    if (from.addSubParameter) {
      setSubParamsArr([]);
      setModalType(null);

    } else if (from.assignTaskForce) {
      setModalType(null);
      setModalData(null);
      setSelectedTaskForce([]);

    } else if (from.viewAssignedTaskForce) {
      localStorage.removeItem('modal-type');
      localStorage.removeItem('modal-data');
      setModalType(null);
      setModalData(null);

    } else if (from.confirmUnassign) {
      setShowConfirmUnassign(false);

    } else if (from.deleteSubParam) {
      setModalType(null);
      setModalData(null);

    } else if (from.deleteDoc) {
      setModalType(null);
      setModalData(null);
    }
  };

  const handleSubParamChange = (e) => {
    setSubParameterInput(e.target.value)
  };

  const handleAddSubParamValue = (val) => {
    if (findDuplicate(val)) {
      setDuplicateValues(prev => [...new Set([...prev, val])]);
      showErrorToast(`${val} already exist.`, 'top-center');
      return;
    }

    setSubParamsArr([...subParamsArr, val]);
    setDuplicateValues(prev => prev.filter(v => v !== val));
  };

  const handleRemoveSubParamValue = (index) => {
    const removedVal = subParamsArr[index];
    setSubParamsArr(subParamsArr.filter((_, i) => i !== index));
    setDuplicateValues(prev => prev.filter(v => v !== removedVal));
  };

  const handleSaveSubParams = async () => {
    try {
      const res = await addSubParams({
        title,
        year,
        accredBody,
        level: levelName,
        program,
        area,
        parameter,
        subParameterNames: subParamsArr
      });

      if (res.data.success) {
        showSuccessToast(SUBPARAMETER_ADDITION.SUCCESS);
      }

      handleCloseModal({ addSubParameter: true });

    } catch (error) {
      const duplicateValue = error?.response?.data?.error?.duplicateValue;
      setDuplicateValues(prev => [...new Set([...prev, duplicateValue])]);
      showErrorToast(`${duplicateValue} already exist.`, 'top-center');
    }
  };

  const handleSPCardClick = (data = {}) => {
    const subParameterUUID = data?.subParameterUUID;
    navigate(SUBPARAM_INDICATORS({
      accredInfoUUID,
      level,
      programUUID,
      areaUUID,
      parameterUUID,
      subParameterUUID
    }));
  };

  const handleUploadClick = (id) => {
    document.getElementById(`file-input-${id}`).click();
  };

  const handleFileChange = (e, subParameterId) => {
  const file = e.target.files[0];
  if (!file) return;

  const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
      'application/vnd.openxmlformats-officedocument.presentationml.presentation', // .pptx
      'image/jpeg',
      'image/png',
      'image/gif'
    ];

    if (!allowedTypes.includes(file.type)) {
      showErrorToast('Only PDF, DOCX, PPTX, and image files are allowed.', 'top-center', 5000);
      e.target.value = ''; // reset file input
      return;
    }

    setSelectedFiles(prev => ({
      ...prev,
      [subParameterId]: file
    }));
  };

  const removeSelectedFile = (id) => {
    setSelectedFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[id];
      return newFiles;
    });
  };

  const handleSaveFile = async (subParameterId) => {
    const file = selectedFiles[subParameterId];
    if (!file) {
      showErrorToast('No file selected!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('accredInfoId', accredInfoId);
      formData.append('levelId', levelId);
      formData.append('programId', programId);
      formData.append('areaId', areaId);
      formData.append('parameterId', paramId);
      formData.append('subParameterId', subParameterId);

      const res = await addDocument(formData);

      if (res.data.success) {
        showSuccessToast(res?.data?.message || 'File uploaded successfully!');
        // Clear selection
        setSelectedFiles(prev => {
          const newFiles = { ...prev };
          delete newFiles[subParameterId];
          return newFiles;
        });

        // Refetch docs so UI updates
        await refetch();
      }

    } catch (error) {
      console.error('Upload failed:', error);
      showErrorToast('Upload failed. Try again.');
    }
  };

  const handleFileClick = (path) => {
    setExpandedId(null);
    setPreviewFile(`${DOCUMENT_PATH}/${path}`);
  };

  const handleFileOptionClick = (docId) => {
    setActiveDocId(prev => prev === docId ? null : docId);
  };

  const handleRenameClick = (e, doc) => {
    e.stopPropagation();
    setIsRename(true);
    setRenameInput(doc.file_name);
    setRenameDocId(doc.doc_id);
    setActiveDocId(null);
  };

  const handleRenameInputChange = (e) => {
    setRenameInput(e.target.value);
  };

  const cancelRename = () => {
    setIsRename(false);
    setRenameInput('');
    setRenameDocId(null);
  };

  const handleSaveRename = async (docId) => {
    if (!renameInput.trim()) {
      showErrorToast('File name cannot be empty.');
      return;
    }

    // Find the subParamId for this document
    const subParamId = subParamsData.find(sp => 
      documentsBySubParam[sp.sub_parameter_id]?.some(d => d.doc_id === docId)
    )?.sub_parameter_id;

    if (!subParamId) return;

    // UI update: replace the file name immediately
    const previousDocs = documentsBySubParam[subParamId] || [];
    const updatedDocs = previousDocs.map(doc => 
      doc.doc_id === docId ? { ...doc, file_name: renameInput } : doc
    );

    // Update the cache immediately
    queryClient.setQueryData(['subparam-documents', subParamId, accredInfoId, levelId, programId, areaId, paramId], {
      data: { documents: updatedDocs }
    });

    // Reset rename UI state immediately
    setIsRename(false);
    setRenameInput('');
    setRenameDocId(null);

    try {
      // Save to server
      await updateDocName(docId, renameInput);
      showSuccessToast('File renamed successfully!');
    } catch (err) {
      console.error(err);
      showErrorToast('Rename failed. Reverting...');
      // Revert to previous state if API fails
      queryClient.setQueryData(['subparam-documents', subParamId, accredInfoId, levelId, programId, areaId, paramId], {
        data: { documents: previousDocs }
      });
    }
  };

  const handleKeyDown = (e, doc) => {
    if(e.key === 'Enter') handleSaveRename(doc.doc_id);
    if(e.key === 'Escape') cancelRename();
  };

  const handleRemoveClick = (e, data = {}) => {
    e.stopPropagation();
    setModalType(MODAL_TYPE.DELETE_DOC);
    setModalData(prev => ({
      ...prev,
      docId: data?.docId,
      document: data?.document
    }));
    setActiveDocId(null);
  };

  const handleConfirmRemove = async (docId) => {
    try {
      const res = await deleteDoc(docId);

      if (res?.data?.success) {
        showSuccessToast(res?.data?.message || 'Remove successfully!');
      }

      handleCloseModal({ deleteDoc: true });

    } catch (error) {
      console.error(error);
      showErrorToast('Something went wrong. Try again.');
      throw error;
    }
  };

  const handleSubParamOption = (e, subParamId) => {
    e.stopPropagation();
    setActiveSubParamId(prev => prev !== subParamId ? subParamId : null);
  };

  const handleFileUserClick = (e, data = {}) => {
    e.stopPropagation();
    const { subParamId, subParamUUID, subParameter } = data;
    setModalType(MODAL_TYPE.ASSIGN_TASK_FORCE);
    setModalData({
      accredInfoId,
      levelId,
      programId,
      areaId,
      paramId,
      subParamId,
      subParamUUID,
      subParameter
    });
  };

  const handleSubParamOptionItem = (e, data = {}) => {
    e.stopPropagation();
    const { label, pspmId, subParamId, subParamUUID, subParameter } = data;

    if (label === 'Assign Task Force') {
      handleFileUserClick(e, data);
      
    } else if (label === 'Rename') {
      console.log(label);

    } else if (label === 'Move to Archive') {
      console.log(label);

    } else if (label === 'Delete') {
      setActiveSubParamId(null);
      setModalType(MODAL_TYPE.DELETE_SUBPARAM);
      setModalData({
        pspmId,
        subParamId,
        subParamUUID,
        subParameter
      });
    }
  };

  const handleDeleteSubParam = async (data = {}) => {
    const { pspmId, subParamId, subParameter } = data;

    try {
      const res = await deletePSPM({
        pspmId,
        subParameterId: subParamId,
        subParameter
      });

      if (res.data.success && res.data.message) {
        showSuccessToast(res.data.message);
      }

      handleCloseModal({ deleteSubParam: true });
      
    } catch (error) {
      showErrorToast('Something went wrong. Please try again.');
      console.error('Error delete sub-parameter:', error);
      throw error;
    }
  };

  // Toggle single checkbox (SubParamModal)
  const handleCheckboxChange = (userId) => {
    setSelectedTaskForce((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId) // Remove if already selected
        : [...prev, userId] // Add if not selected
    );
  };

  // Toggle Select All (SubParamModal)
  const handleSelectAll = () => {
    if (selectedTaskForce.length === taskForce.length) {
      setSelectedTaskForce([]); // Unselect all
    } else {
      setSelectedTaskForce(taskForce.map((user) => user.id)); // select all by id
    }
  };

  // Pass selectedTaskForce to backend on save (SubParamModal)
  const handleAssignTaskForce = async (data = {}) => {
    const { 
      accredInfoId, levelId, programId, areaId, 
      parameterId, subParameterId, subParameter 
    } = data;
    const userIDList = selectedTaskForce;
    
    try {
      const res = await addAssignment({
        accredInfoId, 
        levelId, 
        programId, 
        areaId,
        parameterId,
        subParameterId,
        userIDList
      }, { 
        includeParameter: true, 
        includeSubParameter: true 
      });

      if (res?.data?.success) {
        showSuccessToast(ASSIGNMENT.SUCCESS);
      }

      handleCloseModal({ assignTaskForce: true });

    } catch (error) {
      const userId = error?.response?.data?.error?.user;
      const user = getFullNameById(taskForce, userId);
      
      if (userId && user) {
        showErrorToast(`${user} is already assigned to ${subParameter}.`, 'top-center');

      } else {
        showErrorToast(ASSIGNMENT.ERROR);
      }

      throw error;
    }
  };

  const handleProfileStackClick = (e, data = {}) => {
    e.stopPropagation();
    const { subParameterId, subParameter, taskForces } = data;
    setModalType(MODAL_TYPE.VIEW_ASSIGNED_TASK_FORCE);
    setModalData({
      accredInfoId,
      levelId,
      programId,
      areaId,
      parameterId: paramId,
      subParameterId,
      subParameter,
      taskForces
    });
  };

  // For SubParameModal.jsx
  const handleATFEllipsisClick = (data = {}) => {
    const { taskForceId } = data;
    setActiveTaskForceId(prev => prev === taskForceId ? null : taskForceId);
  };

  // For SubParamModal.jsx
  const handleAddTaskForceClick = () => {
    setModalType(MODAL_TYPE.ASSIGN_TASK_FORCE);
  };

  // For SubParamModal.jsx
  const handleUnassignedAllClick = () => {
    console.log('unassigned all clicked!')
  };

  // For SubParamModal.jsx (Assigned Task Force Options)
  const handleAssignedOptionsClick = (option, data = {}) => {
    if (option.label === 'View Profile') {
      navigate(PATH.DEAN.TASK_FORCE_DETAIL(data.taskForceUUID), {
        state: { from: PATH.DEAN.PROGRAM_AREAS({ accredInfoUUID, level, programUUID }) } 
      });
      localStorage.setItem('modal-type', JSON.stringify(modalType));
      localStorage.setItem('modal-data', JSON.stringify({
        accredInfoId,
        levelId,
        programId,
        areaId,
        parameterId: paramId,
        subParameterId: data.subParameterId,
        subParameter: data.subParameter,
        taskForces: data.taskForces
      }));
      
    } else if (option.label === 'Unassign') {
      setModalData(prev => ({
        ...prev,
        selectedTaskForce: { id: data.taskForceId, fullName: data.taskForce, profilePic: data.taskForceImage }
      }));
      handleUnassignedClick({
        accredInfoId: data.accredInfoId,
        levelId: data.levelId,
        programId: data.programId,
        areaId: data.areaId,
        parameterId: paramId,
        subParameterId: data.subParameterId,
        subParameter: data.subParameter,
        taskForceId: data.taskForceId,
        taskForce: data.taskForce
      });
    } 
  };

  // For SubParamModal.jsx (Assigned Task Force option - Unassigned)
  const handleUnassignedClick = (data = {}) => {
    const {
      accredInfoId, levelId, programId, 
      areaId,  taskForceId
    } = data;
   setShowConfirmUnassign(true);

    return { 
      accredInfoId, levelId, programId, areaId, taskForceId 
    };
  };

  const handleConfirmUnassign = async (data = {}) => {
    const { 
      accredInfoId, levelId, programId, 
      areaId, parameterId, subParameterId, taskForceId 
    } = data;

    try {
      const res = await deleteAssignment({
        accredInfoId, levelId, programId,
        areaId, parameterId, subParameterId, 
        taskForceId
      });

      handleCloseModal({ confirmUnassign: true });
      setModalData(prev => ({
        ...prev,
        taskForces: modalData.taskForces.filter(tf => tf.id !== taskForceId)
      }));

      if (res.data.success) {
        showSuccessToast(TOAST_MESSAGES.UNASSIGN.SUCCESS);
      }

    } catch (error) {
      showErrorToast(TOAST_MESSAGES.UNASSIGN.ERROR);
      console.error('Error deleting assigment:', error);
      throw error;
    }
  };

  return {
    navigate,
    modalType,
    modalData,

    refs: {
      navEllipsisRef,
      subParamInputRef,
      fileInputRef,
      fileOptionRef,
      renameFileRef,
      subParamOptionRef,
      assignedTaskForceRef
    },
    
    params: {
      accredInfoUUID,
      level,
      programUUID,
      areaUUID,
      parameterUUID
    },

    states: {
      previewFile,
      setPreviewFile,
      loadingFileId,
      activeDocId,
      renameInput,
      renameDocId
    },

    datas: {
      title,
      year,
      subParameter,
      subParameters,
      loading,
      error,
      refetch,
      levelName,
      program,
      area,
      parameter,
      subParamsData,
      subParamsByParamIdData,
      subParameterInput,
      subParamsArr,
      duplicateValues,
      documentsBySubParam,
      loadingDocs,
      errorDocs,
      expandedId,
      selectedFiles,
      isRename,
      isNavEllipsisClick,
      activeSubParamId,
      taskForce,
      taskForceLoading,
      taskForceError,
      taskForceRefetch,
      selectedTaskForce,
      assignmentData,
      activeTaskForceId,
      showConfirmUnassign
    },

    handlers: {
      handleAddSubparamClick,
      handleCloseModal,
      handleSubParamChange,
      handleAddSubParamValue,
      handleRemoveSubParamValue,
      handleSaveSubParams,
      handleSPCardClick,
      toggleExpand,
      handleUploadClick,
      handleFileChange,
      removeSelectedFile,
      handleSaveFile,
      handleFileClick,
      handleFileOptionClick,
      handleRenameClick,
      handleRenameInputChange,
      handleKeyDown,
      handleRemoveClick,
      handleConfirmRemove,
      handleNavEllipsis,
      handleSubParamOption,
      handleSubParamOptionItem,
      handleFileUserClick,
      handleDeleteSubParam,
      handleCheckboxChange,
      handleSelectAll,
      handleAssignTaskForce,
      handleProfileStackClick,
      handleATFEllipsisClick,
      handleAddTaskForceClick,
      handleUnassignedAllClick,
      handleAssignedOptionsClick,
      handleConfirmUnassign
    }
  };
};

export default useParamSubparam;