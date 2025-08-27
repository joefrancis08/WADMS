import { useState, useRef, useEffect } from 'react'
import Dropdown from '../../Dropdown/Dropdown';
import { USER_ROLES } from '../../../constants/user';
import { ChevronDown, CircleAlert, X } from 'lucide-react';
import Popover from '../../Popover';
import DatePickerComponent from '../../DatePickerComponent';
import { getUserRolesDropdown } from '../../../utils/dropdownOptions';

const AddField = ({
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
  onChange,
  onClick,
  onChevronClick,
  onDropdownMenuClick,
  toggleDropdown,
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

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



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
    options.showDropdown && setShowDropdown(true);
  };

  const handleBlur = (options = {}) => {
    setIsFocused(false);
    if (options.showDropdown) {
      setTimeout(() => setShowDropdown(false), 300); // Small delay so onClick fires
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
        onDropdownMenuClick(level, {isForAddLevel: true });
        setShowDropdown(false);
      }}
      className='p-2 text-gray-800 hover:shadow cursor-pointer hover:bg-gray-200 first:rounded-t-md last:rounded-b-md active:opacity-50'>
      {level}
    </p>
  ));

  let dropdownContent = null;
  if (isDropdown && toggleDropdown) {
    dropdownContent = roleDropdownItems;

  } else if (showDropdownOnFocus && showDropdown) {
    dropdownContent = levelDropdownItems;
  }
 
  return (
    <div ref={containerRef} className='relative w-full flex-col pt-4'>
      <div className='pb-4'>
        <div className='relative flex flex-col items-start'>
          <label
            onClick={() => (!datePickerDisabled || multiValues.length > 0) && setIsFocused(true)}
            className={`absolute left-3 bg-gradient-to-r from-gray-100 to-gray-50 px-2 rounded-md transition-all duration-300
            ${datePickerDisabled && 'cursor-not-allowed'}
            ${isFloating ? '-top-3 text-sm text-slate-700': 'top-3 text-md text-slate-600'}
            ${type === 'date' && 'z-10'}`}>
            {fieldName}
          </label>
          {type === 'date' ? (
            <DatePickerComponent 
              selected={formValue}
              onChange={(date) => onChange(date, name)}
              placeholder={isFloating ? placeholder : ''}
              className={`w-full p-3 rounded-lg border shadow transition max-sm:text-xs max-md:text-sm
                ${datePickerDisabled && 'cursor-not-allowed'}
                ${isClickable && 'cursor-pointer hover:bg-slate-100'}
                ${!invalid
                  ? 'border-gray-400 text-gray-800 focus:outline-0 focus:ring-2 focus:ring-green-600' 
                  : 'border-red-500 text-red-500 focus:outline-0 focus:ring-1 focus:ring-red-500'  }`}
              onFocus={handleFocus}
              onBlur={handleBlur}
              dateFormat='MMMM d, yyyy'
              minDate={minDate}
              disabled={datePickerDisabled}
            />
          ) : type === 'textarea'  && multiValue ? (
              <div
                className={`w-full min-h-[60px] flex flex-wrap items-center gap-2 p-3 rounded-lg border shadow transition
                  ${!invalid 
                    ? 'border-gray-400 text-gray-800 focus-within:ring-2 focus-within:ring-green-600' 
                    : 'border-red-500 text-red-500 focus-within:ring-1 focus-within:ring-red-500'}`}
              >
                {multiValues.map((val, index) => (
                  <div key={index} className='flex items-center justify-center text-slate-800 px-2 py-1 rounded border border-slate-300'>
                    <button 
                      title='Remove'
                      type="button"
                      onClick={() => onRemoveValue(index)}
                      className='hover:rounded-full hover:bg-slate-200 p-0.5 font-bold hover:text-red-600 transition mr-1 cursor-pointer'
                    >
                      <X size={16}/>
                    </button>
                    {val}
                  </div>
                ))}
                <textarea
                  placeholder={isFloating ? placeholder : ''}
                  readOnly={isReadOnly}
                  name={name}
                  value={formValue}
                  autoComplete='off'
                  onChange={(e) => onChange(e)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && formValue.trim() !== "") {
                      e.preventDefault();
                      onAddValue(formValue.trim());
                      onChange({ target: { name, value: '' } }); // Clear the value
                    }
                  }}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  rows={2}
                  className={`flex resize-y overflow-hidden text-wrap w-full py-2 m-0 focus:outline-none 
                  ${multiValues.length > 0 && 'border-t border-slate-300 bg-slate-100'}`}
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
              <div className='transition-all duration-300'>
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
