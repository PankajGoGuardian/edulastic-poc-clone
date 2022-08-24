import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { get } from 'lodash'
import ManageDistrict from '@edulastic/localization/src/locales/manageDistrict/en'
import { authApi } from '@edulastic/api'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import CreateDistrictAdminModalForm from './CreateDistrictAdminModal'

jest.mock('../../../../../../../packages/api/src/utils/API')

jest.spyOn(authApi, 'checkUserExist')

const mockStore = configureMockStore()
const storeData = {
  user: {
    user: {},
  },
}
const store = mockStore(storeData)

const newUser = {
  firstName: 'dummy',
  lastName: 'user',
  password: 'snapwiz',
  email: 'dummy@dummy.com',
}

const t = (data) => {
  return get(ManageDistrict, data)
}

const createDistrictAdmin = jest.fn()

const defineElements = () => {
  const nameInputTextBox = screen.getByPlaceholderText('Enter name')
  const emailInputTextBox = screen.getByPlaceholderText('Enter username')
  const passwordInputTextBox = screen.getByPlaceholderText('Enter password')
  const superAdminCheckBox = screen.getByTestId('superAdminCheckbox')
  const createDAButton = screen.getByText('Yes, Create')

  return [
    nameInputTextBox,
    emailInputTextBox,
    passwordInputTextBox,
    superAdminCheckBox,
    createDAButton,
  ]
}

const enterValuesToElements = (
  nameInputTextBox,
  emailInputTextBox,
  passwordInputTextBox,
  superAdminCheckBox
) => {
  fireEvent.change(nameInputTextBox, {
    target: { value: `${newUser.firstName} ${newUser.lastName}` },
  })
  fireEvent.change(emailInputTextBox, {
    target: { value: newUser.email },
  })
  fireEvent.change(passwordInputTextBox, {
    target: { value: newUser.password },
  })
  if (newUser.permissions.includes('super_admin')) {
    fireEvent.click(superAdminCheckBox)
  }
}

describe('#Testing the CreateDistrictAdminModalForm', () => {
  afterEach(() => {
    cleanup()
  })

  it('> test CreateDistrictAdminModalForm component renders without error', () => {
    render(
      <Provider store={store}>
        <CreateDistrictAdminModalForm modalVisible t={t} />
      </Provider>
    )
  })

  it('> should display all elements on the screen', () => {
    render(
      <Provider store={store}>
        <CreateDistrictAdminModalForm modalVisible t={t} />
      </Provider>
    )

    const [
      nameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      superAdminCheckBox,
    ] = defineElements()

    expect(nameInputTextBox).toBeInTheDocument()
    expect(nameInputTextBox.value).toBe('')

    expect(emailInputTextBox).toBeInTheDocument()
    expect(emailInputTextBox.value).toBe('')

    expect(passwordInputTextBox).toBeInTheDocument()
    expect(passwordInputTextBox.value).toBe('')

    expect(superAdminCheckBox).toBeInTheDocument()
    expect(superAdminCheckBox).not.toBeChecked()
  })

  it('> should create a normal DA', async () => {
    newUser.permissions = []

    authApi.checkUserExist = jest.fn().mockReturnValue(
      Promise.resolve({
        userExists: false,
        role: 'district-admin',
      })
    )

    render(
      <Provider store={store}>
        <CreateDistrictAdminModalForm
          modalVisible
          t={t}
          createDistrictAdmin={createDistrictAdmin}
        />
      </Provider>
    )

    const [
      nameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      superAdminCheckBox,
      createDAButton,
    ] = defineElements()

    enterValuesToElements(
      nameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      superAdminCheckBox
    )

    await userEvent.click(createDAButton)

    expect(createDistrictAdmin).toBeCalledWith(newUser)
  })

  it('> should create a super admin DA', async () => {
    newUser.permissions = ['super_admin']

    authApi.checkUserExist = jest.fn().mockReturnValue(
      Promise.resolve({
        userExists: false,
        role: 'district-admin',
      })
    )

    render(
      <Provider store={store}>
        <CreateDistrictAdminModalForm
          modalVisible
          t={t}
          createDistrictAdmin={createDistrictAdmin}
        />
      </Provider>
    )

    const [
      nameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      superAdminCheckBox,
      createDAButton,
    ] = defineElements()

    enterValuesToElements(
      nameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      superAdminCheckBox
    )

    await userEvent.click(createDAButton)

    expect(createDistrictAdmin).toBeCalledWith(newUser)
  })

  it('> cannot create an existing DA', async () => {
    newUser.permissions = []

    authApi.checkUserExist = jest.fn().mockReturnValue(
      Promise.resolve({
        userExists: true,
        role: 'district-admin',
      })
    )

    render(
      <Provider store={store}>
        <CreateDistrictAdminModalForm
          modalVisible
          t={t}
          createDistrictAdmin={createDistrictAdmin}
        />
      </Provider>
    )

    const [
      nameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      superAdminCheckBox,
      createDAButton,
    ] = defineElements()

    enterValuesToElements(
      nameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      superAdminCheckBox
    )

    const result = await userEvent.click(createDAButton)

    expect(createDistrictAdmin).not.toBeCalledWith(newUser)
    expect(result).toBeUndefined()
  })
})
