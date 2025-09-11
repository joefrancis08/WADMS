import React from 'react';
import ModalLayout from '../../Layout/ModalLayout';
import { X } from 'lucide-react';
import ProgramToBeAccreditedBaseModal from './ProgramToBeAccreditedBaseModal';

const AreaBaseModal = ({ 
    onClose, 
    onCancel, 
    onSave, 
    headerContent, 
    bodyContent, 
    primaryButton, 
    disabled, 
    secondaryButton, 
    mode = 'add' 
  }) => {
  return (
    <ProgramToBeAccreditedBaseModal 
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

export default AreaBaseModal;
