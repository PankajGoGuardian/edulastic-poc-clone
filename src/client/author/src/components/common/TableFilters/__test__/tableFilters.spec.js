import '@testing-library/jest-dom'
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import configureMockStore from 'redux-mock-store'
import TableFiltersView from '../index'

const mockStore = configureMockStore()
describe('Test Manage Org users with school filter', () => {
  it('test School filter available', async () => {
    const schoolsState = {
      list: [{ schoolId: 'asd123asd123asd123', schoolName: 'Dummy' }],
      fetching: false,
    }
    const store = mockStore({
      user: {
        requestingNewPassword: false,
        requestNewPasswordSuccess: false,
        tooManyAttempt: true,
      },
    })
    render(
      <TableFiltersView
        showFilters={true}
        schoolsState={schoolsState}
        store={store}
        firstColData={['School', 'Username', 'Email', 'Status']}
        filtersData={[
          {
            filtersColumn: '',
            filtersValue: '',
            filterStr: '',
            filterAdded: false,
          },
        ]}
        filterStrDD={{
          status: {
            list: [
              { title: 'Select a value', disabled: true },
              { title: 'Active', value: 1, disabled: false },
              { title: 'Inactive', value: 0, disabled: false },
            ],
            placeholder: 'Select a value',
          },
          school: { list: [], placeholder: 'Search and select a school' },
        }}
      />
    )
    const acceptButton = screen.getByTestId('filter_col') // locate field column in filter
    await userEvent.click(acceptButton) // click on filter column field drop-down
    const inputElement = screen.getByTestId('filter_col_school').innerHTML // locate first option in dropdown
    expect(inputElement).toBe('School')
  })
})
