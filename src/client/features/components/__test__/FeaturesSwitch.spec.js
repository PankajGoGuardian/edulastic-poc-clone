import React from 'react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { waitFor, render } from '@testing-library/react'
import { FeaturesSwitch } from '../FeaturesSwitch'

describe('FeaturesSwitch tests', () => {
  it(' Test inAccessible state', async () => {
    const testComponent = ({ isAccessible }) => (
      <button type="button" disabled={!isAccessible}>
        button
      </button>
    )
    const state = { isAccessible: null }
    const actionOnInaccessible = () => {
      state.isAccessible = false
    }
    const view = render(
      <FeaturesSwitch
        // #region redux store props
        features={{
          enableOmrSheets: false,
        }}
        groupList={[]}
        // #endregion
        inputFeatures="enableOmrSheets"
        actionOnInaccessible={actionOnInaccessible}
      >
        {testComponent}
      </FeaturesSwitch>
    )
    userEvent.click(view.container.firstChild)
    await waitFor(() => expect(state.isAccessible).toBe(false))
    expect(view.getByRole('button')).toBeDisabled()
  })

  it('Test accessible state', async () => {
    const testComponent = ({ isAccessible }) => (
      <button type="button" disabled={!isAccessible}>
        button
      </button>
    )
    const state = { isAccessible: null }
    const actionOnInaccessible = () => {
      state.isAccessible = false
    }
    const view = render(
      <FeaturesSwitch
        // #region redux store props
        features={{
          enableOmrSheets: true,
        }}
        groupList={[]}
        // #endregion
        inputFeatures="enableOmrSheets"
        actionOnInaccessible={actionOnInaccessible}
      >
        {testComponent}
      </FeaturesSwitch>
    )
    userEvent.click(view.container.firstChild)
    await waitFor(() => expect(state.isAccessible).toBeNull())
    expect(view.getByRole('button')).not.toBeDisabled()
  })
})
