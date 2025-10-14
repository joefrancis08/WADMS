import { Archive, CircleUserRound, FileUser, FolderPen, Folders, Trash2, UserRoundX } from "lucide-react";

export const USER_ROLES = {
  UU: 'Unverified User',
  DEAN: 'Dean',
  TASK_FORCE_CHAIR: 'Chair',
  TASK_FORCE_MEMBER: 'Member',
  IA: 'Internal Assessor',
  ACCREDITOR: 'Accreditor'
};

export const USER_STATUS = {
  PENDING: 'Pending',
  VERIFIED: 'Verified'
};

export const MENU_OPTIONS = {
  DEAN: {
    ASSIGNED_TASK_FORCE: [
      { id: 'unassign', icon: UserRoundX, label: 'Unassign' },
      { id: 'view-profile', icon: FileUser, label: 'View Profile'}
    ],

    AREA_OPTIONS: [
      { id: 'view-parameters', icon: Folders, label: 'View Parameters' },
      { id: 'assign-task-force', icon: CircleUserRound, label: 'Assign Task Force'},
      { id: 'rename', icon: FolderPen, label: 'Rename'},
      { id: 'move-to-archive',icon: Archive, label: 'Move to Archive'},
      { id: 'delete', icon: Trash2, label: 'Delete'},
    ],

    PARAMETER_OPTIONS: [
      { id: 'view-sub-parameters', icon: Folders, label: 'View Sub-Parameters' },
      { id: 'assign-task-force', icon: CircleUserRound, label: 'Assign Task Force'},
      { id: 'rename', icon: FolderPen, label: 'Rename'},
      { id: 'move-to-archive',icon: Archive, label: 'Move to Archive'},
      { id: 'delete', icon: Trash2, label: 'Delete'},
    ],

    SUB_PARAMETER_OPTIONS: [
      { id: 'assign-task-force', icon: FileUser, label: 'Assign Task Force'},
      { id: 'rename', icon: FolderPen, label: 'Rename'},
      { id: 'move-to-archive',icon: Archive, label: 'Move to Archive'},
      { id: 'delete', icon: Trash2, label: 'Delete'},
    ]
  }
}
