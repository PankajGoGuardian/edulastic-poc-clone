import '@testing-library/jest-dom'
import React from 'react'
import { cleanup, render, screen, fireEvent } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import DataExport from '../SubContainer/DataExport'

const mockStore = configureMockStore()
const store = mockStore({})

describe("Testing data export component", ()=>{
	it("should have all the default elements in dataExport component", ()=>{
		render(<DataExport 
			store = {store}
		/>)

		const exampleText = screen.getByText(/Drag drop your file/i)
		const viewText = screen.getByText(/ADD ROSTER DATA IN CSV FILES WITHIN A ZIP FILE FORMAT/i)

		expect(exampleText).toBeInTheDocument()
		expect(viewText).toBeInTheDocument()
	})

})