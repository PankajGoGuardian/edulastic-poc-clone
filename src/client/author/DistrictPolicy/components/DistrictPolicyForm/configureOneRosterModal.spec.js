import '@testing-library/jest-dom'
import React from 'react'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import ConfigureOnerosterModal from './ConfigureOnerosterModal'

const mockStore = configureMockStore()

const store = mockStore({
  user: {
    user: {
      districtIds: ['05f7b9467647b6357892bd09'],
    },
  },
})

describe('Testing configure one Roster modal', () => {
  afterEach(() => cleanup())
  it('>> testing visibility of ConfigureOnerosterModal component', () => {
    render(
      <ConfigureOnerosterModal
        store={store}
        visible={true}
        handleCancel={() => {}}
        districtPolicyId="5eabe2a403b7ad092412cf63"
        orgType="district"
        orgId="5eabe28303b7ad092412aa93"
        userDistrictId
      />
    )
    const modalTitle = screen.getAllByText(/oneRoster Integration/i)
    expect(modalTitle[0]).toBeInTheDocument()
    // console.log(screen.debug(null, 2000000000))
  })

  it('>> should have all the default elements in API CONFIGURATION tab', () => {
    const baseUrl = 'https://edulastic-vn-v2.oneroster.com/ims/oneroster/v1p1'
    const clientId = '123411'
    const key = '123111'
    render(
      <ConfigureOnerosterModal
        store={store}
        visible={true}
        handleCancel={() => {}}
        districtPolicyId="5eabe2a403b7ad092412cf63"
        orgType="district"
        orgId="5eabe28303b7ad092412aa93"
        oneRosterBaseUrl={baseUrl}
        oneRosterClientId={clientId}
        oneRosterSecretKey={key}
      />
    )
    const radioButton1 = screen.getByTestId('oAuth1', { name: 'OAUTH 1.0' })
    const radioButton2 = screen.getByTestId('oAuth2', { name: 'OAUTH 2.0' })

    const cancelButton = screen.getAllByRole('button', { name: /close/i })
    const saveButton = screen.getByRole('button', { name: /save/i })
    const modalFooter = screen.getByText(/change details/i)
    const testText = screen.getByText(/test connection/i)
    const baseUrlText = screen.getByText(/base url/i)
    const baseUrlField = screen.getByTestId('baseUrl')
    const clientIdText = screen.getByText(/client id/i)
    const clientIdField = screen.getByTestId('clientId')
    const secretKeyText = screen.getByText(/secret key/i)
    const secretKeyField = screen.getByTestId('secretKey')

    expect(radioButton1).toBeInTheDocument()
    expect(radioButton2).toBeInTheDocument()
    expect(cancelButton[0]).toBeInTheDocument()
    expect(saveButton).toBeInTheDocument()
    expect(modalFooter).toBeInTheDocument()
    expect(testText).toBeInTheDocument()
    expect(baseUrlText).toBeInTheDocument()
    expect(baseUrlField).toBeInTheDocument()
    expect(clientIdText).toBeInTheDocument()
    expect(clientIdField).toBeInTheDocument()
    expect(secretKeyText).toBeInTheDocument()
    expect(secretKeyField).toBeInTheDocument()
  })

  it('>> should have all the default elements in LTI INTEGRATION tab', () => {
    const consumerKey = '112333'
    const key =
      '11111111'

    render(
      <ConfigureOnerosterModal
        store={store}
        visible={true}
        handleCancel={() => {}}
        districtPolicyId="5eabe2a403b7ad092412cf63"
        orgType="district"
        orgId="5eabe28303b7ad092412aa93"
        rosterOAuthConsumerKey={consumerKey}
        rosterOAuthConsumerSecret={key}
      />
    )
    const ltiIntegration = screen.getByText(/lti integration/i)
    fireEvent.click(ltiIntegration)
    const closeButton = screen.getByRole('button', { name: 'CLOSE' })
    const authText = screen.getByText(/auth url/i)
    const consumerKeyText = screen.getByText(/consumer Key/i)
    const consumerField = screen.getByTestId('consumerKey')
    const secretKeyText = screen.getAllByText(/secret Key/i)
    const secretKeyField = screen.getByTestId('secretKey2')

    expect(authText).toBeInTheDocument()
    expect(consumerKeyText).toBeInTheDocument()
    expect(consumerField).toBeInTheDocument()
    expect(secretKeyText[1]).toBeInTheDocument()
    expect(secretKeyField).toBeInTheDocument()
    expect(closeButton).toBeInTheDocument()
  })
})
