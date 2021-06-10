import React from 'react'
import { Tooltip } from 'antd'

import { AddRemoveBtnContainer } from './styled'

export function WithToolTip({ children }) {
  return (
    <AddRemoveBtnContainer>
      <Tooltip
        title="Item does not have any question and cannot be added to test"
        placement="bottomLeft"
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
      >
        {children}
      </Tooltip>
    </AddRemoveBtnContainer>
  )
}
