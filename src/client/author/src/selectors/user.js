import { get as _get, pick, groupBy } from 'lodash'
import { createSelector } from 'reselect'
import { roleuser } from '@edulastic/constants'
import { getSchoolsSelector as getDistrictSchoolsSelector } from '../../Schools/ducks'

// Express grader enabling grid edit for selected districts
const gridEditEnabledDistricts = {
  // DSST Public Schools district
  '5e4a3ce103b7ad09241750e4': true,
  '5ed1fff103b7ad09240966fd': true,
}

export const etsDistrict = '5e42a351a1ee9000081f7cda'

export const stateSelector = (state) => state.user

export const getUserIdSelector = createSelector(stateSelector, (state) =>
  _get(state, 'user._id', '')
)

export const getUserSelector = createSelector(stateSelector, (state) => state)

export const getDefaultGradesSelector = createSelector(
  stateSelector,
  (state) => state.user.orgData.selectedGrades
)

export const getDefaultSubjectSelector = createSelector(
  stateSelector,
  (state) => state.user.orgData.selectedSubject || ''
)

export const getUserNameSelector = createSelector(stateSelector, (state) =>
  state.user
    ? `${state.user.firstName ? state.user.firstName : ''} ${
        state.user.lastName ? state.user.lastName : ''
      }`
    : 'Anonymous'
)

export const getUserFullNameSelector = createSelector(
  stateSelector,
  (state) => {
    const { firstName = '', middleName = '', lastName = '' } = state.user
    return [firstName, middleName, lastName].filter((x) => !!x).join(' ')
  }
)

export const getOrgDataSelector = createSelector(
  stateSelector,
  (state) => state?.user?.orgData || {}
)

export const getCurrentGroup = createSelector(
  stateSelector,
  (state) => state.user && state.user.orgData && state.user.orgData.defaultClass
)

export const getGroupList = createSelector(
  stateSelector,
  (state) => state.user && state.user.orgData && state.user.orgData.classList
)

export const getUserRole = createSelector(
  stateSelector,
  (state) => state?.user?.role
)

export const getChildrens = createSelector(
  stateSelector,
  (state) => state?.user?.children
)

export const getUserIPZipCode = createSelector(
  stateSelector,
  (state) => state.user.ipZipCode
)

export const getUser = createSelector(stateSelector, (state) => state.user)

export const getUserThumbnail = createSelector(
  getUser,
  (state) => state.thumbnail
)

export const getCurrentTerm = createSelector(stateSelector, (state) =>
  _get(state, 'user.orgData.defaultTermId')
)

export const getCurrentActiveTerms = createSelector(stateSelector, (state) => {
  const terms = _get(state, 'user.orgData.terms', [])
  const currentTime = new Date().getTime()
  const currentTerms = terms.filter(
    (o) => o.startDate <= currentTime && o.endDate >= currentTime
  )
  return currentTerms.map((x) => x._id)
})

export const getInterestedCurriculumsSelector = createSelector(
  getOrgDataSelector,
  (state) => _get(state, 'interestedCurriculums', [])
)

export const getShowAllCurriculumsSelector = createSelector(
  getOrgDataSelector,
  (state) => _get(state, 'showAllStandards', true)
)

export const getInterestedGradesSelector = createSelector(
  getOrgDataSelector,
  (state) => _get(state, 'defaultGrades', [])
)

export const getInterestedSubjectsSelector = createSelector(
  getOrgDataSelector,
  (state) => _get(state, 'defaultSubjects', [])
)
/**
 * this selector shouldn't be used for students
 * student can be part of multiple district
 * @type {OutputSelector<unknown, number, (res: *) => number>}
 */
export const getUserOrgId = createSelector(stateSelector, (state) =>
  _get(state, 'user.lastUsedDistrictId', _get(state, 'user.districtIds[0]'))
)
/**
 * this selector shouldn't be used for students
 * student can be part of multiple district
 * @type {OutputSelector<unknown, number, (res: *) => number>}
 */
export const getUserOrgName = createSelector(
  stateSelector,
  (state) => state.user.orgData?.districts?.[0].districtName
)

export const getUserFeatures = createSelector(stateSelector, (state) =>
  _get(state, 'user.features')
)

export const getUserOrgData = createSelector(stateSelector, (state) =>
  _get(state, 'user.orgData', {})
)

export const getOrgItemBanksSelector = createSelector(stateSelector, (state) =>
  _get(state, 'user.orgData.itemBanks', [])
)

export const isFreeAdminSelector = createSelector(
  getUserRole,
  getUserFeatures,
  (userRole, userFeatures) =>
    roleuser.DA_SA_ROLE_ARRAY.includes(userRole) && !userFeatures.premium
)

export const getUserSignupStatusSelector = createSelector(
  stateSelector,
  (state) => _get(state, 'signupStatus', '')
)

export const getIsGridEditEnabledSelector = createSelector(
  stateSelector,
  (state) => {
    const userDistricts = _get(state, 'user.districtIds', [])
    return userDistricts.some((dId) => gridEditEnabledDistricts[dId])
  }
)

export const getCollectionsSelector = createSelector(
  getOrgItemBanksSelector,
  (state) => state.filter((item) => item.status === 1)
)

export const shouldWatchCollectionUpdates = createSelector(
  getUserRole,
  (userRole) =>
    userRole === roleuser.TEACHER ||
    userRole === roleuser.DISTRICT_ADMIN ||
    userRole === roleuser.SCHOOL_ADMIN
)

export const getCustomCollectionsSelector = createSelector(
  getCollectionsSelector,
  (collections) =>
    collections.filter((item) => item.isCustom || item.accessLevel === 'write')
)

export const getWritableCollectionsSelector = createSelector(
  getCustomCollectionsSelector,
  getUserOrgId,
  (collections, districtId) =>
    collections.filter(
      (item) =>
        (item.districtId === districtId && item.accessLevel !== 'read') ||
        item.accessLevel === 'write'
    )
)

export const convertCollectionsToBucketList = (collections) => {
  const flatttenBuckets = collections.flatMap((collection) =>
    collection.buckets.map((bucket) => ({
      ...bucket,
      _id: collection._id,
      bucketId: bucket._id,
      collectionStatus: collection.status,
      collectionName: collection.name,
      collectionDescription: collection.description,
      accessLevel: collection.accessLevel || '',
      districtId: collection.districtId,
      type: collection.type,
    }))
  )
  return flatttenBuckets || []
}

export const getItemBucketsSelector = createSelector(
  getCustomCollectionsSelector,
  (state) => {
    return convertCollectionsToBucketList(state)
  }
)

export const getItemBucketsForAllCollectionsSelector = createSelector(
  getCollectionsSelector,
  (state) => {
    return convertCollectionsToBucketList(state)
  }
)

export const getUserId = createSelector(getUser, (state) => _get(state, '_id'))

export const getIsPublisherAuthor = createSelector(
  getUserFeatures,
  (features) => _get(features, 'isPublisherAuthor', false)
)

export const getIsCurator = createSelector(getUserFeatures, (features) =>
  _get(features, 'isCurator', false)
)

export const isPublisherUserSelector = createSelector(
  getIsPublisherAuthor,
  getIsCurator,
  (isPublisherAuthor, isCurator) => isPublisherAuthor || isCurator
)

export const isCuratorRoleSelector = createSelector(
  getUserRole,
  (role) => role === roleuser.EDULASTIC_CURATOR
)

export const getCollectionsToAddContent = createSelector(
  getItemBucketsSelector,
  getUserRole,
  isPublisherUserSelector,
  getUserOrgId,
  (itemBanks, userRole, isAuthorPublisher, userDistrictId) => {
    if (isAuthorPublisher || userRole !== roleuser.DISTRICT_ADMIN) {
      return itemBanks.filter((c) => c.accessLevel === 'write')
    }
    return itemBanks.filter(
      (c) =>
        (c.districtId === userDistrictId && c.accessLevel !== 'read') ||
        c.accessLevel === 'write'
    )
  }
)

export const showItemStatusSelector = createSelector(
  isPublisherUserSelector,
  getUserRole,
  (isPublisher, role) => isPublisher || role === roleuser.EDULASTIC_CURATOR
)

export const getUserSchoolsListSelector = createSelector(
  getOrgDataSelector,
  (state) => state.schools
)

export const getSchoolsByUserRoleSelector = createSelector(
  getUserRole,
  getUserSchoolsListSelector,
  getDistrictSchoolsSelector,
  (role, userSchools, districtSchools) =>
    role === 'teacher' ? userSchools : districtSchools
)

export const isOrganizationDistrictUserSelector = createSelector(
  getOrgDataSelector,
  (state) => state?.districts?.[0]?.districtPermissions.includes('publisher')
)

export const isOrganizationDistrictSelector = createSelector(
  getUser,
  (state) => {
    if (
      state.role === roleuser.DISTRICT_ADMIN &&
      state.orgData?.districts?.[0]?.districtPermissions.includes('publisher')
    ) {
      return true
    }
    return false
  }
)

export const getManageTabLabelSelector = createSelector(
  getUser,
  isOrganizationDistrictSelector,
  (state, isOrganization) => {
    if (isOrganization) return 'Organization'
    if (state.role === roleuser.DISTRICT_ADMIN) return 'Manage District'
    return 'Manage School'
  }
)

export const getSaSchoolsSelector = createSelector(
  getOrgDataSelector,
  (state) => _get(state, 'schools', [])
)

export const getSaSchoolsSortedSelector = createSelector(
  getSaSchoolsSelector,
  (schools) => schools.sort((a, b) => a.name.localeCompare(b.name))
)

export const getOrgPoliciesSelector = createSelector(
  getOrgDataSelector,
  (state) => _get(state, 'policies', {})
)

export const getInstitutionPoliciesSelector = createSelector(
  getSaSchoolsSelector,
  getOrgPoliciesSelector,
  (schools, policies) =>
    schools.map((s) => {
      let schoolPolicy = policies?.institutions?.find(
        (i) => i.institutionId === s._id
      )
      if (!schoolPolicy) {
        schoolPolicy = policies?.district
      }
      return {
        ...schoolPolicy,
        institutionId: s._id,
        institutionName: s.name,
      }
    })
)

export const getGoogleAllowedInstitionPoliciesSelector = createSelector(
  getInstitutionPoliciesSelector,
  (state) => state.filter((s) => !!s.allowGoogleClassroom)
)

export const getCanvasAllowedInstitutionPoliciesSelector = createSelector(
  getInstitutionPoliciesSelector,
  (state) => state.filter((s) => !!s.allowCanvas)
)

export const getCleverLibraryUserSelector = createSelector(
  getUser,
  getOrgDataSelector,
  (user, orgData) => !orgData.isCleverDistrict && user.cleverId
)

export const getCleverSyncEnabledInstitutionPoliciesSelector = createSelector(
  getCleverLibraryUserSelector,
  getInstitutionPoliciesSelector,
  (user, policies) =>
    user
      ? policies.filter(
          (p) =>
            !(
              p.allowGoogleClassroom ||
              p.allowCanvas ||
              p.allowSchoology ||
              p.allowClassLink
            )
        )
      : []
)

export const getAccountSwitchDetails = createSelector(getUser, (state) => {
  const details = pick(state, ['personId', 'otherAccounts'])
  const userId = state._id
  details.otherAccounts = details.otherAccounts || []
  details.switchAccounts = details.otherAccounts.flatMap((acc) =>
    acc.districts.length && acc._id === userId
      ? acc.districts.map((district) => ({
          ...acc,
          district,
        }))
      : {
          ...acc,
          district: {},
        }
  )
  return details
})

export const getIsPowerPremiumAccount = createSelector(
  getUser,
  (state) => state.isPowerTeacher && state.features.premium
)

export const isPremiumUserSelector = createSelector(getUser, (userData) =>
  _get(userData, ['features', 'premium'], false)
)

export const getInterestedCurriculumsByOrgType = createSelector(
  getInterestedCurriculumsSelector,
  getUserRole,
  (interestedCurriculums, role) => {
    const byOrgType = groupBy(interestedCurriculums, 'orgType')
    const { ORG_TYPE } = roleuser
    if (role === roleuser.TEACHER) {
      return byOrgType[ORG_TYPE.TEACHER] || []
    }
    if (role === roleuser.SCHOOL_ADMIN) {
      return byOrgType[ORG_TYPE.SCHOOL_ADMIN] || []
    }
    if (role === roleuser.DISTRICT_ADMIN) {
      return byOrgType[ORG_TYPE.DISTRICT_ADMIN] || []
    }
    return interestedCurriculums
  }
)

export const isDistrictUserSelector = createSelector(
  getOrgDataSelector,
  (state) =>
    state?.districts?.[0]?.districtPermissions &&
    state?.districts?.[0]?.districtPermissions.length === 0
)

export const isCoTeacherSelector = createSelector(
  isPublisherUserSelector,
  getUserRole,
  (isPublisher, role) =>
    isPublisher ||
    role === roleuser.DISTRICT_ADMIN ||
    role === roleuser.SCHOOL_ADMIN ||
    role === roleuser.TEACHER
)

export const getUserPreferredLanguage = createSelector(
  getUserSelector,
  (state) => state?.user?.preferredLanguage
)

export const currentUserIdSelector = createSelector(
  getUserSelector,
  (state) => state?.user?._id
)

export const allowedToSelectMultiLanguageInTest = createSelector(
  currentUserIdSelector,
  (state) => {
    const allowedUserIds = [
      '5f5f729516eaad0008c45a44', // vinayt@v2.com uat user
      // '5d26f2f892df401ddf8c2fd7', // poc user
      '6034a9c3e6cce4000810e6d1', // cespark1@at.com - automation QA env
      '602383287e63eb0007a54233', // vvk@content.com - Conetnt Author
      '6023834b7e63eb0007a54234', // vvk@approver.com - Content Editor
      '5ee90bb54e6a8b000713dae9', // QA testing author account
      '5e3138446247305142d94332', // QA testing publisher account
      '5ec422aabdde150007764df1', // "Edulastic Premium Content"
    ]
    return allowedUserIds.includes(state)
  }
)

export const isEtsDistrictSelector = createSelector(
  getUserOrgId,
  (districtId) => districtId === etsDistrict
)
