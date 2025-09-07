import React from 'react';
import AreaBaseModal from './AreaBaseModal';

const ParameterBaseModal = ({
  onClose, 
  onCancel, 
  onSave, 
  primaryButton, 
  disabled, 
  secondaryButton, 
  mode, 
  headerContent, 
  bodyContent}) => {
  return (
    <AreaBaseModal 
      onClose={onClose}
      onCancel={onCancel}
      onSave={onSave}
      primaryButton={primaryButton}
      disabled={disabled}
      secondaryButton={secondaryButton}
      mode={mode}
      headerContent={headerContent}
      bodyContent={bodyContent}
    />
  );
};

export default ParameterBaseModal;
