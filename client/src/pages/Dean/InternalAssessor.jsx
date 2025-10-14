import React, { useState } from "react";
import { Search, UserRoundPlus, UserRoundX } from "lucide-react";
import InternalAssessorCard from "../../components/Dean/Internal_Assessor/InternalAssessorCard";
import DeanLayout from "../../components/Layout/Dean/DeanLayout";

const InternalAssessor = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Combined list of all assessors
  const dummyAssessors = [
    { id: 1, fullName: "Dr. Anna Cruz", role: "Lead Assessor" },
    { id: 2, fullName: "Mr. John Villanueva", role: "Chair" },
    { id: 3, fullName: "Ms. Carla Ramos", role: "Member" },
    { id: 4, fullName: "Mr. Leo Santos", role: "Member" },
  ];

  const [activeTab, setActiveTab] = useState("all");

  const filteredAssessors = dummyAssessors.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCount = dummyAssessors.length;

  return (
    <DeanLayout>
        <div className="flex-1 h-full bg-slate-800 text-white min-h-screen">
        {/* Header */}
            <div className="sticky top-0 z-50 bg-slate-900 border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
                <h2 className="text-xl font-bold">Internal Assessor</h2>
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
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded-full shadow active:scale-95 transition">
                    <UserRoundPlus className="h-5 w-5" />
                    Add Assessor
                    </button>
                </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {totalCount > 0 ? (
                <section className="border bg-slate-900 border-slate-700 rounded-lg shadow">
                    <header className="px-4 py-3 border-b border-slate-700">
                    <h3 className="text-lg font-semibold">All Assessors</h3>
                    </header>
                    <div className="p-4">
                    <InternalAssessorCard assessors={filteredAssessors} />
                    </div>
                </section>
                ) : (
                <div className="flex flex-col items-center justify-center py-16">
                    <UserRoundX className="text-slate-600 w-28 h-28" />
                    <p className="mt-4 text-lg text-slate-300">
                    No assessor data to display.
                    </p>
                </div>
                )}
            </div>
        </div>
    </DeanLayout>
  );
};

export default InternalAssessor;
