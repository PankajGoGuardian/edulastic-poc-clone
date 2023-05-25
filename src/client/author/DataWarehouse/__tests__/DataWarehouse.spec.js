import React from 'react'
import '@testing-library/jest-dom'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from 'styled-components'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import DataWarehouse from '../components/Container/DataWarehouse'
import { themes } from '../../../theme'

const defaultProps = {
  fetchUploadsStatusList: () => {},
  resetUploadResponse: () => {},
}

const UPLOADS_LIST_DATA = [
  {
    outputFilePath: [],
    _id: '627cc156c89b10e778d6d337',
    testName: 'air test q1',
    filename: 'air_test.csv',
    reportType: 'AIR',
    version: '2021',
    districtId: '5e4a3ab903b7ad092404fce8',
    uploadedBy: '5e4a3ad603b7ad0924050130',
    inputFilePath:
      'https://cdnedupoc.snapwiz.net/dryrun_data_warehouse/raw_data/air_test_q1__AIR__2021__5e4a3ab903b7ad092404fce8__627cc156c89b10e778d6d337__ac0a9dc3-f165-49d1-965c-c755c6423794.csv',
    status: 'INPROGRESS',
    statusReason: '',
    createdAt: 1652343126384,
    updatedAt: 1652343126384,
  },
  {
    outputFilePath: [],
    _id: '627cc724a691e0f91c57c4f4',
    testName: 'air test 2021 q2',
    reportType: 'AIR',
    versionYear: '2021',
    districtId: '5e4a3ab903b7ad092404fce8',
    uploadedBy: '5e4a3ad603b7ad0924050130',
    inputFilePath:
      'https://cdnedupoc.snapwiz.net/dryrun_data_warehouse/raw_data/air_test_2021_q2__AIR__2021__5e4a3ab903b7ad092404fce8__627cc724a691e0f91c57c4f4__5cc19e2b-65fb-49ff-bd44-6f5a82174678.csv',
    status: 'INPROGRESS',
    statusReason: '',
    createdAt: 1652344612048,
    updatedAt: 1652344612048,
  },
]

const mockStore = configureMockStore()
const storeData = {
  dataWarehouseReducer: {
    testDataFileUploadLoading: false,
    cancelUpload: null,
    uploadProgress: 0,
    testDataFileUploadError: null,
    testDataFileUploadResponse: null,
    uploadsStatusList: UPLOADS_LIST_DATA,
    uploadsStatusListLoader: false,
    uploadsStatusListError: null,
  },
}

const userWithDataWarehouseEnabled = {
  user: {
    user: {
      features: {
        premium: true,
        isDataOpsUser: true,
        isDataOpsOnlyUser: true,
      },
    },
  },
}

const userWithOutDataWarehouseDisabled = {
  user: {
    user: {
      features: {
        premium: true,
        isDataOpsUser: false,
        isDataOpsOnlyUser: false,
      },
    },
  },
}
const storeWithDataWarehouseEnabled = mockStore({
  ...storeData,
  ...userWithDataWarehouseEnabled,
})
const storeWithDataWarehouseDisabled = mockStore({
  ...storeData,
  ...userWithOutDataWarehouseDisabled,
})

describe('Test Data warehouse component', () => {
  beforeEach(() => {
    cleanup()
    storeWithDataWarehouseEnabled.clearActions()
    storeWithDataWarehouseDisabled.clearActions()
  })
  it('Test component renders without error', () => {
    render(
      <ThemeProvider theme={themes.default}>
        <Provider store={storeWithDataWarehouseEnabled}>
          <DataWarehouse {...defaultProps} />
        </Provider>
      </ThemeProvider>
    )
  })
  it('Show info message if user is not data ops only user.', async () => {
    render(
      <ThemeProvider theme={themes.default}>
        <Provider store={storeWithDataWarehouseDisabled}>
          <DataWarehouse {...defaultProps} />
        </Provider>
      </ThemeProvider>
    )

    const infoMessage = screen.getByText(
      /Contact your district administrator to upload data/
    )
    expect(infoMessage).toBeInTheDocument()
  })
  it('Test upload modal opens on button click', async () => {
    render(
      <ThemeProvider theme={themes.default}>
        <Provider store={storeWithDataWarehouseEnabled}>
          <DataWarehouse {...defaultProps} />
        </Provider>
      </ThemeProvider>
    )
    const uploadButton = await screen.findByText(
      'Upload national / state tests data files'
    )
    expect(uploadButton).toBeInTheDocument()
    userEvent.click(uploadButton)

    const modalTitle = await screen.findByText(/Upload File/)
    expect(modalTitle).toBeInTheDocument()
  })
  it('test component renders with correct table data', () => {
    const { container } = render(
      <ThemeProvider theme={themes.default}>
        <Provider store={storeWithDataWarehouseEnabled}>
          <DataWarehouse {...defaultProps} />
        </Provider>
      </ThemeProvider>
    )
    expect(container.getElementsByClassName('ant-table-row').length).toBe(2)
  })
})
