import React, { useState } from 'react'
import TaskForceLayout from '../../components/Layout/Task-Force/TaskForceLayout'

const items = [
  { id: 'programs', name: 'Programs'},
  { id: 'assigned-parameters', name: 'Assigned Parameters'},
];

const Accreditation = () => {

  const [activeItemId, setActiveItemId] = useState('programs');

  const handleItemClick = (item) => {
    setActiveItemId(prev => prev === activeItemId ? item.id : null );
  };

  return (
    <TaskForceLayout>
      <div className="p-2">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-100 ml-4">Accreditation</h1>
        </div>
        <div className='flex gap-x-4 mt-6 mb-4 ml-4'>
          {items.map((item) => (
            <p
              onClick={() => handleItemClick(item)}
              key={item.id}
              className={`text-slate-100 text-lg  pb-1 cursor-pointer scale-95 ${activeItemId === item.id && 'border-b-4 border-yellow-400 transition'}`}
            >
              {item.name}
            </p>
          ))}
          
        </div>
        <div className='bg-slate-800 w-[100%] h-100 rounded-lg'>

        </div>
      </div>
    </TaskForceLayout>
  )
}

export default Accreditation
