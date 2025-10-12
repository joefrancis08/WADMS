const MODAL_TYPES = Object.freeze({
  UU_PROFILE: 'unverified-user-profile',
  UU_VERIFICATION_CONFIRMATION: 'confirm-unverified-user-verification',
  UU_DELETION_CONFIRMATION: 'unverified-user-confirm-delete',
  UU_UPDATE: 'update-unverified-user',
  TF_DELETION_CONFIRMATION: 'task-force-confirm-deletion',
  ADD_TF: 'add-task-force',
  ADD_TF_CARD: 'add-task-force-from-card',
  UPDATE_TF: 'update-user',

  ADD_PROGRAM_TO_BE_ACCREDITED_CARD: 'add-program-to-be-accredited-card',
  ADD_PROGRAM_TO_BE_ACCREDITED: 'add-program-to-be-accredited',
  UPDATE_PROGRAM_TO_BE_ACCREDITED: 'update-program-to-accredit',
  DELETE_PROGRAM_TO_BE_ACCREDITED: 'delete-program-to-be-accredited',

  ADD_LEVEL_PROGRAM: 'add-level-and-programs',

  DELETE_ACCRED_INFO: 'delete-accred-info',

  ADD_AREA: 'add-area',
  REMOVE_AREA: 'remove-area',

  ADD_PARAMETER: 'add-parameter',
  DELETE_PARAM: 'delete-parameter',

  ADD_SUBPARAMETERS: 'add-subparameters',
  DELETE_SUBPARAM: 'delete-subparameter',

  ADD_INDICATORS: 'add-indicators',

  ASSIGN_TASK_FORCE: 'assign-task-force',

  VIEW_ASSIGNED_TASK_FORCE: 'view-assigned-task-force',
  UNASSIGNED_TASK_FORCE: 'unassigned-task-force',

  DELETE_DOC: 'delete-document',

  LOGOUT: 'logout-user'
});

export default MODAL_TYPES;