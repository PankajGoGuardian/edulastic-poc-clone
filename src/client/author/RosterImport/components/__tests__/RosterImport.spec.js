import '@testing-library/jest-dom'
import React from 'react'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import RosterImport from '../Container/RosterImport'
import { Provider } from 'react-redux'
import { name } from 'file-loader'

const mockStore = configureMockStore()
const store = mockStore({
	user :{
		user : {}
	}

})

describe('Testing roster import component', () => {
  it('should have all the default elements in rosterImport component', () => {
    render(
      <Provider store={store}>
        <RosterImport/>
      </Provider>
    )

	const importText = screen.getByText(/Import sis data/i)
	const paraText = screen.getByText(/Choose the import type and import data securely by attaching csv files with a zip format./i)
	const selectText = screen.getByText(/select an option/i)
	const downloadButton = screen.getByRole('button', {name:"Download Examples Files"})
	const viewInstructionText = screen.getByText(/view instructions/i)
	const deltaRadio = screen.getByTestId("delta")
	const fullSyncRadio = screen.getByTestId("full")
	const accomodationRadio = screen.getByTestId("accom")

	expect(importText).toBeInTheDocument()
	expect(paraText).toBeInTheDocument()
	expect(selectText).toBeInTheDocument()
	expect(viewInstructionText).toBeInTheDocument()
	expect(downloadButton).toBeInTheDocument()
	expect(deltaRadio).toBeInTheDocument()
	expect(fullSyncRadio).toBeInTheDocument()
	expect(accomodationRadio).toBeInTheDocument()
  })
})
