
import '@testing-library/jest-dom'
import React from 'react'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import RosterHistory from '../SubContainer/RosterHistory'

describe('Testing Roster History component', () => {
  it('should have all the default elements in rosterHistory component', () => {
    render(<RosterHistory />)

    const importSummaryText = screen.getByText(/import summary/i)
    const recentImportText = screen.getByText(/recent imports/i)
    const recordText = screen.getByText(/record type/i)
    const totalText = screen.getByText(/total count/i)
    const modifiedText = screen.getByText(/modified count/i)
    const failedText = screen.getByText(/failed count/i)
	const fileNameText = screen.getByText(/file name/i)
	const dateText = screen.getByText(/date and time/i)

    expect(importSummaryText).toBeInTheDocument()
    expect(recordText).toBeInTheDocument()
    expect(totalText).toBeInTheDocument()
    expect(modifiedText).toBeInTheDocument()
    expect(failedText).toBeInTheDocument()
	expect(recentImportText).toBeInTheDocument()
	expect(fileNameText).toBeInTheDocument()
	expect(dateText).toBeInTheDocument()
  })

  it('checking if recent imports table renders data', () => {
    render(
      <RosterHistory
        rosterImportLog={[
          {
            recordType: 'school',
            totalCount: 2,
            createdCount: 1,
            errorCount: 0,
          },
        ]}
      />
    )
    const tablebody = document.getElementsByClassName('ant-table-tbody')
    expect(tablebody).toHaveLength(2)
  })

  it('checking if the DOM is rendering "Download Changes" when failed count is greater than 0', () => {
    render(
      <RosterHistory
        rosterImportLog={[
          {
            recordType: 'school',
            totalCount: 2,
            createdCount: 1,
            errorCount: 3,
          },
        ]}
      />
    )
	const downloadText = screen.getByText(/download changes/i)
    const tablebody = document.getElementsByClassName('ant-table-tbody')

	expect(downloadText).toBeInTheDocument()
    expect(tablebody).toHaveLength(2)

  })

  it('checking if recent imports table renders data ', () => {
    render(
      <RosterHistory
        summary={[
			{
		zipFileName: 'rosterFile',
		syncStartTS: new Date()
	},
        ]}
      />
    )
    const tablebody = document.getElementsByClassName('ant-table-tbody')
    expect(tablebody).toHaveLength(2)

  })
})