import React, { useState } from 'react'
import Dropdown from '../../Dropdown/Dropdown';
import { USER_ROLES } from '../../../constants/user';
import { ChevronDown, Info } from 'lucide-react';

const AddField = ({
  fieldName,
  type = 'text',
  name,
  formValue,
  onChange,
  onClick,
  onChevronClick,
  onDropdownMenuClick,
  toggleDropdown,
  isReadOnly = false,
  isClickable = false,
  isDropdown = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isFloating = isFocused && name !== 'role' || (formValue ?? '').trim() !== '';

  return (
    <div className='relative w-full flex-col pt-4'>
      <div className='pb-4'>
        <div className='relative flex flex-col items-start'>
          <label className={`absolute left-3 bg-gradient-to-r from-gray-100 to-gray-50 px-2 rounded-md transition-all duration-300 ${isFloating ? '-top-3.5 text-sm text-slate-700': 'top-3 text-md text-slate-600'}`}>
            {fieldName}
          </label>
          <input
            readOnly={isReadOnly}
            type={type}
            name={name}
            value={formValue}
            autoComplete='off'
            onChange={!isDropdown ? onChange : null}
            onClick={isClickable ? onClick : null}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={`w-full p-3 rounded-lg border border-gray-400 transition text-gray-800 focus:outline-0 focus:ring-2 focus:ring-green-600 shadow ${isClickable && 'cursor-pointer hover:bg-slate-100'}`}
          />

          {isDropdown && (
            <ChevronDown 
              onClick={onChevronClick}
              className={`absolute top-3.5 right-3.5 text-gray-600 cursor-pointer rounded-full hover:bg-gray-100 hover:text-gray-800 transition duration-300 ${toggleDropdown && 'rotate-180'}`} 
              size={26}
            />
          )}
          {toggleDropdown && (
            <Dropdown width='w-full' border='border border-gray-400 rounded-md'>
              <div className='transition-all duration-300'>
                {Object.entries(USER_ROLES)
                  .filter(([_, roleValue]) => roleValue !== 'Unverified User' && roleValue !== formValue)  
                  .map(([roleKey, roleValue]) => (
                    <p 
                      key={roleKey}
                      onClick={() => onDropdownMenuClick(roleValue, {isForAddUser: true })}
                      className='p-2 text-gray-800 hover:shadow cursor-pointer hover:bg-gray-200 first:rounded-t-md last:rounded-b-md active:opacity-50'>
                      {roleValue}
                    </p>
                  ))
                }
              </div>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddField;
