import React, { useState } from 'react'
import TaskForceLayout from '../../components/Layout/Task-Force/TaskForceLayout'

const items = [
  { id: 'programs', name: 'Programs'},
  { id: 'assignments', name: 'Assignments'},
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
        <div className='flex gap-x-2 mt-6 ml-4'>
          {items.map((item) => {
            const isActive = activeItemId === item.id;
            return (
              <p
                onClick={() => handleItemClick(item)}
                key={item.id}
                className={`inline-block text-slate-100 text-lg px-5 cursor-pointer transition-opacity duration-300 hover:bg-slate-800 ${
                  isActive ? 'font-semibold bg-slate-800 pt-2 rounded-t-xl' : 'border-transparent hover:rounded-xl mb-2 py-1'
                }`}
              >
                {item.name}
              </p>
            );
          })}
        </div>
        <div className='bg-slate-800 w-[100%] h-100 rounded-lg'>

        </div>
      </div>
    </TaskForceLayout>
  )
}

export default Accreditation
