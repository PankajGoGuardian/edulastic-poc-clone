import '@testing-library/jest-dom'
import React from 'react'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import RosterHistory from './RosterHistory'

describe('Testing Roster History component', () => {
  it('should have all the default elements in rosterHistory component', () => {
    render(<RosterHistory />)

    const lastAttemptedText = screen.getByText(/last attempted import/i)
    const importHistoryText = screen.getByText(/roster import history/i)
    const recordText = screen.getByText(/record type/i)
    const entityText = screen.getByText(/entity count/i)
    const createdText = screen.getByText('Created / Updated Count')
    const failedText = screen.getByText(/failed count/i)

    expect(lastAttemptedText).toBeInTheDocument()
    expect(importHistoryText).toBeInTheDocument()
    expect(recordText).toBeInTheDocument()
    expect(entityText).toBeInTheDocument()
    expect(createdText).toBeInTheDocument()
    expect(failedText).toBeInTheDocument()
  })

  it('checking if table renders data ', () => {
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

    const tablebody = document.getElementsByClassName('ant-table-tbody')
    expect(tablebody).toHaveLength(1)

  })
})
