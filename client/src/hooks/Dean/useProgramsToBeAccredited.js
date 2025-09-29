
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { showErrorToast, showSuccessToast } from "../../utils/toastNotification";
import { TOAST_MESSAGES } from "../../constants/messages";
import { addInfoLevelProgram, deleteAccreditationPeriod, deleteProgramToBeAccredited } from "../../api-calls/accreditation/accreditationAPI";
import PATH from "../../constants/path";
import MODAL_TYPE from "../../constants/modalTypes";
import useOutsideClick from "../useOutsideClick";
import useAutoFocus from "../useAutoFocus";
import { useFetchILP } from "../fetch-react-query/useFetchILP";
import useScrollSaver from "../useScrollSaver";
import scrollToNewAddition from "../../utils/scrollToNewAddition";
import { set } from "date-fns";
import usePageTitle from "../usePageTitle";

const { PROGRAM_AREAS } = PATH.DEAN;
const { 
  PROGRAMS_TO_BE_ACCREDITED_CREATION, 
  PROGRAMS_TO_BE_ACCREDITED_ADDITION,
  PROGRAMS_TO_BE_ACCREDITED_DELETION,
  PERIOD_DELETION
} = TOAST_MESSAGES;

export const useProgramsToBeAccredited = () => {
  const navigate = useNavigate();
  const scrollContainerRef = useRef();
  const accredInfoOptionsRef = useRef();
  const programCardRef = useRef();
  const programOptionsRef = useRef();
  const levelRef = useRef({});
  usePageTitle('Programs To Be Accredited');

  const { accredInfoLevelPrograms, loading, error } = useFetchILP();
  console.log(accredInfoLevelPrograms);

  useScrollSaver(scrollContainerRef);

  const [modalType, setModalType] = useState(null);
  const [modalData, setModalData] = useState({
    title: '',
    year: null,
    accreditationBody: '',
    level: '',
    program: ''
  });

  const [infoHover, setInfoHover] = useState(false);
  const [toggleDropdown, setToggleDropdown] = useState(false);

  const [activeAccredInfoID, setActiveAccredInfoID] = useState(null);
  const [activeProgramID, setActiveProgramID] = useState(null);
  
  const [programs, setPrograms] = useState([]); // Save here the program inputted
  const [programInput, setProgramInput] = useState(''); // Temporary input for text area
  const [isAllDuplicates, setIsAllDuplicates] = useState(false);
  const [duplicateValues, setDuplicateValues] = useState([]);
  const [formValue, setFormValue] = useState({
    title: '',
    year: null,
    accreditationBody: '',
    level: '',
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

  const levelInputRef = useAutoFocus(
    modalType,
    modalType === MODAL_TYPE.ADD_LEVEL_PROGRAM
  );

  // Reuse useOutsideClick hook to make period and program options disappear
  useOutsideClick(accredInfoOptionsRef, () => setActiveAccredInfoID(null));
  useOutsideClick(programOptionsRef, () => setActiveProgramID(null));

  // Remove duplicates automatically if programs state changes
  useEffect(() => {
    setDuplicateValues(prev => prev.filter(val => programs.includes(val)));
  }, [programs]);

  // Save position of this page when navigating on other page
  useEffect(() => {
    const lastId = localStorage.getItem('lastProgramId');
    if (lastId) {
      const el = document.getElementById(`last-program-${lastId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'auto', block: 'center' });
      }
    }
  }, []);

  const findDuplicate = (value) => {
    const data = accredInfoLevelPrograms.data ?? [];
    return data.some(d => d.program?.program.trim() === value.trim());
  };

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

    } else if (options.isFromHeader) {
      return (
        !formValue.level ||
        programs.length === 0 ||
        duplicateValues.length > 0 
      );
    }
  };

  const handleLevelScroll = (id) => {
    levelRef.current[id]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

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
        level: options?.data?.level
      });
    }
  };

  const handleClipboardClick = (data = {}) => {
    const {title, year, accredBody } = data;
    setModalType(MODAL_TYPE.ADD_LEVEL_PROGRAM);
    setModalData(prev => ({
      ...prev,
      title,
      year,
      accreditationBody: accredBody
    }));
  };


  /* 
    isFromMain, isFromCard, isFromPeriod, and isFromProgram 
    is the options (don't forget), add more if necessary 
  */
  const handleCloseClick = (options = {}) => {
    if (options.isFromMain) {
      setPrograms([]);
      setModalType(null);
      setFormValue(prev => ({
        ...prev,
        title: '',
        year: null,
        accreditationBody: '',
        level: ''
      }));

    } else if (options?.isFromHeader) {
      setPrograms([]);
      setModalType(null);
      setFormValue(prev => ({
        ...prev,
        title: '',
        year: '',
        accreditationBody: '',
        level: ''
      }))

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
      setIsAllDuplicates(false);

    } else {
      // Input is a year (from a date picker)
      if (fieldName === 'year') {
        if (eOrYear) {
          // Start date selected
          const newYear = eOrYear.getFullYear(); // Store selected year
          setFormValue(prev => ({ ...prev, year: newYear }));
          // Update year in the form state
          setDuplicateValues([]);
          setIsAllDuplicates(false);

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
    setIsAllDuplicates(false);

    if (options.isForAddLevel && level) {
      setFormValue(prev => ({...prev, level}));
      
    } else if (options.isForAddProgram && program) {
      // Make sure we're adding to programs, not level
      setPrograms(prev => [...prev, program]);
    }
  };

  const handleProgramChange = (e) => {
    setProgramInput(e.target.value);
    setIsAllDuplicates(false);
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
    setIsAllDuplicates(false);
  };

  const handleSave = async (options = {}) => {
    try {
      if (formValue?.year && formValue?.title && formValue?.accreditationBody && formValue?.level && programs.length > 0) {
        const res = await addInfoLevelProgram({
          title: formValue?.title,
          year: formValue?.year,
          accredBody: formValue?.accreditationBody, 
          level: formValue?.level, 
          programNames: programs
        });

        handleCloseClick({ isFromMain: true });
        if (res.data.success) {
          showSuccessToast(PROGRAMS_TO_BE_ACCREDITED_CREATION.SUCCESS);
        } 

        scrollToNewAddition('newAccreditation', `${formValue?.title} ${String(formValue?.year)}`);
      }

      if (options?.isFromHeader && options?.data) {
        const title = options?.data?.title;
        const year = options?.data?.year;
        const accredBody = options?.data?.accredBody;
        const level = formValue?.level;
        const programNames = programs;

        console.log(`${title} ${year}-${level}`);

        const res = await addInfoLevelProgram({
          title,
          year,
          accredBody,
          level,
          programNames
        });

        handleCloseClick({ isFromHeader: true });
        if (res?.data?.success) {
          showSuccessToast(PROGRAMS_TO_BE_ACCREDITED_ADDITION.SUCCESS);
        }

        scrollToNewAddition('newLevel', `${title} ${year}-${level}`);
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

        scrollToNewAddition('newProgram', `${accredBody}-${year}-${level}-${programs[0]}`);
      }

    } catch (error) {
      const duplicates = error?.response?.data?.duplicateValue;
      const duplicateProgram = error?.response?.data?.duplicateValue[4];

      if (options.isFromCard) {
        showErrorToast(`${duplicateProgram} already exist.`, 'top-center', 5000);
        setDuplicateValues(prev => [...new Set([...prev, duplicateProgram])]);

      } else if (options?.isFromHeader) {
        const duplicateLevel = error?.response?.data?.duplicateValue[3];
        setDuplicateValues(prev => [...new Set([...prev, duplicateLevel, duplicateProgram])]);
        showErrorToast(`${duplicateLevel} and ${duplicateProgram} already exist!`);

      } else {
        setDuplicateValues(prev => [...new Set([...prev, duplicates])]);
        setIsAllDuplicates(true);
        showErrorToast('The data entered already exist. Please check your input.', 'top-center', 8000);
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

        if (options.data?.programId) {
          localStorage.setItem('lastProgramId', options.data.programId)
          navigate(PROGRAM_AREAS({ 
            accredInfoUUID, 
            level: formattedLevel, 
            programUUID
          }));
        }
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
    // Check if container is scrolling instead of window
    console.log(scrollContainerRef);
    
    if (options.data) {
      const level = options.data.level;
      const formattedLevel = String(level).toLowerCase().split(' ').join('-');
      const accredInfoUUID = options.data.accredInfoUUID;
      const programUUID = options.data.programUUID;

      if (options.data?.programId) {
        localStorage.setItem('lastProgramId', options.data.programId); // Save last program id when navigating
        navigate(PROGRAM_AREAS({ 
          accredInfoUUID, 
          level: formattedLevel, 
          programUUID 
        }));
      }
    }
  };

  return {
    refs: {
      accredInfoOptionsRef,
      programOptionsRef,
      titleInputRef,
      levelInputRef,
      programInputRef,
      programCardRef,
      levelRef,
      scrollContainerRef
    },

    datas: {
      disableButton,
      toggleDropdown,
      duplicateValues,
      isAllDuplicates,
      accredInfoLevelPrograms,
      loading,
      error,
      formValue,
      infoHover,
      modalType,
      modalData,
      activeAccredInfoID,
      activeProgramID,
      programInput,
      programs,
    },

    handlers: {
      handleAddClick,
      handleClipboardClick,
      handleCloseClick,
      handleChevronClick,
      handleConfirmClick,
      handleOptionSelection,
      handleInfoHover,
      handleInputChange,
      handleLevelScroll,
      handleProgramCardClick,
      handleOptionClick,
      handleOptionItemClick,
      handleProgramChange,
      handleAddProgramValue,
      handleRemoveProgramValue,
      handleSave
    }
  };
};