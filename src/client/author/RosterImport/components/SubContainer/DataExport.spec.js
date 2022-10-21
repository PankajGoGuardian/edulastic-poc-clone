import '@testing-library/jest-dom'
import React from 'react'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import DataExport from './DataExport'

const mockStore = configureMockStore()
const store = mockStore({})

describe("Testing data export component", ()=>{
	it("should have all the default elements in dataExport component", ()=>{
		render(<DataExport 
			store = {store}
		/>)

		const rosterDataText = screen.getAllByText(/roster data/i)
		const exampleText = screen.getByText(/download example files/i)
		const viewText = screen.getByText(/view instructions/i)

		expect(rosterDataText[0]).toBeInTheDocument()
		expect(exampleText).toBeInTheDocument()
		expect(viewText).toBeInTheDocument()
	})

})