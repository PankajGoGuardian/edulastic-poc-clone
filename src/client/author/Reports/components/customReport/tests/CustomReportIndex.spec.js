import { render } from '@testing-library/react'
import React from 'react'
import CustomReports from '../index'

describe('Custom Reports component', () => {
  it('test component renders without error', () => {
    render(<CustomReports />)
  })
})
