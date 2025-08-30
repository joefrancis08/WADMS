import { CircleQuestionMark, Info, MoveRight, TriangleAlert } from 'lucide-react';
import MODAL_TYPE from '../../constants/modalTypes';
import AddField from '../Form/Dean/AddField';
import ProgramToBeAccreditedBaseModal from '../Modals/accreditation/ProgramToBeAccreditedBaseModal';
import Popover from '../Popover';
import useAccreditationLevel from '../../hooks/fetch-react-query/useAccreditationLevel';
import useAccreditationPeriod from '../../hooks/fetch-react-query/useAccreditationPeriod';
import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import usePrograms from '../../hooks/fetch-react-query/usePrograms';
import ConfirmationModal from '../Modals/ConfirmationModal';

const ProgramToBeAccreditedModal = ({
  infoHover,
  modalType,
  formValue,
  programs,
  programInput,
  disableButton,
  handlers,
  modalData
}) => {
  const dropdownRef = useRef();
  const [ showDropdown, setShowDropdown ] = useState(false); // Create local state for date dropdown
  const [focus, setFocus] = useState(false);

  // Here we store the value of the selected period in the dropdown
  const [ periodStartValue, setPeriodStartValue] = useState(null); 
  const [ periodEndValue, setPeriodEndValue ] = useState(null);

  const { levels, loadingAL, errorAL } = useAccreditationLevel();
  const data = levels?.data ?? []; // Fallback to [] if levels.data is null or undefined
  const levelsArray = data.map(item => item.level); // Map over data to extract only the "level" values
  
  const { period, loadingP, errorP } = useAccreditationPeriod();
  const dataP = period?.data ?? [];

  const { programsData, loadingPr, errorPr } = usePrograms();
  const dataPr = programsData?.data ?? [];
  const programsArray = dataPr.map(item => item.program);
  
  const {
    handleCloseClick,
    handleConfirmClick,
    handleSave,
    handleInputChange,
    handleOptionSelection,
    handleAddProgramValue,
    handleRemoveProgramValue,
    handleProgramChange,
    handleInfoHover,
  } = handlers;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownOptionClick = (periodStart, periodEnd) => {
    setShowDropdown(false);
    
    handleInputChange(periodStart, 'startDate');
    handleInputChange(periodEnd, 'endDate');
  };

  const handleClose = () => {
    handleCloseClick({ isFromMain: true });
    setPeriodStartValue(null);
    setPeriodEndValue(null);
    handleProgramChange({ target: { name: 'programInput', value: '' } }); // Reset textarea
  };

  const handleFocus = () => {
    setFocus(true);

    const interval = setTimeout(() => setFocus(false), 10000);
    return () => clearInterval(interval);
  };

  switch (modalType) {
      case MODAL_TYPE.ADD_PROGRAM_TO_BE_ACCREDITED:
        return (
          <ProgramToBeAccreditedBaseModal
            mode='add'
            modalData={modalData}
            onClose={() => handleClose({isFromMain: true})}
            onCancel={() => handleClose({isFromMain: true})}
            onSave={handleSave}
            primaryButton='Create'
            secondaryButton='Cancel'
            disabled={disableButton?.({ isFromMain: true })}
            headerContent={
              <p className='ml-5 text-xl font-semibold text-slate-900'>
                Create Period, Level, and Program
              </p>
            }
            bodyContent={
              <div className='relative w-[90%]'>
                <p className='text-center text-lg text-slate-800'>
                  Accreditation Period
                </p>
                <div className='flex flex-row items-center gap-x-2'>
                  <AddField
                    fieldName='Start Date'
                    placeholder='Select start date'
                    type='date'
                    name='startDate'
                    formValue={formValue.startDate || periodStartValue}
                    minDate={new Date()}
                    onFocus={() => setShowDropdown(true)}
                    onChange={handleInputChange}
                    calendarClose={showDropdown}
                  />
                  <p className='text-gray-500'>&ndash;</p>
                  <AddField 
                    fieldName='End Date'
                    placeholder='Select end date'
                    type='date'
                    name='endDate'
                    formValue={formValue.endDate || periodEndValue}
                    datePickerDisabled={!formValue.startDate}
                    minDate={formValue.startDate}
                    onChange={handleInputChange}
                  />
                  
                  {showDropdown && dataP.length > 0 && (
                    <div
                      ref={dropdownRef}
                      className="absolute top-25 left-0 flex flex-col w-full border border-slate-400 rounded-md bg-slate-100 shadow-xl z-50 p-2 text-gray-700"
                    >
                      {dataP.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center w-full px-3 py-2 hover:bg-slate-200 rounded-md cursor-pointer active:opacity-70"
                          onClick={() => handleDropdownOptionClick(item.period_start, item.period_end)}
                        >
                          <span className="text-md">
                            {format(item.period_start, "MMMM dd, yyyy")}
                          </span>
                          <span className="text-gray-500"><MoveRight size={15}/></span>
                          <span className="text-mdp">
                            {format(item.period_end, "MMMM dd, yyyy")}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>
                <hr className='w-[60%] mx-auto text-slate-300'></hr>
                <AddField 
                  fieldName='Level'
                  placeholder='e.g., Preliminary, Level I, Level II, etc.'
                  type='text'
                  name='level'
                  formValue={formValue.level}
                  onChange={handleInputChange}
                  showDropdownOnFocus={true}
                  dropdownItems={levelsArray}
                  onDropdownMenuClick={handleOptionSelection}
                />
                <div className='relative'>
                  <AddField 
                    fieldName={programs.length > 1 ? 'Programs' : 'Program'}
                    placeholder='e.g., Master of Management, Doctor of Philosophy in Education in Educational Management, etc.'
                    type='textarea'
                    name='programInput'
                    formValue={programInput}
                    multiValue={true}
                    multiValues={programs}
                    dropdownItems={programsArray}
                    showDropdownOnFocus={true}
                    onDropdownMenuClick={handleOptionSelection}
                    onAddValue={(val) => handleAddProgramValue(val)}
                    onRemoveValue={(index) => handleRemoveProgramValue(index)}
                    onChange={(e) => handleProgramChange(e)}
                  />
                  <CircleQuestionMark
                    onMouseEnter={handleInfoHover}
                    onMouseLeave={handleInfoHover}
                    className='absolute text-slate-500 hover:text-slate-600 top-4 -left-7' size={22}
                  />
                  {infoHover && (
                    <Popover 
                      handleMouseEnter={handleInfoHover}
                      handleMouseLeave={handleInfoHover}
                      position='-top-18 -left-7'
                      content={
                        <p className='text-white text-sm p-2'>
                          Type a program and press Enter to add it. Click 'Create' to save all programs with their level and period.
                        </p>
                      }
                    />
                  )}
                </div>
              </div>
            }
          />
        );
    
      case MODAL_TYPE.ADD_PROGRAM_TO_BE_ACCREDITED_CARD:
        return (
          <ProgramToBeAccreditedBaseModal 
            mode='add'
            onClose={() => handleCloseClick({isFromCard: true})}
            onCancel={() => handleCloseClick({isFromCard: true})}
            onSave={() => handleSave({
              isFromCard: true,
              data: {
                startDate: modalData.startDate,
                endDate: modalData.endDate,
                level: modalData.level
              }
            })}
            primaryButton={programs.length > 1 ? 'Add Programs' : 'Add Program'}
            disabled={disableButton?.({ isFromCard: true })}
            secondaryButton={'Cancel'}
            headerContent={
              <div className='flex items-center justify-center relative gap-x-2'>
                <p className='ml-5 text-xl font-semibold text-slate-800'>
                  Add Program to {modalData.level}
                </p>
                {<CircleQuestionMark 
                  onMouseEnter={null}
                  onMouseLeave={null}
                  className='hover:opacity-75' size={20}/>}
              </div>
            }
            bodyContent={
              <div className='relative w-[90%]'>
                <AddField 
                  fieldName={programs.length > 1 ? 'Programs' : 'Program'}
                  placeholder='e.g., Master of Management, Doctor of Philosophy in Education in Educational Management, etc.'
                  type='textarea'
                  name='programInput'
                  formValue={programInput}
                  multiValue={true}
                  multiValues={programs}
                  dropdownItems={programsArray}
                  showDropdownOnFocus={true}
                  onDropdownMenuClick={handleOptionSelection}
                  onAddValue={(val) => handleAddProgramValue(val)}
                  onRemoveValue={(index) => handleRemoveProgramValue(index)}
                  onChange={(e) => handleProgramChange(e)}
                  onFocus={handleFocus}
                />
                {focus && (
                  <Popover 
                    position='-top-4 -left-64 translate-y-1/2'
                    content={
                      <p className='text-white text-sm p-2'>
                        Type a program and press Enter to store it. Click 'Add Program' to save all stored programs.
                      </p>
                    }
                  />
                )}
              </div>
            }
          />
        );

      case MODAL_TYPE.DELETE_PROGRAM_TO_BE_ACCREDITED:
        return (
          <ConfirmationModal 
            onClose={() => handleCloseClick({ isFromProgram: true, isDelete: true})}
            onCancelClick={() => handleCloseClick({ isFromProgram: true, isDelete: true })}
            onConfirmClick={() => handleConfirmClick({ isFromProgram: true, isDelete: true })}
            isDelete={true}
            primaryButton={'Confirm'}
            secondaryButton={'Cancel'}
            bodyContent={
              <div className='flex flex-col items-center justify-center pb-4 px-2'>
                <div className='flex flex-col items-center justify-center pb-4'>
                  <TriangleAlert className='text-red-400 h-20 w-20'/>
                  <p className='px-8 text-lg text-center text-red-500'>
                    Delete {modalData.program}?
                  </p>
                </div>
                
                <div className='pb-2 space-y-2'>
                  <p className='text-center'>
                    You can't undo this action. Do you want to proceed?
                  </p>
                </div>
              </div>
            }
          />
        );

      default:
        return null;
    }
};

export default ProgramToBeAccreditedModal;