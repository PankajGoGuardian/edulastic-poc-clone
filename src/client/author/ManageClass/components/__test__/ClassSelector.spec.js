import '@testing-library/jest-dom'
import React from 'react'
import { render, cleanup, screen } from '@testing-library/react'
import ClassSelector from '../ClassListContainer/ClassSelector'

describe('Testing the classSelector', () => {
  afterEach(() => {
    cleanup()
  })

  it('test #ClassSelector component renders without error', () => {
    render(
      <ClassSelector
        filterClass="Active"
        setFilterClass={() => {}}
        currentTab="class"
      />
    )
  })

  it('Verify #ClassSelector component is showing active class option', () => {
    render(
      <ClassSelector
        filterClass="Active"
        setFilterClass={() => {}}
        currentTab="class"
      />
    )
    const moduleTitleElement = screen.getByText('Active Classes')
    expect(moduleTitleElement).toBeInTheDocument()
  })

  it('Verify #ClassSelector component is showing archived class option', () => {
    render(
      <ClassSelector
        filterClass="Archived"
        setFilterClass={() => {}}
        currentTab="class"
      />
    )
    const moduleTitleElement = screen.getByText('Archived Classes')
    expect(moduleTitleElement).toBeInTheDocument()
  })

  it('Verify #ClassSelector component is showing active group option', () => {
    render(
      <ClassSelector
        filterClass="Active"
        setFilterClass={() => {}}
        currentTab="group"
      />
    )
    const moduleTitleElement = screen.getByText('Active Groups')
    expect(moduleTitleElement).toBeInTheDocument()
  })

  it('Verify #ClassSelector component is showing archived group option', () => {
    render(
      <ClassSelector
        filterClass="Archived"
        setFilterClass={() => {}}
        currentTab="group"
      />
    )
    const moduleTitleElement = screen.getByText('Archived Groups')
    expect(moduleTitleElement).toBeInTheDocument()
  })
})
