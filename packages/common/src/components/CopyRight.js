import React from 'react'
import { isPearDomain } from '../../../../src/utils/pear'

const CopyRight = () => {
  const edulasticCopyRightText = `Edulastic @ ${new Date().getFullYear()} - All rights reserved.`
  const pearAssessCopyRightText = `© Pear Assess ${new Date().getFullYear()}. All rights reserved.`

  return (
    <span>
      {isPearDomain ? pearAssessCopyRightText : edulasticCopyRightText}
    </span>
  )
}

export default CopyRight
