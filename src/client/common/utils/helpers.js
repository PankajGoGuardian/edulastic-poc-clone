import React from 'react'
import styled from 'styled-components'
import { isUndefined, last, get, isEmpty, keyBy } from 'lodash'
import { Tooltip as AntDTooltip, Modal } from 'antd'
import { notification } from '@edulastic/common'
import { EDULASTIC_CURATOR } from '@edulastic/constants/const/roleType'
import { themeColor } from '@edulastic/colors'
import { signUpState, test as testConst } from '@edulastic/constants'
import * as Sentry from '@sentry/browser'
import { API } from '@edulastic/api'
import { Partners } from './static/partnerData'
import { smallestZoomLevel } from './static/zoom'
import { breakpoints } from '../../student/zoomTheme'

// eslint-disable-next-line no-control-regex
const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

const api = new API()

export const getWordsInURLPathName = (pathname) => {
  // When u try to change this function change the duplicate function in "packages/api/src/utils/API.js" also
  let path = pathname
  path += ''
  path = path.split('/')
  path = path.filter((item) => !!(item && item.trim()))
  return path
}

export const isLoggedInForPrivateRoute = (user) => {
  if (user && user.isAuthenticated) {
    if (
      user &&
      user.user &&
      !user.user.role &&
      (user.user.googleId || user.user.msoId || user.user.cleverId)
    ) {
      return false
    }
    if (user && user.user && user.user.role !== 'teacher') {
      return true
    }
    if (
      user.user &&
      user.user.role === 'teacher' &&
      (user.signupStatus === signUpState.DONE ||
        user.signupStatus === signUpState.ACCESS_WITHOUT_SCHOOL ||
        isUndefined(user.signupStatus))
    ) {
      return true
    }
  }
  return false
}

export const isLoggedInForLoggedOutRoute = (user) => {
  if (user && user.isAuthenticated) {
    if (
      user &&
      user.user &&
      !user.user.role &&
      (user.user.googleId || user.user.msoId || user.user.cleverId)
    ) {
      return true
    }
    if (user && user.user && user.user.role !== 'teacher') {
      return true
    }
    if (
      user.user &&
      user.user.role === 'teacher' &&
      (user.signupStatus === signUpState.DONE ||
        user.signupStatus === signUpState.ACCESS_WITHOUT_SCHOOL ||
        isUndefined(user.signupStatus))
    ) {
      return true
    }
  }
  return false
}

export const validatePartnerUrl = (partner) => {
  // eslint-disable-next-line no-restricted-globals
  const pathname = location.pathname
  if (
    partner.keyName !== 'login' &&
    pathname.toLocaleLowerCase().includes('partnerlogin') &&
    pathname.toLocaleLowerCase().includes(partner.keyName.toLocaleLowerCase())
  ) {
    return true
  }
  if (
    partner.keyName === 'login' &&
    !pathname.toLocaleLowerCase().includes('partnerlogin')
  ) {
    return true
  }
  return false
}

export const getPartnerLoginUrl = (partner) =>
  partner.keyName === 'login' ? `/login` : `/partnerLogin/${partner.keyName}/`

export const getPartnerTeacherSignupUrl = (partner) =>
  partner.keyName === 'login'
    ? `/signup`
    : `/partnerLogin/${partner.keyName}/signup`

export const getPartnerStudentSignupUrl = (partner) =>
  partner.keyName === 'login'
    ? `/studentsignup`
    : `/partnerLogin/${partner.keyName}/studentsignup`

export const getPartnerDASignupUrl = (partner) =>
  partner.keyName === 'login'
    ? `/adminsignup`
    : `/partnerLogin/${partner.keyName}/adminsignup`

export const getPartnerGetStartedUrl = (partner) =>
  partner.keyName === 'login'
    ? `/getStarted`
    : `/partnerLogin/${partner.keyName}/getStarted/`

export const getPartnerKeyFromUrl = (pathname) => {
  const pathArr = pathname.split('/')
  const partnersArr = Object.keys(Partners)
  const tempPartner = pathArr[partnersArr.length - 1]
  const foundPartner = partnersArr.find((item) => item === tempPartner)
  if (foundPartner) {
    return foundPartner
  }
  return 'login'
}

export const getDistrictLoginUrl = (orgShortName, orgType) =>
  `/${orgType}/${orgShortName}`

export const getDistrictTeacherSignupUrl = (orgShortName, orgType) =>
  `/${orgType}/${orgShortName}/signup`

export const getDistrictStudentSignupUrl = (orgShortName, orgType) =>
  `/${orgType}/${orgShortName}/studentsignup`

export const getDistrictGetStartedUrl = (orgShortName, orgType) =>
  `/${orgType}/${orgShortName}/getstarted`

export const isDistrictPolicyAllowed = (
  isSignupUsingDaURL,
  districtPolicy,
  name
) => {
  if (
    isSignupUsingDaURL &&
    districtPolicy &&
    (districtPolicy[name] || isUndefined(districtPolicy[name]))
  ) {
    return true
  }
  return false
}

export const isDistrictPolicyAvailable = (isSignupUsingDaURL, districtPolicy) =>
  isSignupUsingDaURL && typeof districtPolicy === 'object'

export const isEmailValid = (rule, value, callback, checks, message) => {
  const userNameRegExp = new RegExp(`^[A-Za-z0-9._ \\-\\+\\'\\"]+$`)

  let flag = false

  if (checks === 'email') {
    flag = emailRegex.test(value.trim())
  } else if (checks === 'username') {
    flag = userNameRegExp.test(value.trim())
  } else if (checks === 'both' || !checks) {
    flag = emailRegex.test(value.trim()) || userNameRegExp.test(value.trim())
  }

  if (flag) {
    callback()
    return true
  }
  callback(message)
}

export const getFullNameFromAsString = (obj) =>
  `${obj.firstName} ${obj.middleName ? `${obj.middleName} ` : ''}${
    obj.lastName ? obj.lastName : ''
  }`

export const getFullNameFromString = (name) => {
  let nameList = name.split(' ')
  nameList = nameList.filter((item) => !!(item && item.trim()))
  if (!nameList.length) {
    return false
  }

  let firstName
  let lastName
  let middleName
  if (nameList.length === 1) {
    firstName = nameList[0]
  } else if (nameList.length === 2) {
    firstName = nameList[0]
    lastName = nameList[1]
  } else if (nameList.length > 2) {
    firstName = nameList[0]
    middleName = nameList.slice(1, nameList.length - 1).join(' ')
    lastName = last(nameList)
  }

  return {
    firstName,
    middleName,
    lastName,
  }
}

export const getInitialsFromName = (obj) =>
  (obj.firstName?.[0] || '') + (obj?.lastName?.[0] || '')

export const getDistrictSignOutUrl = (generalSettings) => {
  if (generalSettings.orgType === 'institution') {
    return `/school/${generalSettings.shortName}`
  }
  return `/district/${generalSettings.shortName}`
}

export const setSignOutUrl = (url) => {
  sessionStorage.setItem('signOutUrl', url)
}

export const getSignOutUrl = () =>
  sessionStorage.getItem('signOutUrl') || '/login'

export const getStartedUrl = () => '/getStarted'

export const removeSignOutUrl = () => sessionStorage.removeItem('signOutUrl')

export const validateQuestionsForDocBased = (questions, forDraft = false) => {
  if (!questions.filter((q) => q.type !== 'sectionLabel').length) {
    notification({ type: 'warn', messageKey: 'aleastOneQuestion' })
    return false
  }

  const sectionTitle = questions
    .filter((question) => question.type === 'sectionLabel')
    .every((question) => !!question.title.trim())

  if (!sectionTitle) {
    notification({ messageKey: 'sectionNameCanNotEmpty' })
    return false
  }

  const correctAnswerPicked = questions
    .filter(
      (question) =>
        question.type !== 'sectionLabel' && question.type !== 'essayPlainText'
    )
    .every((question) => {
      const validationValue = get(question, 'validation.validResponse.value')
      if (question.type === 'math') {
        return validationValue.every((value) => !isEmpty(value.value))
      }
      return !isEmpty(validationValue)
    })

  if (!forDraft && !correctAnswerPicked) {
    notification({ type: 'warn', messageKey: 'correctAnswer' })
    return false
  }
  return true
}

export const addThemeBackgroundColor = (elem) => styled(elem)`
  background-color: ${(props) => props.theme.sectionBackgroundColor};
`

export const ifZoomed = (zoomLevel) =>
  zoomLevel && zoomLevel !== smallestZoomLevel

export const isZoomGreator = (zoomLevel, levelToCheck) =>
  breakpoints[levelToCheck] > breakpoints[zoomLevel]

export const Tooltip = ({ children, ...rest }) =>
  window.isMobileDevice || window.isIOS ? (
    children
  ) : (
    <AntDTooltip {...rest}>{children}</AntDTooltip>
  )

export const nameValidator = (name) => {
  const trimmedName = name.trim()

  // rules (valid name)
  // should start with alphabet
  // should contain at least three char (eg: stu, st1 s01)
  // should contain only one space between name/word
  // can contain number after initial alphabet
  // can contain special characters ' and - after initial alphabet

  const namePattern = /^(?!\d)(?!-)(?!')[a-zA-Z\d-']{2,}(?: [a-zA-z\d-']+)*$/
  if (!trimmedName || !namePattern.test(trimmedName)) {
    return false
  }
  return true
}

export const getDefaultSettings = ({
  testType = '',
  defaultTestProfiles = {},
}) => {
  switch (true) {
    case testType === testConst.type.COMMON:
      return {
        performanceBand: {
          _id: defaultTestProfiles?.performanceBand?.common || '',
        },
        standardProficiency: {
          _id: defaultTestProfiles?.standardProficiency?.common || '',
        },
      }
    case testType === testConst.type.ASSESSMENT:
      return {
        performanceBand: {
          _id: defaultTestProfiles?.performanceBand?.class || '',
        },
        standardProficiency: {
          _id: defaultTestProfiles?.standardProficiency?.class || '',
        },
      }
    case testType === testConst.type.PRACTICE:
      return {
        performanceBand: {
          _id: defaultTestProfiles?.performanceBand?.practice || '',
        },
        standardProficiency: {
          _id: defaultTestProfiles?.standardProficiency?.practice || '',
        },
      }
    default:
      return {
        performanceBand: {
          _id: defaultTestProfiles?.performanceBand?.common || '',
        },
        standardProficiency: {
          _id: defaultTestProfiles?.standardProficiency?.common || '',
        },
      }
  }
}

/**
 *
 * @param score
 * @param maxScore
 * @returns a tuple containing the type and message for notifaction [type, msg]
 */
export const getTypeAndMsgBasedOnScore = (score, maxScore) => {
  let returnValue = []
  if (score === maxScore) {
    returnValue = ['success', 'Correct']
  } else if (score > 0) {
    returnValue = ['success', 'Partially Correct']
  } else {
    returnValue = ['error', 'Incorrect']
  }
  return returnValue
}

/**
 * Make confirmation popup native to app
 * call router dom prompt as usual with appropriate message
 * resolve callback as per user's decision
 *  */
export const getUserConfirmation = (message, callback) =>
  Modal.confirm({
    title: 'Alert',
    content: message,
    onOk: () => {
      callback(true)
      Modal.destroyAll()
    },
    okText: 'Yes, Continue',
    onCancel: () => {
      callback(false)
      Modal.destroyAll()
    },
    centered: true,
    width: 500,
    okButtonProps: {
      style: { background: themeColor },
    },
  })

/**
 * Widgets contains the correct sequence of the Questions
 * @param {array} widgets
 * @param {array} questions
 */
export const reSequenceQuestionsWithWidgets = (
  widgets = [],
  questions = []
) => {
  const _questions = keyBy(questions, 'id')
  const reSequencedQ = widgets
    .map(({ reference }) => _questions[reference])
    .filter((x) => x)
  return reSequencedQ.length ? reSequencedQ : questions
}

export const validateEmail = (email = '') =>
  emailRegex.test(String(email).toLowerCase())

/** Use this helper to invoke at places where you to need to validate client time into sentry */
export const checkClientTime = (meta = {}) => {
  const error = new Error('[App] CLIENT_TIME_MISMATCH')
  // log into sentry if we see a difference at user client side
  setTimeout(async () => {
    try {
      const resp = await api
        .callApi({
          url: `/utils/fetch-sync-time`,
          method: 'get',
        })
        .then(({ data }) => data)
      if (resp.serverTimeISO) {
        try {
          const serverTime = new Date(resp.serverTimeISO).getTime()
          const currentTime = new Date().getTime()
          if (Math.abs((serverTime - currentTime) / 1000) > 10) {
            Sentry.withScope((scope) => {
              scope.setTag('issueType', 'clientTypeMismatchError')
              scope.setExtra('message', new Date().toISOString())
              scope.setExtras(meta)
              Sentry.captureException(error)
            })
          }
        } catch (e) {
          Sentry.captureException(e)
        }
      }
    } catch (e) {
      Sentry.captureException(e)
    }
  })
}

// Converts any given blob into a base64 encoded string.
const convertBlobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = reject
    reader.onload = () => {
      resolve(reader.result)
    }
    reader.readAsDataURL(blob)
  })
}

const handleOnLoad = (image) =>
  new Promise((resolve) => {
    image.onload = () => resolve(image.naturalWidth)
    // if images are blocked onload is never called
    setTimeout(() => !image.complete && resolve(0), 1000)
  })

export const isImagesBlockedByBrowser = async () => {
  try {
    let renderedImage = document.querySelector('img')
    // if image tag is rendered then check for naturalWidth
    if (renderedImage) {
      return !renderedImage.naturalWidth
    }
    // else fetch 1x1 image and try rendering it in background
    const image = document.createElement('img')
    const fetchResult = await fetch(
      'https://cdn.edulastic.com/default/edu-logo.png'
    )
    const id = 'customRenderedEduImage'
    const src = await convertBlobToBase64(await fetchResult.blob())
    image.setAttribute('src', src)
    image.setAttribute('id', id)
    image.style.display = 'none'
    document.body.appendChild(image)
    renderedImage = document.getElementById(id)
    if (renderedImage) {
      const naturalWidth = await handleOnLoad(renderedImage)
      return !naturalWidth
    }
  } catch (error) {
    console.warn(error)
  }
}

export const canUseAllOptionsByDefault = (permissions = [], userRole = '') => {
  return (
    userRole === EDULASTIC_CURATOR ||
    ['author', 'curator'].some((permission) => permissions.includes(permission))
  )
}

export const isHashAssessmentUrl = () => {
  return (
    window.location.hash.includes('#renderResource/close/') ||
    window.location.hash.includes('#assessmentQuestions/close/')
  )
}
