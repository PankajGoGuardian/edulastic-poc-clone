import '@testing-library/jest-dom'
import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { BrowserRouter as Router } from 'react-router-dom'
import ShareModal from '../ShareModal'
import { RECEIVE_SHARED_USERS_LIST } from '../../../../../TestPage/ducks'
import { daStoreData, props, permissions } from './common/shareModalData'

const mockStore = configureMockStore()
const daStore = mockStore(daStoreData)
const shareTypeKeys = ['Everyone', 'District', 'Individuals', 'Link Sharing']

const renderComponent = (store, currentProps = props) => {
  cleanup()
  render(
    <Router>
      <Provider store={daStore}>
        <ShareModal {...currentProps} />
      </Provider>
    </Router>
  )
}

describe('Testing Share modal for DA', () => {
  afterEach(() => daStore.clearActions())

  it('>> Render the Share Modal component', () => {
    renderComponent(daStore)
  })

  it('>> Should have all the default elements', () => {
    const tempProps = { ...props, testId: '111111111' }

    renderComponent(daStore, tempProps)
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
    const defaultShareType = screen.getByTitle(permissions.VIEW)
    const emailAddressTextbox = screen.getByText(
      /Enter names or email addresses/i
    )

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
    expect(defaultShareType).toBeInTheDocument()

    expect(emailNotificationCheckbox).toBeInTheDocument()
    expect(emailNotificationCheckbox).not.toBeChecked()

    expect(cancelButton).toBeInTheDocument()
    expect(shareButton).toBeInTheDocument()

    // the following action is triggerred when the testId is passed in props
    expect(daStore.getActions()[0].type).toEqual(RECEIVE_SHARED_USERS_LIST)
  })
})
