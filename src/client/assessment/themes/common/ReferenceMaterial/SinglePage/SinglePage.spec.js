import React from 'react'
import '@testing-library/jest-dom'
import { screen, render } from '@testing-library/react'
import { SinglePage, testid } from '.'

const defaultProps = {
  getPage: () => ({
    getViewport: ({ scale = 1 }) => ({
      width: 600 * scale,
      height: 800 * scale,
    }),
    render: ({ canvasContext }) => {
      canvasContext.fillText('PDF Single Page', 0, 0)
    },
  }),
  pageNum: 0,
  size: 600,
  zoomLevel: 1,
}

describe('test reference material pdf single page', () => {
  test('should render without page crash', async () => {
    render(<SinglePage {...defaultProps} />)

    const canvas = await screen.getByTestId(testid)
    expect(canvas).toBeInTheDocument()
    expect(canvas.width).toEqual(600)
  })

  test('should scale on resizing', async () => {
    render(<SinglePage {...defaultProps} size={800} />)
    const canvas = await screen.getByTestId(testid)
    expect(canvas.width).toEqual(800)
  })

  test('should scale on resizing', async () => {
    render(<SinglePage {...defaultProps} zoomLevel={1.5} />)
    const canvas = await screen.getByTestId(testid)
    expect(canvas.width).toEqual(900)
  })
})
