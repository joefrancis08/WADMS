import React from 'react';
import DeanLayout from '../../components/Layout/Dean/DeanLayout';
import { BookPlus, CirclePlus, EllipsisVertical, NotebookPen, NotepadText, Plus, Scroll } from 'lucide-react';
import ContentHeader from '../../components/Dean/ContentHeader';
import { useProgramsToBeAccredited } from '../../hooks/Dean/useProgramsToBeAccredited';
import ProgramToBeAccreditedModal from '../../components/Dean/ProgramToBeAccreditedModal';
import formatAccreditationPeriod from '../../utils/formatAccreditationPeriod';
import ProgramsToBeAccreditedSL from '../../components/Loaders/ProgramsToBeAccreditedSL';

const ProgramsToAccredit = () => {
  const { 
    addButton,
    close,
    dropdown, 
    form, 
    hovers, 
    inputs, 
    modal, 
    program, 
    programsToBeAccreditedData,
    saveHandler 
  } = useProgramsToBeAccredited();

  const { disableAddButton, handleAddClick } = addButton;
  const { handleCloseClick } = close;
  const { handleOptionSelection } = dropdown;
  const { formValue } = form;
  const { infoHover, handleInfoHover } = hovers;
  const { handleInputChange } = inputs;
  const { modalType } = modal;
  const { handleSave } = saveHandler;
  
  const { programsToBeAccredited, loading, error } = programsToBeAccreditedData;
  const { 
    programInput,
    programs, 
    handleProgramChange,
    handleAddProgramValue,
    handleRemoveProgramValue,
  } = program;
  
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
              title='Add period, level, and program' 
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
              <div className='absolute -top-5 left-1/2 -translate-x-1/2 flex items-center justify-center w-1/2 lg:w-1/3 p-2 bg-gradient-to-l from-slate-900 via-green-600 to-slate-900 shadow-md text-white rounded font-bold'>
                <p className='max-sm:text-sm md:text-md lg:text-lg text-center'>
                  {periodKey}
                </p>
              </div>
              <button 
                title='Options'
                className='absolute top-2 p-2 right-2 text-slate-800 rounded-bl-xl rounded-tr-lg hover:shadow hover:text-slate-700 hover:bg-slate-200 active:opacity-50 transition cursor-pointer'>
                <EllipsisVertical size={24}/>
              </button>
              
              {/* Loop through levels inside each period */}
              {Object.entries(levels).map(([level, programs]) => (
                <React.Fragment key={level} >
                  <div 
                    className='relative p-4 space-y-6 mb-4 border bg-slate-200 shadow-md border-slate-300 rounded-md mx-4 mt-12'
                  >

                    {/* Level label (ex: Level II, Preliminary, etc.) */}
                    <h2 className='absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-[60%] md:w-[70%] lg:w-[80%] p-2 text-lg md:text-2xl bg-gradient-to-l from-green-700 via-yellow-400 to-green-700 shadow-md text-white rounded font-bold'>
                      {level}
                    </h2>

                    {/* Program cards */}
                    <div className='relative flex flex-wrap gap-10 justify-center pb-4 pt-8 px-4'>
                      {programs.map((programName, idx) => (
                        <div
                          key={idx}
                          className='relative flex items-center justify-center h-60 p-8 bg-gradient-to-b from-green-700 to-amber-300 rounded-xl border border-slate-300 shadow hover:shadow-md cursor-pointer transition-all w-full sm:w-65 md:w-70 lg:w-75 xl:w-80'
                        >
                          <p className='flex items-center justify-center text-wrap bg-gradient-to-b from-yellow-300 to-amber-400 w-full text-lg md:text-xl text-white text-center shadow h-40 font-bold p-4'>
                            {programName}
                          </p>

                          <button 
                            title='Options'
                            className='absolute top-0 p-2 right-0 text-slate-100 rounded-bl-xl rounded-tr-lg hover:shadow hover:text-slate-200 hover:bg-slate-100/20 active:opacity-50 transition cursor-pointer'>
                            <EllipsisVertical size={20}/>
                          </button>
                        </div>
                      ))}

                      {/* For adding program */}
                      <div
                        onClick={() => handleAddClick({ isFromCard: true })}
                        title='Click to add program'
                        className='relative flex flex-col items-center justify-center gap-y-2 h-60 p-4 bg-slate-200 border border-gray-300 rounded-lg shadow-md hover:shadow-lg active:shadow-md cursor-pointer transition-all w-full sm:w-65 md:w-70 lg:w-75 xl:w-80'
                      >
                        <Plus className='text-slate-600 h-16 w-16 rounded-full'/>
                        <button className='text-xl font-medium text-slate-600 py-4 px-6 hover:bg-slate-300 rounded-full cursor-pointer'>
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
        infoHover={infoHover}
        modalType={modalType}
        formValue={formValue}
        programs={programs}
        programInput={programInput}
        disableAddButton={disableAddButton}
        handlers={{
          handleCloseClick,
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
