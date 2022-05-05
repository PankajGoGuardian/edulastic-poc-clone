import '@testing-library/jest-dom'
import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import ReferenceMaterial from '../ReferenceMaterial'

jest.mock(
  '../../../../../../AssignTest/components/Container/DollarPremiumSymbol',
  () => {
    return {
      __esModule: true,
      default: ({ premium }) => {
        if (premium) return null
        return <div data-testid="dollar-preminum" />
      },
    }
  }
)

jest.mock('../../../../../../Shared/HOC/withRefMaterial', () => {
  return {
    withRefMaterial: (WrappedComponent) => (props) => {
      return (
        <WrappedComponent {...props}>
          <div data-testid="reference-material-files">File List</div>
        </WrappedComponent>
      )
    },
  }
})

const switchId = 'assignment-referenceDocAttributes-switch'
const defaultProps = {
  owner: true,
  premium: true,
  disabled: false,
  isEditable: true,
  isSmallSize: false,
  enableUpload: false,
  onChangeSwitch: jest.fn(),
}

describe('test ReferenceMaterial setting', () => {
  test('reference material setting should be rendered', async () => {
    render(<ReferenceMaterial {...defaultProps} />)
    expect(screen.getByTestId('reference-material-setting')).toBeInTheDocument()
    expect(screen.queryByTestId('dollar-preminum')).not.toBeInTheDocument()
  })

  test('premium icon should be shown - premium:false', async () => {
    render(<ReferenceMaterial {...defaultProps} premium={false} />)
    const switcher = screen.getByTestId('dollar-preminum')
    expect(switcher).toBeInTheDocument()
  })

  test('toggle switch should be disabled - owner:false', async () => {
    render(<ReferenceMaterial {...defaultProps} owner={false} />)
    const switcher = screen.getByTestId(switchId)
    expect(switcher).toBeDisabled()
  })

  test('toggle switch should be disabled - isEditable:false', async () => {
    render(<ReferenceMaterial {...defaultProps} isEditable={false} />)
    const switcher = screen.getByTestId(switchId)
    expect(switcher).toBeDisabled()
  })

  test('toggle switch should be disabled - premium:false', async () => {
    render(<ReferenceMaterial {...defaultProps} premium={false} />)
    const switcher = screen.getByTestId(switchId)
    expect(switcher).toBeDisabled()
  })

  test('toggle switch should be disabled - disabled:true', async () => {
    render(<ReferenceMaterial {...defaultProps} disabled />)
    const switcher = screen.getByTestId(switchId)
    expect(switcher).toBeDisabled()
  })

  test('toggle switch should be checked - enableUpload:true', async () => {
    render(<ReferenceMaterial {...defaultProps} enableUpload />)
    const switcher = screen.getByTestId(switchId)
    expect(switcher).toHaveClass('ant-switch-checked')
  })

  test('toggle switch should be unchecked - enableUpload:false', async () => {
    render(<ReferenceMaterial {...defaultProps} enableUpload={false} />)
    const switcher = screen.getByTestId(switchId)
    expect(switcher).not.toHaveClass('ant-switch-checked')
  })

  test('onChangeSwitch should be called - on clicking', async () => {
    const testFn = jest.fn()
    render(<ReferenceMaterial {...defaultProps} onChangeSwitch={testFn} />)
    const switcher = screen.getByTestId(switchId)
    fireEvent.click(switcher)
    expect(testFn).toHaveBeenCalledTimes(1)
  })
})
