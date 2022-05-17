import React from 'react'
import { render } from '@testing-library/react'
import { appRender } from './test-utils'
import TestDataUploadModal from './TestDataUploadModal'

const initialState = {
  loading: false,
  uploadResponse: {},
  uploadProgress: 0,
}

const defaultProps = {
  isVisible: true,
  closeModal: () => true,
}

describe('Test Data Upload Modal component', () => {
  it('test component renders without error', () => {
    render(<TestDataUploadModal />)
  })
})
