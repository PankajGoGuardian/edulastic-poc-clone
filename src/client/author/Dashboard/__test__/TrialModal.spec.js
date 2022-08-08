import '@testing-library/jest-dom'
import React from 'react'
import { render, screen } from '@testing-library/react'

import TrialModal from '../components/Showcase/components/Myclasses/components/TrialModal'

describe('Test TrialModal with new trial expiry day', () => {
  it('test #60 day trial expiry day', async () => {
    render(
      <TrialModal
        isVisible
        addOnProductIds={[]}
        toggleModal={() => {}}
        isPremiumUser={false}
        isPremiumTrialUsed={false}
        startPremiumTrial={() => {}}
        products={[]}
        setShowHeaderTrialModal={() => {}}
        trialPeriod={60}
      />
    )
    const moduleTitleElement = screen.getByText(
      'Experience the additional features of Edulastic Teacher Premium for 60 days: OMR exams, read-loud for students, extra test security settings, easier collaboration, in-depth reports and more.'
    )
    expect(moduleTitleElement).toBeInTheDocument()
  })
})
