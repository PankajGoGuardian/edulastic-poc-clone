import '@testing-library/jest-dom'
import React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import ShareModal from '../ShareModal'
import {
  UPDATE_EMAIL_NOTIFICATION_DATA,
  DELETE_SHARED_USER,
} from '../../../../../TestPage/ducks'
import {
  coAuthorsStoreData,
  props as coAuthorProps,
  permissions,
} from './common/shareModalData'

const mockStore = configureMockStore()
const store = mockStore(coAuthorsStoreData)
const props = { ...coAuthorProps, isPublished: false }

const renderComponent = (coAuthorStore, currentProps = props) => {
  cleanup()
  render(
    <Router>
      <Provider store={coAuthorStore}>
        <ShareModal {...currentProps} />
      </Provider>
    </Router>
  )
}

describe('Testing Share Modal for published test', () => {
  afterEach(() => store.clearActions())

  it('>> Render the Share Modal component', () => {
    renderComponent(store)
  })

  it('>> Should have all the defualt elements for Co-Author share modal', () => {
    renderComponent(store)

    const modalTitle = screen.getByText(/Collaborate with other Co-Authors/i)
    const copyButton = screen.queryByRole('button', { name: 'Copy' })
    const giveAccessLabel = screen.getAllByText('Invite Co-Authors')[0]
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
      name: 'Invite Co-Authors',
    })

    // verify the elements to be present
    expect(modalTitle).toBeInTheDocument()

    expect(copyButton).not.toBeInTheDocument()
    expect(giveAccessLabel).toBeInTheDocument()

    expect(emailAddressTextbox).toBeInTheDocument()
    expect(selectedShareType).toBeInTheDocument()

    expect(emailNotificationCheckbox).toBeInTheDocument()
    expect(emailNotificationCheckbox).toBeChecked()

    expect(cancelButton).toBeInTheDocument()
    expect(shareButton).toBeInTheDocument()

    // the following action is triggerred when the item is not published
    expect(store.getActions()[0].type).toEqual(UPDATE_EMAIL_NOTIFICATION_DATA)
  })

  it(`>> Should not have ${permissions.ASSIGN} dropdown option`, async () => {
    renderComponent(store)

    const selectedShareType = screen.getByTitle(permissions.EDIT)
    expect(selectedShareType).toBeInTheDocument()

    userEvent.click(selectedShareType)

    await screen.findByRole('option', {
      name: permissions.EDIT,
    })

    Object.values(permissions).forEach((permission) => {
      const shareTypeOption = screen.queryByRole('option', {
        name: permission,
      })
      if (permissions.ASSIGN === permission) {
        expect(shareTypeOption).not.toBeInTheDocument()
      } else {
        expect(shareTypeOption).toBeInTheDocument()
      }
    })
  })

  it(`>> Should show the users list to whom the test was shared`, async () => {
    renderComponent(store)
    const coAuthors = screen.getByText('CO-AUTHORS FOR THIS TEST')
    expect(coAuthors).toBeInTheDocument()

    const sharedWithUser = screen.getByText(
      coAuthorsStoreData.tests.sharedUsersList[0].sharedWith[0].name
    )
    const deleteShare = document.querySelector('[data-cy="share-button-close"]')

    expect(sharedWithUser).toBeInTheDocument()
    expect(deleteShare).toBeInTheDocument()

    store.clearActions()
    fireEvent.click(deleteShare)
    expect(store.getActions()[0].type).toEqual(DELETE_SHARED_USER)
  })

  it(`>> Should be able to uncheck the send notification checkbox`, async () => {
    renderComponent(store)

    const emailNotificationCheckbox = screen.getByRole('checkbox', {
      name: 'Send Email Notification',
    })
    expect(emailNotificationCheckbox).toBeChecked()

    store.clearActions()
    fireEvent.click(emailNotificationCheckbox)

    const actionOccured = store.getActions()[0]
    expect(actionOccured?.type).toEqual(UPDATE_EMAIL_NOTIFICATION_DATA)
    expect(actionOccured?.payload).toEqual(
      expect.objectContaining({
        sendEmailNotification: false,
        showMessageBody: false,
      })
    )
  })

  it(`>> Should be able to click on Add message text`, async () => {
    renderComponent(store)

    const emailNotificationCheckbox = screen.getByRole('checkbox', {
      name: 'Send Email Notification',
    })
    const addMessage = screen.getByText(/Add Message/i)

    expect(emailNotificationCheckbox).toBeChecked()

    store.clearActions()
    fireEvent.click(addMessage)

    const actionOccured = store.getActions()[0]
    expect(actionOccured?.type).toEqual(UPDATE_EMAIL_NOTIFICATION_DATA)
    expect(actionOccured?.payload).toEqual(
      expect.objectContaining({
        showMessageBody: true,
      })
    )
  })

  it(`>> Should be able to type a mail`, async () => {
    const emailBody = 'Hello world'
    const tempStore = mockStore({
      ...coAuthorsStoreData,
      tests: {
        sendEmailNotification: true,
        showMessageBody: true,
      },
    })

    renderComponent(tempStore)
    const emailNotificationCheckbox = screen.getByRole('checkbox', {
      name: 'Send Email Notification',
    })
    const discardMessage = screen.getByText(/Discard Message/i)

    expect(emailNotificationCheckbox).toBeChecked()
    expect(discardMessage).toBeInTheDocument()

    const textArea = screen.getByPlaceholderText('Enter Message')

    tempStore.clearActions()
    fireEvent.change(textArea, { target: { value: emailBody } })

    const actionOccured = tempStore.getActions()[0]
    expect(actionOccured?.type).toEqual(UPDATE_EMAIL_NOTIFICATION_DATA)
    expect(actionOccured?.payload).toEqual({
      notificationMessage: emailBody,
    })
  })
})
