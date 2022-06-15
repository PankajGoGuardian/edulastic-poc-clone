import TestTypeIcon from '../../../packages/common/src/components/TestTypeIcon'
import { TEST_TYPE_LABELS } from '../../../packages/constants/const/testTypes'
import { testTypeColor } from '../../../packages/colors'
import { render, cleanup, fireEvent } from '@testing-library/react'
import { toHaveStyle } from '@testing-library/jest-dom'

describe('Testing the testTypeIcon', () => {
  afterEach(() => {
    cleanup()
  })

  it('TestTypeIcon component renders without error', () => {
    render(<TestTypeIcon testType={TEST_TYPE_LABELS.assessment} />)
  })

  Object.keys(TEST_TYPE_LABELS).forEach((testType) => {
    it(`Verify TestTypeIcon font and background color for ${TEST_TYPE_LABELS[testType]}`, () => {
      const result = render(<TestTypeIcon testType={testType} />)
      const testTypeIcon = result.getByTestId('testType')
      expect(testTypeIcon.textContent).toBe(testType.split('')[0].toUpperCase())
      expect(testTypeIcon).toHaveStyle(`background: ${testTypeColor[testType]}`)
    })

    it(`Verify TestTypeIcon tooltip for ${TEST_TYPE_LABELS[testType]}`, async () => {
      const result = render(
        <TestTypeIcon
          testType={testType}
          toolTipTitle={TEST_TYPE_LABELS[testType]}
          toolTipPlacement="top"
        />
      )
      const testTypeIcon = result.getByTestId('testType')
      expect(testTypeIcon.textContent).toBe(testType.split('')[0].toUpperCase())
      expect(testTypeIcon).toHaveStyle(`background: ${testTypeColor[testType]}`)
      expect(
        result.queryByText(TEST_TYPE_LABELS[testType])
      ).not.toBeInTheDocument()
      fireEvent.mouseOver(testTypeIcon) //To hover element and show tooltip
      expect(
        await result.findByText(TEST_TYPE_LABELS[testType])
      ).toBeInTheDocument()
    })
  })
})
