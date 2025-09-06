import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { format, parse } from "date-fns";
import { useFetchProgramsToBeAccredited } from "../fetch-react-query/useFetchProgramsToBeAccredited";
import { showErrorToast, showSuccessToast } from "../../utils/toastNotification";
import { TOAST_MESSAGES } from "../../constants/messages";
import { addProgramToBeAccredited, deleteAccreditationPeriod, deleteProgramToBeAccredited } from "../../api/accreditation/accreditationAPI";
import PATH from "../../constants/path";
import MODAL_TYPE from "../../constants/modalTypes";
import useOutsideClick from "../useOutsideClick";
import parseAccreditationPeriod from "../../utils/parseAccreditationPeriod";

export const useProgramsToBeAccredited = () => {
  const navigate = useNavigate();
  const { programsToBeAccredited, loading, error } = useFetchProgramsToBeAccredited();
  const periodOptionsRef = useRef();
  const programOptionsRef = useRef();
  const { PROGRAM_AREAS } = PATH.DEAN;
  const { 
    PROGRAMS_TO_BE_ACCREDITED_CREATION, 
    PROGRAMS_TO_BE_ACCREDITED_ADDITION,
    PROGRAMS_TO_BE_ACCREDITED_DELETION,
    PERIOD_DELETION
  } = TOAST_MESSAGES;

  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({
    startDate: null,
    endDate: null,
    level: '',
    program: ''
  });

  const [infoHover, setInfoHover] = useState(false);

  const [activePeriodId, setActivePeriodId] = useState(null);
  const [activeProgramId, setActiveProgramId] = useState(null);
  
  const [programs, setPrograms] = useState([]); // Save here the program inputted
  const [programInput, setProgramInput] = useState(''); // Temporaty input for text area
  const [formValue, setFormValue] = useState({
    startDate: null,
    endDate: null,
    level: '',
  });

  // Reuse useOutsideClick hook to make period and program options disappear
  useOutsideClick(periodOptionsRef, () => setActivePeriodId(null));
  useOutsideClick(programOptionsRef, () => setActiveProgramId(null));

  const disableButton = (options = {}) => {
    if (options.isFromMain) {
      return (
        !formValue.startDate || 
        !formValue.endDate || 
        !formValue.level.trim() || 
        programs.length === 0
      );

    } else if (options.isFromCard) {
      return (
        !modalData.startDate ||
        !modalData.endDate ||
        !modalData.level.trim() ||
        programs.length === 0
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

  console.log(modalData);

  const handleInputChange = (eOrDate, fieldName) => {
    // Check if the input is a normal DOM event (like typing in a text field)
    if (eOrDate && eOrDate.target) {
      const { name, value } = eOrDate.target; // Destructure the field name and value
      setFormValue(prev => ({ ...prev, [name]: value })); // Update the form value for that field
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
    if (options.isForAddLevel) {
      setFormValue(prev => ({...prev, level}));
    } else if (options.isForAddProgram) {
      setPrograms(prev => [...prev, program]);
    }
  };

  const handleProgramChange = (e) => {
    setProgramInput(e.target.value);
  };

  const handleAddProgramValue = (val) => {
    setPrograms([...programs, val])
  };

  const handleRemoveProgramValue = (index) => {
    setPrograms(programs.filter((_, i) => i !== index))
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
        res.data.success && showSuccessToast(PROGRAMS_TO_BE_ACCREDITED_CREATION.SUCCESS);
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
        } else {
          showErrorToast(PROGRAMS_TO_BE_ACCREDITED_ADDITION.ERROR);
        }
      }

    } catch (error) {
      console.error('Error adding program to be accredited: ', error);
    }
  };

  const handleInfoHover = () => {
    setInfoHover(prev => !prev);
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
      console.log('Delete Click from Period');

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
        console.log(options.data.period);
        const startDate = String(options.data.period[0]).split('-').join('');
        const endDate = String(options.data.period[1]).split('-').join('');
        const formattedLevel = String(options.data.levelName).toLowerCase().split(' ').join('-');
        const formattedProgram = String(options.data.programName).toLowerCase().split(' ').join('-');

        navigate(PROGRAM_AREAS(startDate + endDate, formattedLevel, formattedProgram));
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
        console.log(result);
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
      const startDate = parseAccreditationPeriod(options.data.periodKey)[0].replaceAll('-', '');
      const endDate = parseAccreditationPeriod(options.data.periodKey)[1].replaceAll('-', '');
      const level = options.data.level;
      const program = options.data.programName;

      const formattedLevel = String(level).toLowerCase().split(' ').join('-');
      const formattedProgram = String(program).toLowerCase().split(' ').join('-');

      navigate(PROGRAM_AREAS(startDate + endDate, formattedLevel, formattedProgram));
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

    confirmation: {
      handleConfirmClick
    },

    dropdown: {
      handleOptionSelection
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
      programOptionsRef
    },

    saveHandler: {
      handleSave
    }
  };
};