import React from 'react'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import '@testing-library/jest-dom/extend-expect'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router'
import { cloneDeep } from 'lodash'
import { Provider } from 'react-redux'
import { act } from 'react-dom/test-utils'
import JoinSchool from '../TeacherContainer/JoinSchool'

const mockStore = configureMockStore()
const storeData = {
  user: {
    user: {},
  },
  signup: {
    checkingPolicy: false,
    displayHomeSchoolButton: true,
  },
}
const store = mockStore(storeData)
const history = createMemoryHistory()

const props = {
  userInfo: {
    email: 'test@user.com',
    firstName: 'Test',
    lastName: 'User',
  },
  hideJoinSchoolBanner: true,
}

const renderComponent = (tempStore = store, tempProps = props) => {
  render(
    <Provider store={tempStore}>
      <Router history={history}>
        <JoinSchool {...tempProps} />
      </Router>
    </Provider>
  )
}

const verifyElementVisibility = (isBannerHidden = true) => {
  const searchSchoolLabel = screen.getByText(/Search for your school/i)
  const schoolSearchBar = screen.getByPlaceholderText(/Search by zip code/i)
  const requestSchoolButton = screen.getByRole('button', {
    name: 'Request a new school',
  })
  const homeSchoolButton = screen.getByRole('button', {
    name: 'HOME SCHOOL',
  })
  const joinSchoolHeader = screen.queryByText(/Join your school/i)
  const infoWithoutBannerText = screen.queryByText(/For International School/i)
  const infoWithBannerText = screen.queryByText(/To find your school/)

  expect(searchSchoolLabel).toBeInTheDocument()
  expect(schoolSearchBar).toBeInTheDocument()
  expect(requestSchoolButton).toBeInTheDocument()
  expect(homeSchoolButton).toBeInTheDocument()

  if (isBannerHidden) {
    expect(infoWithoutBannerText).toBeInTheDocument()
    expect(joinSchoolHeader).toBeNull()
    expect(infoWithBannerText).toBeNull()
  } else {
    expect(infoWithoutBannerText).toBeNull()
    expect(joinSchoolHeader).toBeInTheDocument()
    expect(infoWithBannerText).toBeInTheDocument()
  }
}

describe('Testing the Join School Modal', () => {
  afterEach(() => {
    cleanup()
    store.clearActions()
  })

  it('> should verify the Join school component visibility', () => {
    renderComponent()
  })

  it('> verify all the default element without banner', () => {
    renderComponent()
    verifyElementVisibility()
  })

  it('> verify all the default element with banner', () => {
    const tempProps = cloneDeep(props)
    tempProps.hideJoinSchoolBanner = false
    tempProps.fromUserProfile = true

    renderComponent(store, tempProps)
    verifyElementVisibility(false)
  })

  it('> should be able to create a home school', () => {
    const { firstName, lastName } = props.userInfo
    const userName = firstName + lastName

    renderComponent()
    const homeSchoolButton = screen.getByRole('button', {
      name: 'HOME SCHOOL',
    })

    store.clearActions()
    fireEvent.click(homeSchoolButton)
    const actions = store.getActions()

    const {
      name: schoolName,
      districtName,
      requestNewSchool,
      homeSchool,
    } = actions[0]?.payload?.createSchool

    expect(schoolName).toBe(`${userName} HOME SCHOOL`)
    expect(districtName).toBe(`${userName} HOME SCHOOL DISTRICT`)
    expect(requestNewSchool).toBeTruthy()
    expect(homeSchool).toBeTruthy()
  })

  it('> should be able to search a school from school searchbox', async () => {
    const searchText = 'Test School'
    const { email } = props.userInfo

    renderComponent()
    const schoolSearchBar = screen.getByPlaceholderText(/Search by zip code/i)
    store.clearActions()
    fireEvent.change(schoolSearchBar, {
      target: { value: searchText },
    })

    await new Promise((r) => setTimeout(r, 1000))
    const actions = store.getActions()

    expect(actions[0]?.payload?.email).toBe(email)
    expect(actions[0]?.payload?.searchText).toBe(searchText)
  })

  it('> verify select school warning message is displayed', () => {
    const tempStoreData = cloneDeep(storeData)
    tempStoreData.signup.displaySchoolSelectWarning = true
    const tempStore = mockStore(tempStoreData)

    renderComponent(tempStore)
    const warningMessage = screen.getByText(/Please select/)
    expect(warningMessage).toBeInTheDocument()
  })

  it('> verify that the selected school appear on the search bar', async () => {
    const tempStoreData = cloneDeep(storeData)
    tempStoreData.signup.schools = [
      {
        isApproved: true,
        districtId: '1',
        schoolId: '2',
        districtName: 'Test District',
        schoolName: 'Test-School1',
      },
      {
        isApproved: true,
        districtId: '1',
        schoolId: '3',
        districtName: 'Test District',
        schoolName: 'Test-School2',
      },
    ]
    const tempStore = mockStore(tempStoreData)

    renderComponent(tempStore)
    store.clearActions()

    const schoolSearchBar = screen.getByPlaceholderText(/Search by zip code/i)
    fireEvent.click(schoolSearchBar)

    // options dropdown is not visible
    expect(document.querySelector('.ant-select-dropdown-hidden')).toBeNull()

    const selectSchool = screen.getByText(/Test-School1/i)
    await act(async () => {
      fireEvent.click(selectSchool)
      await new Promise((r) => setTimeout(r, 1000))
    })

    // options dropdown should not be visible
    expect(
      document.querySelector('.ant-select-dropdown-hidden')
    ).toBeInTheDocument()

    const schoolSelected = screen.getByPlaceholderText(/Test-School1/i)
    expect(schoolSelected).toBeInTheDocument()
  })

  it('> verify the school name is prepopulated when user belongs to a school', () => {
    const tempStoreData = cloneDeep(storeData)
    tempStoreData.user.user.districtIds = '1'
    tempStoreData.user.user.orgData = {}
    tempStoreData.user.user.orgData.schools = [
      {
        _id: '2',
        name: 'Test-School',
        districtId: '1',
      },
    ]
    const tempStore = mockStore(tempStoreData)

    renderComponent(tempStore)

    const selectedSchool = screen.getByText(/Test-School/)
    const removeSelectedSchool = document.querySelector(
      '[data-cy="removeSelected"]'
    )

    expect(selectedSchool).toBeInTheDocument()
    expect(removeSelectedSchool).not.toBeInTheDocument()
  })
})
