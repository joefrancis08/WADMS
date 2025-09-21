import { useNavigate, useParams } from "react-router-dom";
import formatProgramParams from "../../utils/formatProgramParams";
import { useAreaParamsDetails, useProgramAreaDetails, useProgramToBeAccreditedDetails } from "../useAccreditationDetails";
import useFetchParamSubparam from "../fetch-react-query/useFetchParamSubparam";
import { useEffect, useState } from "react";
import useAutoFocus from "../useAutoFocus";
import MODAL_TYPE from "../../constants/modalTypes";
import { showErrorToast, showSuccessToast } from "../../utils/toastNotification";
import { addDocument, addSubParams, deleteDoc, fetchDocumentsDynamically, updateDocName } from "../../api/accreditation/accreditationAPI";
import { TOAST_MESSAGES } from "../../constants/messages";
import PATH from "../../constants/path";
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { messageHandler } from "../../services/websocket/messageHandler";
import { useMemo } from "react";
import useOutsideClick from "../useOutsideClick";

const { SUBPARAMETER_ADDITION } = TOAST_MESSAGES;
const { SUBPARAM_INDICATORS } = PATH.DEAN;
const DOCUMENT_PATH = import.meta.env.VITE_DOCUMENT_PATH;

const useParamSubparam = () => {
  const navigate = useNavigate();
  const { accredInfoUUID, level, programUUID, areaUUID, parameterUUID } = useParams();
  const fileInputRef = useRef();
  const renameFileRef = useRef();
  const fileOptionRef = useRef();
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
  
  const { subParameters, loading, error, refetch } = useFetchParamSubparam({
    title,
    year,
    accredBody,
    level: levelName,
    program,
    area,
    parameter
  });

  const subParamsData = useMemo(() => subParameters?.data ?? [], [subParameters?.data]) ;
  const subParameter = subParamsData.map((sp) => sp.sub_parameter_id);
  console.log(subParameter);

  // useQueries allows fetching multiple queries in parallel.
  // Here we fetch documents for all sub-parameters dynamically on mount.
  const documentsQueries = useQueries({
    queries: subParamsData.map(sp => ({
      queryKey: [
        'subparam-documents',
        sp.sub_parameter_id,           // use subParameterId for caching
        accredInfoId,
        levelId,            // careful: make sure this is the numeric levelId (not just "Preliminary")
        programId,
        areaId,
        paramId
      ],
      queryFn: () => fetchDocumentsDynamically({
        accredInfoId,
        levelId,        // must be numeric id, not string name
        programId,
        areaId,
        parameterId: paramId,
        subParameterId: sp.sub_parameter_id, // pass subParameterId from API response
        indicatorId: null
      }),
      staleTime: 0 // 5 minutes cache
    }))
  });

  const documentsBySubParam = {};
  documentsQueries.forEach((q, i) => {
    const documents = q.data?.data?.documents ?? [];
    documentsBySubParam[subParamsData[i]?.sub_parameter_id] = Array.isArray(documents) ? documents : [];
  });

  // Check if any of the document queries are still loading
  const loadingDocs = documentsQueries.some(q => q.isLoading);

  // Check if any of the document queries encountered an error
  const errorDocs = documentsQueries.some(q => q.isError);

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

  // Auto-focus on sub-parameter input
  const subParamInputRef = useAutoFocus(
    modalType,
    modalType === MODAL_TYPE.ADD_SUBPARAMETERS
  );

  // Remove duplicate automatically if sub-parameter state changes
  useEffect(() => {
    setDuplicateValues(prev => prev.filter(val => subParamsArr.includes(val)));
  }, [subParamsArr]);

  // Close file option when click outside
  useOutsideClick(fileOptionRef, () => setActiveDocId(null));

  // Close input when click outside
  useOutsideClick(renameFileRef, () => cancelRename());

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

  const handleAddSubparamClick = () => {
    setModalType(MODAL_TYPE.ADD_SUBPARAMETERS);
    console.log('clicked');
  };

  // Handler for dropdown expand
  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleCloseModal = () => {
    setSubParamsArr([]);
    setModalType(null);
    setModalData(null);
  };

  console.log(modalData);
  console.log(modalType);

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

      handleCloseModal();

    } catch (error) {
      const duplicateValue = error?.response?.data?.error?.duplicateValue;
      console.log(duplicateValue);
      setDuplicateValues(prev => [...new Set([...prev, duplicateValue])]);
      showErrorToast(`${duplicateValue} already exist.`, 'top-center');
    }
  };

  const handleSPCardClick = (data = {}) => {
    console.log('Clicked');
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

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];

    if (!allowedTypes.includes(file.type)) {
      showErrorToast('Only PDF and image files are allowed.', 'top-center', 5000);
      e.target.value = ''; // reset file input
      return;
    }

    setSelectedFiles(prev => ({
      ...prev,
      [subParameterId]: file
    }));

    console.log('Selected file:', file.name, 'for subParam:', subParameterId);
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

    // Optimistic UI update: replace the file name immediately
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

      handleCloseModal();

    } catch (error) {
      console.log(error);
      showErrorToast('Something went wrong. Try again.');
    }
  };

  return {
    navigate,
    modalType,
    modalData,

    refs: {
      subParamInputRef,
      fileInputRef,
      fileOptionRef,
      renameFileRef
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
      subParameterInput,
      subParamsArr,
      duplicateValues,
      documentsBySubParam,
      loadingDocs,
      errorDocs,
      expandedId,
      selectedFiles,
      isRename
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
    }
  };
};

export default useParamSubparam;