import { format } from "date-fns";
import { useEffect, useState } from "react";
import { addProgramToBeAccredited } from "../api/accreditation/accreditationAPI";
import MODAL_TYPE from "../constants/modalTypes";

export const useProgramToAccredit = () => {
  const [modalType, setModalType] = useState(null);
  const [hoverProgramOptions, setHoverProgramOptions] = useState(false);
  const [infoHover, setInfoHover] = useState(false);
  
  const [programs, setPrograms] = useState([]); // Save here the program inputted
  const [programInput, setProgramInput] = useState(''); // Temporaty input for text area
  const [formValue, setFormValue] = useState({
    startDate: null,
    endDate: null,
    level: '',
  });

  const disableAddButton = !formValue.startDate || !formValue.endDate || 
    !formValue.level.trim() || programs.length === 0;

  const handleAddClick = () => {
    setModalType(MODAL_TYPE.ADD_PROGRAM_TO_ACCREDIT);
  };

  const handleCloseClick = () => {
    setModalType(null);
    setPrograms([]);
    setFormValue({
      startDate: null,
      endDate: null,
      level: '',
    });
  };

  const handleInputChange = (eOrDate, fieldName) => {
    // Check if the input is a normal DOM event (like typing in a text field)
    if (eOrDate && eOrDate.target) {
      const { name, value } = eOrDate.target; // Destructure the field name and value
      setFormValue(prev => ({ ...prev, [name]: value })); // Update the form value for that field
    } else {
      // Input is a Date (from a date picker)
      if (fieldName === "startDate") {
        if (eOrDate) {
          // Start date selected
          const newStartDate = eOrDate; // Store selected start date
          const newEndDate = new Date(newStartDate); // Copy start date
          newEndDate.setDate(newEndDate.getDate() + 3); // Automatically set end date to 3 days after start date
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

  const handleProgramChange = (e) => {
    setProgramInput(e.target.value);
  };

  const handleAddProgramValue = (val) => {
    setPrograms([...programs, val])
  };

  const handleRemoveProgramValue = (index) => {
    setPrograms(programs.filter((_, i) => i !== index))
  };

  const handleSave = async () => {
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

        console.log(res);
        handleCloseClick();
      }
    } catch (error) {
      console.error('Error adding program to be accredited: ', error);
    }
  };

  const handleInfoHover = () => {
    setInfoHover(!infoHover);
  };

  const handleHoverProgramOptions = () => {
    setHoverProgramOptions(!hoverProgramOptions);
  }

  return {
    addButton: {
      disableAddButton,
      handleAddClick
    },

    close: {
      handleCloseClick
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
      modalType
    },

    program: {
      programInput,
      programs,
      hoverProgramOptions,
      handleProgramChange,
      handleAddProgramValue,
      handleRemoveProgramValue,
      handleHoverProgramOptions
    },

    saveHandler: {
      handleSave
    }
  };
};