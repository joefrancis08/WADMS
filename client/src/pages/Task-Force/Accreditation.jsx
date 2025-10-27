import React from 'react';
import TaskForceLayout from '../../components/Layout/Task-Force/TaskForceLayout';
import { ChevronDown, Ellipsis, EllipsisVertical, File, FileLineChart, FileText, Folder, FolderOpen, List, LoaderCircle, Pen, Scroll, Search, Trash2, Upload } from 'lucide-react';
import { toga } from '../../assets/icons';
import useAccreditation from '../../hooks/Task Force/useAccreditation';
import Dropdown from '../../components/Dropdown/Dropdown';
import AssignmentTab from '../../components/Task Force/AssignmentTab';
import ProgramsTab from '../../components/Task Force/ProgramsTab';

export default function Accreditation() {
  const { refs, states, datas, helpers, handlers } = useAccreditation();

  const { searchInputRef, scrollContainerRef, levelRef, docOptionRef } = refs;

  const {
    setQuery,
    activeParamId,
    activeSubparamId,
    activeIndicatorId,
    loading,
    error,
    activeDocId
  } = states;

  const {
    items,
    activeItemId,
    query,
    dataPrograms,        
    groupedAssignments,
    selectedFiles,
    uploaderDocs,
    loadingUploaderDocuments,
    errorUploaderDocuments,
  } = datas;

  console.log(groupedAssignments);

  const { formatAccreditationTitleForUI } = helpers;

  const {
    handleProgramCardClick,
    handleItemClick,
    handleLevelScroll,
    handleDropdownClick,
    handleUploadClick,
    handleFileChange,
    handleDocOptionClick,
    handleDelete
  } = handlers;

  return (
    <TaskForceLayout>
      <div className="flex-1">
        {/* Header */}
        <div className="sticky top-0 z-40 mb-8 bg-slate-900/95 backdrop-blur border-b border-slate-700">
          <div className="flex items-center justify-between py-2">
            <h2 className="text-2xl text-slate-100 font-bold">Accreditation</h2>
            <div
                role="tablist"
                aria-label="Accreditation sections"
                className="hidden md:flex items-center gap-x-2 pr-2"
              >
                <div className="flex items-center gap-2 rounded-full bg-slate-800/60 p-1 border border-slate-700">
                  {items.map((item) => {
                    const isActive = activeItemId === item.id;
                    return (
                      <button
                        key={item.id}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => handleItemClick(item)}
                        className={[
                          "px-4 py-1.5 rounded-full text-sm font-medium transition",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 cursor-pointer",
                          isActive
                            ? "bg-yellow-400 text-slate-900 shadow-sm"
                            : "text-slate-200 hover:text-white hover:bg-slate-700/80"
                        ].join(" ")}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>

            <div className="flex items-center gap-x-4">
              {/* Tabs (desktop) */}
              

              {/* Tabs (mobile) */}
              <div
                role="tablist"
                aria-label="Accreditation sections"
                className="md:hidden max-w-[60vw] overflow-x-auto scrollbar-hide -mx-1 px-1"
              >
                <div className="flex items-center gap-2">
                  {items.map((item) => {
                    const isActive = activeItemId === item.id;
                    return (
                      <button
                        key={item.id}
                        role="tab"
                        aria-selected={isActive}
                        onClick={() => handleItemClick(item)}
                        className={[
                          "whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition border",
                          "focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500",
                          isActive
                            ? "bg-yellow-400 text-slate-900 border-yellow-300 shadow"
                            : "bg-slate-800 text-slate-200 border-slate-600 hover:bg-slate-700"
                        ].join(" ")}
                      >
                        {item.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Search */}
              <div className="relative w-80 hidden sm:block">
                <Search className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input
                  ref={searchInputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search title, year, level, program…"
                  aria-label="Search accreditation"
                  className="w-full pl-10 pr-9 py-2 rounded-full bg-slate-800 text-slate-100 border border-slate-600 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                />
                {!!query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-slate-300 hover:text-white hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    aria-label="Clear search"
                    title="Clear"
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
                      <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7a1 1 0 1 0-1.41 1.42L10.59 12l-4.9 4.89a1 1 0 1 0 1.41 1.42L12 13.41l4.89 4.9a1 1 0 0 0 1.41-1.42L13.41 12l4.9-4.89a1 1 0 0 0-.01-1.4Z"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div>
          {/* ------------------ PROGRAMS TAB ------------------ */}
          {activeItemId === 'programs' && (
            <ProgramsTab 
              refs={{ scrollContainerRef, levelRef }}
              states={{ loading, error }}
              datas={{ dataPrograms }}
              helpers={{ formatAccreditationTitleForUI }}
              handlers={{ handleLevelScroll, handleProgramCardClick }}
            />
          )}

          {/* ------------------ ASSIGNMENTS TAB ------------------ */}
          {activeItemId === 'assignments' && (
            <AssignmentTab 
              refs={{docOptionRef}}
              states={{
                activeParamId,
                activeSubparamId,
                activeIndicatorId,
                activeDocId,
                loadingUploaderDocuments,
              }}
              data={{
                groupedAssignments,
                selectedFiles,
                uploaderDocs
              }}
              handlers={{
                handleDropdownClick,
                handleUploadClick,
                handleFileChange,
                handleDocOptionClick,
                handleDelete
              }}
            />
          )}
        </div>
      </div>
    </TaskForceLayout>
  );
}
