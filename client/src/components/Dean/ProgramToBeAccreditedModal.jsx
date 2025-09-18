import { CircleQuestionMark, Info, MoveRight, TriangleAlert } from 'lucide-react';
import MODAL_TYPE from '../../constants/modalTypes';
import AddField from '../Form/AddField';
import ProgramToBeAccreditedBaseModal from '../Modals/accreditation/ProgramToBeAccreditedBaseModal';
import Popover from '../Popover';
import useAccreditationLevel from '../../hooks/fetch-react-query/useAccreditationLevel';
import { useState } from 'react';
import usePrograms from '../../hooks/fetch-react-query/usePrograms';
import ConfirmationModal from '../Modals/ConfirmationModal';
import formatAccreditationPeriod from '../../utils/formatAccreditationPeriod';

const ProgramToBeAccreditedModal = ({
  ref,
  modalType,
  formValue,
  programs,
  programInput,
  duplicateValues,
  disableButton,
  handlers,
  modalData
}) => {
  // Here we store the value of the selected year in the dropdown
  const [ accredYear, setAccredYear] = useState(null); 

  const { levels, loading: levelLoading, error: errorLoading } = useAccreditationLevel();
  const data = levels?.data ?? []; // Fallback to [] if levels.data is null or undefined
  const levelsArray = data.map(item => item.level); // Map over data to extract only the "level" values

  const { programsData, loading: programLoading, error: programError } = usePrograms();
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
  } = handlers;

  const handleClose = () => {
    handleCloseClick({ isFromMain: true });
    setAccredYear(null);
    handleProgramChange({ target: { name: 'programInput', value: '' } }); // Reset textarea
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
                Add New Accreditation
              </p>
            }
            bodyContent={
              <div className='relative w-full px-8'>
                <div className='flex flex-row items-center gap-x-2'>
                  <AddField
                    ref={ref} 
                    fieldName='Title'
                    placeholder={'Enter new title...'}
                    type='text'
                    name='title'
                    formValue={formValue?.title}
                    isDropdown={false}
                    onChange={handleInputChange}
                    showDropdownOnFocus={false}
                    // dropdownItems={null}
                    // onDropdownMenuClick={handleOptionSelection}
                  />
                  <AddField
                    fieldName='Year'
                    placeholder='Enter or year...'
                    type='date'
                    name='year'
                    formValue={formValue.year ? new Date(formValue.year, 0, 1) : null}
                    minDate={new Date()}
                    onChange={handleInputChange}
                  />
                </div>
                <AddField 
                  fieldName='Accrediting Agency'
                  placeholder={'Enter accrediting agency...'}
                  type='text'
                  name='accreditationBody'
                  formValue={formValue?.accreditationBody}
                  isDropdown={false}
                  onChange={handleInputChange}
                  showDropdownOnFocus={false}
                  // dropdownItems={levelsArray}
                  // onDropdownMenuClick={handleOptionSelection}
                />
                <AddField 
                  fieldName='Level'
                  placeholder={levelsArray.length > 0 
                    ? 'Enter new level or select from below...'
                    : 'Enter new level...'
                  }
                  type='text'
                  name='level'
                  formValue={formValue.level}
                  isDropdown={levelsArray.length > 0}
                  onChange={handleInputChange}
                  showDropdownOnFocus={true}
                  dropdownItems={levelsArray}
                  isReadOnly
                  onDropdownMenuClick={handleOptionSelection}
                />
                <div className='relative'>
                  <AddField 
                    fieldName={programs.length > 1 ? 'Programs' : 'Program'}
                    placeholder={programs.length < programsArray.length && programsArray.length > 0 
                      ? 'Enter new program or select from below...'
                      : 'Enter new program...'
                    }
                    type='textarea'
                    name='programInput'
                    formValue={programInput}
                    multiValue={true}
                    multiValues={programs}
                    dropdownItems={programsArray}
                    duplicateValues={duplicateValues}
                    showDropdownOnFocus={true}
                    isDropdown={programsArray.length > 0 && !programs.length}
                    onDropdownMenuClick={handleOptionSelection}
                    onAddValue={(val) => handleAddProgramValue(val)}
                    onRemoveValue={(index) => handleRemoveProgramValue(index)}
                    onChange={(e) => handleProgramChange(e)}
                  />
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
                title: modalData?.title,
                year: modalData?.year,
                accredBody: modalData?.accreditationBody,
                level: modalData?.level,
                programNames: programs
              }
            })}
            primaryButton={programs.length > 1 ? 'Add Programs' : 'Add Program'}
            disabled={disableButton?.({ isFromCard: true })}
            secondaryButton={'Cancel'}
            headerContent={
              <div className='flex items-center justify-center relative gap-x-2'>
                <p className='ml-5 text-xl font-semibold text-slate-800'>
                  Add Programs to {modalData.level}
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
                  ref={ref} 
                  fieldName={programs.length > 1 ? 'Programs' : 'Program'}
                  placeholder={
                    programs.length < programsArray.length && programsArray.length > 0
                      ? 'Enter new program or select from below...'
                      : 'Enter new program...'
                  }
                  type='textarea'
                  name='programInput'
                  formValue={programInput}
                  multiValue={true}
                  multiValues={programs}
                  dropdownItems={programsArray}
                  duplicateValues={duplicateValues}
                  showDropdownOnFocus={true}
                  isDropdown={programsArray.length > 0 && !programs.length}
                  onDropdownMenuClick={handleOptionSelection}
                  onAddValue={(val) => handleAddProgramValue(val)}
                  onRemoveValue={(index) => handleRemoveProgramValue(index)}
                  onChange={(e) => handleProgramChange(e)}
                />
              </div>
            }
          />
        );

      case MODAL_TYPE.ADD_LEVEL_PROGRAM:
       return (
        <ProgramToBeAccreditedBaseModal
          mode='add'
          modalData={modalData}
          onClose={() => handleClose({ isFromHeader: true })}
          onCancel={() => handleClose({ isFromHeader: true })}
          onSave={() => handleSave({ 
            isFromHeader: true,
            data: {
              title: modalData?.title,
              year: modalData?.year,
              accredBody: modalData?.accreditationBody
            }
          })}
          primaryButton='Add'
          secondaryButton='Cancel'
          disabled={disableButton?.({ isFromHeader: true })}
          headerContent={
            <p className='ml-5 text-xl font-semibold text-slate-900'>
              Add Level and Programs
            </p>
          }
          bodyContent={
            <div className='relative w-full px-8'>
              <AddField 
                fieldName='Level'
                placeholder={levelsArray.length > 0 
                  ? 'Enter new level or select from below...'
                  : 'Enter new level...'
                }
                type='text'
                name='level'
                formValue={formValue.level}
                isDropdown={levelsArray.length > 0}
                onChange={handleInputChange}
                showDropdownOnFocus={true}
                dropdownItems={levelsArray}
                isReadOnly
                onDropdownMenuClick={handleOptionSelection}
              />
              <div className='relative'>
                <AddField 
                  fieldName={programs.length > 1 ? 'Programs' : 'Program'}
                  placeholder={programs.length < programsArray.length && programsArray.length > 0 
                    ? 'Enter new program or select from below...'
                    : 'Enter new program...'
                  }
                  type='textarea'
                  name='programInput'
                  formValue={programInput}
                  multiValue={true}
                  multiValues={programs}
                  dropdownItems={programsArray}
                  duplicateValues={duplicateValues}
                  showDropdownOnFocus={true}
                  isDropdown={programsArray.length > 0 && !programs.length}
                  onDropdownMenuClick={handleOptionSelection}
                  onAddValue={(val) => handleAddProgramValue(val)}
                  onRemoveValue={(index) => handleRemoveProgramValue(index)}
                  onChange={(e) => handleProgramChange(e)}
                />
              </div>
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
                    Delete {'\n'}
                    <span className='font-bold'>
                      {modalData.programName}
                    </span>?
                  </p>
                </div>
                
                <div className='pb-2 space-y-2'>
                  <p className='px-8 text-center'>
                    This will permanently delete the program along with all associated areas and parameters. This action cannot be undone.
                  </p>
                  <p className='px-8 text-center'>
                    Do you want to proceed?
                  </p>
                </div>
              </div>
            }
          />
        );
      
      case MODAL_TYPE.DELETE_PERIOD:
        return (
          <ConfirmationModal 
            onClose={() => handleCloseClick({ isFromPeriod: true, isDelete: true })}
            onCancelClick={() => handleCloseClick({ isFromPeriod: true, isDelete: true })}
            onConfirmClick={() => handleConfirmClick({
              isFromPeriod: true,
              isDelete: true,
              data: {
                startDate: modalData.startDate,
                endDate: modalData.endDate
              }
            })}
            isDelete={true}
            primaryButton='Delete'
            secondaryButton='Cancel'
            bodyContent={
              <div className='flex flex-col items-center justify-center pb-4 px-2'>
                <div className='flex flex-col items-center justify-center pb-4'>
                  <TriangleAlert className='text-red-400 h-20 w-20'/>
                  <p className='px-8 text-md md:text-lg text-center text-red-500'>
                    Delete {'\n'}
                    <span className='font-bold'>
                      {formatAccreditationPeriod(modalData.startDate, modalData.endDate)}
                    </span> {'\n'}
                    Period?
                  </p>
                </div>
                
                <div className='pb-2 space-y-2'>
                  <p className='px-8 text-center'>
                    This action will permanently delete the period along with all associated levels and programs. This cannot be undone.
                  </p>
                  <p className='px-8 text-center'>
                    Do you want to proceed?
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