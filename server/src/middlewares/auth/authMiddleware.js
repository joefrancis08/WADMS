import verifyJWT from "./verifyJWT.js";
import verifyRole from "./verifyRole.js";

export const authorize = (roles = []) => [verifyJWT(), verifyRole(roles)];
