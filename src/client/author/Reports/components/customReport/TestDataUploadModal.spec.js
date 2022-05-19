import React from 'react'
import { appRender } from './test-utils'
import TestDataUploadModal from './TestDataUploadModal'

const initialState = {
  loading: false,
  uploadResponse: {},
  uploadProgress: 0,
}

const defaultProps = {
  isVisible: true,
  closeModal: () => true,
}

describe('Test Data Upload Modal component', () => {
  it('test component renders without error', () => {
    appRender(<TestDataUploadModal {...defaultProps} />, initialState)
  })

  it('test component renders with data format dropdown', () => {
    const container = appRender(
      <TestDataUploadModal {...defaultProps} />,
      initialState
    )
    expect(container.getByTestId('data-format-dropdown')).toBeTruthy()
  })
  it('test component renders with year dropdown', () => {
    const container = appRender(
      <TestDataUploadModal {...defaultProps} />,
      initialState
    )
    expect(container.getByTestId('year-dropdown')).toBeTruthy()
  })
  it('test component renders with test title input', () => {
    const container = appRender(
      <TestDataUploadModal {...defaultProps} />,
      initialState
    )
    expect(container.getByTestId('test-title-input')).toBeTruthy()
  })
  it('test component renders with drag and drop container', () => {
    const container = appRender(
      <TestDataUploadModal {...defaultProps} />,
      initialState
    )
    expect(container.queryByText(/Drag & Drop/i)).toBeTruthy()
  })
  it('test component renders with Upload button disabled', () => {
    const container = appRender(
      <TestDataUploadModal {...defaultProps} />,
      initialState
    )
    expect(container.getByTestId('upload-button')).toBeDisabled()
  })
})
