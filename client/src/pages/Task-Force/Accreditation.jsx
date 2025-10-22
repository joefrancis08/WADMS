import React, { useState } from 'react'
import TaskForceLayout from '../../components/Layout/Task-Force/TaskForceLayout'
import { Scroll, FolderOpen, Folder, ChevronDown } from 'lucide-react'
import { toga } from '../../assets/icons'

const items = [
  { id: 'programs', name: 'Programs' },
  { id: 'assignments', name: 'Assignments' },
];

// Dummy accreditation data
const dummyPrograms = [
  {
    accredTitle: 'Institutional Accreditation 2025',
    levels: {
      'Preliminary': [
        { id: 1, program: 'BS Information Technology' },
        { id: 2, program: 'BS Computer Science' },
      ],
      'Level I': [
        { id: 3, program: 'BS Mechanical Engineering' },
      ],
    },
  },
  {
    accredTitle: 'Program Accreditation 2024',
    levels: {
      'Level II': [
        { id: 4, program: 'BS Architecture' },
        { id: 5, program: 'BS Civil Engineering' },
      ],
    },
  },
];

// Dummy assignment data
const dummyAssignments = [
  {
    accredTitle: 'Institutional Accreditation 2025',
    levels: {
      'Level I': [
        {
          program: 'BS Information Technology',
          areas: [
            {
              area: 'Area I – Vision, Mission, Goals',
              parameters: [
                {
                  parameter: 'Parameter A – Implementation',
                  subParameters: [
                    {
                      subParameter: 'Sub-Parameter 1',
                      indicators: ['Indicator 1', 'Indicator 2'],
                    },
                  ],
                },
              ],
            },
            {
              area: 'Area II – Faculty',
              parameters: [
                {
                  parameter: 'Parameter A – Faculty Qualification',
                  subParameters: [
                    {
                      subParameter: 'Sub-Parameter 1',
                      indicators: ['Indicator 1'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    accredTitle: 'Program Accreditation 2024',
    levels: {
      'Preliminary': [
        {
          program: 'BS Mechanical Engineering',
          areas: [
            {
              area: 'Area I – Curriculum and Instruction',
              parameters: [
                {
                  parameter: 'Parameter A – Curriculum Review',
                  subParameters: [
                    {
                      subParameter: 'Sub-Parameter 1',
                      indicators: ['Indicator 1', 'Indicator 2', 'Indicator 3'],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
];

const Accreditation = () => {
  const [activeItemId, setActiveItemId] = useState('programs');

  const handleItemClick = (item) => {
    setActiveItemId(item.id);
  };

  return (
    <TaskForceLayout>
      <div className="p-2">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-100 ml-4">Accreditation</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-x-4 mt-4 ml-4 mb-4">
          {items.map((item) => {
            const isActive = activeItemId === item.id;
            return (
              <p
                onClick={() => handleItemClick(item)}
                key={item.id}
                className={`inline-block py-2 px-5 text-slate-100 text-lg cursor-pointer transition-all hover:bg-slate-800 ${
                  isActive ? 'border-b-2 border-yellow-500' : ''
                }`}
              >
                {item.name}
              </p>
            );
          })}
        </div>

        {/* Main Section */}
        <div className="bg-slate-800 w-full h-auto rounded-lg p-6">
          {/* ------------------ PROGRAMS TAB ------------------ */}
          {activeItemId === 'programs' && (
            <div>
              {dummyPrograms.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Scroll className="text-slate-400 h-40 w-40" />
                  <p className="text-slate-200 text-xl font-medium mt-4">
                    No accreditation data available.
                  </p>
                </div>
              ) : (
                dummyPrograms.map((accred, i) => (
                  <div
                    key={i}
                    className="mb-10 border border-slate-700 rounded-lg bg-slate-900 shadow-lg p-6"
                  >
                    {/* Accreditation Title */}
                    <h2 className="text-3xl text-yellow-400 font-bold text-center mb-6">
                      {accred.accredTitle}
                    </h2>

                    {/* Levels */}
                    {Object.entries(accred.levels).map(([level, programs], index) => (
                      <div
                        key={index}
                        className="bg-slate-800 border border-slate-700 rounded-lg p-4 mt-6"
                      >
                        <h3 className="text-2xl text-center text-yellow-300 font-semibold mb-6">
                          {level.toUpperCase()}
                        </h3>

                        <div className="flex flex-wrap gap-10 justify-center">
                          {programs.map((p) => (
                            <div
                              key={p.id}
                              className="relative bg-gradient-to-b from-green-700 to-amber-300 text-white font-bold p-10 rounded-lg shadow-lg w-80 h-56 flex flex-col justify-center items-center text-center"
                            >
                              <p className="text-2xl tracking-wide">{p.program}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}

          {/* ------------------ ASSIGNMENTS TAB ------------------ */}
          {activeItemId === 'assignments' && (
            <div>
              {dummyAssignments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <Scroll className="text-slate-400 h-40 w-40" />
                  <p className="text-slate-200 text-xl font-medium mt-4">
                    No assignments available.
                  </p>
                </div>
              ) : (
                dummyAssignments.map((accred, i) => (
                  <div
                    key={i}
                    className="mb-10 border border-slate-700 rounded-lg bg-slate-900 shadow-lg p-6"
                  >
                    {/* Accreditation Title */}
                    <h2 className="text-3xl text-yellow-400 font-bold text-center mb-6">
                      {accred.accredTitle}
                    </h2>

                    {/* Levels */}
                    {Object.entries(accred.levels).map(([level, programs], index) => (
                      <div
                        key={index}
                        className="bg-slate-800 border border-slate-700 rounded-lg p-4 mt-6"
                      >
                        <h3 className="text-2xl text-center text-yellow-300 font-semibold mb-6">
                          {level.toUpperCase()}
                        </h3>

                        <div className="flex flex-wrap gap-10 justify-center">
                          {programs.map((p, j) => (
                            <div
                              key={j}
                              className="bg-gradient-to-b from-green-700 to-amber-300 text-white font-bold p-8 rounded-lg shadow-lg w-80 h-auto text-center"
                            >
                              <div className="relative flex flex-col items-center mb-4">
                                <img
                                  src={toga}
                                  alt="Program icon"
                                  className="opacity-10 h-40 w-40 absolute"
                                />
                                <p className="text-2xl z-10 font-bold">{p.program}</p>
                              </div>

                              {/* Areas */}
                              <div className="mt-6 text-left space-y-4">
                                {p.areas.map((area, k) => (
                                  <div
                                    key={k}
                                    className="bg-slate-900 p-4 rounded-lg border border-slate-700"
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <FolderOpen className="text-yellow-400" />
                                      <h4 className="text-lg font-semibold text-slate-100">
                                        {area.area}
                                      </h4>
                                      <ChevronDown className="text-slate-300" size={20} />
                                    </div>

                                    {/* Parameters */}
                                    {area.parameters.map((param, m) => (
                                      <div key={m} className="ml-6 mb-2">
                                        <div className="flex items-center gap-2 mb-2">
                                          <Folder className="text-yellow-400" />
                                          <p className="text-slate-200">{param.parameter}</p>
                                        </div>

                                        {/* Sub-Parameters */}
                                        {param.subParameters.map((sub, n) => (
                                          <div key={n} className="ml-6 mb-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <Folder className="text-yellow-400" />
                                              <p className="text-slate-300">{sub.subParameter}</p>
                                            </div>

                                            {/* Indicators */}
                                            <ul className="list-disc list-inside text-slate-400 ml-6">
                                              {sub.indicators.map((ind, o) => (
                                                <li key={o}>{ind}</li>
                                              ))}
                                            </ul>
                                          </div>
                                        ))}
                                      </div>
                                    ))}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </TaskForceLayout>
  );
};

export default Accreditation;
