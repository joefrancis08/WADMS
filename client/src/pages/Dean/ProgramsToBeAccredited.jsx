import React from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import { CalendarArrowUp, ClipboardPenLine, ClipboardPlus, EllipsisVertical, Folders, NotebookPen, NotepadText, Plus, Scroll, SquarePen, Trash2 } from 'lucide-react';
import ContentHeader from '../../components/Dean/ContentHeader';
import { useProgramsToBeAccredited } from '../../hooks/Dean/useProgramsToBeAccredited';
import ProgramToBeAccreditedModal from '../../components/Dean/ProgramToBeAccreditedModal';
import formatAccreditationPeriod from '../../utils/formatAccreditationPeriod';
import ProgramsToBeAccreditedSL from '../../components/Loaders/ProgramsToBeAccreditedSL';
import parseAccreditationPeriod from '../../utils/parseAccreditationPeriod';
import Dropdown from '../../components/Dropdown/Dropdown';

const ProgramsToAccredit = () => {
  const { 
    addButton,
    close,
    confirmation,
    dropdown, 
    form, 
    hovers, 
    inputs, 
    modal,
    navigation, 
    option,
    program, 
    programsToBeAccreditedData,
    ref,
    saveHandler 
  } = useProgramsToBeAccredited();

  const { periodOptionsRef, programOptionsRef } = ref;
  const { disableButton, handleAddClick } = addButton;
  const { handleCloseClick } = close;
  const { handleConfirmClick } = confirmation;
  const { handleOptionSelection } = dropdown;
  const { formValue } = form;
  const { infoHover, handleInfoHover } = hovers;
  const { handleInputChange } = inputs;
  const { modalType, modalData } = modal;
  const { handleProgramCardClick } = navigation;
  const { handleSave } = saveHandler;
  const { programsToBeAccredited, loading, error } = programsToBeAccreditedData;
  const { 
    programInput,
    programs, 
    handleProgramChange,
    handleAddProgramValue,
    handleRemoveProgramValue,
  } = program;
  const { 
    activePeriodId,
    activeProgramId, 
    handleOptionClick, 
    handleOptionItemClick 
  } = option;
  
  // Array of Programs To Be Accredited, fallback to empty array if fetch is loading
  const data = programsToBeAccredited.data || [];

  // Group the data into nested structure: Period → Level → Programs
  const grouped = data.reduce((acc, item) => {

    // Create a unique key for the period (start - end) use formatAccreditationPeriod to format the dates.
    // If period_start is missing, use "No start" instead.
    const periodKey = item.period_start
      ? formatAccreditationPeriod(item.period_start, item.period_end)
      : `No start - ${formatAccreditationPeriod(item.period_end, item.period_end)}`;

    // If this period does not exist yet in the accumulator,
    // initialize it as an empty object.
    if (!acc[periodKey]) {
      acc[periodKey] = {};
    }

    // Inside this period, if the level does not exist yet,
    // initialize it as an empty array (to hold the programs).
    if (!acc[periodKey][item.level]) {
      acc[periodKey][item.level] = [];
    }

    // Push the current program into the correct period + level group.
    acc[periodKey][item.level].push(item.program);

    // Always return the accumulator so reduce can keep building it.
    return acc;
  }, {}); // Start with an empty object {}

  // Options for Period
  const periodOptions = [
    { icon: <ClipboardPlus size={24} />, label: 'Add Level and Programs' },
    { icon: <CalendarArrowUp size={24} />, label: 'Change Period' },
    { icon: <Trash2 size={24} />, label: 'Delete' },
  ];

  const programOptions = [
    { icon: <Folders size={22} />, label: 'View Areas and Parameters' },
    { icon: <SquarePen size={22} />, label: 'Update' },
    { icon: <Trash2 size={22} />, label: 'Delete' },
  ];

  return (
    <DeanLayout>
      <div className='flex-1 space-y-3'>
        {/* Header */}
        <ContentHeader 
          headerIcon={NotepadText}
          headerTitle='Programs to be Accredited'
          searchTitle='Search Program to be Accredited'
          placeholder='Search program to be accredited...'
          condition={Object.entries(grouped).length > 0}
        />

        {/* Add button */}
        <div className='relative px-4 flex justify-end'>
          <div className='flex items-center'>
            <button 
              title='Create period, level, and programs to be accredited' 
              onClick={handleAddClick} 
              className='p-3 rounded-full mr-2 cursor-pointer transition-all shadow bg-slate-300 hover:opacity-80 active:opacity-50'
            >
              <NotebookPen className='text-slate-700' size={28}/>
            </button>
          </div>
        </div>
        
        {/* Render fallback UI if data is empty */}
        {loading ? (
          <ProgramsToBeAccreditedSL /> 
        ) : Object.entries(grouped).length === 0 ? (
          <div className='flex flex-col items-center justify-center h-100'>
            <Scroll className='text-slate-500 h-40 w-40 md:h-60 md:w-60'/>
            <p className='text-center font-medium text-slate-600 text-lg md:text-xl'>
              No program to be accredited yet.
            </p>
          </div>
        ) : (
          /* Render Accreditation Period, Level, and Programs to be accredited */
          Object.entries(grouped).map(([periodKey, levels]) => (
            <div 
              key={periodKey} 
              className='relative bg-slate-300 rounded-md p-4 mx-4 mb-15 mt-6'
            >
              {/* Period label (ex: Aug 26 – Aug 29, 2025) */}
              <div className='absolute -top-5 left-1/2 -translate-x-1/2 flex items-center justify-center w-1/2 lg:w-1/3 p-2 bg-slate-600 shadow-md text-white rounded font-bold'>
                <p className='max-sm:text-sm md:text-md lg:text-lg text-center'>
                  {periodKey}
                </p>
              </div>
              {/* Render period options if the Options button is clicked */}
              {activePeriodId === periodKey && (
                <div ref={periodOptionsRef} className='absolute top-8 right-48 z-10 space-y-2 p-2 '>
                  <Dropdown 
                    key={periodKey}
                    width='h-auto w-50' 
                    border='border border-slate-400 rounded-md' 
                  >
                    {periodOptions.map((option, index) => (
                      <React.Fragment key={index}>
                        {option.label === 'Delete' && (
                          <hr className='m-1 text-slate-300'></hr>
                        )}
                        <div 
                          onClick={(e) => (
                            handleOptionItemClick(e, {
                              isFromPeriod: true,
                              optionName: option.label,
                              data: {
                                period: parseAccreditationPeriod(periodKey)
                              }
                            })
                          )}
                          key={index} 
                          className={`flex items-center p-2 justify-start gap-x-2 cursor-pointer rounded-md active:opacity-60 transition ${option.label === 'Delete' ? 
                          'hover:bg-red-200' : 'hover:bg-slate-200'}`}
                        >
                          <i className={option.label === 'Delete' ? 'text-red-500' : 'text-slate-800'}>
                            {option.icon}
                          </i>
                          <p className={option.label === 'Delete' ? 'text-red-500' : 'text-slate-800'}>
                            {option.label}
                          </p>
                        </div>
                      </React.Fragment>
                    ))}
                  </Dropdown>
                </div>
              )}
              {/* Options for Accreditation Period */}
              <button 
                onClick={(e) => (
                  handleOptionClick(e, { 
                    isFromPeriod: true,
                    data: {
                      periodId: periodKey
                    }
                  }))}
                title='Options'
                className='absolute top-2 p-2 right-2 text-black rounded-bl-lg rounded-tr-lg hover:shadow hover:text-slate-700 hover:bg-slate-200 active:opacity-50 transition cursor-pointer'>
                <EllipsisVertical size={24}/>
              </button>
              
              {/* Loop through levels inside each period */}
              {Object.entries(levels).map(([level, programs]) => (
                <React.Fragment key={level} >
                  <div 
                    className='relative p-4 space-y-6 mb-4 border bg-slate-800 shadow-lg border-slate-700 rounded-lg mx-4 mt-12 '
                  >

                    {/* Level label (ex: Level II, Preliminary, etc.) */}
                    <h2 className='absolute top-3 left-1/2 -translate-x-1/2 flex items-center justify-center w-[60%] md:w-[50%] lg:w-[40%] p-2 text-lg md:text-2xl bg-slate-900 border-b-2 border-slate-500 to-green-700 shadow-md text-white rounded font-bold'>
                      {level}
                    </h2>

                    {/* Program cards */}
                    <div className='relative flex flex-wrap gap-10 justify-center pb-4 pt-16 px-4'>
                      {programs.map((programName, id) => {
                        /* 
                          Use this id (programId) in passing the data because id is an index
                          and it starts with zero and when activeProgramId === 0
                          then that would be false and won't render the dropdown options 
                          of the first program card. Never rely on 2nd parameter on map, only
                          use it in keys. Also, include the periodKey in id, 
                          not just level and programName because there mignt be cases that 
                          level and programName is the same in the different period.
                        */
                        const programId = `${periodKey}-${level}-${programName}`; 
                        return (
                          <div
                            key={id}
                            onClick={(e) => handleProgramCardClick(e, {
                              data: {
                                periodKey,
                                level,
                                programName
                              }
                            })}
                            className='relative flex items-center justify-center h-60 py-8 px-4 bg-gradient-to-b from-green-700 to-yellow-400 rounded-xl shadow hover:shadow-slate-500 hover:shadow-md active:shadow cursor-pointer transition-all w-full sm:w-65 md:w-70 lg:w-75 xl:w-80'
                          >
                            <p className='flex items-center justify-center text-wrap rounded-md bg-gradient-to-b border-slate-400 from-slate-900 to-green-600 w-full text-lg md:text-xl text-white text-center shadow h-40 font-bold p-5'>
                              {programName}
                            </p>

                            {/* Render program options when option button is clicked */}
                            {activeProgramId === programId && (
                              <div ref={programOptionsRef} className='absolute top-6 right-47 z-10 space-y-2 p-2 '>
                                <Dropdown 
                                  key={id}
                                  width='h-auto w-50' 
                                  border='border border-slate-400 rounded-md' 
                                >
                                  {programOptions.map((option, index) => (
                                    <React.Fragment key={index}>
                                      {option.label === 'Delete' && (
                                        <hr className='m-1 text-slate-300'></hr>
                                      )}
                                      <div 
                                        onClick={(e) => (
                                          handleOptionItemClick(e, { 
                                            isFromProgram: true,
                                            optionName: option.label,
                                            data: {
                                              period: parseAccreditationPeriod(periodKey),
                                              levelName: level,
                                              programName
                                            }
                                          }))}
                                        key={index} 
                                        className={`flex items-center p-2 justify-start gap-x-2 cursor-pointer rounded-md active:opacity-60 ${option.label === 'Delete' ? 
                                        'hover:bg-red-200' : 'hover:bg-slate-200'}`}
                                      >
                                        <i className={option.label === 'Delete' ? 'text-red-500' : 'text-slate-800'}>
                                          {option.icon}
                                        </i>
                                        <p className={`text-sm ${option.label === 'Delete' ? 'text-red-500' : 'text-slate-800'}`}>
                                          {option.label}
                                        </p>
                                      </div>
                                    </React.Fragment>
                                  ))}
                                </Dropdown>
                              </div>
                            )}

                            {/* Option button for Program Cards */}
                            <button 
                              onClick={(e) => (
                                handleOptionClick(e, { 
                                  isFromProgram: true,
                                  data: {
                                    periodKey,
                                    level,
                                    programId
                                  }
                                }))}
                              title='Options'
                              className='absolute top-1 p-2 right-1 text-slate-100 rounded-bl-lg rounded-tr-lg hover:shadow hover:text-slate-200 hover:bg-slate-100/20 active:opacity-50 transition cursor-pointer'>
                              <EllipsisVertical size={20}/>
                            </button>
                          </div>
                        )}
                      )}

                      {/* Card button for adding program */}
                      <div
                        onClick={() => handleAddClick({ 
                          isFromCard: true, 
                          data: { 
                            level,
                            period: parseAccreditationPeriod(periodKey) 
                          }  
                        })}
                        title='Click to add program'
                        className='relative flex flex-col items-center justify-center gap-y-2 h-60 p-4 bg-slate-600 rounded-lg shadow-md hover:shadow-slate-400 hover:shadow-md active:shadow cursor-pointer transition-all w-full sm:w-65 md:w-70 lg:w-75 xl:w-80'
                      >
                        <Plus className='text-white h-16 w-16 rounded-full'/>
                        <button className='text-xl font-medium text-white py-4 px-6 rounded-full cursor-pointer'>
                          Add Program
                        </button>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      <ProgramToBeAccreditedModal 
        modalData={modalData}
        infoHover={infoHover}
        modalType={modalType}
        formValue={formValue}
        programs={programs}
        programInput={programInput}
        disableButton={disableButton}
        handlers={{
          handleCloseClick,
          handleConfirmClick,
          handleSave,
          handleInputChange,
          handleOptionSelection,
          handleAddProgramValue,
          handleRemoveProgramValue,
          handleProgramChange,
          handleInfoHover,
        }}
      />
    </DeanLayout>
  );
};

export default ProgramsToAccredit;
