import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import configureMockStore from 'redux-mock-store'
import { BrowserRouter as Router } from 'react-router-dom'
import Header from '../components/Header/Header'

const mockStore = configureMockStore()

const props = {
  user: {
    addAccount: false,
    authenticating: false,
    currentChild: null,
    emailVerifiedStatus: '',
    iosRestrictNavigationModalVisible: false,
    isAuthenticated: true,
    isClassCodeModalOpen: false,
    isCliUser: false,
    isImageBlockNotification: false,
    isRoleConfirmation: false,
    isUserIdPresent: true,
    showAdminAlertModal: false,
    showVerifyEmailModal: false,
    signedUpUsingUsernameAndPassword: true,
    signupStatus: 5,
    user: {
      currentSignUpState: 5,
      currentStandardSetStandards: {},
      districtIds: [],
      email: 'yeshwanth303@gmail.com',
      emailVerified: true,
      features: {
        free: true,
        premium: false,
        presentationMode: false,
        expressGrader: false,
        textToSpeech: false,
      },
      firstName: 'yeshwanth303',
      institutionIds: ['622ee64968d94a0009470cbb'],
      isPolicyAccepted: true,
      isPowerTeacher: false,
      isUserGoogleLoggedIn: false,
      kid:
        'v1-fa33625e9b6e9e4238ac26eab89f9300fa97a3ba772790b5825c21af6cb07e45',
      lastName: undefined,
      location: {
        city: 'Bangalore',
        state: 'CA',
        zip: '560100',
        address: '@13',
        country: 'US',
      },
      middleName: undefined,
      openIdProvider: undefined,
      orgData: {
        districtIds: [],
        institutionIds: [],
        policies: [],
        isCleverDistrict: false,
        userFavorites: [],
      },
      otherAccounts: [],
      permissions: [],
      personId: 'f147882a-65ae-4cb2-af30-4e6dfc643371',
      recommendedContentUpdated: false,
      referrer: 'https://edulasticv2-dryrun.snapwiz.net/author/dashboard',
      role: 'teacher',
      sparkPlaylistCollectionsVisited: [],
      status: 1,
      teachingStandards: {},
      username: 'yeshwanth303@gmail.com',
      _id: '615c1272040bea00091fe422',
    },
    userId: null,
  },
  openLaunchHangout: ' ',
  subscription: undefined,
  fetchClassList: ' ',
  history: '()',
  isUserGoogleLoggedIn: false,
  googleAllowedInstitutions: [],
  canvasAllowedInstitutions: [],
  isCleverUser: undefined,
  setShowCleverSyncModal: ' ',
  loadingCleverClassList: false,
  courseList: [],
  cleverClassList: [],
  getStandardsListBySubject: '',
  defaultGrades: ['TK'],
  defaultSubjects: ['Science'],
  syncCleverClassList: ' ',
  institutionIds: ['622ee64968d94a0009470cbb'],
  isAboutToExpire: false,
  isClassLink: false,
  canvasCourseList: [],
  canvasSectionList: [],
  getCanvasCourseListRequest: ' ',
  getCanvasSectionListRequest: ' ',
  showCanvasSyncModal: false,
  classData: [],
  teacherData: [],
  loading: false,
  isHangoutEnabled: true,
  isPaidPremium: false,
  isPremiumTrialUsed: undefined,
  isPremiumUser: false,
  isSignupComplete: false,
  districtPolicy: {
    allowCanvas: false,
    allowClasslink: false,
    allowGoogleClassroom: false,
    allowSchoology: false,
    cleverGradeSyncEnabled: false,
    enableGoogleMeet: true,
    enforceDistrictSignonPolicy: false,
    searchAndAddStudents: false,
  },
  schoolPolicy: undefined,
  setShowHeaderTrialModal: ' ',
}

describe('Dashboard Header component', () => {
  test('test Header for newly signedup user should contain dashboard title and complete signup ,new class and try premium for free buttons ', async () => {
    const store = mockStore({
      user: { user: { _id: 'id ' } },
      manageClass: { cleverClassList: [] },
      dashboardTeacher: {
        data: [],
      },
      subscription: {
        isSubscriptionExpired: false,
      },
    })

    render(
      <Router>
        <Provider store={store}>
          <Header {...props} />
        </Provider>
      </Router>
    )
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('NEW CLASS')).toBeInTheDocument()
    expect(screen.getByText('TRY PREMIUM FOR FREE')).toBeInTheDocument()
    expect(screen.getByText('Complete signup')).toBeInTheDocument()
  })
})
