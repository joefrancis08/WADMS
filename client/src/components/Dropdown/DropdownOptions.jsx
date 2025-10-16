import { useState } from 'react'

export const DropdownItems = ({
  items = [],
  selected = [],
  onChange,
  label = 'Item', // e.g. 'Area', 'Parameter'
}) => {
  // Determine if all items are selected
  const allSelected = items?.length > 0 && items?.every((i) => selected?.includes(i));

  const toggleSelectAll = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange([...items]);
    }
  };

  const toggleSelect = (item) => {
    if (selected.includes(item)) {
      onChange(selected.filter((i) => i !== item));
    } else {
      onChange([...selected, item]);
    }
  };

  return (
    <div className='bg-white shadow rounded-md'>
      {/* Select/Deselect All */}
      <label className='flex items-center gap-2 p-2 font-semibold text-slate-900 hover:bg-gray-50 cursor-pointer rounded-t-md'>
        <input
          type='checkbox'
          checked={allSelected}
          onChange={toggleSelectAll}
          className='w-4 h-4 accent-green-600 rounded border-gray-300 cursor-pointer transition duration-150'
        />
        <span className='select-none'>
          {allSelected ? `Deselect All (${items.length})` : `Select All (${items.length})`}
        </span>
      </label>

      <hr className='border-t border-slate-300 my-2' />

      {/* Individual Items */}
      {items.map((item, index) => (
        <label
          key={index}
          className='flex items-center gap-2 p-2 text-gray-800 hover:bg-gray-100 cursor-pointer last:rounded-b-md'
        >
          <input
            type='checkbox'
            checked={selected?.includes(item)}
            onChange={() => toggleSelect(item)}
            className='w-4 h-4 accent-green-600 rounded border-gray-300 cursor-pointer transition duration-150'
          />
          <span className='select-none'>{item}</span>
        </label>
      ))}
    </div>
  );
};


export const AreaDropdownItems = ({ areas, selected, onChange }) => {
  // Check if all areas are selected
  const allSelected = areas.length > 0 && areas.every((a) => selected.includes(a));

  const toggleSelectAll = () => {
    if (allSelected) {
      onChange([]) // deselect all
    } else {
      onChange([...areas]) // select all
    }
  };

  const toggleSelect = (area) => {
    if (selected.includes(area)) {
      onChange(selected.filter((a) => a !== area))
    } else {
      onChange([...selected, area])
    }
  };

  return (
    <div className='bg-white shadow rounded-md'>
      {/* Select/Deselect All */}
      <label className='flex items-center gap-2 p-2 font-semibold text-slate-900 hover:bg-gray-50 cursor-pointer rounded-t-md'>
        <input
          type='checkbox'
          checked={allSelected}
          onChange={toggleSelectAll}
          className='w-4 h-4 accent-green-600 rounded border-gray-300 cursor-pointer transition duration-150'
        />
        <span className='select-none'>
          {allSelected ? 'Deselect All' : `Select All (${areas.length})`}
        </span>
      </label>
      <hr className='border-t border-slate-300 my-2' />

      {/* Individual Areas */}
      {areas.map((a, index) => (
        <label
          key={index}
          className='flex items-center gap-2 p-2 text-gray-800 hover:bg-gray-100 cursor-pointer last:rounded-b-md'
        >
          <input
            type='checkbox'
            checked={selected.includes(a)}
            onChange={() => toggleSelect(a)}
            className='w-4 h-4 accent-green-600 rounded border-gray-300 cursor-pointer transition duration-150'
          />
          <span className='select-none'>{a}</span>
        </label>
      ))}
    </div>
  );
};

export const ParamDropdownItems = ({ parameters, selected, onChange }) => {
  // Check if all parameters are selected
  const allSelected = parameters.length > 0 && parameters.every((a) => selected.includes(a));

  const toggleSelectAll = () => {
    if (allSelected) {
      onChange([]); // deselect all
    } else {
      onChange([...parameters]); // select all
    }
  };

  const toggleSelect = (parameter) => {
    if (selected.includes(parameter)) {
      onChange(selected.filter((a) => a !== parameter))
    } else {
      onChange([...selected, parameter])
    }
  };

  return (
    <div className='bg-white shadow rounded-md'>
      {/* Select/Deselect All */}
      <label className='flex items-center gap-2 p-2 font-semibold text-slate-900 hover:bg-gray-50 cursor-pointer rounded-t-md'>
        <input
          type='checkbox'
          checked={allSelected}
          onChange={toggleSelectAll}
          className='w-4 h-4 accent-green-600 rounded border-gray-300 cursor-pointer transition duration-150'
        />
        <span className='select-none'>
          {allSelected ? 'Deselect All' : `Select All (${parameters.length})`}
        </span>
      </label>
      <hr className='border-t border-slate-300 my-2' />

      {/* Individual Parameters */}
      {parameters.map((p, index) => (
        <label
          key={index}
          className='flex items-center gap-2 p-2 text-gray-800 hover:bg-gray-100 cursor-pointer last:rounded-b-md'
        >
          <input
            type='checkbox'
            checked={selected.includes(p)}
            onChange={() => toggleSelect(p)}
            className='w-4 h-4 accent-green-600 rounded border-gray-300 cursor-pointer transition duration-150'
          />
          <span className='select-none'>{p}</span>
        </label>
      ))}
    </div>
  );
};
