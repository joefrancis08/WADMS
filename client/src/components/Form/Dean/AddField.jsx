import { useState, useRef, useEffect } from 'react'
import Dropdown from '../../Dropdown/Dropdown';
import { USER_ROLES } from '../../../constants/user';
import { Calendar, CalendarDays, ChevronDown, CircleAlert, X } from 'lucide-react';
import Popover from '../../Popover';
import DatePickerComponent from '../../DatePickerComponent';
import { getUserRolesDropdown } from '../../../utils/dropdownOptions';
import useOutsideClick from '../../../hooks/useOutsideClick';

const AddField = ({
  ref,
  fieldName,
  placeholder,
  type = 'text',
  name,
  formValue,
  dropdownItems = [],
  multiValue = false, // Enable multi-value mode (for textarea)
  multiValues = [], // Array of existing values (for textarea)
  onAddValue, // Callback when a value is added (for textarea)
  onRemoveValue, // Callback when a value is removed (for textarea)
  minDate,
  datePickerDisabled = false,
  onFocus,
  onBlur,
  onChange,
  onClick,
  onChevronClick,
  onDropdownMenuClick,
  toggleDropdown,
  calendarClose,
  invalid = false,
  isReadOnly = false,
  isClickable = false,
  showDropdownOnFocus = false,
  isDropdown = false
}) => {
  const containerRef = useRef();
  const [isFocused, setIsFocused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [alertHover, setAlertHover] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [availablePrograms, setAvailablePrograms] = useState(() => dropdownItems);

  // Reuse the useOutsideClick hook to make dropdown gone when clicking outside
  useOutsideClick(containerRef, () => {
    setShowDropdown(false);
    setIsFocused(false);
  });

  const isFloating = isFocused && name !== 'role' || 
    (type === 'date'
      ? (formValue !== null)
      : multiValue
        ? multiValues.length > 0 || (formValue ?? '').trim() !== ''
        : (formValue ?? '').trim() !== ''
    );

  const handleMouseEnter = () => {
    setAlertHover(true);
  };

  const handleMouseLeave = () => {
    setAlertHover(false);
  };

  const handleFocus = (options = {}) => {
    setIsFocused(true);
    onFocus?.(); // Calls only if onFocus is a function
    options.showDropdown && setShowDropdown(true);
  };

  const handleBlur = () => {
    setIsFocused(false);

    if (formValue.trim() !== "") {
      onAddValue(formValue.trim()); // Add to multiValues
      onChange({ target: { name, value: '' } }); // Clear formValue
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && formValue.trim() !== '') {
      e.preventDefault();
      onAddValue(formValue.trim());
      onChange({ target: { name, value: '' } }); // Clear the value
    }
  };

  const roleDropdownItems = getUserRolesDropdown(formValue).map((roleValue) => (
    <p 
      key={roleValue}
      onClick={() => onDropdownMenuClick(roleValue, {isForAddUser: true })}
      className='p-2 text-gray-800 hover:shadow cursor-pointer hover:bg-gray-200 first:rounded-t-md last:rounded-b-md active:opacity-50'>
      {roleValue}
    </p>
  ));

  const levelDropdownItems = dropdownItems.map(level => (
    <p 
      key={level}
      onClick={() => {
        onDropdownMenuClick(level, null, {isForAddLevel: true });
        setShowDropdown(false);
      }}
      className='p-2 text-gray-800 hover:shadow cursor-pointer hover:bg-gray-200 first:rounded-t-md last:rounded-b-md active:opacity-50'>
      {level}
    </p>
  ));

  const programDropdownItems = availablePrograms.map(program => (
    <label
      key={program}
      className='flex items-center gap-2 p-2 text-slate-800 hover:shadow cursor-pointer hover:bg-gray-200 first:rounded-t-md last:rounded-b-md active:opacity-50'
    >
      <input 
        type='checkbox'
        onChange={() => {
          onDropdownMenuClick(null, program, { isForAddProgram: true });
          setAvailablePrograms(prev => prev.filter(item => item !== program));
        }}
      />
      {program}
    </label>
  ));

  let dropdownContent = null;
  if (isDropdown && toggleDropdown) {
    dropdownContent = roleDropdownItems;

  } else if (type === 'textarea' && multiValue && showDropdown) {
    // Textarea should take priority over level
    dropdownContent = availablePrograms.length > 0 ? programDropdownItems : null;

  } else if (showDropdownOnFocus && showDropdown) {
    dropdownContent = levelDropdownItems;
  }

 
  return (
    <div ref={containerRef} className='relative w-full flex-col pt-4'>
      <div className='pb-4'>
        <div className='relative flex flex-col items-start'>
          <label
            onClick={() => (!datePickerDisabled || multiValues.length > 0) && setIsFocused(true)}
            className={`absolute left-3 px-2 rounded-md transition-all
            ${datePickerDisabled && 'cursor-not-allowed'}
            ${isFloating ? '-top-3 text-sm text-slate-700 bg-white': 'top-3 text-md text-slate-600'}
            ${type === 'date' && 'z-10'}`}>
            {fieldName}
          </label>
          {type === 'date' ? (
            <div className='relative w-full'>
              <DatePickerComponent 
                selected={formValue}
                onChange={(date) => {
                  onChange(date, name);
                  setCalendarOpen(false);
                }}
                placeholder={isFloating ? placeholder : ''}
                className={`w-full p-3 rounded-lg border shadow transition max-sm:text-xs max-md:text-sm
                  ${datePickerDisabled && 'cursor-not-allowed'}
                  ${isClickable && 'cursor-pointer hover:bg-slate-100'}
                  ${!invalid
                    ? 'border-gray-400 text-gray-800 focus:outline-0 focus:ring-2 focus:ring-green-600' 
                    : 'border-red-500 text-red-500 focus:outline-0 focus:ring-1 focus:ring-red-500'  }`}
                open={calendarOpen}
                onClickOutside={() => setCalendarOpen(false)}
                onFocus={handleFocus}
                onBlur={onBlur}
                dateFormat='MMMM d, yyyy'
                minDate={minDate}
                disabled={datePickerDisabled}
                forceClosed={calendarClose}
              />

              {!datePickerDisabled && (
                <CalendarDays 
                  onClick={() => setCalendarOpen(prev => !prev)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 cursor-pointer hover:text-gray-800'
                  size={20}
                />
              )}
            </div>
          ) : type === 'textarea'  && multiValue ? (
              <div
                className={`w-full min-h-[60px] flex flex-wrap items-center gap-2 p-3 rounded-lg border shadow transition max-h-50 overflow-auto
                  ${!invalid 
                    ? 'border-gray-400 text-gray-800 focus-within:ring-2 focus-within:ring-green-600' 
                    : 'border-red-500 text-red-500 focus-within:ring-1 focus-within:ring-red-500'}`}
              >
                {multiValues.map((val, index) => (
                  <div key={index} className='flex items-center justify-center text-slate-800 px-2 py-1 rounded border border-slate-300'>
                    <button 
                      title='Remove'
                      type='button'
                      onClick={() => {
                        onRemoveValue(index);
                        // Restore the remove value but only restore the original part of dropdownItems
                        if (dropdownItems.includes(val)) {
                          setAvailablePrograms(prev => [...prev, val]);
                        }
                      }}
                      className='hover:rounded-full hover:bg-slate-200 p-0.5 font-bold hover:text-red-600 transition mr-1 cursor-pointer'
                    >
                      <X size={16}/>
                    </button>
                    {val}
                  </div>
                ))}
                <textarea
                  ref={ref}
                  placeholder={isFloating ? placeholder : ''}
                  readOnly={isReadOnly}
                  name={name}
                  value={formValue}
                  autoComplete='off'
                  onChange={(e) => {
                    onChange(e);
                    setShowDropdown(false);
                  }}
                  onKeyDown={(e) => handleKeyDown(e)}
                  onFocus={() => handleFocus({showDropdown: true})}
                  onBlur={() => handleBlur({hideDropdown: true})}
                  rows={2}
                  className={`flex resize-none overflow-hidden text-wrap w-full py-2 m-0 focus:outline-none 
                  ${multiValues.length > 0 && 'border px-4 border-slate-300 bg-slate-100 rounded-md'}`}
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = e.target.scrollHeight + "px";
                  }}
                />
              </div>
          ) : (
            <input
              placeholder={isFloating ? placeholder : ''}
              readOnly={isReadOnly}
              type={type}
              name={name}
              value={formValue}
              autoComplete='off'
              onChange={(e) => !isDropdown ? onChange(e) : null}
              onClick={isClickable ? onClick : null}
              onFocus={() => handleFocus({ showDropdown: true })}
              className={`text-wrap w-full p-3 rounded-lg border shadow transition
                ${isClickable && 'cursor-pointer hover:bg-slate-100'}
                ${!invalid 
                  ? 'border-gray-400 text-gray-800 focus:outline-0 focus:ring-2 focus:ring-green-600' 
                  : 'border-red-500 text-red-500 focus:outline-0 focus:ring-1 focus:ring-red-500'  }`}
            />
          )}


          {invalid && (
            <>
              <CircleAlert 
                onMouseEnter={handleMouseEnter} 
                onMouseLeave={handleMouseLeave}
                className='absolute top-3.5 right-3 text-red-500' 
                size={22}
              />
              {alertHover && (
                <Popover 
                  handleMouseEnter={handleMouseEnter}
                  handleMouseLeave={handleMouseLeave}
                  position='top-2 right-10'
                  content={
                    <p className='text-slate-100 bg-slate-800 p-2 rounded-md text-sm'>
                      Email was already taken. Provide a unique one.
                    </p>
                  }
                />
              )}
            </>
          )}
          
          {isDropdown && (
            <ChevronDown 
              onClick={onChevronClick}
              className={`absolute top-3.5 right-3.5 text-gray-600 cursor-pointer rounded-full hover:bg-gray-100 hover:text-gray-800 transition duration-300 ${toggleDropdown && '-rotate-180'}`} 
              size={26}
            />
          )}
          {dropdownContent && (
            <Dropdown width='w-full' border='border border-gray-400 rounded-md'>
              <div className='transition-all duration-300 max-h-35 overflow-auto'>
                {dropdownContent}
              </div>
            </Dropdown>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddField;
