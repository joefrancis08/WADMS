import AdminLayout from '../../components/Layout/Dean/DeanLayout';
import { BookPlus, NotebookPen, NotepadText } from 'lucide-react';
import ContentHeader from '../../components/Dean/ContentHeader';
import { useProgramToAccredit } from '../../hooks/useProgramToAccredit';
import ProgramToBeAccreditedModal from '../../components/Dean/ProgramToBeAccreditedModal';
import formatAccreditationPeriod from '../../utils/formatAccreditationPeriod';

const ProgramsToAccredit = () => {
  const { addButton, close, form, hovers, inputs, modal, program, saveHandler } = useProgramToAccredit();

  const { disableAddButton, handleAddClick } = addButton;
  const { handleCloseClick } = close;
  const { formValue } = form;
  const { infoHover, handleInfoHover } = hovers;
  const { handleInputChange } = inputs;
  const { modalType } = modal;
  const { handleSave } = saveHandler;
  const { 
    programInput,
    programs, 
    hoverProgramOptions, 
    handleProgramChange,
    handleAddProgramValue,
    handleRemoveProgramValue,
    handleHoverProgramOptions 
  } = program;

  // Sample data
  const data = [
    {
      period_start: "2025-08-26T16:00:00.000Z",
      period_end: "2025-08-29T16:00:00.000Z",
      level: "Preliminary",
      program: "Doctor of Philosophy"
    },
    {
      period_start: "2025-08-26T16:00:00.000Z",
      period_end: "2025-08-29T16:00:00.000Z",
      level: "Preliminary",
      program: "Master of Management"
    },
    {
      period_start: "2025-08-24T16:00:00.000Z",
      period_end: "2025-08-29T16:00:00.000Z",
      level: "Level IV",
      program: "PhD-TM"
    },
    {
      period_start: null,
      period_end: "2025-08-29T16:00:00.000Z",
      level: "Level IV",
      program: "PhD-TM"
    },
    {
      period_start: "2025-10-31T16:00:00.000Z",
      period_end: "2025-11-03T16:00:00.000Z",
      level: "Level 3",
      program: "Master of Management"
    },
    {
      period_start: "2025-10-31T16:00:00.000Z",
      period_end: "2025-11-03T16:00:00.000Z",
      level: "Level 3",
      program: "Doctor of Philosophy in Education in Educational Management"
    }
  ];

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

  console.log(grouped);

  return (
    <AdminLayout>
      <div className='flex-1 space-y-3'>
        {/* Header */}
        <ContentHeader 
          headerIcon={NotepadText}
          headerTitle='Programs to be Accredited'
          searchTitle='Search Program to be Accredited'
          placeholder='Search program to be accredited...'
          condition={true}
        />

        {/* Add button */}
        <div className='relative px-4 flex justify-end'>
          <div className='flex items-center'>
            <button 
              title='Add Program to Accredit' 
              onClick={handleAddClick} 
              className='p-3 rounded-full mr-2 cursor-pointer transition-all shadow bg-slate-300 hover:opacity-80 active:opacity-50'
            >
              <NotebookPen className='text-slate-700' size={28}/>
            </button>
          </div>
        </div>

        {/* Render each Accreditation Period */}
        {Object.entries(grouped).map(([periodKey, levels]) => (
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

            {/* Loop through levels inside each period */}
            {Object.entries(levels).map(([level, programs]) => (
              <div 
                key={level} 
                className='relative p-4 space-y-6 mb-4 border bg-slate-200 shadow-md border-slate-300 rounded-md mx-4 mt-12'
              >
                {/* Level label (ex: Level II, Preliminary, etc.) */}
                <h2 className='absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-[80%] md:w-[70%] lg:w-1/2 p-2 text-2xl bg-gradient-to-l from-green-700 via-yellow-400 to-green-700 shadow-md text-white rounded font-bold'>
                  {level}
                </h2>

                {/* Program cards */}
                <div className='relative flex flex-wrap gap-10 justify-center pb-4 pt-8'>
                  {programs.map((programName, idx) => (
                    <div
                      key={idx}
                      onMouseEnter={handleHoverProgramOptions}
                      onMouseLeave={handleHoverProgramOptions}
                      className='relative flex items-center justify-center h-60 p-4 bg-gradient-to-b from-green-700 to-amber-300 rounded-xl border border-slate-300 shadow hover:shadow-md cursor-pointer transition-all w-full sm:w-65 md:w-70 lg:w-75 xl:w-80'
                    >
                      <p className='bg-gradient-to-b from-yellow-300 to-amber-400 w-full text-2xl text-white text-center shadow font-bold mt-3 p-4'>
                        {programName} {/* <- Now uses data */}
                      </p>

                      {/* Hover actions */}
                      {hoverProgramOptions && (
                        <>
                          <div className="absolute inset-0 rounded-xl bg-black/10 backdrop-blur-xs z-10"></div>
                          <div className='flex items-center justify-center px-6 py-4 gap-x-4 bg-white absolute z-20'>
                            <BookPlus />
                            <BookPlus />
                            <BookPlus />
                            <BookPlus />
                            <BookPlus />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}

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
          handleAddProgramValue,
          handleRemoveProgramValue,
          handleProgramChange,
          handleInfoHover,
        }}
      />
    </AdminLayout>
  );
};

export default ProgramsToAccredit;
