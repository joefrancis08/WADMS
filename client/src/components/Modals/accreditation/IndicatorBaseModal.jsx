import React from 'react';
import SubParameterBaseModal from './SubParameterBaseModal';

const IndicatorBaseModal = ({
  onClose,
  onCancel,
  onSave,
  primaryButton,
  disabled,
  secondaryButton,
  mode,
  headerContent,
  bodyContent
}) => {
  return (
    <SubParameterBaseModal 
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

export default IndicatorBaseModal;
