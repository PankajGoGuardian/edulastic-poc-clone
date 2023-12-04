import React from 'react'
import { isPearDomain } from '../../../../src/utils/pear'

const CopyRight = () => {
  const edulasticCopyRightText = `Edulastic @ ${new Date().getFullYear()} - All rights reserved.`
  const pearAssessCopyRightText = `© ${new Date().getFullYear()} Liminex, Inc. dba GoGuardian and Pear Deck Learning. All Rights Reserved.`

  return (
    <span>
      {isPearDomain ? pearAssessCopyRightText : edulasticCopyRightText}
    </span>
  )
}

export default CopyRight
