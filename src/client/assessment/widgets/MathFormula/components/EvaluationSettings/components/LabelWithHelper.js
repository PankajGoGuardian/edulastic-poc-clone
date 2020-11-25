import React from 'react'
import { FieldLabel } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import HelperToolTip from './HelperToolTip'

const LabelWithHelper = ({ t, label, optionKey, vertical, large }) => {
  return (
    <FieldLabel
      marginBottom={vertical ? '' : '0px'}
      display={vertical ? '' : 'inline-block'}
    >
      <span>{label || t(`component.math.${optionKey}`)}</span>
      <HelperToolTip optionKey={optionKey} large={large} />
    </FieldLabel>
  )
}

export default withNamespaces('assessment')(LabelWithHelper)
