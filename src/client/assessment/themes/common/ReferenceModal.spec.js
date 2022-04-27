import '@testing-library/jest-dom'
import React from 'react'
import { render, cleanup } from '@testing-library/react'
import { ReferenceDocModal } from './ReferenceDocModal'

afterEach(cleanup)

// jest.mock('pdfjs-dist', () => {
//   return {
//     getPage: () => ({}),
//     getDocument: () => ({
//       promise: new Promise((resolve) =>
//         resolve({
//           getPage: () => ({
//             render: () => ({}),
//             getViewport: () => ({}),
//           }),
//         })
//       ),
//     }),
//     GlobalWorkerOptions: {},
//   }
// })

describe('test reference material modal', () => {
  test('reference material should be rendered', async () => {
    const validAttributes = {
      name: 'Get_Started_With_Smallpdf.pdf',
      size: 69432,
      source:
        'https://cdnedupoc.snapwiz.net/default/Get_Started_With_Smallpdf_fdab183c-e3c9-42e1-b47b-c4ab49a662e3.pdf',
      type: 'application/pdf',
    }
    const modal = render(
      <ReferenceDocModal
        attributes={validAttributes}
        playerSkinTyp="edulastic"
      />
    )
    const wrapper = modal.getByTestId('reference-material-modal')
    expect(wrapper).toBeInTheDocument()
  })

  test('reference material should be empty', async () => {
    // it should not render anything as only images and pdfs are supported
    // we are passing a text file as input
    const invalidAttributes = {
      name: 'Get_Started_With_Smallpdf.text',
      size: 69432,
      source:
        'https://cdnedupoc.snapwiz.net/default/Get_Started_With_Smallpdf_fdab183c-e3c9-42e1-b47b-c4ab49a662e3.text',
      type: 'application/text',
    }
    const modal = render(
      <ReferenceDocModal
        attributes={invalidAttributes}
        playerSkinTyp="edulastic"
      />
    )
    const reference = modal.getByTestId('reference')
    expect(reference).toBeEmptyDOMElement()
  })
})
