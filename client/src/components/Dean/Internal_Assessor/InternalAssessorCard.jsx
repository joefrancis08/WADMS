import React from "react";
import { PlusCircle, EllipsisVertical } from "lucide-react";

const InternalAssessorCard = ({ assessors }) => {
  return (
    <div className="flex flex-wrap justify-center gap-5">
      {assessors.map((user) => (
        <div
          key={user.id}
          className="relative w-full max-w-[18rem] bg-gradient-to-b from-slate-800 to-slate-700
                     border border-slate-600 rounded-xl shadow hover:shadow-lg hover:border-slate-500
                     transition overflow-visible cursor-pointer"
        >
          <button
            className="absolute top-2 right-2 p-2 rounded-full text-slate-200 hover:text-white hover:bg-slate-700 focus:ring-2 focus:ring-slate-600"
            type="button"
          >
            <EllipsisVertical size={18} />
          </button>

          <div className="px-4 pt-6 pb-5 flex flex-col items-center text-center">
            <div className="h-24 w-24 rounded-full bg-slate-600 flex items-center justify-center text-2xl font-bold">
              {user.fullName.charAt(0)}
            </div>

            <div className="mt-4 space-y-2 w-full mb-4">
              <p className="mx-auto max-w-[220px] px-2 py-1 rounded bg-slate-900 text-slate-100 text-sm font-semibold truncate">
                {user.fullName}
              </p>
            </div>
          </div>
        </div>
      ))}

      {/* Add new card */}
      <button
        type="button"
        className="w-full max-w-[18rem] flex items-center justify-center rounded-xl border-2 border-dashed border-slate-600 hover:border-slate-500 bg-slate-800/60 hover:bg-slate-800 text-slate-200 shadow-inner min-h-[220px] transition active:scale-95 cursor-pointer"
      >
        <div className="flex flex-col items-center gap-2">
          <PlusCircle className="h-10 w-10" />
          <p className="text-sm font-medium">Add Assessor</p>
        </div>
      </button>
    </div>
  );
};

export default InternalAssessorCard;
