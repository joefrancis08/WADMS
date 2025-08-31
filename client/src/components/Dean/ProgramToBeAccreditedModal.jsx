import { CircleQuestionMark, Info, MoveRight, TriangleAlert } from 'lucide-react';
import MODAL_TYPE from '../../constants/modalTypes';
import AddField from '../Form/Dean/AddField';
import ProgramToBeAccreditedBaseModal from '../Modals/accreditation/ProgramToBeAccreditedBaseModal';
import Popover from '../Popover';
import useAccreditationLevel from '../../hooks/fetch-react-query/useAccreditationLevel';
import useAccreditationPeriod from '../../hooks/fetch-react-query/useAccreditationPeriod';
import { useRef, useState } from 'react';
import usePrograms from '../../hooks/fetch-react-query/usePrograms';
import ConfirmationModal from '../Modals/ConfirmationModal';
import useOutsideClick from '../../hooks/useOutsideClick';

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

  // Use useOutsideClick hook to close the dropdown on outside click
  useOutsideClick(dropdownRef, () => setShowDropdown(false));

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
                    placeholder='Type or select date'
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
                    placeholder='Type or select end date'
                    type='date'
                    name='endDate'
                    formValue={formValue.endDate || periodEndValue}
                    datePickerDisabled={!formValue.startDate}
                    minDate={formValue.startDate}
                    onChange={handleInputChange}
                  />
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
                    position='-top-2 -left-64 translate-y-1/2'
                    content={
                      <p className='text-white text-xs p-2'>
                        Type a program and press Enter to store it. {'\n'}
                        <span>
                          Click 'Add Program' or 'Add Programs' to save all stored programs.
                        </span>
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
            onConfirmClick={() => handleConfirmClick({ 
              isFromProgram: true, 
              isDelete: true,
              data: {
                startDate: modalData.startDate,
                endDate: modalData.endDate,
                levelName: modalData.levelName,
                programName: modalData.programName
              }
            })}
            isDelete={true}
            primaryButton={'Delete'}
            secondaryButton={'Cancel'}
            bodyContent={
              <div className='flex flex-col items-center justify-center pb-4 px-2'>
                <div className='flex flex-col items-center justify-center pb-4'>
                  <TriangleAlert className='text-red-400 h-20 w-20'/>
                  <p className='px-8 text-md md:text-lg text-center text-red-500'>
                    Delete "{modalData.programName}"?
                  </p>
                </div>
                
                <div className='pb-2 space-y-2'>
                  <p className='px-8 text-center'>
                    This action cannot be undone. Are you sure you want to delete this program?
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