import React from 'react'
import { waitFor, screen } from '@testing-library/react'
import { dataWarehouseApi, customReportApi } from '@edulastic/api'
import CustomReports from '../index'
import { appRender } from '../test-utils'

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

jest.spyOn(dataWarehouseApi, 'getDataWarehouseLogs')
jest.spyOn(customReportApi, 'getCustomReports')

describe('Custom Reports component', () => {
  it('test component renders without error', () => {
    appRender(<CustomReports />, initialState)
  })

  it('test component renders with upload button', async () => {
    dataWarehouseApi.getDataWarehouseLogs = jest
      .fn()
      .mockReturnValue(Promise.resolve({}))
    customReportApi.getCustomReports = jest
      .fn()
      .mockReturnValue(Promise.resolve({}))
    await waitFor(() => {
      appRender(<CustomReports />, initialState)
    })
    const button = screen.getByTestId('upload-button')
    expect(button).toBeInTheDocument()
  })
})
