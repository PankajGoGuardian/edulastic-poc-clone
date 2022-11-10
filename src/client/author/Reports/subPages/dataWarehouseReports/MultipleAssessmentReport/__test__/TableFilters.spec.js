import React from 'react'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

import TableFilters from '../components/TableFilters'

describe('Table Filters', () => {
  beforeEach(() => {
    render(
      <TableFilters
        selectedCompareBy={{
          key: 'school',
          title: 'School',
          hiddenFromRole: ['teacher'],
        }}
      />
    )
  })
  test('check table filters visibility', () => {
    const compareByFilter = screen.getByText('Compare By')
    expect(compareByFilter).toBeInTheDocument()

    const compareBy = screen.getByText('Performance by School')
    expect(compareBy).toBeInTheDocument()
  })
})
