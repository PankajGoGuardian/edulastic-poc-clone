import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { get } from 'lodash'
import ManageDistrict from '@edulastic/localization/src/locales/manageDistrict/en'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import EditDistrictAdminModalForm from './EditDistrictAdminModal'

const newUser = {
  firstName: 'dummy',
  lastName: 'user',
  password: 'snapwiz',
  email: 'dummy@dummy.com',
  permissions: [],
}

const districtAdminData = {
  _source: newUser,
}

const t = (data) => {
  return get(ManageDistrict, data)
}

const mockStore = configureMockStore()
const storeData = {
  user: {
    user: {},
  },
}
const store = mockStore(storeData)

const updateDistrictAdmin = jest.fn()

const closeModal = jest.fn()

const defineElements = () => {
  const firstNameInputTextBox = screen.getByPlaceholderText('Enter first name')
  const lastNameInputTextBox = screen.getByPlaceholderText('Enter last name')
  const emailInputTextBox = screen.getByPlaceholderText('Enter email')
  const passwordInputTextBox = screen.getByPlaceholderText('Enter password')
  const confirmPasswordInputTextBox = screen.getByPlaceholderText(
    'Enter Confirm Password'
  )
  const superAdminCheckBox = screen.getByTestId('superAdminCheckbox')
  const editDAButton = screen.getByText('Yes, Update')

  return [
    firstNameInputTextBox,
    lastNameInputTextBox,
    emailInputTextBox,
    passwordInputTextBox,
    confirmPasswordInputTextBox,
    superAdminCheckBox,
    editDAButton,
  ]
}

const enterValuesToElements = (
  updatedUser,
  firstNameInputTextBox,
  lastNameInputTextBox,
  emailInputTextBox,
  passwordInputTextBox,
  confirmPasswordInputTextBox,
  superAdminCheckBox
) => {
  fireEvent.change(firstNameInputTextBox, {
    target: { value: updatedUser.firstName },
  })
  fireEvent.change(lastNameInputTextBox, {
    target: { value: updatedUser.lastName },
  })
  fireEvent.change(emailInputTextBox, {
    target: { value: updatedUser.email },
  })
  fireEvent.change(passwordInputTextBox, {
    target: { value: updatedUser.password },
  })
  fireEvent.change(confirmPasswordInputTextBox, {
    target: { value: updatedUser.password },
  })
  if (
    (updatedUser.permissions.includes('super_admin') &&
      !superAdminCheckBox.checked) ||
    (!updatedUser.permissions.includes('super_admin') &&
      superAdminCheckBox.checked)
  ) {
    fireEvent.click(superAdminCheckBox)
  }
}

describe('#Testing the EditDistrictAdminModalForm', () => {
  afterEach(() => {
    cleanup()
  })

  it('> test EditDistrictAdminModalForm component renders without error', () => {
    render(
      <Provider store={store}>
        <EditDistrictAdminModalForm
          modalVisible
          t={t}
          districtAdminData={districtAdminData}
        />
      </Provider>
    )
  })

  it('> should display all elements with default user values - normal DA', () => {
    render(
      <Provider store={store}>
        <EditDistrictAdminModalForm
          modalVisible
          t={t}
          districtAdminData={districtAdminData}
        />
      </Provider>
    )

    const [
      firstNameInputTextBox,
      lastNameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      confirmPasswordInputTextBox,
      superAdminCheckBox,
      editDAButton,
    ] = defineElements()

    expect(firstNameInputTextBox).toBeInTheDocument()
    expect(firstNameInputTextBox.value).toBe(newUser.firstName)

    expect(lastNameInputTextBox).toBeInTheDocument()
    expect(lastNameInputTextBox.value).toBe(newUser.lastName)

    expect(emailInputTextBox).toBeInTheDocument()
    expect(emailInputTextBox.value).toBe(newUser.email)

    expect(passwordInputTextBox).toBeInTheDocument()
    expect(passwordInputTextBox.value).toBe('')

    expect(confirmPasswordInputTextBox).toBeInTheDocument()
    expect(confirmPasswordInputTextBox.value).toBe('')

    expect(superAdminCheckBox).toBeInTheDocument()
    expect(superAdminCheckBox).not.toBeChecked()

    expect(editDAButton).toBeInTheDocument()
  })

  it('> should display all elements with default user values - super Admin DA', () => {
    districtAdminData._source.permissions = ['super_admin']
    render(
      <Provider store={store}>
        <EditDistrictAdminModalForm
          modalVisible
          t={t}
          districtAdminData={districtAdminData}
        />
      </Provider>
    )

    const [
      firstNameInputTextBox,
      lastNameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      confirmPasswordInputTextBox,
      superAdminCheckBox,
      editDAButton,
    ] = defineElements()

    expect(firstNameInputTextBox).toBeInTheDocument()
    expect(firstNameInputTextBox.value).toBe(newUser.firstName)

    expect(lastNameInputTextBox).toBeInTheDocument()
    expect(lastNameInputTextBox.value).toBe(newUser.lastName)

    expect(emailInputTextBox).toBeInTheDocument()
    expect(emailInputTextBox.value).toBe(newUser.email)

    expect(passwordInputTextBox).toBeInTheDocument()
    expect(passwordInputTextBox.value).toBe('')

    expect(confirmPasswordInputTextBox).toBeInTheDocument()
    expect(confirmPasswordInputTextBox.value).toBe('')

    expect(superAdminCheckBox).toBeInTheDocument()
    expect(superAdminCheckBox).toBeChecked()

    expect(editDAButton).toBeInTheDocument()
  })

  it('> should update normal DA to super admin DA', async () => {
    districtAdminData._source.permissions = []
    render(
      <Provider store={store}>
        <EditDistrictAdminModalForm
          modalVisible
          t={t}
          districtAdminData={districtAdminData}
          closeModal={closeModal}
          updateDistrictAdmin={updateDistrictAdmin}
        />
      </Provider>
    )

    const [
      firstNameInputTextBox,
      lastNameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      confirmPasswordInputTextBox,
      superAdminCheckBox,
      editDAButton,
    ] = defineElements()

    expect(superAdminCheckBox).not.toBeChecked()

    enterValuesToElements(
      { ...newUser, permissions: ['super_admin'] },
      firstNameInputTextBox,
      lastNameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      confirmPasswordInputTextBox,
      superAdminCheckBox
    )

    await userEvent.click(editDAButton)

    expect(superAdminCheckBox).toBeChecked()

    expect(updateDistrictAdmin).toBeCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          permissions: ['super_admin'],
        }),
      })
    )
    expect(closeModal).toBeCalled()
  })

  it('> should downgrade a super admin DA to normal DA', async () => {
    districtAdminData._source.permissions = ['super_admin']
    render(
      <Provider store={store}>
        <EditDistrictAdminModalForm
          modalVisible
          t={t}
          districtAdminData={districtAdminData}
          closeModal={closeModal}
          updateDistrictAdmin={updateDistrictAdmin}
        />
      </Provider>
    )

    const [
      firstNameInputTextBox,
      lastNameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      confirmPasswordInputTextBox,
      superAdminCheckBox,
      editDAButton,
    ] = defineElements()

    expect(superAdminCheckBox).toBeChecked()

    enterValuesToElements(
      { ...newUser, permissions: [] },
      firstNameInputTextBox,
      lastNameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      confirmPasswordInputTextBox,
      superAdminCheckBox
    )

    expect(superAdminCheckBox).not.toBeChecked()
    await userEvent.click(editDAButton)

    expect(updateDistrictAdmin).toBeCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          permissions: [],
        }),
      })
    )
    expect(closeModal).toBeCalled()
  })
})
