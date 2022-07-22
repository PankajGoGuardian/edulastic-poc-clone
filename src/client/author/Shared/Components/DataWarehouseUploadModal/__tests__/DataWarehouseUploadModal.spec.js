import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import DataWarehouseUploadModal from '../index'

const mockStore = configureMockStore()
const storeData = {
  dataWarehouseReducer: {
    testDataFileUploadLoading: false,
    cancelUpload: null,
    uploadProgress: 0,
    testDataFileUploadError: null,
    testDataFileUploadResponse: null,
    uploadsStatusList: [],
    uploadsStatusListLoader: false,
    uploadsStatusListError: null,
  },
}

const store = mockStore(storeData)

const defaultProps = {
  isVisible: true,
  closeModal: () => true,
}

describe('Test Data Upload Modal component', () => {
  it('test component renders without error', () => {
    render(
      <Provider store={store}>
        <DataWarehouseUploadModal {...defaultProps} />
      </Provider>
    )
  })

  it('test component renders with input boxes and drap and drop container', () => {
    render(
      <Provider store={store}>
        <DataWarehouseUploadModal {...defaultProps} />
      </Provider>
    )

    const dataFormatDropdown = screen.getByText(/Select data format/)
    const yearDropdown = screen.getByText(/Select year/)
    const testTitleInput = screen.getByPlaceholderText(/Enter Test Title/)
    const dragAndDropContainer = screen.getByText(/Drag & Drop/)

    expect(dataFormatDropdown).toBeInTheDocument()
    expect(yearDropdown).toBeInTheDocument()
    expect(testTitleInput).toBeInTheDocument()
    expect(dragAndDropContainer).toBeInTheDocument()
  })
  it('test component renders with Upload button disabled', async () => {
    render(
      <Provider store={store}>
        <DataWarehouseUploadModal {...defaultProps} />
      </Provider>
    )
    const uploadBtn = await screen.getByTestId('upload-btn')
    expect(uploadBtn).toBeDisabled()
  })

  // @todo
  // Add a spec to test file upload
})
