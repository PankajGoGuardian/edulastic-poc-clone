import React from 'react'
import '@testing-library/jest-dom'
import { screen, render } from '@testing-library/react'
import PdfView from '.'

const defaultProps = {
  zoomLevel: 1,
  size: 600,
  uri: 'https://cdnedupoc.snapwiz.net/default/example.pdf',
}

jest.mock('../SinglePage', () => ({
  __esModule: true,
  default: () => <div data-testid="single-page-view" />,
}))

jest.mock('pdfjs-dist', () => {
  return {
    getDocument: () => ({
      promise: new Promise((resolve) =>
        resolve({
          numPages: 5,
        })
      ),
    }),
    GlobalWorkerOptions: {},
  }
})

describe('test reference material pdf view', () => {
  test('should render 5 page pages', async () => {
    render(<PdfView {...defaultProps} />)

    const pages = await screen.findAllByTestId('single-page-view')
    expect(pages).toHaveLength(5)
  })

  test('should not render pdf pages', async () => {
    render(<PdfView {...defaultProps} uri="" />)

    expect(screen.queryByTestId('pdf-document')).not.toBeInTheDocument()
  })
})
