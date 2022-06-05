import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { get } from 'lodash'
import ManageDistrict from '@edulastic/localization/src/locales/manageDistrict/en'
import EditSchoolAdminModal from './EditSchoolAdminModal'

const t = (data) => {
  return get(ManageDistrict, data)
}

const newUser = {
  firstName: 'SA',
  lastName: '02 Dhyaneshwar',
  email: 'dhyaneshwar@sa2.com',
  institutionIds: ['111'],
  permissions: [],
  isPowerTeacher: true,
  institutionDetails: [
    {
      id: '111',
      name: 'Dummy-School',
    },
  ],
}

const schoolAdminData = {
  _source: newUser,
}

const updateSchoolAdmin = jest.fn()

const closeModal = jest.fn()

const defineElements = () => {
  const firstNameInputTextBox = screen.getByPlaceholderText('Enter first name')
  const lastNameInputTextBox = screen.getByPlaceholderText('Enter last name')
  const emailInputTextBox = screen.getByPlaceholderText('Enter email')
  const passwordInputTextBox = screen.getByPlaceholderText('Enter password')
  const conPasswordInputTextBox = screen.getByPlaceholderText(
    'Enter Confirm Password'
  )
  const selectSchoolSearchBox = screen.getByTestId('selectSchools')
  const superAdminCheckBox = screen.getByTestId('superAdminCheckbox')
  const powerUserCheckBox = screen.getByTestId('powerUserCheckBox')
  const editSAButton = screen.getByText('Yes, Update')

  return [
    firstNameInputTextBox,
    lastNameInputTextBox,
    emailInputTextBox,
    passwordInputTextBox,
    conPasswordInputTextBox,
    superAdminCheckBox,
    editSAButton,
    selectSchoolSearchBox,
    powerUserCheckBox,
  ]
}

const enterValuesToElements = (
  updateUser,
  firstNameInputTextBox,
  lastNameInputTextBox,
  emailInputTextBox,
  passwordInputTextBox,
  conPasswordInputTextBox,
  superAdminCheckBox
) => {
  fireEvent.change(firstNameInputTextBox, {
    target: { value: updateUser.firstName },
  })
  fireEvent.change(lastNameInputTextBox, {
    target: { value: updateUser.lastName },
  })
  fireEvent.change(emailInputTextBox, {
    target: { value: updateUser.email },
  })
  fireEvent.change(passwordInputTextBox, {
    target: { value: updateUser.password },
  })
  fireEvent.change(conPasswordInputTextBox, {
    target: { value: updateUser.password },
  })
  if (
    (updateUser.permissions.includes('super_admin') &&
      !superAdminCheckBox.checked) ||
    (!updateUser.permissions.includes('super_admin') &&
      superAdminCheckBox.checked)
  ) {
    fireEvent.click(superAdminCheckBox)
  }
}

describe('#Testing the EditSchoolAdminModal', () => {
  afterEach(() => {
    cleanup()
  })

  it('> test EditSchoolAdminModal component renders without error', () => {
    render(
      <EditSchoolAdminModal
        modalVisible
        t={t}
        schoolAdminData={schoolAdminData}
      />
    )
  })

  it('> should display all elements with default user values - normal DA', () => {
    render(
      <EditSchoolAdminModal
        modalVisible
        t={t}
        schoolAdminData={schoolAdminData}
      />
    )

    const [
      firstNameInputTextBox,
      lastNameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      conPasswordInputTextBox,
      superAdminCheckBox,
      editSAButton,
      selectSchoolSearchBox,
      powerUserCheckBox,
    ] = defineElements()

    expect(firstNameInputTextBox).toBeInTheDocument()
    expect(firstNameInputTextBox.value).toBe(newUser.firstName)

    expect(lastNameInputTextBox).toBeInTheDocument()
    expect(lastNameInputTextBox.value).toBe(newUser.lastName)

    expect(emailInputTextBox).toBeInTheDocument()
    expect(emailInputTextBox.value).toBe(newUser.email)

    expect(passwordInputTextBox).toBeInTheDocument()
    expect(passwordInputTextBox.value).toBe('')

    expect(conPasswordInputTextBox).toBeInTheDocument()
    expect(conPasswordInputTextBox.value).toBe('')

    expect(selectSchoolSearchBox).toBeInTheDocument()

    expect(superAdminCheckBox).toBeInTheDocument()
    expect(superAdminCheckBox).not.toBeChecked()

    expect(powerUserCheckBox).toBeInTheDocument()
    expect(powerUserCheckBox).toBeChecked()

    expect(editSAButton).toBeInTheDocument()
  })

  it('> should display all elements with default user values - super Admin DA', () => {
    schoolAdminData._source.permissions = ['super_admin']
    schoolAdminData._source.isPowerTeacher = false

    render(
      <EditSchoolAdminModal
        modalVisible
        t={t}
        schoolAdminData={schoolAdminData}
      />
    )

    const [
      firstNameInputTextBox,
      lastNameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      conPasswordInputTextBox,
      superAdminCheckBox,
      editSAButton,
      selectSchoolSearchBox,
      powerUserCheckBox,
    ] = defineElements()

    expect(firstNameInputTextBox).toBeInTheDocument()
    expect(firstNameInputTextBox.value).toBe(newUser.firstName)

    expect(lastNameInputTextBox).toBeInTheDocument()
    expect(lastNameInputTextBox.value).toBe(newUser.lastName)

    expect(emailInputTextBox).toBeInTheDocument()
    expect(emailInputTextBox.value).toBe(newUser.email)

    expect(passwordInputTextBox).toBeInTheDocument()
    expect(passwordInputTextBox.value).toBe('')

    expect(conPasswordInputTextBox).toBeInTheDocument()
    expect(conPasswordInputTextBox.value).toBe('')

    expect(selectSchoolSearchBox).toBeInTheDocument()

    expect(superAdminCheckBox).toBeInTheDocument()
    expect(superAdminCheckBox).toBeChecked()

    expect(powerUserCheckBox).toBeInTheDocument()
    expect(powerUserCheckBox).not.toBeChecked()

    expect(editSAButton).toBeInTheDocument()
  })

  it('> should update normal SA to super admin SA', async () => {
    schoolAdminData._source.permissions = []
    render(
      <EditSchoolAdminModal
        modalVisible
        t={t}
        schoolAdminData={schoolAdminData}
        closeModal={closeModal}
        updateSchoolAdmin={updateSchoolAdmin}
      />
    )

    const [
      firstNameInputTextBox,
      lastNameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      conPasswordInputTextBox,
      superAdminCheckBox,
      editSAButton,
    ] = defineElements()

    expect(superAdminCheckBox).not.toBeChecked()

    enterValuesToElements(
      { ...newUser, permissions: ['super_admin'] },
      firstNameInputTextBox,
      lastNameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      conPasswordInputTextBox,
      superAdminCheckBox
    )

    await userEvent.click(editSAButton)

    expect(superAdminCheckBox).toBeChecked()

    expect(updateSchoolAdmin).toBeCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          permissions: ['super_admin'],
        }),
      })
    )
    expect(closeModal).toBeCalled()
  })

  it('> should downgrade a super admin SA to normal SA', async () => {
    schoolAdminData._source.permissions = ['super_admin']
    render(
      <EditSchoolAdminModal
        modalVisible
        t={t}
        schoolAdminData={schoolAdminData}
        closeModal={closeModal}
        updateSchoolAdmin={updateSchoolAdmin}
      />
    )

    const [
      firstNameInputTextBox,
      lastNameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      conPasswordInputTextBox,
      superAdminCheckBox,
      editSAButton,
    ] = defineElements()

    expect(superAdminCheckBox).toBeChecked()

    enterValuesToElements(
      { ...newUser, permissions: [] },
      firstNameInputTextBox,
      lastNameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      conPasswordInputTextBox,
      superAdminCheckBox
    )

    expect(superAdminCheckBox).not.toBeChecked()
    await userEvent.click(editSAButton)

    expect(updateSchoolAdmin).toBeCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          permissions: [],
        }),
      })
    )
    expect(closeModal).toBeCalled()
  })
})
