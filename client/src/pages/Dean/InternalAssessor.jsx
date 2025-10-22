import React, { useState } from "react";
import { Search, UserRoundPlus, UserRoundX } from "lucide-react";
import InternalAssessorCard from "../../components/Dean/Internal_Assessor/InternalAssessorCard";
import DeanLayout from "../../components/Layout/Dean/DeanLayout";
import useInternalAssessor from "../../hooks/Dean/useInternalAssessor";
import InternalAssessorModal from "../../components/Dean/Internal_Assessor/InternalAssessorModal";

const InternalAssessor = () => {
  const { refs, data, states, handlers } = useInternalAssessor();
  const { menuOptionsRef } = refs;
  const { setProfilePic } = states;
  const { modalType, modalData, activeAssessorId, formValue, assessors } = data;
  const {
    handleAddNew,
    handleEllipsisClick,
    handleCloseModal,
    handleProfilePic,
    handleFieldChange,
    handleAddAssessor,
    handleMenuItems,
    handleConfirmDelete
  } = handlers;

  const [searchQuery, setSearchQuery] = useState("");

  const filteredAssessors = assessors.filter((user) =>
    user.full_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCount = assessors.length;

  return (
    <DeanLayout>
      <div className="min-h-screen h-full flex-1 bg-slate-800 text-white">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-2">
              Internal Assessor
              <span className="text-xs font-medium px-2 py-0.5 rounded-full border border-slate-600 bg-slate-800 text-slate-300">
                {totalCount} total
              </span>
            </h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search assessor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-full bg-slate-800 border border-slate-600 placeholder-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none"
                />
              </div>
              <button
                onClick={handleAddNew}
                className="z-50 flex items-center gap-1 rounded-full border border-slate-600 bg-green-600 px-3 py-2 text-white shadow transition hover:bg-green-600/90 active:scale-95 cursor-pointer"
              >
                <UserRoundPlus className="h-5 w-5" />
                Add New
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {totalCount > 0 ? (
            <section className="rounded-lg border border-slate-700 bg-slate-900 shadow">
              <header className="border-b border-slate-700 px-4 py-3">
                <h3 className="text-lg font-semibold">All Assessors</h3>
              </header>
              <div className="p-4">
                <InternalAssessorCard
                  assessors={filteredAssessors}
                  menuOptionsRef={menuOptionsRef}
                  activeAssessorId={activeAssessorId}
                  handleEllipsisClick={handleEllipsisClick}
                  handleMenuItems={handleMenuItems}
                  searchTerm={searchQuery}
                  onResetSearch={() => setSearchQuery("")}
                  handleAddNew={handleAddNew}
                />
              </div>
            </section>
          ) : (
            // SIMPLE EMPTY STATE
            <div className="flex items-center justify-center lg:py-30">
              <div className="w-full max-w-xl rounded-2xl border border-dashed border-slate-600 bg-slate-900 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
                  <UserRoundX className="h-8 w-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-white">No internal assessors</h3>
                <p className="mt-1 text-sm text-slate-300">Create your first assessor to get started.</p>
                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    onClick={handleAddNew}
                    type="button"
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700 cursor-pointer border border-slate-600"
                  >
                    <UserRoundPlus className="h-5 w-5" /> Add new
                  </button>
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-500"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <InternalAssessorModal
        data={{ modalType, modalData, formValue }}
        states={{ setProfilePic }}
        handlers={{
          handleCloseModal,
          handleProfilePic,
          handleFieldChange,
          handleAddAssessor,
          handleConfirmDelete
        }}
      />
    </DeanLayout>
  );
};

export default InternalAssessor;