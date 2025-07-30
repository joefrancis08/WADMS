import { Route } from "react-router-dom";
import { USER_ROLES, USER_STATUS } from "../constants/user";
import Pending from "../pages/Pending/Pending";
import PATH from "../constants/path";
import PendingSkeleton from "../pages/Pending/PendingSkeletonLoader";
import ProtectedRoute from "./ProtectedRoute";

const { PENDING_VERIFICATION } = PATH.UNVERIFIED_USER;
const { REGISTER } = PATH.PUBLIC
const { UNVERIFIED_USER } = USER_ROLES;
const { PENDING } = USER_STATUS;

const unverifiedUserRoute = [
  <Route 
    path={PENDING_VERIFICATION}
    element={
      <ProtectedRoute 
        allowedStatuses={[PENDING]} 
        allowedRoles={[UNVERIFIED_USER]} 
        fallbackRoute={REGISTER}
        loader={<PendingSkeleton />} 
      >
        <Pending />
      </ProtectedRoute>
    }
  />
];

export default unverifiedUserRoute;