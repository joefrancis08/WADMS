import React from 'react'
import ParameterBaseModal from './ParameterBaseModal'

const SubParameterBaseModal = ({
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
    <ParameterBaseModal 
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
  )
}

export default SubParameterBaseModal;
