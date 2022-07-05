import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { get } from 'lodash'
import ManageDistrict from '@edulastic/localization/src/locales/manageDistrict/en'
import CreateSchoolAdminModalForm from './CreateSchoolAdminModal'

const t = (data) => {
  return get(ManageDistrict, data)
}

const defineElements = () => {
  const nameInputTextBox = screen.getByPlaceholderText('Enter name')
  const emailInputTextBox = screen.getByPlaceholderText('Enter email')
  const passwordInputTextBox = screen.getByPlaceholderText('Enter password')
  const selectSchoolSearchBox = screen.getByTestId('selectSchools')
  const superAdminCheckBox = screen.getByTestId('superAdminCheckbox')
  const powerUserCheckBox = screen.getByTestId('powerUserCheckBox')
  const createSAButton = screen.getByText('Yes, Create')

  return [
    nameInputTextBox,
    emailInputTextBox,
    passwordInputTextBox,
    selectSchoolSearchBox,
    superAdminCheckBox,
    powerUserCheckBox,
    createSAButton,
  ]
}

describe('#Testing the CreateSchoolAdminModalForm', () => {
  afterEach(() => {
    cleanup()
  })

  it('> test CreateSchoolAdminModalForm component renders without error', () => {
    render(<CreateSchoolAdminModalForm modalVisible t={t} />)
  })

  it('> should display all elements on the screen', () => {
    render(<CreateSchoolAdminModalForm modalVisible t={t} />)

    const [
      nameInputTextBox,
      emailInputTextBox,
      passwordInputTextBox,
      selectSchoolSearchBox,
      superAdminCheckBox,
      powerUserCheckBox,
      createSAButton,
    ] = defineElements()

    expect(nameInputTextBox).toBeInTheDocument()
    expect(nameInputTextBox.value).toBe('')

    expect(emailInputTextBox).toBeInTheDocument()
    expect(emailInputTextBox.value).toBe('')

    expect(passwordInputTextBox).toBeInTheDocument()
    expect(passwordInputTextBox.value).toBe('')

    expect(selectSchoolSearchBox).toBeInTheDocument()

    expect(superAdminCheckBox).toBeInTheDocument()
    expect(superAdminCheckBox).not.toBeChecked()

    expect(powerUserCheckBox).toBeInTheDocument()
    expect(powerUserCheckBox).not.toBeChecked()

    expect(createSAButton).toBeInTheDocument()
  })

  it('> verify super admin checkbox', async () => {
    render(<CreateSchoolAdminModalForm modalVisible t={t} />)

    const superAdminCheckBox = screen.getByTestId('superAdminCheckbox')
    expect(superAdminCheckBox).not.toBeChecked()

    fireEvent.click(superAdminCheckBox)
    expect(superAdminCheckBox).toBeChecked()

    fireEvent.click(superAdminCheckBox)
    expect(superAdminCheckBox).not.toBeChecked()
  })
})
