import React from 'react'
import CustomReports from './index'
import { appRender } from './test-utils'

const initialState = {
  customReportReducer: {
    customReportList: [],
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

describe('Custom Reports component', () => {
  it('test component renders without error', () => {
    appRender(<CustomReports />, initialState)
  })

  it('test component renders with upload button', () => {
    const container = appRender(<CustomReports />, initialState)
    expect(container.getByRole('button')).toBeTruthy()
  })
})
