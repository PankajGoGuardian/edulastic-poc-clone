import React from 'react'
import { withNamespaces } from '@edulastic/localization'
import { compose } from 'redux'
import { Subtitle } from '../../../styled/Subtitle'

const QuestionLayer = ({ t, options }) => {
  return (
    <>
      <Subtitle>{t('component.pictograph.questionLayer')}</Subtitle>
      {options}
    </>
  )
}

const enhance = compose(withNamespaces('assessment'))

export default enhance(QuestionLayer)
