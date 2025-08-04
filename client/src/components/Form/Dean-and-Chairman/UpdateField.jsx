import { ChevronDown } from "lucide-react";
import { USER_ROLES } from "../../../constants/user";
import Dropdown from "../../Dropdown/Dropdown";

const UpdateField = ({
  fieldName,
  type,
  name,
  formValue,
  onChange,
  onClick,
  onChevronClick,
  onDropdownMenuClick,
  toggleDropdown,
  isReadOnly = false,
  isClickable = false,
  hasDropdown = false,
  
}) => {
  return (
    <div className='relative w-full flex-col pt-4'>
      <div className='pb-6'>
        <div className='relative flex flex-col items-start'>
          <p className='absolute bottom-10 text-gray-700 text-sm left-2 bg-gradient-to-r from-gray-100 to-gray-50 px-2 rounded-md'>{fieldName}</p>
          <input
            type={type}
            name={name}
            readOnly={isReadOnly}
            autoComplete='off'
            onClick={isClickable ? onClick : null}
            onChange={!hasDropdown ? onChange : null}
            className={`w-full p-3 rounded-lg border border-gray-400 transition text-gray-800 focus:outline-0 focus:ring-2 focus:ring-green-600 shadow ${isClickable && 'cursor-pointer hover:bg-slate-100'}`}
            value={formValue}
          />
          {hasDropdown && (
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
                      onClick={() => onDropdownMenuClick(roleValue)}
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

export default UpdateField;
