import { get as _get, pick, groupBy, isEmpty } from 'lodash'
import { createSelector } from 'reselect'
import { roleuser } from '@edulastic/constants'
import { getSchoolsSelector as getDistrictSchoolsSelector } from '../../Schools/ducks'
import { getDefaultInterests } from '../../dataUtils'
import { getCurriculumsListSelector } from './dictionaries'

// Express grader enabling grid edit for selected districts
const gridEditEnabledDistricts = {
  // DSST Public Schools district
  '5e4a3ce103b7ad09241750e4': true,
  '5ed1fff103b7ad09240966fd': true,
  '61824414a8d6b600096ed825': true,
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

export const isSuperAdminSelector = createSelector(
  stateSelector,
  (state) => state?.user?.features?.isSuperAdmin
)

export const getChildrens = createSelector(
  stateSelector,
  (state) => state?.user?.children
)

export const getUserIPZipCode = createSelector(
  stateSelector,
  (state) => state.user?.location?.zip || undefined
)

export const getUser = createSelector(stateSelector, (state) => state.user)

export const getUserThumbnail = createSelector(
  getUser,
  (state) => state.thumbnail
)

export const getIsPublisherDistrictSelector = createSelector(
  stateSelector,
  (state) =>
    state.user?.orgData?.districts?.find((obj) =>
      obj.districtPermissions.includes('publisher')
    ) || false
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
  return currentTerms
})

export const getCurrentActiveTermIds = createSelector(
  getCurrentActiveTerms,
  (state) => state.map((x) => x._id)
)

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

export const getPreviouslyUsedOrDefaultInterestsSelector = createSelector(
  getDefaultInterests,
  getInterestedSubjectsSelector,
  getInterestedGradesSelector,
  getInterestedCurriculumsSelector,
  (s) => getCurriculumsListSelector(s),
  (
    previousInterests,
    interestedSubjects,
    interestedGrades,
    interestedCurriculums,
    curriculums
  ) => {
    const subject = previousInterests.subject || interestedSubjects[0] || ''

    const curriculum =
      curriculums?.find(
        (curr) =>
          curr._id === previousInterests.curriculumId &&
          curr.subject === subject
      ) || interestedCurriculums.find((cur) => cur.subject === subject)

    return {
      subject,
      grades: !isEmpty(previousInterests.grades)
        ? previousInterests.grades
        : interestedGrades || [],
      curriculum: {
        id: parseInt(curriculum?._id, 10) || '',
        curriculum: curriculum?.curriculum || curriculum?.name || '',
      },
    }
  }
)

/**
 * this selector shouldn't be used for students
 * student can be part of multiple district
 * @type {OutputSelector<unknown, string, (Object) => string>}
 */
export const getUserOrgId = createSelector(stateSelector, (state) =>
  _get(state, 'user.currentDistrictId', _get(state, 'user.districtIds[0]'))
)
/**
 * this selector shouldn't be used for students
 * student can be part of multiple district
 */
export const getUserOrg = createSelector(
  stateSelector,
  getUserOrgId,
  (state, orgId) =>
    (state.user.orgData?.districts || []).find((d) => d.districtId === orgId)
)

/**
 * this selector shouldn't be used for students
 * student can be part of multiple district
 * @type {OutputSelector<unknown, string, (Object) => string>}
 */
export const getUserOrgName = createSelector(
  getUserOrg,
  (userOrg) => userOrg?.districtName
)

export const getUserFeatures = createSelector(stateSelector, (state) =>
  _get(state, 'user.features')
)

export const getUserOrgData = createSelector(stateSelector, (state) =>
  _get(state, 'user.orgData', {})
)

/**
 * this selector shouldn't be used for students
 * student can be part of multiple district
 */
export const getOrgSchools = createSelector(
  getUserOrgData,
  (orgData) => orgData.schools || []
)

export const getOrgGroupList = createSelector(
  getUserOrgData,
  (orgData) => orgData.classList || []
)

export const getCurrentSchool = createSelector(
  getUserOrgData,
  (orgData) => orgData.defaultSchool
)

export const getCurrentSchoolState = createSelector(
  getUserOrg,
  getOrgSchools,
  getCurrentSchool,
  (orgData, schools, schoolId) => {
    if (orgData?.districtStatus === 1) {
      return orgData?.districtState
    }
    const currentSchool =
      schools.find((sc) => sc._id === schoolId) || schools?.[0]
    return currentSchool?.location?.state
  }
)

export const isHomeSchoolSelector = createSelector(getUserOrg, (userOrg) => {
  return userOrg?.districtStatus === 2
})

export const currentDistrictInstitutionIds = createSelector(
  getOrgSchools,
  (schools) => schools.map((item) => item._id)
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

export const isSAWithoutSchoolsSelector = createSelector(
  getUserRole,
  currentDistrictInstitutionIds,
  (userRole, institutionIds) =>
    userRole === roleuser.SCHOOL_ADMIN && !institutionIds.length
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
        institution: s,
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
          institutions: acc.institutions.filter(
            (inst) => inst.districtId === district._id
          ),
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
  getUserFeatures,
  getIsCurator,
  (userFeatures, isCurator) => {
    return _get(userFeatures, 'allowMultiLanguageAuthoring', false) || isCurator
  }
)

export const isEtsDistrictSelector = createSelector(
  getUserOrgId,
  (districtId) => districtId === etsDistrict
)

export const allowReferenceMaterialSelector = createSelector(
  getUserFeatures,
  (features) => _get(features, 'allowReferenceMaterial', false)
)

export const isDataWarehouseEnabled = createSelector(
  getUserFeatures,
  (features) => _get(features, 'isDataWarehouseEnabled', false)
)

export const isDataOpsUser = createSelector(getUserFeatures, (features) =>
  _get(features, 'isDataOpsUser', false)
)

export const isDataOpsOnlyUser = createSelector(getUserFeatures, (features) =>
  _get(features, 'isDataOpsOnlyUser', false)
)

export const isPerformanceByRubricsReportEnabled = createSelector(
  getUserFeatures,
  (features) => _get(features, 'performanceByRubricsReports', false)
)
