import { get as _get } from "lodash";
import { createSelector } from "reselect";
import { getSchoolsSelector as getDistrictSchoolsSelector } from "../../Schools/ducks";

export const stateSelector = state => state.user;

export const getUserIdSelector = createSelector(
  stateSelector,
  state => state._id
);

export const getUserSelector = createSelector(
  stateSelector,
  state => state
);

export const getUserNameSelector = createSelector(
  stateSelector,
  state => (state.user && state.user.firstName) || "Anonymous"
);

export const getOrgDataSelector = createSelector(
  stateSelector,
  state => state.user.orgData
);

export const getCurrentGroup = createSelector(
  stateSelector,
  state => state.user && state.user.orgData && state.user.orgData.defaultClass
);

export const getUserRole = createSelector(
  stateSelector,
  state => state.user.role
);

export const getUserIPZipCode = createSelector(
  stateSelector,
  state => state.user.ipZipCode
);

export const getUser = createSelector(
  stateSelector,
  state => state.user
);

export const getCurrentTerm = createSelector(
  stateSelector,
  state => _get(state, "user.orgData.defaultTermId")
);

export const getInterestedCurriculumsSelector = createSelector(
  getOrgDataSelector,
  state => state.interestedCurriculums
);

export const getUserOrgId = createSelector(
  stateSelector,
  state => _get(state, "user.orgData.districtId")
);

export const getUserOrgData = createSelector(
  stateSelector,
  state => _get(state, "user.orgData")
);

export const getUserId = createSelector(
  getUser,
  state => _get(state, "_id")
);

export const getUserSchoolsListSelector = createSelector(
  getOrgDataSelector,
  state => state.schools
);

export const getSchoolsByUserRoleSelector = createSelector(
  getUserRole,
  getUserSchoolsListSelector,
  getDistrictSchoolsSelector,
  (role, userSchools, districtSchools) => (role === "teacher" ? userSchools : districtSchools)
);
