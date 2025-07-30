import { forwardRef } from 'react';
import ValidationMessage from '../Auth/ValidationMessage';
import { Eye, EyeOff } from 'lucide-react';

const FieldComponent = ({

  icon,
  type = 'text',
  name,
  placeholder,
  value,
  onChange,
  error,
  isPassword,
  isPasswordVisible = false,
  togglePasswordVisibility

}, ref) => {
  
  return (
    <div className="w-full">
      <div className="input-container-layout">
        <span className="input-icon-layout">
          {icon}
        </span>
        <input
          type={isPassword ? (isPasswordVisible ? 'text' : 'password') : type}
          ref={ref}
          placeholder={placeholder}
          autoComplete='off'
          name={name}
          value={value}
          onChange={onChange}
          className={`${error 
            ? 'input-invalid' 
            : 'input-valid'} 
            input-field-style`
          }
        />

        {isPassword && (
          <span
            title={isPasswordVisible ? 'Hide Password' : 'Show Password'}
            onClick={togglePasswordVisibility} 
            className="password-icon-visibility">
            {isPasswordVisible ? <EyeOff color='gray' /> : <Eye color='gray'/>}
          </span>
        )}
      </div>
      <div className="min-h-[1.25rem]">
        {error && <ValidationMessage message={error} />}
      </div>
    </div>
  );
};

const Field = forwardRef(FieldComponent);

export default Field;
