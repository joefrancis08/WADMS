import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { showErrorToast, showSuccessToast } from "../../utils/toastNotification";
import { TOAST_MESSAGES } from "../../constants/messages";
import { addInfoLevelProgram, deleteAccreditationPeriod, deleteProgramToBeAccredited } from "../../api/accreditation/accreditationAPI";
import PATH from "../../constants/path";
import MODAL_TYPE from "../../constants/modalTypes";
import useOutsideClick from "../useOutsideClick";
import useAutoFocus from "../useAutoFocus";
import { useFetchILP } from "../fetch-react-query/useFetchILP";

const { PROGRAM_AREAS } = PATH.DEAN;
const { 
  PROGRAMS_TO_BE_ACCREDITED_CREATION, 
  PROGRAMS_TO_BE_ACCREDITED_ADDITION,
  PROGRAMS_TO_BE_ACCREDITED_DELETION,
  PERIOD_DELETION
} = TOAST_MESSAGES;

export const useProgramsToBeAccredited = () => {
  const navigate = useNavigate();
  const accredInfoOptionsRef = useRef();
  const programOptionsRef = useRef();

  const { accredInfoLevelPrograms, loading, error } = useFetchILP();
  console.log(accredInfoLevelPrograms);

  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({
    title: null,
    year: null,
    accreditationBody: null,
    level: null,
    program: null
  });

  const [infoHover, setInfoHover] = useState(false);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  const [activeAccredInfoID, setActiveAccredInfoID] = useState(null);
  const [activeProgramID, setActiveProgramID] = useState(null);
  
  const [programs, setPrograms] = useState([]); // Save here the program inputted
  const [programInput, setProgramInput] = useState(''); // Temporary input for text area
  const [duplicateValues, setDuplicateValues] = useState([]);
  const [formValue, setFormValue] = useState({
    title: null,
    year: null,
    accreditationBody: null,
    level: null,
  });

  // Auto-focus on start date to let the user know where to start
  const titleInputRef = useAutoFocus(
    modalType,
    modalType === MODAL_TYPE.ADD_PROGRAM_TO_BE_ACCREDITED
  );

  // Auto-focus on program input when modal renders
  const programInputRef = useAutoFocus(
    modalType, 
    modalType === MODAL_TYPE.ADD_PROGRAM_TO_BE_ACCREDITED_CARD
  );

  // Reuse useOutsideClick hook to make period and program options disappear
  useOutsideClick(accredInfoOptionsRef, () => setActiveAccredInfoID(null));
  useOutsideClick(programOptionsRef, () => setActiveProgramID(null));

  // Remove duplicates automatically if programs state changes
  useEffect(() => {
    setDuplicateValues(prev => prev.filter(val => programs.includes(val)));
  }, [programs]);

  const findDuplicate = (value) => {
    const data = accredInfoLevelPrograms.data ?? [];
    return data.some(d => d.program?.program.trim() === value.trim());
  }

  const disableButton = (options = {}) => {
    if (options.isFromMain) {
      return (
        !formValue.title ||
        !formValue.year || 
        !formValue.accreditationBody || 
        !formValue.level || 
        programs.length === 0 ||
        duplicateValues.length > 0
      );

    } else if (options.isFromCard) {
      return (
        !modalData.title ||
        !modalData.year ||
        !modalData.accreditationBody ||
        !modalData.level ||
        programs.length === 0 ||
        duplicateValues.length > 0
      );
    }
  };

  console.log(modalData);

  const handleAddClick = (options = {}) => {
    setModalType(MODAL_TYPE.ADD_PROGRAM_TO_BE_ACCREDITED);
    
    if (options.isFromCard) {
      setModalType(MODAL_TYPE.ADD_PROGRAM_TO_BE_ACCREDITED_CARD);
    }

    if (options.isFromCard && options.data) {
      setModalData({
        title: options?.data?.accredTitle,
        year: options?.data?.accredYear,
        accreditationBody: options?.data?.accredBody,
        level: options?.data?.level,
      });
    }
  };


  /* 
    isFromMain, isFromCard, isFromPeriod, and isFromProgram 
    is the options (don't forget), add more if necessary 
  */
  const handleCloseClick = (options = {}) => {
    if (options.isFromMain) {
      setPrograms([]);
      setModalType(null);
      setFormValue({
        title: null,
        year: null,
        accreditationBody: null,
        level: null
      });

    } else if (
      options.isFromCard || 
      (options.isFromTitleCard && options.isMoveToArchive || 
      (options.isFromProgramCard && options.isMoveToArchive))) {
        setPrograms([]);
        setModalType(null);
        setModalData(null);
      }
  };

  const handleInputChange = (eOrYear, fieldName) => {
    // Check if the input is a normal DOM event (like typing in a text field)
    if (eOrYear && eOrYear.target) {
      const { name, value } = eOrYear.target; // Destructure the field name and value
      setFormValue(prev => ({ ...prev, [name]: value })); // Update the form value for that field
      setDuplicateValues([]);

    } else {
      // Input is a year (from a date picker)
      if (fieldName === 'year') {
        if (eOrYear) {
          // Start date selected
          const newYear = eOrYear.getFullYear(); // Store selected year
          setFormValue(prev => ({ ...prev, year: newYear }));
          // Update year in the form state
          setDuplicateValues([]);

        } else {
          // Year cleared
          setFormValue(prev => ({ ...prev, year: null }));
        }

      } else {
        // For other date fields (like endDate)
        setFormValue(prev => ({ ...prev, [fieldName]: eOrYear })); // Just update the respective field
      }
    }
  };

  const handleOptionSelection = (level, program, options = {}) => {
    setDuplicateValues([]);

    if (options.isForAddLevel) {
      setFormValue(prev => ({...prev, level}));

    } else if (options.isForAddProgram) {
      setPrograms(prev => [...prev, program]);
    }
  };

  console.log(formValue.accreditationBody);

  const handleProgramChange = (e) => {
    setProgramInput(e.target.value);
    setDuplicateValues([]);
  };

  const handleAddProgramValue = (val) => {
    if (findDuplicate(val)) {
      setDuplicateValues(prev => [...new Set([...prev, val])]);
      showErrorToast(`${val} already exist.`, 'top-center', 8000);
      return;
    }
    setPrograms(prev => [...prev, val]);
    setDuplicateValues(prev => prev.filter(v => v !== val));
  };

  const handleRemoveProgramValue = (index) => {
    const removedVal = programs[index];
    setPrograms(prev => prev.filter((_, i) => i !== index));
    setDuplicateValues(prev => prev.filter(v => v !== removedVal));
  };

  console.log(formValue.year);

  const handleSave = async (options = {}) => {
    try {
      if (formValue.year && formValue.title && formValue.accreditationBody && formValue.level && programs.length > 0) {
        console.log(formValue.year);
        const res = await addInfoLevelProgram({
          title: formValue.title,
          year: formValue.year,
          accredBody: formValue.accreditationBody, 
          level: formValue.level, 
          programNames: programs
        });

        handleCloseClick({ isFromMain: true });
        if (res.data.success) {
          showSuccessToast(PROGRAMS_TO_BE_ACCREDITED_CREATION.SUCCESS);
        } 
      }

      if (options.isFromCard && options.data) {
        const title = options.data.title;
        const year = options.data.year;
        const accredBody = options.data.accredBody;
        const level = options.data.level;
        const res = await addInfoLevelProgram({
          title,
          year,
          accredBody,
          level,
          programNames: programs
        });

        handleCloseClick({ isFromCard: true });
        if (res.data.success) {
          showSuccessToast(PROGRAMS_TO_BE_ACCREDITED_ADDITION.SUCCESS);
        } 
      }

    } catch (error) {
      const isDuplicate = error?.response?.data?.isDuplicate;
      const duplicates = error?.response?.data?.duplicateValue;

      if (options.isFromCard) {
        const duplicateValue = error?.response?.data?.duplicateValue[4];
        if (isDuplicate && duplicateValue) {
          setDuplicateValues(prev => [...new Set([...prev, duplicateValue])]);
        }
        showErrorToast(`${duplicateValue} already exist.`, 'top-center', 5000);
        
      } else {
        setDuplicateValues(prev => [...new Set([...prev, duplicates])]);
        showErrorToast('The data entered already exist.', 'top-center', 5000);
      }
    }
  };

  const handleInfoHover = () => {
    setInfoHover(prev => !prev);
  };

  const handleChevronClick = () => {
    setToggleDropdown(!toggleDropdown);
  };

  const handleOptionClick = (e, options = {}) => {
    e.stopPropagation();
    if (options?.isFromAccredInfo && options?.data?.accredInfoId) {
      setActiveAccredInfoID(prev => (
        prev === options?.data?.accredInfoId ? null : options.data?.accredInfoId
      ));

    } else if (options?.isFromProgram && options?.data?.programId) {
      setActiveProgramID(prev => (
        prev === options.data.programId ? null : options.data.programId
      ));
    }
  };

  const handleOptionItemClick = (e, options = {}) => {
    e.stopPropagation();
    if (options.isFromAccredInfo && options.optionName) {
      setActiveAccredInfoID(null);

      if (options.optionName === 'Delete' && options.data) {
        setModalType(MODAL_TYPE.DELETE_PERIOD);
        setModalData(prev => ({
          ...prev,
          startDate: options.data.period[0],
          endDate: options.data.period[1]
        }));
      }
      
    } else if (options.isFromProgram && options.optionName) {
      setActiveProgramID(null);
      if (options.optionName === 'Delete' && options.data) {
        setModalType(MODAL_TYPE.DELETE_PROGRAM_TO_BE_ACCREDITED);
        setModalData(prev => ({
          ...prev, 
          startDate: options.data.period[0],
          endDate: options.data.period[1],
          levelName: options.data.levelName,
          programName: options.data.programName,
        }));

      } else if (options?.optionName === 'View Areas') {
        const accredInfoUUID = options?.data?.accredInfoUUID;
        const programUUID = options?.data?.programUUID;
        const formattedLevel = String(options.data.level).toLowerCase().split(' ').join('-');

        navigate(PROGRAM_AREAS({ 
          accredInfoUUID, 
          level: formattedLevel, 
          programUUID
        }));
      }
    }
  };

  // This code here is not function but this could be useful
  const handleConfirmClick = async (options = {}) => {
    if (options.isFromPeriod && options.isDelete && options.data) {
      try {
        const year = options?.data?.year;
        const result = await deleteAccreditationPeriod(year, { isFromPTBA: true });


        if (result.data.success) {
          showSuccessToast(PERIOD_DELETION.SUCCESS);
        } else {
          showErrorToast(PERIOD_DELETION.ERROR);
        }

        handleCloseClick({ isFromPeriod: true, isDelete: true });

      } catch (error) {
        console.error('Failed to delete period', error);
        throw error;
      }

    } else if (options.isFromProgram && options.isDelete && options.data) {
      try {
        const year = options?.data?.year;
        const level = options.data.level;
        const program = options.data.program;
        const result = await deleteProgramToBeAccredited(year, level, program);
        
        if (result.data.success) {
          showSuccessToast(PROGRAMS_TO_BE_ACCREDITED_DELETION.SUCCESS);
        } else {
          showErrorToast(PROGRAMS_TO_BE_ACCREDITED_DELETION.ERROR);
        }

        handleCloseClick({ isFromProgram: true, isDelete: true });

      } catch (error) {
        console.error('Failed to delete program.', error);
        throw error;
      }
    }
  };

  const handleProgramCardClick = (e, options = {}) => {
    e.stopPropagation();
    
    if (options.data) {
      const level = options.data.level;
      const formattedLevel = String(level).toLowerCase().split(' ').join('-');
      const accredInfoUUID = options.data.accredInfoUUID;
      const programUUID = options.data.programUUID;
      
      navigate(PROGRAM_AREAS({ 
        accredInfoUUID, 
        level: formattedLevel, 
        programUUID 
      }));
    }
  };

  return {
    addButton: {
      disableButton,
      handleAddClick
    },

    close: {
      handleCloseClick
    },

    chevron: {
      handleChevronClick
    },

    confirmation: {
      handleConfirmClick
    },

    dropdown: {
      toggleDropdown,
      handleOptionSelection
    },

    duplicates: {
      duplicateValues
    },

    programsToBeAccreditedData: {
      accredInfoLevelPrograms,
      loading,
      error
    },

    form: {
      formValue
    },

    hovers: {
      infoHover,
      handleInfoHover
    },

    inputs: {
      handleInputChange
    },

    modal: {
      modalType,
      modalData
    },

    navigation: {
      handleProgramCardClick
    },

    option: {
      handleOptionClick,
      activeAccredInfoID,
      activeProgramID,
      handleOptionItemClick
    },

    program: {
      programInput,
      programs,
      handleProgramChange,
      handleAddProgramValue,
      handleRemoveProgramValue,
    },

    ref: {
      accredInfoOptionsRef,
      programOptionsRef,
      titleInputRef,
      programInputRef,
    },

    saveHandler: {
      handleSave
    }
  };
};