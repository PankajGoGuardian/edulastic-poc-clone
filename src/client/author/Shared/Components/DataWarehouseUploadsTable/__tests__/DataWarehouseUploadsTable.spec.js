import { ThemeProvider } from 'styled-components'
import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import DataWarehouseUploadsTable from '../index'
import { themes } from '../../../../../theme'

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

describe('Test Data Uploads Table component', () => {
  it('test component renders without error', () => {
    render(
      <ThemeProvider theme={themes.default}>
        <DataWarehouseUploadsTable uploadsStatusList={UPLOADS_LIST_DATA} />
      </ThemeProvider>
    )
  })
  it('test component renders with expect no data text', () => {
    render(
      <ThemeProvider theme={themes.default}>
        <DataWarehouseUploadsTable uploadsStatusList={[]} />
      </ThemeProvider>
    )
    const infoMessage = screen.getByText(
      /No previous import, use upload button to import test data./i
    )
    expect(infoMessage).toBeInTheDocument()
  })
  it('test component renders with 2 table rows', () => {
    const { container } = render(
      <ThemeProvider theme={themes.default}>
        <DataWarehouseUploadsTable uploadsStatusList={UPLOADS_LIST_DATA} />
      </ThemeProvider>
    )
    expect(container.getElementsByClassName('ant-table-row').length).toBe(2)
  })
})
