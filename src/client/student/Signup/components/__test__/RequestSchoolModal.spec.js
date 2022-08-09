import React from 'react'
import { render, cleanup, fireEvent, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import '@testing-library/jest-dom/extend-expect'
import { createMemoryHistory } from 'history'
import { Router } from 'react-router'
import { cloneDeep } from 'lodash'
import { Provider } from 'react-redux'
import { countryApi } from '@edulastic/api'
import RequestSchoolModal from '../TeacherContainer/RequestSchoolModal'

jest.mock('../../../../../../packages/api/src/utils/API')

const mockStore = configureMockStore()
const storeData = {
  user: {
    user: {
      orgData: {},
    },
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
  isOpen: true,
}

const renderComponent = (tempStore = store, tempProps = props) => {
  render(
    <Provider store={tempStore}>
      <Router history={history}>
        <RequestSchoolModal {...tempProps} />
      </Router>
    </Provider>
  )
}

const verifyElementVisibility = () => {
  const modalTitle = screen.getByText('Request a new school')
  const modalDescription = screen.getByText('provide details of your school')
  const schoolNameLabel = screen.getByText('Name of your school')
  const addressLabel = screen.getByText('Address')
  const districtLabel = screen.getByText('District')
  const cityLabel = screen.getByText('City')
  const zipLabel = screen.getByText('Zip')
  const stateLabel = screen.getByText('State')
  const countryLabel = screen.getByText('Country')
  const requestNewSchoolButton = screen.getByRole('button', {
    name: 'Request new school',
  })

  expect(modalTitle).toBeInTheDocument()
  expect(modalDescription).toBeInTheDocument()
  expect(schoolNameLabel).toBeInTheDocument()
  expect(addressLabel).toBeInTheDocument()
  expect(districtLabel).toBeInTheDocument()
  expect(cityLabel).toBeInTheDocument()
  expect(zipLabel).toBeInTheDocument()
  expect(stateLabel).toBeInTheDocument()
  expect(countryLabel).toBeInTheDocument()
  expect(requestNewSchoolButton).toBeInTheDocument()
}

describe('Testing the RequestNeSchool modal', () => {
  beforeEach(() => {
    cleanup()
    store.clearActions()
    jest.spyOn(countryApi, 'getCountries').mockReturnValueOnce(
      Promise.resolve({
        US: 'United States',
        IN: 'India',
      })
    )
  })

  it('> verify the RequestNeSchool visibility', async () => {
    await renderComponent()
  })

  it('> should have the default element on the modal', async () => {
    await renderComponent()
    verifyElementVisibility()
  })

  it('> verify the mandatory fields', async () => {
    await renderComponent()
    const mandatoryFields = document.querySelectorAll('.ant-form-item-required')
    expect(mandatoryFields).toHaveLength(4)
  })

  it('> should display warning messages if mandatory fields are empty', async () => {
    // to prevent irrelevent error and warn messages
    jest.spyOn(console, 'error').mockImplementation(() => {})
    jest.spyOn(console, 'warn').mockImplementation(() => {})

    await renderComponent()
    const requestNewSchoolButton = screen.getByRole('button', {
      name: 'Request new school',
    })

    fireEvent.click(requestNewSchoolButton)
    const schoolNameWarning = await screen.findByText(/valid school name/)
    const districtNameWarning = await screen.findByText(/valid district name/)
    const zipCodeWarning = await screen.findByText(/valid zip code/)
    const countrySelectBydefualt = await screen.findByText(/United States/)

    expect(schoolNameWarning).toBeInTheDocument()
    expect(districtNameWarning).toBeInTheDocument()
    expect(zipCodeWarning).toBeInTheDocument()
    expect(countrySelectBydefualt).toBeInTheDocument()
  })

  it('> should trigger action to search a district', async () => {
    await renderComponent()
    const districtInputBox = screen.getByPlaceholderText(/school district name/)
    fireEvent.change(districtInputBox, {
      target: { value: 'Test' },
    })
    await new Promise((r) => setTimeout(r, 1000))
    const actions = store.getActions()
    expect(actions[0].type).toContain('search districts')
    expect(actions[0].payload).toStrictEqual({ searchText: 'Test' })
  })

  it('> verify the default district is pre-populated', async () => {
    const tempStoreData = cloneDeep(storeData)
    tempStoreData.user.user.orgData = {
      districts: [{ districtId: '1', districtName: 'Testing' }],
    }
    tempStoreData.user.user.districtIds = ['1']

    const tempStore = mockStore(tempStoreData)
    await renderComponent(tempStore)

    const districtInputBox = document.querySelector('[data-cy="district"]')
    // default district cannot be edited
    expect(districtInputBox).toHaveClass('ant-input-disabled')
    expect(districtInputBox).toHaveValue('Testing')
  })

  it('> verify the actions triggered when click on the request new school button', async () => {
    const tempStoreData = cloneDeep(storeData)
    tempStoreData.signup = {
      autocompleteDistricts: [
        { title: 'District-1', key: '1' },
        { title: 'District-2', key: '2' },
      ],
    }
    const tempStore = mockStore(tempStoreData)
    await renderComponent(tempStore)
    const schoolInputBox = screen.getByRole('textbox', {
      name: 'Name of your school',
    })
    const districtInputBox = screen.getByPlaceholderText(/school district name/)
    const zipInputBox = screen.getByRole('textbox', {
      name: 'Zip',
    })
    fireEvent.change(schoolInputBox, {
      target: { value: 'Test School' },
    })
    fireEvent.change(zipInputBox, {
      target: { value: '123456' },
    })

    fireEvent.click(districtInputBox)
    const selectDistrict = screen.getByText(/District-1/)
    fireEvent.click(selectDistrict)
    const requestNewSchoolButton = screen.getByRole('button', {
      name: 'Request new school',
    })
    tempStore.clearActions()
    const actions = tempStore.getActions()
    fireEvent.click(requestNewSchoolButton)
    const { createSchool } = actions[0]?.payload

    expect(createSchool?.name).toBe('Test School')
    expect(createSchool?.districtName).toBe('District-1')
    expect(createSchool?.location?.zip).toBe('123456')
    expect(createSchool?.requestNewSchool).toBeTruthy()
  })
})
