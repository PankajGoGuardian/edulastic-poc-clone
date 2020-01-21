import { get as _get } from "lodash";
import { createSelector } from "reselect";
import { getSchoolsSelector as getDistrictSchoolsSelector } from "../../Schools/ducks";

export const stateSelector = state => state.user;

export const getUserIdSelector = createSelector(
  stateSelector,
  state => state.user._id
);

export const getUserSelector = createSelector(
  stateSelector,
  state => state
);

export const getDefaultGradesSelector = createSelector(
  stateSelector,
  state => state.user.orgData.selectedGrades
);

export const getDefaultSubjectSelector = createSelector(
  stateSelector,
  state => state.user.orgData.selectedSubject || ""
);

export const getUserNameSelector = createSelector(
  stateSelector,
  state =>
    state.user
      ? `${state.user.firstName ? state.user.firstName : ""} ${state.user.lastName ? state.user.lastName : ""}`
      : "Anonymous"
);

export const getOrgDataSelector = createSelector(
  stateSelector,
  state => state.user.orgData
);

export const getCurrentGroup = createSelector(
  stateSelector,
  state => state.user && state.user.orgData && state.user.orgData.defaultClass
);

export const getGroupList = createSelector(
  stateSelector,
  state => state.user && state.user.orgData && state.user.orgData.classList
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
  state => _get(state, "interestedCurriculums", [])
);

export const getShowAllCurriculumsSelector = createSelector(
  getOrgDataSelector,
  state => _get(state, "showAllStandards", true)
);

export const getInterestedGradesSelector = createSelector(
  getOrgDataSelector,
  state => _get(state, "defaultGrades", [])
);

export const getInterestedSubjectsSelector = createSelector(
  getOrgDataSelector,
  state => _get(state, "defaultSubjects", [])
);

export const getUserOrgId = createSelector(
  stateSelector,
  state => _get(state, "user.orgData.districtId")
);

export const getUserFeatures = createSelector(
  stateSelector,
  state => _get(state, "user.features")
);

export const getUserOrgData = createSelector(
  stateSelector,
  state => _get(state, "user.orgData")
);

export const getCollectionsSelector = createSelector(
  stateSelector,
  state => _get(state, "user.orgData.itemBanks", [])
);

export const getUserId = createSelector(
  getUser,
  state => _get(state, "_id")
);

export const getIsPublisherAuthor = createSelector(
  getUserFeatures,
  features => _get(features, "isPublisherAuthor", false)
);

export const getIsCurator = createSelector(
  getUserFeatures,
  features => _get(features, "isCurator", false)
);

export const isPublisherUserSelector = createSelector(
  getIsPublisherAuthor,
  getIsCurator,
  (isPublisherAuthor, isCurator) => isPublisherAuthor || isCurator
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
