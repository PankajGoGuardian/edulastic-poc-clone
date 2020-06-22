import { get as _get, pick } from "lodash";
import { createSelector } from "reselect";
import { roleuser } from "@edulastic/constants";
import { getSchoolsSelector as getDistrictSchoolsSelector } from "../../Schools/ducks";

export const stateSelector = state => state.user;

export const getUserIdSelector = createSelector(
  stateSelector,
  state => _get(state, "user._id", "")
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
  state => state?.user?.role
);

export const getUserIPZipCode = createSelector(
  stateSelector,
  state => state.user.ipZipCode
);

export const getUser = createSelector(
  stateSelector,
  state => state.user
);

export const getUserThumbnail = createSelector(
  getUser,
  state => state.thumbnail
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
/**
 * this selector shouldn't be used for students
 * student can be part of multiple district
 * @type {OutputSelector<unknown, number, (res: *) => number>}
 */
export const getUserOrgId = createSelector(
  stateSelector,
  state => state.user.districtIds?.[0]
);
/**
 * this selector shouldn't be used for students
 * student can be part of multiple district
 * @type {OutputSelector<unknown, number, (res: *) => number>}
 */
export const getUserOrgName = createSelector(
  stateSelector,
  state => state.user.orgData?.districts?.[0].districtName
);

export const getUserFeatures = createSelector(
  stateSelector,
  state => _get(state, "user.features")
);

export const getUserOrgData = createSelector(
  stateSelector,
  state => _get(state, "user.orgData", {})
);

export const getCollectionsSelector = createSelector(
  stateSelector,
  state => _get(state, "user.orgData.itemBanks", [])
);

export const getCustomCollectionsSelector = createSelector(
  getCollectionsSelector,
  collections => collections.filter(item => item.isCustom)
);

export const getItemBucketsSelector = createSelector(
  getCustomCollectionsSelector,
  state => {
    const flatttenBuckets = state.flatMap(collection =>
      collection.buckets.map(bucket => ({
        ...bucket,
        _id: collection._id,
        bucketId: bucket._id,
        collectionStatus: collection.status,
        collectionName: collection.name,
        collectionDescription: collection.description
      }))
    );
    return flatttenBuckets;
  }
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

export const showItemStatusSelector = createSelector(
  isPublisherUserSelector,
  getUserRole,
  (isPublisher, role) => isPublisher || role === roleuser.EDULASTIC_CURATOR
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

export const isOrganizationDistrictSelector = createSelector(
  getUser,
  state => {
    if (state.role === roleuser.DISTRICT_ADMIN && state.orgData?.districts?.[0]?.districtPermissions.includes("publisher")) {
      return true;
    }
    return false;
  }
);

export const getManageTabLabelSelector = createSelector(
  getUser,
  isOrganizationDistrictSelector,
  (state, isOrganization) => {
    if (isOrganization) return "Organization";
    if (state.role === roleuser.DISTRICT_ADMIN) return "Manage District";
    return "Manage School";
  }
);

export const getSaSchoolsSelector = createSelector(
  getOrgDataSelector,
  state => _get(state, "schools", [])
);

export const getSaSchoolsSortedSelector = createSelector(
  getSaSchoolsSelector,
  schools => schools.sort((a, b) => a.name.localeCompare(b.name))
);

export const getOrgPoliciesSelector = createSelector(
  getOrgDataSelector,
  state => _get(state, "policies", {})
);

export const getInstitutionPoliciesSelector = createSelector(
  getSaSchoolsSelector,
  getOrgPoliciesSelector,
  (schools, policies) =>
    schools.map(s => {
      let schoolPolicy = policies?.institutions?.find(i => i.institutionId === s._id);
      if (!schoolPolicy) {
        schoolPolicy = policies?.district;
      }
      return {
        ...schoolPolicy,
        institutionId: s._id,
        institutionName: s.name
      };
    })
);

export const getGoogleAllowedInstitionPoliciesSelector = createSelector(
  getInstitutionPoliciesSelector,
  state => state.filter(s => !!s.allowGoogleClassroom)
);

export const getCleverDistrictUserSelector = createSelector(
  getOrgDataSelector,
  orgData => !!orgData.isCleverDistrict
);

export const getCleverLibraryUserSelector = createSelector(
  getUser,
  getOrgDataSelector,
  (user, orgData) => !orgData.isCleverDistrict && user.cleverId
);

export const getCleverSyncEnabledInstitutionPoliciesSelector = createSelector(
  getCleverLibraryUserSelector,
  getInstitutionPoliciesSelector,
  (user, policies) =>
    user ? policies.filter(p => !(p.allowGoogleClassroom || p.allowCanvas || p.allowSchoology || p.allowClassLink)) : []
);

export const getAccountSwitchDetails = createSelector(
  getUser,
  state => pick(state, ["personId", "otherAccounts"])
);
