import React from "react";
import {
  PlusCircle,
  EllipsisVertical,
  LinkIcon,
  FileUser,
  UserRoundPen,
  Trash2,
  SearchX
} from "lucide-react";
import Dropdown from "../../Dropdown/Dropdown";
import ProfilePicture from "../../ProfilePicture";

/**
 * InternalAssessorCard
 * Adds an empty-state UI when a search returns no results (assessors.length === 0).
 *
 * Optional props for empty-state actions:
 *  - searchTerm?: string
 *  - onResetSearch?: () => void
 *  - onCreateAssessor?: () => void
 */
const InternalAssessorCard = ({
  assessors = [],
  activeAssessorId,
  menuOptionsRef,
  handleEllipsisClick = () => {},
  handleMenuItems = () => {},
  handleAddNew = () => {},
  searchTerm,
  onResetSearch = () => {},
}) => {
  const menuOptions = [
    { icon: <LinkIcon size={20} />, label: "View Access Link" },
    { icon: <FileUser size={20} />, label: "View Details" },
    { icon: <UserRoundPen size={20} />, label: "Update" },
    { icon: <Trash2 size={20} color="red" />, label: "Delete" }
  ];

  const getUserId = (u) => u.id;

  const renderMenuOptions = (user) => {
    const id = getUserId(user);
    if (activeAssessorId !== id) return null;

    return (
      <div ref={menuOptionsRef} className="absolute top-10 left-14 z-50">
        <Dropdown width="w-56" border="border border-slate-300 rounded-md bg-white shadow-lg">
          {menuOptions.map((menu, idx) => (
            <React.Fragment key={idx}>
              {menu.label === "Delete" && <hr className="m-1 text-slate-200" />}
              <div
                onClick={(e) => handleMenuItems(e, menu, user)}
                className={`flex text-slate-800 items-center gap-2 text-sm p-2 rounded-md cursor-pointer transition ${
                  menu.label === "Delete" ? "hover:bg-red-200" : "hover:bg-slate-200"
                }`}
                role="menuitem"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleMenuItems?.(e, menu, user);
                  }
                }}
              >
                <i className="shrink-0">{menu.icon}</i>
                <p className={menu.label === "Delete" ? "text-red-500" : ""}>{menu.label}</p>
              </div>
            </React.Fragment>
          ))}
        </Dropdown>
      </div>
    );
  };

  // Empty-state when no assessors (e.g., a search returned no results)
  if (!assessors || assessors.length === 0) {
    return (
      <div className="flex items-center justify-center">
        <div
          className="w-full max-w-xl rounded-2xl border border-dashed border-slate-400 bg-gradient-to-b from-slate-800 to-slate-700 p-8 text-center shadow-md"
          role="status"
          aria-live="polite"
        >
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-900/60">
            <SearchX size={28} className="text-slate-200" />
          </div>
          <h3 className="text-lg font-semibold text-slate-100">
            {searchTerm ? (
              <>
                No results for <span className="font-bold text-white">“{searchTerm}”</span>
              </>
            ) : (
              "No assessors found"
            )}
          </h3>
          <p className="mt-2 text-sm text-slate-300">
            {searchTerm
              ? "Try adjusting your filters, checking the spelling, or clear your search."
              : "Get started by creating a new assessor."}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {searchTerm && (
              <button
                type="button"
                onClick={onResetSearch}
                className="nline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-100 shadow-slate-700 hover:shadow-md border border-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer "
              >
                Clear search
              </button>
            )}
            <button
              type="button"
              onClick={handleAddNew}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-slate-100 shadow-slate-700 hover:shadow-md border border-slate-500 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-400 cursor-pointer "
            >
              <PlusCircle size={18} /> Add assessor
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-5">
      {assessors.map((user) => (
        <div
          key={user.id}
          className="relative w-full max-w-[18rem] cursor-pointer overflow-visible rounded-xl border border-slate-600 bg-gradient-to-b from-slate-800 to-slate-700 shadow transition hover:border-slate-500 hover:shadow-lg"
        >
          {activeAssessorId === user.id && <div className="fixed inset-0 z-40" />}
          <button
            onClick={(e) => handleEllipsisClick?.(e, user)}
            className={`absolute right-2 top-2 cursor-pointer rounded-full p-2 text-slate-200 hover:bg-slate-700 hover:text-white ${activeAssessorId === user.id && 'bg-slate-700'}`}
            type="button"
            aria-label={`Open menu for ${user.full_name}`}
          >
            <EllipsisVertical size={18} />
          </button>

          {renderMenuOptions(user)}

          <div className="flex flex-col items-center px-4 pb-5 pt-6 text-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-slate-600 text-2xl font-bold text-slate-100">
              {user.profile_pic_path ? (
                <ProfilePicture 
                  profilePic={user.profile_pic_path}
                  width="w-22"
                  height="h-22"
                />
              ) : (
                user.full_name?.charAt(0) ?? "?"
              )}
              
            </div>

            <div className="mb-4 mt-4 w-full space-y-2">
              <p className="mx-auto max-w-[220px] truncate rounded bg-slate-900 px-2 py-1 text-sm font-semibold text-slate-100">
                {user.full_name}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InternalAssessorCard;