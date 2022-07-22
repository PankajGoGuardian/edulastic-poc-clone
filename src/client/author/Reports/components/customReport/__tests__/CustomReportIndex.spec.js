import React from 'react'
import { screen, render } from '@testing-library/react'
import '@testing-library/jest-dom'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import { dataWarehouseApi, customReportApi } from '@edulastic/api'
import CustomReports from '../index'

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
  reportReducer: {
    customReportReducer: {
      customReportList: [],
    },
  },
}

const userWithDataWarehouseEnabled = {
  user: {
    user: {
      features: {
        premium: true,
        isDataWarehouseEnabled: true,
        isDataOpsUser: true,
      },
    },
  },
}

const userWithOutDataWarehouseDisabled = {
  user: {
    user: {
      features: {
        premium: false,
        isDataWarehouseEnabled: false,
        isDataOpsUser: false,
      },
    },
  },
}

const mockStore = configureMockStore()

const storeWithDataWarehouseEnabled = mockStore({
  ...storeData,
  ...userWithDataWarehouseEnabled,
})
const storeWithDataWarehouseDisabled = mockStore({
  ...storeData,
  ...userWithOutDataWarehouseDisabled,
})

jest.spyOn(dataWarehouseApi, 'getDataWarehouseLogs')
jest.spyOn(customReportApi, 'getCustomReports')

const renderCustomReports = (store) => {
  dataWarehouseApi.getDataWarehouseLogs = jest
    .fn()
    .mockReturnValue(Promise.resolve({}))
  customReportApi.getCustomReports = jest
    .fn()
    .mockReturnValue(Promise.resolve({}))
  render(
    <Provider store={store}>
      <CustomReports />
    </Provider>
  )
}

describe('Custom Reports component.', () => {
  it('test component renders without error', () => {
    render(
      <Provider store={storeWithDataWarehouseEnabled}>
        <CustomReports />
      </Provider>
    )
  })

  it('test component renders with upload button.', async () => {
    renderCustomReports(storeWithDataWarehouseEnabled)
    const uploadButton = await screen.findByText(
      'Upload national / state tests data files'
    )
    expect(uploadButton).toBeInTheDocument()
  })

  it('test component renders with two tabs with correct names.', async () => {
    renderCustomReports(storeWithDataWarehouseEnabled)
    const tabs = screen.getAllByRole('tab')
    expect(tabs).toHaveLength(2)
    const tabNames = tabs.map((tab) => tab.textContent)
    expect(tabNames).toEqual(
      expect.arrayContaining(['Reports', 'Imports history'])
    )
  })

  it('test component renders with no upload button for non data warehouse user.', async () => {
    renderCustomReports(storeWithDataWarehouseDisabled)
    const uploadButton = await screen.queryByText(
      'Upload national / state tests data files'
    )
    expect(uploadButton).toBeNull()
  })
})
