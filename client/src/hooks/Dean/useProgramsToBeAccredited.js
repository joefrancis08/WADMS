import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { useFetchProgramsToBeAccredited } from "../fetch-react-query/useFetchProgramsToBeAccredited";
import { showErrorToast, showSuccessToast } from "../../utils/toastNotification";
import { TOAST_MESSAGES } from "../../constants/messages";
import { addProgramToBeAccredited, deleteAccreditationPeriod, deleteProgramToBeAccredited } from "../../api/accreditation/accreditationAPI";
import PATH from "../../constants/path";
import MODAL_TYPE from "../../constants/modalTypes";
import useOutsideClick from "../useOutsideClick";
import useAutoFocus from "../useAutoFocus";

const { PROGRAM_AREAS } = PATH.DEAN;
const { 
  PROGRAMS_TO_BE_ACCREDITED_CREATION, 
  PROGRAMS_TO_BE_ACCREDITED_ADDITION,
  PROGRAMS_TO_BE_ACCREDITED_DELETION,
  PERIOD_DELETION
} = TOAST_MESSAGES;

export const useProgramsToBeAccredited = () => {
  const navigate = useNavigate();
  const periodOptionsRef = useRef();
  const programOptionsRef = useRef();

  const { programsToBeAccredited, loading, error } = useFetchProgramsToBeAccredited();

  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({
    startDate: null,
    endDate: null,
    level: '',
    program: ''
  });

  const [infoHover, setInfoHover] = useState(false);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  const [activePeriodId, setActivePeriodId] = useState(null);
  const [activeProgramId, setActiveProgramId] = useState(null);
  
  const [programs, setPrograms] = useState([]); // Save here the program inputted
  const [programInput, setProgramInput] = useState(''); // Temporary input for text area
  const [duplicateValues, setDuplicateValues] = useState([]);
  const [formValue, setFormValue] = useState({
    startDate: null,
    endDate: null,
    level: '',
  });

  // Auto-focus on start date to let the user know where to start
  const startDateInputRef = useAutoFocus(
    modalType,
    modalType === MODAL_TYPE.ADD_PROGRAM_TO_BE_ACCREDITED,
    { forDateInput: true }
  );

  // Auto-focus on program input when modal renders
  const programInputRef = useAutoFocus(
    modalType, 
    modalType === MODAL_TYPE.ADD_PROGRAM_TO_BE_ACCREDITED_CARD
  );

  // Reuse useOutsideClick hook to make period and program options disappear
  useOutsideClick(periodOptionsRef, () => setActivePeriodId(null));
  useOutsideClick(programOptionsRef, () => setActiveProgramId(null));

  // Remove duplicates automatically if programs state changes
  useEffect(() => {
    setDuplicateValues(prev => prev.filter(val => programs.includes(val)));
  }, [programs]);

  const findDuplicate = (value) => {
    const data = programsToBeAccredited.data ?? [];
    return data.some(d => d.program?.program.trim() === value.trim());
  }

  const disableButton = (options = {}) => {
    if (options.isFromMain) {
      return (
        !formValue.startDate || 
        !formValue.endDate || 
        !formValue.level.trim() || 
        programs.length === 0 ||
        duplicateValues.length > 0
      );

    } else if (options.isFromCard) {
      return (
        !modalData.startDate ||
        !modalData.endDate ||
        !modalData.level.trim() ||
        programs.length === 0 ||
        duplicateValues.length > 0
      );
    }
  };

  const handleAddClick = (options = {}) => {
    setModalType(MODAL_TYPE.ADD_PROGRAM_TO_BE_ACCREDITED);
    
    if (options.isFromCard) {
      setModalType(MODAL_TYPE.ADD_PROGRAM_TO_BE_ACCREDITED_CARD);
    }

    if (options.isFromCard && options.data) {
      setModalData({
        startDate: options.data.period[0],
        endDate: options.data.period[1],
        level: options.data.level,
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
        startDate: null,
        endDate: null,
        level: '',
      });

    } else if (
      options.isFromCard || 
      (options.isFromPeriod && options.isDelete) || 
      (options.isFromProgram && options.isDelete)) {
        setPrograms([]);
        setModalType(null);
        setModalData(null);
      }
  };

  const handleInputChange = (eOrDate, fieldName) => {
    // Check if the input is a normal DOM event (like typing in a text field)
    if (eOrDate && eOrDate.target) {
      const { name, value } = eOrDate.target; // Destructure the field name and value
      setFormValue(prev => ({ ...prev, [name]: value })); // Update the form value for that field
      setDuplicateValues([]);

    } else {
      // Input is a Date (from a date picker)
      if (fieldName === 'startDate') {
        if (eOrDate) {
          // Start date selected
          const newStartDate = eOrDate; // Store selected start date
          const newEndDate = new Date(newStartDate); // Copy start date
          // newEndDate.setDate(newEndDate.getDate() + 3); // Automatically set end date to 3 days after start date
          setFormValue(prev => ({ ...prev, startDate: newStartDate, endDate: newEndDate }));
          // Update both startDate and endDate in form state
          setDuplicateValues([]);

        } else {
          // Start date cleared
          setFormValue(prev => ({ ...prev, startDate: null, endDate: null }));
           // If start date is cleared, also clear end date to prevent illogical state
        }

      } else {
        // For other date fields (like endDate)
        setFormValue(prev => ({ ...prev, [fieldName]: eOrDate })); // Just update the respective field
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

  const handleSave = async (options = {}) => {
    try {
      if (formValue.startDate && formValue.endDate && formValue.level && programs.length > 0) {
        const formattedStartDate = format(formValue.startDate, "yyyy-MM-dd");
        const formattedEndDate = format(formValue.endDate, 'yyyy-MM-dd');

        const res = await addProgramToBeAccredited(
          formattedStartDate, 
          formattedEndDate, 
          formValue.level, 
          programs
        );

        handleCloseClick({ isFromMain: true });
        if (res.data.success) {
          showSuccessToast(PROGRAMS_TO_BE_ACCREDITED_CREATION.SUCCESS);
        } 
      }

      if (options.isFromCard && options.data) {
        const startDate = options.data.startDate;
        const endDate = options.data.endDate;
        const level = options.data.level;
        const res = await addProgramToBeAccredited(
          startDate,
          endDate,
          level,
          programs
        );

        handleCloseClick({ isFromCard: true });
        if (res.data.success) {
          showSuccessToast(PROGRAMS_TO_BE_ACCREDITED_ADDITION.SUCCESS);
        } 
      }

    } catch (error) {
      const isDuplicate = error?.response?.data?.isDuplicate;
      const duplicates = error?.response?.data?.duplicateValue;

      if (options.isFromCard) {
        const duplicateValue = error?.response?.data?.duplicateValue[3];
        if (isDuplicate && duplicateValue) {
          setDuplicateValues(prev => [...new Set([...prev, duplicateValue])]);
        }
        showErrorToast(`${duplicateValue} already exist.`, 'top-center', 8000);
        
      } else {
        setDuplicateValues(prev => [...new Set([...prev, duplicates])]);
        showErrorToast('Period, level, and program already exist.', 'top-center', 8000);
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
    if (options.isFromPeriod && options.data.periodId) {
      setActivePeriodId(prev => (
        prev === options.data.periodId ? null : options.data.periodId
      ));

    } else if (options.isFromProgram && options.data.programId) {
      setActiveProgramId(prev => (
        prev === options.data.programId ? null : options.data.programId
      ));
    }
  };

  const handleOptionItemClick = (e, options = {}) => {
    e.stopPropagation();
    if (options.isFromPeriod && options.optionName) {
      setActivePeriodId(null);

      if (options.optionName === 'Delete' && options.data) {
        setModalType(MODAL_TYPE.DELETE_PERIOD);
        setModalData(prev => ({
          ...prev,
          startDate: options.data.period[0],
          endDate: options.data.period[1]
        }));
      }
      
    } else if (options.isFromProgram && options.optionName) {
      setActiveProgramId(null);
      if (options.optionName === 'Delete' && options.data) {
        setModalType(MODAL_TYPE.DELETE_PROGRAM_TO_BE_ACCREDITED);
        setModalData(prev => ({
          ...prev, 
          startDate: options.data.period[0],
          endDate: options.data.period[1],
          levelName: options.data.levelName,
          programName: options.data.programName,
        }));

      } else if (options.optionName === 'View Areas' && options.data) {
        const periodUUID = options?.data?.periodUUID;
        const programUUID = options?.data?.programUUID;
        const formattedLevel = String(options.data.levelName).toLowerCase().split(' ').join('-');

        navigate(PROGRAM_AREAS({ 
          periodID: periodUUID, 
          level: formattedLevel, 
          programID: programUUID
        }));
      }
    }
  };

  const handleConfirmClick = async (options = {}) => {
    if (options.isFromPeriod && options.isDelete && options.data) {
      try {
        const startDate = options.data.startDate;
        const endDate = options.data.endDate;
        const result = await deleteAccreditationPeriod(startDate, endDate, { isFromPTBA: true });


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
        const startDate = options.data.startDate;
        const endDate = options.data.endDate;
        const levelName = options.data.levelName;
        const programName = options.data.programName;
        const result = await deleteProgramToBeAccredited(startDate, endDate, levelName, programName);
        
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
      const periodUUID = options.data.periodUUID;
      const programUUID = options.data.programUUID;

      navigate(PROGRAM_AREAS({ 
        periodID: periodUUID, 
        level: formattedLevel, 
        programID: programUUID 
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
      programsToBeAccredited,
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
      activePeriodId,
      activeProgramId,
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
      periodOptionsRef,
      programOptionsRef,
      startDateInputRef,
      programInputRef,
    },

    saveHandler: {
      handleSave
    }
  };
};