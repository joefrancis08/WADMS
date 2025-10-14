import React, { useState } from "react";
import { Search, FolderPlus, Archive } from "lucide-react";
import DeanLayout from "../../components/Layout/Dean/DeanLayout";

const ArchivePage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Dummy archive data (you can later fetch from backend)
  const archives = [
     { id: 1, name: "AACCUP Accreditation 2021" },
    { id: 2, name: "AACCUP Accreditation 2022" },
    { id: 3, name: "AACCUP Accreditation 2023" },
    { id: 4, name: "AACCUP Accreditation 2024" },
    { id: 5, name: "AACCUP Accreditation 2025" },
  ];

  const filteredArchives = archives.filter((archive) =>
    archive.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DeanLayout>
      <div className="flex-1 h-full bg-slate-800 text-white min-h-screen">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
            <h2 className="text-xl font-bold">Archive</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search archive..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 rounded-full bg-slate-800 border border-slate-600 placeholder-slate-400 focus:ring-2 focus:ring-slate-200 focus:outline-none"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-full shadow active:scale-95 transition">
                <FolderPlus className="h-5 w-5" />
                Add Folder
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 py-6">
          {filteredArchives.length > 0 ? (
            <section className="border bg-slate-900 border-slate-700 rounded-lg shadow">
              <header className="px-4 py-3 border-b border-slate-700">
                <h3 className="text-lg font-semibold">Archived Files</h3>
              </header>
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredArchives.map((folder) => (
                  <div
                    key={folder.id}
                    className="group relative bg-gradient-to-b from-slate-800 to-slate-700 border border-slate-600 rounded-xl shadow hover:shadow-lg hover:border-slate-500 transition cursor-pointer p-6 flex flex-col items-center justify-center"
                  >
                    <Archive className="h-12 w-12 text-slate-300 group-hover:text-white mb-4" />
                    <p className="font-medium text-slate-100 group-hover:text-white text-center">
                      {folder.name}
                    </p>
                  </div>
                ))}

                {/* Add new archive card */}
                <button
                  type="button"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600 hover:border-slate-500 bg-slate-800/60 hover:bg-slate-800 rounded-xl shadow-inner min-h-[180px] transition active:scale-95"
                >
                  <FolderPlus className="h-10 w-10 text-slate-300 mb-2" />
                  <p className="text-sm text-slate-200 font-medium">
                    Add Archive Folder
                  </p>
                </button>
              </div>
            </section>
          ) : (
            <div className="flex flex-col items-center justify-center py-16">
              <Archive className="text-slate-600 w-28 h-28" />
              <p className="mt-4 text-lg text-slate-300">
                No archive folders to display.
              </p>
            </div>
          )}
        </div>
      </div>
    </DeanLayout>
  );
};

export default ArchivePage;
