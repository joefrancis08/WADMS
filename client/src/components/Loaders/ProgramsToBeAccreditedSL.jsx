import { EllipsisVertical, Plus } from "lucide-react";

const ProgramsToBeAccreditedSL = () => {
  const skeletonPeriods = Array.from({ length: 1 }); // pretend 2 periods
  const skeletonLevels = Array.from({ length: 2 });  // pretend 2 levels per period
  const skeletonPrograms = Array.from({ length: 3 }); // pretend 3 programs per level

  return (
    <div className="animate-pulse">
      {skeletonPeriods.map((_, periodIdx) => (
        <div
          key={periodIdx}
          className="relative bg-slate-200 rounded-md p-4 mx-4 mb-15 mt-6"
        >
          {/* Period label */}
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 flex items-center justify-center w-1/2 lg:w-1/3 p-2 bg-slate-400 shadow-md text-white rounded font-bold">
            <div className="h-4 w-32 bg-slate-300 rounded" />
          </div>
          <button
            disabled
            className="absolute top-2 p-2 right-2 text-slate-400 rounded-bl-xl rounded-tr-lg"
          >
            <EllipsisVertical size={24} />
          </button>

          {/* Levels */}
          {skeletonLevels.map((_, levelIdx) => (
            <div
              key={levelIdx}
              className="relative p-4 space-y-6 mb-4 border bg-slate-100 shadow-md border-slate-300 rounded-md mx-4 mt-12"
            >
              {/* Level label */}
              <h2 className="absolute -top-6 left-1/2 -translate-x-1/2 flex items-center justify-center w-[60%] md:w-[70%] lg:w-[80%] p-2 text-lg md:text-2xl bg-slate-400 shadow-md text-white rounded font-bold">
                <div className="h-4 w-40 bg-slate-300 rounded" />
              </h2>

              {/* Program cards */}
              <div className="relative flex flex-wrap gap-10 justify-center pb-4 pt-8 px-4">
                {skeletonPrograms.map((_, progIdx) => (
                  <div
                    key={progIdx}
                    className="relative flex items-center justify-center h-60 p-4 bg-slate-300 rounded-xl border border-slate-200 shadow w-full sm:w-65 md:w-70 lg:w-75 xl:w-80"
                  >
                    <div className="h-6 w-3/4 bg-slate-200 rounded" />
                  </div>
                ))}

                {/* Add Program placeholder */}
                <div className="relative flex flex-col items-center justify-center gap-y-2 h-60 p-4 bg-slate-200 border border-gray-300 rounded-lg shadow-md w-full sm:w-65 md:w-70 lg:w-75 xl:w-80">
                  <Plus className="text-slate-400 h-16 w-16" />
                  <div className="h-4 w-24 bg-slate-300 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default ProgramsToBeAccreditedSL;
