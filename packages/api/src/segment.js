import { get, without } from 'lodash'
import { createHmac } from 'crypto-browserify'
import AppConfig from '../../../src/app-config'

const allowedRoles = ['teacher', 'school-admin', 'district-admin']

const trackingParameters = {
  CATEGORY_WEB_APPLICATION: 'Web Application',
}

const getUserDetails = (user) => {
  const {
    clever = false,
    clever_district = false,
    email,
    gm = false,
    isAdmin = false,
    orgData,
    orgData: { districts = [] },
    referrer = '',
    role,
    username,
    utm_source = '',
  } = user

  const extraProps = {
    isSingaporeMath:
      utm_source.toLowerCase().includes('singapore') ||
      referrer.includes('singapore') ||
      orgData?.itemBanks?.some(
        (itemBank) =>
          itemBank.owner?.toLowerCase().includes('singapore') &&
          itemBank.status === 1
      ),
    isCpm:
      utm_source.toLowerCase().includes('cpm') ||
      referrer.toLowerCase().includes('cpm'),
  }
  // setting first district details for student other user role will have only one district
  const {
    districtId = '',
    districtName: district = '',
    districtState: state = '',
    districtCountry: country = '',
    v1Id,
  } = districts?.[0] || {}
  const schoolId =
    get(orgData, 'schools[0].v1Id', '') || get(orgData, 'schools[0]._id', '')
  return {
    domain: window.document.domain,
    email,
    username,
    role,
    clever,
    clever_district,
    gm,
    // this is not Groups._id
    // https://segment.com/docs/connections/spec/group/
    // its districtId
    groupId: v1Id || districtId,
    schoolId,
    school: get(orgData, 'schools[0].name', ''),
    districtId: v1Id || districtId,
    district,
    state,
    country,
    isAdmin,
    ...extraProps,
  }
}

const analyticsIdentify = ({ user }) => {
  if (!AppConfig.isSegmentEnabled) {
    return
  }
  if (user && user.orgData) {
    const {
      role = '',
      _id,
      v1Id,
      features = { premium: false },
      firstName,
      lastName,
      orgData: {
        defaultGrades: [grade = '', ,] = [],
        defaultSubjects: [subject = '', ,] = [],
      },
    } = user
    const userId = v1Id || _id
    if (allowedRoles.includes(role) && window.analytics) {
      // Passing user_hash to have secure communication
      window.analytics.identify(
        userId,
        {
          ...getUserDetails(user),
          isV2User: true,
          grade,
          subject,
          name: without([firstName, lastName], undefined, null, '').join(' '),
          premium_user: features.premium,
        },
        {
          Intercom: {
            hideDefaultLauncher: false,
            // Keep your secret key safe! Never commit it directly to your repository,
            // client-side code, or anywhere a third party can find it.
            // send it from backend ???
            user_hash: createHmac('sha256', AppConfig.segmentHashSecret)
              .update(userId.toString())
              .digest('hex'),
          },
        }
      )
    }
  }
}

const unloadIntercom = ({ user }) => {
  if (!AppConfig.isSegmentEnabled) {
    return
  }
  if (user) {
    const { role = '', _id, v1Id } = user
    const userId = v1Id || _id
    if (allowedRoles.includes(role) && window.analytics) {
      window.analytics.identify(
        userId,
        {},
        {
          Intercom: {
            hideDefaultLauncher: true,
            // Keep your secret key safe! Never commit it directly to your repository,
            // client-side code, or anywhere a third party can find it.
            // send it from backend ???
            user_hash: createHmac('sha256', AppConfig.segmentHashSecret)
              .update(userId.toString())
              .digest('hex'),
          },
        }
      )
    }
  }
}

const trackTeacherClickOnUpgradeSubscription = ({ user }) => {
  if (!AppConfig.isSegmentEnabled) {
    return
  }
  if (user) {
    const { role = '', _id, v1Id } = user
    const userId = v1Id || _id
    const event = 'upgrade initiated by teacher'
    const category = 'Web Application'
    const userData = getUserDetails(user)
    if (role === 'teacher' && window.analytics) {
      window.analytics.track(event, {
        userId: `${userId}`,
        ...userData,
        category,
      })
    }
  }
}

const trackUserClick = ({ user, data }) => {
  if (!AppConfig.isSegmentEnabled) {
    return
  }

  const { event, category = trackingParameters.CATEGORY_WEB_APPLICATION } = data
  if (user) {
    const { role = '', _id, v1Id } = user
    const userId = v1Id || _id
    const userData = getUserDetails(user)
    if (role === 'teacher' && window.analytics) {
      window.analytics.track(event, {
        userId: `${userId}`,
        ...userData,
        category,
      })
    }
  }
}

const trackTeacherSignUp = ({ user }) => {
  if (!AppConfig.isSegmentEnabled) {
    return
  }
  if (user) {
    const { role = '', _id, v1Id, isAdmin } = user
    const event = isAdmin ? 'Administrator Signed Up' : 'Teacher Signed Up'
    const userId = v1Id || _id
    const category = 'Web Application'
    if (role === 'teacher' && window.analytics) {
      analyticsIdentify({ user })
      const userData = getUserDetails(user)
      window.analytics.track(event, {
        userId: `${userId}`,
        ...userData,
        category,
      })
    }
  }
}

const trackProductPurchase = ({ user, data }) => {
  if (!AppConfig.isSegmentEnabled) {
    return
  }
  const {
    event,
    category = trackingParameters.CATEGORY_WEB_APPLICATION,
    ...rest
  } = data
  if (user) {
    const { role = '', _id, v1Id } = user
    const userId = v1Id || _id
    const userData = getUserDetails(user)
    if (role === 'teacher' && window.analytics) {
      window.analytics.track(event, {
        userId: `${userId}`,
        ...userData,
        ...rest,
        category,
      })
    }
  }
}

export default {
  unloadIntercom,
  analyticsIdentify,
  trackTeacherClickOnUpgradeSubscription,
  trackTeacherSignUp,
  trackUserClick,
  trackingParameters,
  trackProductPurchase,
}
