import { CircleQuestionMark } from 'lucide-react';
import MODAL_TYPE from '../../constants/modalTypes';
import AddField from '../Form/Dean/AddField';
import ProgramToAccreditModal from '../Modals/accreditation/ProgramToAccreditModal';
import Popover from '../Popover';
import Dropdown from '../Dropdown/Dropdown';
import useAccreditationLevel from '../../hooks/fetch/useAccreditationLevel';

const ProgramToBeAccreditedModal = ({
  infoHover,
  modalType,
  formValue,
  programs,
  programInput,
  disableAddButton,
  handlers,
}) => {
  const { levels, loadingAL, errorAL } = useAccreditationLevel();
  const data = levels?.data ?? []; // Fallback to [] if levels.data is null or undefined
  const levelsArray = data?.map(item => item.level); // Map over data to extract only the "level" values
  console.log(levelsArray);
  const {
    handleCloseClick,
    handleSave,
    handleInputChange,
    handleOptionSelection,
    handleAddProgramValue,
    handleRemoveProgramValue,
    handleProgramChange,
    handleInfoHover,
  } = handlers;

  switch (modalType) {
      case MODAL_TYPE.ADD_PROGRAM_TO_ACCREDIT:
        return (
          <ProgramToAccreditModal
            mode='add'
            onClose={handleCloseClick}
            onCancel={handleCloseClick}
            onSave={handleSave}
            primaryButton='Add Program'
            secondaryButton='Cancel'
            disabled={disableAddButton}
            headerContent={
              <p className='ml-5 text-2xl font-semibold text-slate-900'>
                Add Program(s) to be Accredited
              </p>
            }
            bodyContent={
              <div className='w-[90%]'>
                <p className='text-center text-lg text-slate-800'>Accreditation Period</p>
                <div className='flex flex-row items-center gap-x-2'>
                  <AddField
                    fieldName='Start Date'
                    placeholder='Select start date'
                    type='date'
                    name='startDate'
                    formValue={formValue.startDate}
                    minDate={new Date()}
                    onChange={handleInputChange}
                  />
                  <p className='text-gray-500'>&ndash;</p>
                  <AddField 
                    fieldName='End Date'
                    placeholder='Select end date'
                    type='date'
                    name='endDate'
                    formValue={formValue.endDate}
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
                          You can add multiple programs. Press "Enter" after you add one program.
                        </p>
                      }
                    />
                  )}
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