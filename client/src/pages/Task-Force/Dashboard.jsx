import React from "react";
import { Calendar, FileCheck, Eye, Download, Flag } from "lucide-react";
import TaskForceLayout from "../../components/Layout/Task-Force/TaskForceLayout";

const overview = [
  { title: "Start Date", value: "26 Jul 2018", icon: <Calendar className="w-5 h-5 text-yellow-400" /> },
  { title: "Documents Reviewed", value: "12,345", icon: <FileCheck className="w-5 h-5 text-green-400" /> },
  { title: "Total Views", value: "98,355", icon: <Eye className="w-5 h-5 text-slate-300" /> },
  { title: "Reports Submitted", value: "2,783", icon: <Download className="w-5 h-5 text-yellow-400" /> },
  { title: "Issues Flagged", value: "843", icon: <Flag className="w-5 h-5 text-red-400" /> },
];

const metrics = [
  {
    title: "Compliance Rate",
    value: "95%",
    change: "+30%",
    changeColor: "text-green-400",
    subtitle: "Overall compliance for July",
    desc: "Percentage of documents meeting accreditation standards.",
  },
  {
    title: "Department Submissions",
    value: "120",
    change: "+16%",
    changeColor: "text-yellow-400",
    subtitle: "Submissions for January",
    desc: "Documents submitted by all departments.",
  },
  {
    title: "Pending Reviews",
    value: "35",
    change: "-12%",
    changeColor: "text-red-400",
    subtitle: "As of March",
    desc: "Documents awaiting taskforce review.",
  },
  {
    title: "Completed Evaluations",
    value: "250",
    change: "+19%",
    changeColor: "text-green-400",
    subtitle: "Evaluations finished in May",
    desc: "Accreditation tasks successfully completed.",
  },
];

const Dashboard = () => {
  return (
    <TaskForceLayout>
      <div className="p-2 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Home</h1>
          <p className="text-slate-100">Overview and Analytics</p>
        </div>

        {/* Overview Row */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {overview.map((item, i) => (
            <div
              key={i}
              className="bg-slate-800 shadow rounded-lg p-4 flex flex-col items-center justify-center border border-slate-700"
            >
              <div className="flex items-center space-x-2 text-slate-300">
                {item.icon}
                <span className="text-sm">{item.title}</span>
              </div>
              <p className="text-lg font-semibold text-slate-100">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Metrics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {metrics.map((metric, i) => (
            <div
              key={i}
              className="bg-slate-800 shadow rounded-lg p-5 border border-slate-700 hover:shadow-lg transition"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm text-slate-300">{metric.title}</h2>
                <span className={`text-xs font-semibold ${metric.changeColor}`}>
                  {metric.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-slate-100">{metric.value}</p>
              <p className="text-sm text-slate-400">{metric.subtitle}</p>
              <p className="text-xs text-slate-500">{metric.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </TaskForceLayout>
  );
};

export default Dashboard;
