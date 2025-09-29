import { FileUser, UserRoundX } from "lucide-react";

export const USER_ROLES = {
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
      { id: 'unassigned', icon: UserRoundX, label: 'Unassigned' },
      { id: 'view-profile', icon: FileUser, label: 'View Profile'}
    ]
  }
}
