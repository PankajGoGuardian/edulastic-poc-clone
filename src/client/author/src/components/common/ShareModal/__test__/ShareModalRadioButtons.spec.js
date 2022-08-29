import '@testing-library/jest-dom'
import React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import ShareModal from '../ShareModal'
import { FETCH_USERS } from '../../../../../sharedDucks/userDetails'
import { RECEIVE_SHARED_USERS_LIST } from '../../../../../TestPage/ducks'
import {
  storeData,
  props,
  permissions,
  shareTypeKeys,
  schoolOptionsStoreData,
  sharedWithSchool,
  districtOptionsStoreData,
  sharedWithDistrict,
  sharedWithEveryone,
} from './common/shareModalData'

const mockStore = configureMockStore()
const individualOptionStore = mockStore(storeData)
const schoolOptionStore = mockStore(schoolOptionsStoreData)
const districtOptionStore = mockStore(districtOptionsStoreData)
const everyoneOptionStore = mockStore(storeData)

const renderComponent = (store, currentProps = props) => {
  cleanup()
  render(
    <Router>
      <Provider store={store}>
        <ShareModal {...currentProps} />
      </Provider>
    </Router>
  )
}

// setTimeout is used to handle the debounce for searchUser
const waitToSearchUser = () => new Promise((r) => setTimeout(r, 1000))

const clickOnOptions = (type) => {
  const selectedShareType = screen.getByTitle(permissions[type])
  userEvent.click(selectedShareType)
}

const clickOnSpecificRadioButton = (radioButtonOption) => {
  const radioButton = screen.getByRole('radio', {
    name: radioButtonOption,
  })
  fireEvent.click(radioButton)
  expect(radioButton).toBeChecked()
}

const expectedPayload = {
  emails: [],
  sharedType: 'SCHOOL',
  permission: 'ASSIGN',
  contentType: 'TEST',
}

const clickOnShareButton = async (store) => {
  const shareButton = screen.getByRole('button', {
    name: 'SHARE',
  })
  store.clearActions()
  fireEvent.click(shareButton)
}

const verifySharedUsersList = (tests, permission, isEveryone = false) => {
  const sharedWithTitle = screen.getByText('WHO HAS ACCESS')

  let sharedWithUser
  if (!isEveryone) {
    sharedWithUser = screen.getByText(
      tests.sharedUsersList[0].sharedWith[0]?.name
    )
  } else {
    sharedWithUser = screen.getByText('EVERYONE')
  }
  const sharedType = screen.getByText((content, element) => {
    return (
      element.tagName.toLowerCase() === 'span' && content.includes(permission)
    )
  })
  expect(sharedWithTitle).toBeInTheDocument()
  expect(sharedWithUser).toBeInTheDocument()
  expect(sharedType).toBeInTheDocument()
}

describe('Testing radio buttons in Share Modal for published test', () => {
  afterEach(() => individualOptionStore.clearActions())

  it('>> Render the Share Modal component', () => {
    renderComponent(individualOptionStore)
  })

  it('>> Should have all the defualt elements', () => {
    const tempProps = { ...props, testId: '111111111' }
    renderComponent(individualOptionStore, tempProps)

    const modalTitle = screen.getByText(/Share with others/i)
    const shareBlockTitle = screen.getByText(/TEST URL/i) // shareLabel is not passed in the props
    const sharableURL = `/author/tests/verid/${props.testVersionId}`

    const shareLinkElement = screen.queryByText((content, element) => {
      return (
        element.tagName.toLowerCase() === 'div' && content.includes(sharableURL)
      )
    })
    const copyButton = screen.getByRole('button', { name: 'Copy' })
    const previouslyShared = screen.queryByText(/WHO HAS ACCESS/i)
    const giveAccessLabel = screen.queryByText(/GIVE ACCESS TO/i)
    const emailAddressTextbox = screen.getByText(
      /Enter names or email addresses/i
    )
    const selectedShareType = screen.getByTitle(permissions.EDIT)
    const emailNotificationCheckbox = screen.getByRole('checkbox', {
      name: 'Send Email Notification',
    })
    const cancelButton = screen.getByRole('button', {
      name: 'Cancel',
    })
    const shareButton = screen.getByRole('button', {
      name: 'SHARE',
    })

    // verify the elements to be present
    expect(modalTitle).toBeInTheDocument()
    expect(shareBlockTitle).toBeInTheDocument()
    expect(shareLinkElement).toBeInTheDocument()
    expect(copyButton).toBeInTheDocument()
    expect(previouslyShared).toBeNull()
    expect(giveAccessLabel).toBeInTheDocument()

    // Verify the radio buttons
    shareTypeKeys.forEach((shareTypeKey) => {
      const shareTypeElement = screen.getByRole('radio', {
        name: shareTypeKey,
      })
      expect(shareTypeElement).toBeInTheDocument()
      if (shareTypeKey === 'Individuals') {
        expect(shareTypeElement).toBeChecked()
      } else {
        expect(shareTypeElement).not.toBeChecked()
      }
    })

    expect(emailAddressTextbox).toBeInTheDocument()
    expect(selectedShareType).toBeInTheDocument()

    expect(emailNotificationCheckbox).toBeInTheDocument()
    expect(emailNotificationCheckbox).not.toBeChecked()

    expect(cancelButton).toBeInTheDocument()
    expect(shareButton).toBeInTheDocument()

    // the following action is triggerred when the testId is passed in props
    expect(individualOptionStore.getActions()[0].type).toEqual(
      RECEIVE_SHARED_USERS_LIST
    )
  })

  describe('> Verify for Individual radio button', () => {
    beforeEach(() => renderComponent(individualOptionStore))

    afterEach(() => individualOptionStore.clearActions())

    it('>> Should have all the 3 options in dropdown', async () => {
      clickOnOptions('EDIT')
      Object.values(permissions).forEach(async (permission) => {
        const shareTypeOption = await screen.findByRole('option', {
          name: permission,
        })
        expect(shareTypeOption).toBeInTheDocument()
      })
    })

    it('>> Should be able to select different options', async () => {
      clickOnOptions('EDIT')
      const shareTypeOption = await screen.findByRole('option', {
        name: permissions.VIEW,
      })
      userEvent.click(shareTypeOption)
      const selectedShareType = await screen.findAllByTitle(permissions.VIEW)
      expect(selectedShareType).toHaveLength(1)
    })

    it('>> Search for a user in the search box', async () => {
      const searchString = 'TestUser'
      const nameSearchBox = screen.getByRole('textbox')

      fireEvent.change(nameSearchBox, { target: { value: searchString } })

      // the user will be searched only after a 500ms delay.
      await waitToSearchUser()

      const storeActions = individualOptionStore.getActions()
      expect(storeActions[0]?.type).toEqual(FETCH_USERS)
      expect(storeActions[0]?.payload).toEqual(
        expect.objectContaining({
          type: 'INDIVIDUAL',
          search: expect.objectContaining({
            searchString,
          }),
        })
      )
    })

    it('>> Should be able to share using Individual option', async () => {
      const searchString = 'TestUser2'
      const expectedPayloadValue = {
        emails: [searchString],
        sharedType: 'INDIVIDUAL',
        permission: 'EDIT',
        contentType: 'TEST',
        sendEmailNotification: true,
        authorName: ' ',
        testVersionId: props.testVersionId,
      }

      const tempStore = mockStore({
        ...storeData,
        tests: {
          sendEmailNotification: true,
        },
      })

      renderComponent(tempStore)
      const nameSearchBox = screen.getByRole('textbox')

      fireEvent.change(nameSearchBox, { target: { value: searchString } })

      // the user will be searched only after a 500ms delay.
      await waitToSearchUser()

      clickOnShareButton(tempStore)
      const shareActionPayload = tempStore.getActions()[0]?.payload?.data
      expect(shareActionPayload).toEqual(expectedPayloadValue)
    })
  })

  describe('> Verify for School radio button', () => {
    beforeEach(() => {
      renderComponent(schoolOptionStore)
      clickOnSpecificRadioButton('School')
    })

    afterEach(() => schoolOptionStore.clearActions())

    it('>> Should have the default values of School option', () => {
      const selectedShareType = screen.getByTitle(permissions.ASSIGN)
      const shareTo = screen.getByText(
        `Anyone in ${schoolOptionsStoreData.user.user.orgData.schools[0].name}`
      )
      expect(selectedShareType).toBeInTheDocument()
      expect(shareTo).toBeInTheDocument()
    })

    it('>> Should have all the 2 options in dropdown', async () => {
      clickOnOptions('ASSIGN')
      await screen.findByRole('option', {
        name: permissions.ASSIGN,
      })

      Object.values(permissions).forEach((permission) => {
        const shareTypeOption = screen.queryByRole('option', {
          name: permission,
        })
        if (permissions.EDIT === permission) {
          expect(shareTypeOption).not.toBeInTheDocument()
        } else {
          expect(shareTypeOption).toBeInTheDocument()
        }
      })
    })

    it('>> Should be able to select different options', async () => {
      clickOnOptions('ASSIGN')
      const shareTypeOption = await screen.findByRole('option', {
        name: permissions.VIEW,
      })
      userEvent.click(shareTypeOption)
      const selectedShareType = await screen.findAllByTitle(permissions.VIEW)
      expect(selectedShareType).toHaveLength(1)
    })

    it('>> Should be able to share using School option', async () => {
      clickOnShareButton(schoolOptionStore)
      const shareActionPayload = schoolOptionStore.getActions()[0].payload?.data
      expect(shareActionPayload).toEqual(expectedPayload)
    })

    it(`>> Should show the users list to whom the test was shared`, async () => {
      const tests = sharedWithSchool
      const tempStore = mockStore({
        ...schoolOptionsStoreData,
        tests,
      })

      renderComponent(tempStore)
      verifySharedUsersList(tests, permissions.VIEW)
    })
  })

  describe('> Verify for District radio button', () => {
    beforeEach(() => {
      renderComponent(districtOptionStore)
      clickOnSpecificRadioButton('District')
    })

    afterEach(() => districtOptionStore.clearActions())

    it('>> Should have the default values of District option', () => {
      const selectedShareType = screen.getByTitle(permissions.ASSIGN)
      const shareTo = screen.getByText(
        `Anyone in ${districtOptionsStoreData.user.user.orgData.districts[0].districtName}`
      )
      expect(selectedShareType).toBeInTheDocument()
      expect(shareTo).toBeInTheDocument()
    })

    it('>> Should have all the 2 options in dropdown', async () => {
      clickOnOptions('ASSIGN')
      await screen.findByRole('option', {
        name: permissions.ASSIGN,
      })

      Object.values(permissions).forEach((permission) => {
        const shareTypeOption = screen.queryByRole('option', {
          name: permission,
        })
        if (permissions.EDIT === permission) {
          expect(shareTypeOption).not.toBeInTheDocument()
        } else {
          expect(shareTypeOption).toBeInTheDocument()
        }
      })
    })

    it('>> Should be able to select different options', async () => {
      clickOnOptions('ASSIGN')
      const shareTypeOption = await screen.findByRole('option', {
        name: permissions.VIEW,
      })
      userEvent.click(shareTypeOption)
      const selectedShareType = await screen.findAllByTitle(permissions.VIEW)
      expect(selectedShareType).toHaveLength(1)
    })

    it('>> Should be able to share using District option', async () => {
      expectedPayload.sharedType = 'DISTRICT'
      clickOnShareButton(districtOptionStore)
      const shareActionPayload = districtOptionStore.getActions()[0].payload
        ?.data
      expect(shareActionPayload).toEqual(expectedPayload)
    })

    it(`>> Should show the users list to whom the test was shared`, async () => {
      const tests = sharedWithDistrict
      const tempStore = mockStore({
        ...districtOptionsStoreData,
        tests,
      })
      renderComponent(tempStore)
      verifySharedUsersList(tests, permissions.ASSIGN)
    })
  })

  describe('> Verify for Everyone radio button', () => {
    beforeEach(() => {
      renderComponent(everyoneOptionStore)
      clickOnSpecificRadioButton('Everyone')
    })

    afterEach(() => everyoneOptionStore.clearActions())

    it('>> Should have the default values of Everyone option', () => {
      const shareTo = screen.getByText(`The entire Edulastic Community`)
      expect(shareTo).toBeInTheDocument()
    })

    it('>> Should be able to share using Everyone option', async () => {
      expectedPayload.sharedType = 'PUBLIC'
      expectedPayload.permission = 'VIEW'

      clickOnShareButton(everyoneOptionStore)
      const shareActionPayload = everyoneOptionStore.getActions()[0].payload
        ?.data
      expect(shareActionPayload).toEqual(expectedPayload)
    })

    it(`>> Should show the users list to whom the test was shared`, async () => {
      const tests = sharedWithEveryone
      const tempStore = mockStore({
        ...storeData,
        tests,
      })

      renderComponent(tempStore)
      verifySharedUsersList(tests, permissions.VIEW, true)
    })
  })
})
